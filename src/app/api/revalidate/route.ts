import { start, resumeHook } from "workflow/api";
import { HookConflictError, HookNotFoundError } from "workflow/errors";
import { handlePublishedContentWebhook } from "@/lib/published-content-webhook";
import { PUBLICATION_QUIET_MS } from "@/lib/publication-debounce";
import { publicationWorkflow } from "@/workflows/publication";
import { projectId, dataset } from "@/sanity/env";
import { resolvePublicationRotation, type PublicationRotation } from "@/lib/publication-rotation";
import { enqueuePublicationEvent } from "@/lib/publication-enqueue";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  let rotation: PublicationRotation;
  try {
    rotation = resolvePublicationRotation(process.env);
  } catch {
    return Response.json({ error: "Webhook is not configured" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const environment = process.env.VERCEL_ENV ?? "local";
  const callbackOrigin = process.env.VERCEL
    ? (environment === "production" ? "https://www.yoramen.ca" : `https://${process.env.VERCEL_URL}`)
    : new URL(request.url).origin;
  // Short windows are local tests only; Vercel is always ten minutes.
  const quietMs = !process.env.VERCEL && process.env.PUBLICATION_TEST_QUIET_MS
    ? Number(process.env.PUBLICATION_TEST_QUIET_MS) : PUBLICATION_QUIET_MS;
  return handlePublishedContentWebhook(request, {
    secret: rotation.primarySecret, legacySecret: rotation.webhookLegacySecret, projectId, dataset,
    enqueue: async event => {
      if (!process.env.VERCEL && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(callbackOrigin)) {
        throw new Error("Invalid local callback origin");
      }
      return enqueuePublicationEvent(event, {
        projectId, dataset, environment, generation: rotation.generation, callbackOrigin, quietMs,
        adapter: {
          start: (token, origin, window) => start(publicationWorkflow, [token, origin, window], { experimental_hook: { token } }),
          resume: (token, nextEvent) => resumeHook(token, nextEvent),
          isConflict: error => HookConflictError.is(error),
          isNotFound: error => HookNotFoundError.is(error),
        },
      });
    },
  });
}
