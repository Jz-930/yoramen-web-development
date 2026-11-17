import { createHook, sleep, RetryableError } from "workflow";
import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { runPublicationDebounce, type PublicationBatch, type PublicationEvent } from "@/lib/publication-debounce";
import { publicationSigningSecret } from "@/lib/publication-rotation";

export async function publicationWorkflow(token: string, callbackOrigin: string, quietMs: number) {
  "use workflow";
  const events = createHook<PublicationEvent>({ token });
  await runPublicationDebounce(events, {
    quietMs,
    now: () => Date.now(),
    sleepUntil: deadline => sleep(new Date(deadline)),
    publish: batch => commitPublication(callbackOrigin, batch),
  });
}

async function commitPublication(origin: string, batch: PublicationBatch) {
  "use step";
  const secret = publicationSigningSecret(process.env);
  const body = JSON.stringify({ kind: "quiet-publication", ...batch });
  const signature = await encodeSignatureHeader(body, Date.now(), secret);
  // Use the current production alias, even if this waiting run predates a deploy.
  const response = await fetch(`${origin}/api/revalidate/commit`, {
    method: "POST", headers: { "Content-Type": "application/json", [SIGNATURE_HEADER_NAME]: signature },
    body, signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new RetryableError(`Publication commit returned ${response.status}`, { retryAfter: "30s" });
  console.log("Published static content after quiet window", { eventId: batch.eventId, quietUntil: batch.quietUntil });
}
commitPublication.maxRetries = 20;
