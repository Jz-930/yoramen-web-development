import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("../.next/prerender-manifest.json", import.meta.url), "utf8"));
const englishPaths = ["/", "/about", "/contact", "/gallery", "/locations", "/menu", "/order"];
const paths = ["", "/fr-ca", "/zh-hant", "/ja-jp"].flatMap(prefix => englishPaths.map(path => prefix + (path === "/" ? "" : path) || "/"));
for (const pathname of paths) {
  assert.ok(manifest.routes[pathname], `${pathname} must be prerendered`);
  assert.equal(manifest.routes[pathname].initialRevalidateSeconds, false, `${pathname} must remain cached until publication (or a deliberately scheduled content deadline)`);
}
assert.ok(!manifest.routes["/api/contact"], "Contact submission must never be statically cached");
assert.ok(!manifest.routes["/api/revalidate"], "Signed webhook must remain dynamic");
console.log("PASS: all 28 public routes stay static until publication; form and webhook remain dynamic.");

// Optional production-server smoke test. No email is sent.
if (process.env.CHECK_BASE_URL) {
  const base = process.env.CHECK_BASE_URL;
  for (const pathname of paths) {
    const response = await fetch(`${base}${pathname}`, {redirect:"manual"});
    if (response.status === 307) {
      assert.ok(!englishPaths.includes(pathname), "Only localized pages may fall back");
      assert.equal(response.headers.get("location"), pathname.replace(/^\/(fr-ca|zh-hant|ja-jp)/, "") || "/");
      console.log(pathname, "cached English fallback", response.headers.get("x-nextjs-cache") ?? response.headers.get("x-vercel-cache"));
      continue;
    }
    assert.equal(response.status, 200, pathname);
    const body = await response.text();
    const locale = pathname.startsWith('/fr-ca') ? 'fr-CA' : pathname.startsWith('/zh-hant') ? 'zh-Hant' : pathname.startsWith('/ja-jp') ? 'ja-JP' : 'en-CA';
    assert.ok(body.includes(`lang="${locale}"`), pathname);
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
  const unsigned = await fetch(`${base}/api/revalidate`, {method:"POST",body:"{}"});
  assert.equal(unsigned.status,401,"Unsigned cache invalidation must be rejected");
  console.log("PASS: pages, robots, 404, locale canonical redirect, and uncached form validation.");
}
