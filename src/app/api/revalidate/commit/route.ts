import { revalidatePath, revalidateTag } from "next/cache";
import { PUBLIC_CONTENT_TAG } from "@/sanity/cache";
import { handlePublicationCommit } from "@/lib/publication-commit";

export const runtime = "nodejs";
export async function POST(request: Request) {
  return handlePublicationCommit(request, {
    secret: process.env.SANITY_REVALIDATE_SECRET, now: () => Date.now(),
    invalidate: () => {
      revalidateTag(PUBLIC_CONTENT_TAG, {expire:0});
      revalidatePath("/", "layout");
    },
  });
}
