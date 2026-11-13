import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

export async function handlePublicationCommit(request: Request, deps: {
  secret?: string; now: () => number; invalidate: () => void;
}) {
  const json = (body: unknown, status: number) => Response.json(body, {status,headers:{"Cache-Control":"no-store"}});
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!deps.secret) return json({error:"Not configured"},503);
  if (!signature) return json({error:"Signature required"},401);
  const reader = request.body?.getReader();
  if (!reader) return json({error:"Body required"},400);
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const {done,value} = await reader.read(); if (done) break;
    size += value.length;
    if (size > 4096) { await reader.cancel(); return json({error:"Body too large"},413); }
    chunks.push(value);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  try {
    if (!await isValidSignature(raw,signature,deps.secret)) return json({error:"Invalid signature"},401);
  } catch { return json({error:"Invalid signature"},401); }
  let body;
  try { body=JSON.parse(raw); } catch { return json({error:"Invalid body"},400); }
  if (!body || body.kind !== "quiet-publication" || !/^[a-f0-9]{64}$/.test(body.eventId ?? "") ||
      !Number.isFinite(body.quietUntil) || !Number.isFinite(body.receivedAt) || body.quietUntil <= body.receivedAt) {
    return json({error:"Invalid publication batch"},400);
  }
  if (deps.now() < body.quietUntil) return json({error:"Quiet window has not ended"},409);
  deps.invalidate();
  return json({revalidated:true,eventId:body.eventId},200);
}
