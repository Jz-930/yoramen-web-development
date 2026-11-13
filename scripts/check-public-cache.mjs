import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("../.next/prerender-manifest.json", import.meta.url), "utf8"));
const paths = ["/", "/about", "/contact", "/gallery", "/locations", "/menu", "/order"];
for (const pathname of paths) {
  assert.ok(manifest.routes[pathname], `${pathname} must be prerendered`);
  assert.equal(manifest.routes[pathname].initialRevalidateSeconds, 600, `${pathname} must revalidate after ten minutes`);
}
assert.ok(!manifest.routes["/api/contact"], "Contact submission must never be statically cached");
console.log("PASS: all seven English pages use ten-minute ISR; contact submission remains dynamic.");

// Optional production-server smoke test. No email is sent.
if (process.env.CHECK_BASE_URL) {
  const base = process.env.CHECK_BASE_URL;
  for (const pathname of paths) {
    const response = await fetch(`${base}${pathname}`);
    assert.equal(response.status, 200, pathname);
    const body = await response.text();
    assert.match(body, /<html[^>]*lang="en-CA"/, pathname);
    assert.ok(!body.includes('NEXT_HTTP_ERROR_FALLBACK;500'), pathname);
    assert.ok(response.headers.get("x-nextjs-cache") || response.headers.get("x-vercel-cache"), `${pathname} cache header`);
    console.log(pathname, response.headers.get("x-nextjs-cache") ?? response.headers.get("x-vercel-cache"));
  }
  assert.equal((await fetch(`${base}/robots.txt`)).status, 200);
  assert.equal((await fetch(`${base}/not-a-real-page`)).status, 404);
  const uppercase = await fetch(`${base}/FR-CA/menu?source=cache-check`, { redirect: "manual" });
  assert.equal(uppercase.status, 308);
  assert.ok(uppercase.headers.get("location")?.endsWith("/fr-ca/menu?source=cache-check"));
  const submission = await fetch(`${base}/api/contact`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: base }, body: "{}",
  });
  assert.ok(submission.status >= 400 && submission.status < 500, "Invalid submission must be rejected");
  assert.match(submission.headers.get("cache-control") ?? "", /no-store/);
  console.log("PASS: pages, robots, 404, locale canonical redirect, and uncached form validation.");
}
