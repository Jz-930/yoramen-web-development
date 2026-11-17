import { revalidatePath, revalidateTag } from "next/cache";
import { PUBLIC_CONTENT_TAG } from "@/sanity/cache";
import { handlePublicationCommit } from "@/lib/publication-commit";
import { resolvePublicationRotation, type PublicationRotation } from "@/lib/publication-rotation";

export const runtime = "nodejs";
export async function POST(request: Request) {
  let rotation: PublicationRotation;
  try {
    rotation = resolvePublicationRotation(process.env);
  } catch {
    return Response.json({ error: "Not configured" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  return handlePublicationCommit(request, {
    secret: rotation.primarySecret, legacySecret: rotation.commitLegacySecret, now: () => Date.now(),
    invalidate: () => {
      revalidateTag(PUBLIC_CONTENT_TAG, {expire:0});
      revalidatePath("/", "layout");
    },
  });
}
