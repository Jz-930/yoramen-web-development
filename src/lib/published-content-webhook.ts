import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

export const PUBLIC_DOCUMENT_TYPES = [
  "siteSettings", "homePage", "aboutPage", "galleryPage", "contactPage",
  "menuPage", "orderPage", "menuCategory", "menuItem", "promotion", "location",
  "localizationConfig", "translationBundle",
] as const;

type Dependencies = {
  secret?: string;
  projectId: string;
  dataset: string;
  invalidate: () => void | Promise<void>;
  waitForConsistency?: () => Promise<void>;
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Verify Sanity's raw-body HMAC before accepting any cache invalidation. */
export async function handlePublishedContentWebhook(request: Request, deps: Dependencies) {
  if (!deps.secret) return json({ error: "Webhook is not configured" }, 503);
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature) return json({ error: "Signature required" }, 401);
  const reader = request.body?.getReader();
  if (!reader) return json({ error: "Body required" }, 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16_384) {
      await reader.cancel();
      return json({ error: "Body too large" }, 413);
    }
    chunks.push(value);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  try {
    if (!await isValidSignature(raw, signature, deps.secret)) return json({ error: "Invalid signature" }, 401);
  } catch {
    return json({ error: "Invalid signature" }, 401);
  }
  let body: Record<string, unknown>;
  try { body = JSON.parse(raw); } catch { return json({ error: "Invalid JSON" }, 400); }
  if (!body || typeof body !== "object" ||
      body.projectId !== deps.projectId || body.dataset !== deps.dataset ||
      typeof body._id !== "string" || typeof body._type !== "string") {
    return json({ error: "Unexpected project or document" }, 400);
  }
  if (body._id.startsWith("drafts.") || body._id.startsWith("versions.") ||
      !(PUBLIC_DOCUMENT_TYPES as readonly string[]).includes(body._type)) {
    return json({ revalidated: false, reason: "Not published website content" });
  }
  if (!["create", "update", "delete"].includes(String(body.operation))) {
    return json({ error: "Unexpected operation" }, 400);
  }
  await deps.waitForConsistency?.();
  await deps.invalidate();
  return json({ revalidated: true });
}
