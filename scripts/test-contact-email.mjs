import assert from "node:assert/strict";
import { test } from "node:test";
import { handleContactSubmission } from "../src/lib/contact-email.ts";

const origin = "https://www.yoramen.ca";
const env = {
  RESEND_API_KEY: "test-key-not-a-real-secret",
  CONTACT_FROM_EMAIL: "website@notifications.example.com",
  CONTACT_TO_EMAILS: "info@yoramen.ca",
};
const submission = {
  name: "Test Customer",
  email: "customer@example.com",
  phone: "+1 555 010 1234",
  message: "Table for 4 on Friday at 6 pm?\nPlease confirm availability.",
  website: "",
  submissionId: "c76db4cc-129a-41d4-811b-2c3bd70d14c0",
};
function request(body = submission, headers = {}, url = `${origin}/api/contact`) {
  return new Request(url, {
    method: "POST",
    headers: { origin, "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}
const noSend = async () => { assert.fail("Email must not be sent"); };

test("sends all customer details only to the single configured inbox, with reply-to", async () => {
  let sent;
  const response = await handleContactSubmission(request({
    ...submission, to: "attacker@example.com", cc: "extra@example.com", bcc: "hidden@example.com",
  }), {
    env,
    fetch: async (url, options) => {
      assert.equal(url, "https://api.resend.com/emails");
      sent = JSON.parse(options.body);
      assert.equal(options.headers["Idempotency-Key"], `yoramen-contact/${submission.submissionId}`);
      return Response.json({ id: "test-message-id" });
    },
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.deepEqual(sent.to, ["info@yoramen.ca"]);
  assert.equal(sent.cc, undefined);
  assert.equal(sent.bcc, undefined);
  assert.equal(sent.reply_to, submission.email);
  assert.ok(sent.text.includes(submission.name));
  assert.ok(sent.text.includes(submission.phone));
  assert.ok(sent.text.includes(submission.message));
  assert.equal(sent.html, undefined);
});

test("a multi-recipient server configuration still sends to all configured inboxes only", async () => {
  let sent;
  const response = await handleContactSubmission(request({ ...submission, to: "attacker@example.com" }), {
    env: { ...env, CONTACT_TO_EMAILS: "restaurant@example.com, second-inbox@example.com" },
    fetch: async (_url, options) => {
      sent = JSON.parse(options.body);
      return Response.json({ id: "test-multiple-recipient-message" });
    },
  });
  assert.equal(response.status, 200);
  assert.deepEqual(sent.to, ["restaurant@example.com", "second-inbox@example.com"]);
});

test("retries use an identical provider payload and idempotency key", async () => {
  const attempts = [];
  const fetch = async (_url, options) => {
    attempts.push({ body: options.body, key: options.headers["Idempotency-Key"] });
    return Response.json({ id: "same-message" });
  };
  await handleContactSubmission(request(), { env, fetch });
  await handleContactSubmission(request(), { env, fetch });
  assert.deepEqual(attempts[0], attempts[1]);
});

test("missing configuration never reports success or sends", async () => {
  const response = await handleContactSubmission(request(), { env: {}, fetch: noSend });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ok: false, error: "unavailable" });
});

test("an invalid second recipient fails closed instead of sending to only one inbox", async () => {
  const response = await handleContactSubmission(request(), {
    env: { ...env, CONTACT_TO_EMAILS: "restaurant@example.com,not-an-email" },
    fetch: noSend,
  });
  assert.equal(response.status, 503);
});

test("invalid inputs, honeypot and oversized bodies never send", async () => {
  for (const body of [
    null, [], {},
    { ...submission, name: "   " },
    { ...submission, email: "invalid" },
    { ...submission, email: "customer@@example.com" },
    { ...submission, email: "customer@example.com\r\nBcc: other@example.com" },
    { ...submission, phone: 12345 },
    { ...submission, message: "x".repeat(5001) },
    { ...submission, message: "x".repeat(40_000) },
    { ...submission, website: "https://spam.example" },
    { ...submission, submissionId: "anything" },
  ]) {
    const response = await handleContactSubmission(request(body), { env, fetch: noSend });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).ok, false);
  }
});

test("cross-origin and non-JSON requests never send", async () => {
  assert.equal((await handleContactSubmission(request(submission, { origin: "https://other.example" }), { env, fetch: noSend })).status, 403);
  assert.equal((await handleContactSubmission(request(submission, { "content-type": "text/plain" }), { env, fetch: noSend })).status, 415);
});

test("development allows the live Next localhost/127.0.0.1 URL mismatch only with matching Host", async () => {
  for (const browserOrigin of ["http://127.0.0.1:3000", "http://localhost:3000", "http://[::1]:3000"]) {
    const response = await handleContactSubmission(request(submission, {
      origin: browserOrigin,
      host: new URL(browserOrigin).host,
    }, "http://localhost:3000/api/contact"), {
      env: { NODE_ENV: "development" },
      fetch: noSend,
    });
    // The request passes origin and input validation and reaches missing-config handling.
    assert.equal(response.status, 503, browserOrigin);
  }
});

test("development loopback exception rejects different ports, schemes, remote hosts, and forged forwarded headers", async () => {
  for (const [browserOrigin, host, url] of [
    ["http://localhost:3001", "localhost:3001", "http://localhost:3000/api/contact"],
    ["https://localhost:3000", "localhost:3000", "http://localhost:3000/api/contact"],
    ["http://127.0.0.1:3000", "localhost:3000", "http://localhost:3000/api/contact"],
    ["http://127.0.0.1:3000", "", "http://localhost:3000/api/contact"],
    ["http://127.0.0.1:3000", "127.0.0.1:3000", "http://other.example:3000/api/contact"],
    ["http://localhost.evil.example:3000", "localhost.evil.example:3000", "http://localhost:3000/api/contact"],
    ["https://other.example", "other.example", "https://other.example/api/contact"],
  ]) {
    const response = await handleContactSubmission(request(submission, {
      origin: browserOrigin, host, "x-forwarded-host": new URL(browserOrigin).host,
      "x-forwarded-proto": new URL(browserOrigin).protocol.slice(0, -1),
    }, url), { env: { ...env, NODE_ENV: "development" }, fetch: noSend });
    assert.equal(response.status, 403, `${browserOrigin} / ${host} / ${url}`);
  }
});

test("production accepts the two HTTPS site origins even when the framework URL is internal", async () => {
  for (const browserOrigin of ["https://yoramen.ca", "https://www.yoramen.ca"]) {
    const response = await handleContactSubmission(request(submission, {
      origin: browserOrigin, host: new URL(browserOrigin).host,
    }, "http://localhost:3000/api/contact"), { env: { NODE_ENV: "production" }, fetch: noSend });
    assert.equal(response.status, 503);
  }
});

test("Vercel accepts only exact server-configured deployment URLs, never arbitrary preview domains", async () => {
  const vercelEnv = {
    NODE_ENV: "production", VERCEL: "1",
    VERCEL_URL: "yoramen-deployment-example.vercel.app",
    VERCEL_BRANCH_URL: "yoramen-git-main-example.vercel.app",
    VERCEL_PROJECT_PRODUCTION_URL: "yoramen-project-example.vercel.app",
  };
  for (const hostname of [vercelEnv.VERCEL_URL, vercelEnv.VERCEL_BRANCH_URL, vercelEnv.VERCEL_PROJECT_PRODUCTION_URL]) {
    const response = await handleContactSubmission(request(submission, {
      origin: `https://${hostname}`, host: hostname,
    }, "http://localhost:3000/api/contact"), { env: vercelEnv, fetch: noSend });
    assert.equal(response.status, 503);
  }
  for (const browserOrigin of [
    "https://someone-elses-site.vercel.app", "https://yoramen-project-example.vercel.app.evil.example",
    "http://yoramen-project-example.vercel.app", "https://yoramen-project-example.vercel.app:8443",
    "http://localhost:3000", "http://127.0.0.1:3000", "http://www.yoramen.ca",
  ]) {
    const response = await handleContactSubmission(request(submission, {
      origin: browserOrigin, host: new URL(browserOrigin).host,
      "x-forwarded-host": new URL(browserOrigin).host, "x-forwarded-proto": "https",
    }, `${browserOrigin}/api/contact`), { env: { ...env, ...vercelEnv }, fetch: noSend });
    assert.equal(response.status, 403, browserOrigin);
  }
});

test("missing, opaque, multiple or malformed origins never send", async () => {
  for (const browserOrigin of [
    "", "null", "not-a-url", "https://www.yoramen.ca/", "https://www.yoramen.ca/path",
    "https://www.yoramen.ca?query", "https://www.yoramen.ca#fragment", "https://user@www.yoramen.ca",
    "https://www.yoramen.ca https://other.example", "https://www.yoramen.ca,https://other.example",
    "https://www.yoramen.ca:443", "ftp://www.yoramen.ca", "https://www.yoramen.ca.evil.example",
  ]) {
    const response = await handleContactSubmission(request(submission, { origin: browserOrigin }), { env, fetch: noSend });
    assert.equal(response.status, 403, browserOrigin);
  }
  const withoutOrigin = request();
  withoutOrigin.headers.delete("origin");
  assert.equal((await handleContactSubmission(withoutOrigin, { env, fetch: noSend })).status, 403);
});

test("malformed Vercel values cannot add an origin", async () => {
  for (const deployment of [
    "other.example", "https://preview.vercel.app", "preview.vercel.app/", "preview.vercel.app:8443",
    "user@preview.vercel.app", "preview.vercel.app#fragment", "preview.vercel.app.evil.example",
  ]) {
    const response = await handleContactSubmission(request(submission, { origin: "https://preview.vercel.app" }), {
      env: { ...env, NODE_ENV: "production", VERCEL: "1", VERCEL_URL: deployment }, fetch: noSend,
    });
    assert.equal(response.status, 403, deployment);
  }
});

test("provider rejections, quota limits and ambiguous replies never report success", async () => {
  for (const providerResponse of [
    () => Response.json({ message: "rejected" }, { status: 403 }),
    () => Response.json({ message: "quota exceeded" }, { status: 429 }),
    () => Response.json({}),
    () => new Response("invalid JSON", { status: 200 }),
  ]) {
    const response = await handleContactSubmission(request(), { env, fetch: async () => providerResponse() });
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { ok: false, error: "send_failed" });
  }
});

test("network/timeout failures are retryable failures, never success", async () => {
  const response = await handleContactSubmission(request(), {
    env,
    fetch: async () => { throw new DOMException("Timed out", "TimeoutError"); },
  });
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { ok: false, error: "send_failed" });
});
