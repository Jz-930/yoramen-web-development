import { start, resumeHook } from "workflow/api";
import { HookConflictError, HookNotFoundError } from "workflow/errors";
import { handlePublishedContentWebhook } from "@/lib/published-content-webhook";
import { PUBLICATION_QUIET_MS } from "@/lib/publication-debounce";
import { publicationWorkflow } from "@/workflows/publication";
import { projectId, dataset } from "@/sanity/env";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const environment = process.env.VERCEL_ENV ?? "local";
  const token = `yoramen-publication-v1:${projectId}:${dataset}:${environment}`;
  const callbackOrigin = process.env.VERCEL
    ? (environment === "production" ? "https://www.yoramen.ca" : `https://${process.env.VERCEL_URL}`)
    : new URL(request.url).origin;
  // Short windows are local tests only; Vercel is always ten minutes.
  const quietMs = !process.env.VERCEL && process.env.PUBLICATION_TEST_QUIET_MS
    ? Number(process.env.PUBLICATION_TEST_QUIET_MS) : PUBLICATION_QUIET_MS;
  return handlePublishedContentWebhook(request, {
    secret: process.env.SANITY_REVALIDATE_SECRET, projectId, dataset,
    enqueue: async event => {
      if (!process.env.VERCEL && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(callbackOrigin)) {
        throw new Error("Invalid local callback origin");
      }
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await start(publicationWorkflow, [token, callbackOrigin, quietMs], { experimental_hook: { token } });
        } catch (error) {
          if (!HookConflictError.is(error)) throw error;
        }
        try {
          const hook = await resumeHook(token, event);
          return { runId: hook.runId, quietUntil: event.receivedAt + quietMs };
        } catch (error) {
          if (!HookNotFoundError.is(error)) throw error;
        }
      }
      throw new Error("Could not persist publication event");
    },
  });
}
