import "server-only";
import { unstable_cache } from "next/cache";
import { secondsUntilTransition } from "@/lib/content-transitions";
import { PUBLIC_CONTENT_TAG } from "./cache";

/** Expire a static page once at a configured business deadline, then recompute
 * its next deadline. Without an upcoming deadline it stays cached indefinitely. */
export async function markNextContentTransition(timestamps: readonly number[], now = Date.now()) {
  const revalidate = secondsUntilTransition(timestamps, now);
  if (revalidate === false) return;
  const next = Math.min(...timestamps.filter(value => Number.isFinite(value) && value > now));
  await unstable_cache(async () => true, ["yoramen-content-transition", String(next)], {
    revalidate, tags: [PUBLIC_CONTENT_TAG],
  })();
}
