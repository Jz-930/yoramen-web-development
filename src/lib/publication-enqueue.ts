import type { PublicationEvent } from "./publication-debounce";
import { publicationToken } from "./publication-rotation";

type Adapter = {
  start: (token: string, callbackOrigin: string, quietMs: number) => Promise<unknown>;
  resume: (token: string, event: PublicationEvent) => Promise<{ runId: string }>;
  isConflict: (error: unknown) => boolean;
  isNotFound: (error: unknown) => boolean;
};

export async function enqueuePublicationEvent(event: PublicationEvent, options: {
  projectId: string; dataset: string; environment: string; generation: string;
  callbackOrigin: string; quietMs: number; adapter: Adapter;
}) {
  const token = publicationToken(options.projectId, options.dataset, options.environment, options.generation);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await options.adapter.start(token, options.callbackOrigin, options.quietMs);
    } catch (error) {
      if (!options.adapter.isConflict(error)) throw error;
    }
    try {
      const hook = await options.adapter.resume(token, event);
      return { runId: hook.runId, quietUntil: event.receivedAt + options.quietMs };
    } catch (error) {
      if (!options.adapter.isNotFound(error)) throw error;
    }
  }
  throw new Error("Could not persist publication event");
}
