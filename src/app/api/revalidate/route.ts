import { revalidatePath, revalidateTag } from "next/cache";
import { handlePublishedContentWebhook } from "@/lib/published-content-webhook";
import { PUBLIC_CONTENT_TAG } from "@/sanity/cache";
import { projectId, dataset } from "@/sanity/env";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  return handlePublishedContentWebhook(request, {
    secret: process.env.SANITY_REVALIDATE_SECRET,
    projectId,
    dataset,
    // Sanity's recommended delay avoids refilling the cache before publication propagates.
    waitForConsistency: () => new Promise(resolve => setTimeout(resolve, 3000)),
    invalidate: () => {
      revalidateTag(PUBLIC_CONTENT_TAG, { expire: 0 });
      // Shared navigation, hreflang and language gates depend on all published content.
      // Include cached redirects and parallel order slots, not only successful pages.
      revalidatePath("/", "layout");
    },
  });
}
