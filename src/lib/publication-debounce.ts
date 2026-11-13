export const PUBLICATION_QUIET_MS = 10 * 60 * 1000;
export type PublicationEvent = { eventId: string; receivedAt: number };
export type PublicationBatch = PublicationEvent & { quietUntil: number };

/** Single durable actor; never drops the pending delivery while a commit runs. */
export async function runPublicationDebounce(events: AsyncIterable<PublicationEvent>, deps: {
  quietMs: number;
  now: () => number;
  sleepUntil: (deadline: number) => Promise<void>;
  publish: (batch: PublicationBatch) => Promise<void>;
}) {
  const iterator = events[Symbol.asyncIterator]();
  const seen = new Set<string>();
  let pending = iterator.next();
  let batch: PublicationBatch | undefined;
  let timer: Promise<{ kind: "timer" }> | undefined;
  while (true) {
    const delivery = pending.then(result => ({ kind: "event" as const, result }));
    const wake = timer ? await Promise.race([delivery, timer]) : await delivery;
    if (wake.kind === "event") {
      if (wake.result.done) return;
      pending = iterator.next();
      const event = wake.result.value;
      if (seen.has(event.eventId)) continue;
      seen.add(event.eventId);
      if (seen.size > 4096) seen.delete(seen.values().next().value!);
      const quietUntil = Math.max(batch?.quietUntil ?? 0, event.receivedAt + deps.quietMs);
      batch = { ...event, quietUntil };
      // Keep the existing timer: on its wake, rearm for the extended deadline.
      if (!timer) timer = deps.sleepUntil(quietUntil).then(() => ({ kind: "timer" as const }));
      continue;
    }
    timer = undefined;
    if (!batch) continue;
    if (deps.now() < batch.quietUntil) {
      timer = deps.sleepUntil(batch.quietUntil).then(() => ({ kind: "timer" as const }));
      continue;
    }
    await deps.publish(batch);
    batch = undefined;
    // Return to durable idle; no polling and no function stays running.
  }
}
