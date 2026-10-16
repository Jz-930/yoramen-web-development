// Server-side only: imported by the contact route, never by the form.
const MAX_BODY_BYTES = 32_768;
const EMAIL_PATTERN = /^[^\s@<>(),;:\\"\[\]\x00-\x1f\x7f]+@[^\s@<>(),;:\\"\[\]\x00-\x1f\x7f]+\.[^\s@<>(),;:\\"\[\]\x00-\x1f\x7f]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PRODUCTION_ORIGINS = new Set(["https://yoramen.ca", "https://www.yoramen.ca"]);
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

type Submission = {
  name: string;
  email: string;
  phone: string;
  message: string;
  submissionId: string;
};

type Dependencies = {
  env?: NodeJS.ProcessEnv;
  fetch?: typeof globalThis.fetch;
};

function result(status: number, error?: string) {
  return Response.json(error ? { ok: false, error } : { ok: true }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function parseOrigin(value: string | null): URL | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    // A browser Origin is a single serialized origin, without credentials or a path.
    if ((url.protocol !== "https:" && url.protocol !== "http:") || url.origin !== value) return null;
    return url;
  } catch {
    return null;
  }
}

function isAllowedOrigin(request: Request, env: NodeJS.ProcessEnv): boolean {
  const origin = parseOrigin(request.headers.get("origin"));
  if (!origin) return false;
  if (PRODUCTION_ORIGINS.has(origin.origin)) return true;

  // Trust only exact deployment URLs supplied by Vercel's server environment.
  // Host / X-Forwarded-Host must never introduce arbitrary production origins.
  if (env.VERCEL === "1") {
    for (const hostname of [env.VERCEL_URL, env.VERCEL_BRANCH_URL, env.VERCEL_PROJECT_PRODUCTION_URL]) {
      if (!hostname) continue;
      const deployment = parseOrigin(`https://${hostname}`);
      if (deployment && !deployment.port && deployment.hostname.endsWith(".vercel.app") && deployment.origin === origin.origin) {
        return true;
      }
    }
  }

  // Next dev can build request.url with localhost even when the browser used
  // 127.0.0.1. Permit that alias only in development, on the same protocol/port,
  // and only when the actual Host header matches the browser's loopback origin.
  if (env.NODE_ENV !== "development") return false;
  const requestUrl = new URL(request.url);
  return LOOPBACK_HOSTS.has(origin.hostname)
    && LOOPBACK_HOSTS.has(requestUrl.hostname)
    && origin.protocol === requestUrl.protocol
    && origin.port === requestUrl.port
    && request.headers.get("host") === origin.host;
}

async function readBody(request: Request): Promise<unknown> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength && Number(declaredLength) > MAX_BODY_BYTES) throw new Error("Too large");
  if (!request.body) throw new Error("Missing body");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error("Too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function parseSubmission(value: unknown): Submission | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  const limits = { name: 100, email: 254, phone: 40, message: 5000 } as const;
  const fields = {} as Pick<Submission, keyof typeof limits>;
  for (const key of Object.keys(limits) as (keyof typeof limits)[]) {
    if (typeof data[key] !== "string" || data[key].length > limits[key]) return null;
    const field = data[key].trim();
    if (key !== "phone" && !field) return null;
    // Only the message may contain line breaks and tabs.
    const controls = key === "message" ? /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/ : /[\x00-\x1f\x7f]/;
    if (controls.test(field)) return null;
    fields[key] = field;
  }
  if (!EMAIL_PATTERN.test(fields.email)) return null;
  if (typeof data.submissionId !== "string" || !UUID_PATTERN.test(data.submissionId)) return null;
  return { ...fields, submissionId: data.submissionId.toLowerCase() };
}

export async function handleContactSubmission(request: Request, dependencies: Dependencies = {}) {
  const env = dependencies.env ?? process.env;
  // Untrusted browser origins are rejected. This is not a substitute for bot protection.
  if (!isAllowedOrigin(request, env)) {
    return result(403, "invalid_request");
  }
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    return result(415, "invalid_request");
  }

  let body: unknown;
  try {
    body = await readBody(request);
  } catch {
    return result(400, "invalid_request");
  }
  if (body && typeof body === "object" && "website" in body && body.website !== "") {
    return result(400, "spam");
  }
  const submission = parseSubmission(body);
  if (!submission) return result(400, "invalid_request");

  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.CONTACT_FROM_EMAIL?.trim() ?? "";
  const recipients = (env.CONTACT_TO_EMAILS ?? "").split(",").map((email) => email.trim());
  const to = [...new Set(recipients)];
  if (!apiKey || !EMAIL_PATTERN.test(from) || to.length > 10 || to.some((email) => !EMAIL_PATTERN.test(email))) {
    return result(503, "unavailable");
  }

  // Keep the payload stable on retries: Resend deduplicates this submission for 24 hours.
  // Use plain text so customer input cannot inject email HTML. No customer data is logged.
  const text = [
    "New message from the Yoramen website",
    "",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone || "Not provided"}`,
    "",
    "Message:",
    submission.message,
    "",
    "Reply to this email to contact the customer.",
    "A reservation request is not confirmed until the restaurant replies.",
    `Reference: ${submission.submissionId}`,
  ].join("\n");

  try {
    const response = await (dependencies.fetch ?? globalThis.fetch)("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `yoramen-contact/${submission.submissionId}`,
      },
      body: JSON.stringify({
        from: `Yoramen Website <${from}>`,
        to,
        reply_to: submission.email,
        subject: "Yoramen website: new message / reservation request",
        text,
      }),
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Contact email provider rejected request", { status: response.status });
      return result(502, "send_failed");
    }
    const sent: unknown = await response.json();
    if (!sent || typeof sent !== "object" || !("id" in sent) || typeof sent.id !== "string" || !sent.id) {
      return result(502, "send_failed");
    }
    // This means the provider accepted the email, not that the mailbox delivered/read it.
    return result(200);
  } catch {
    console.error("Contact email provider request failed");
    return result(502, "send_failed");
  }
}
