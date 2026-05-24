import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const imageBuilder = createImageUrlBuilder({
  projectId,
  dataset,
});

export function urlForImage(source: unknown) {
  if (!source) return null;
  return imageBuilder.image(source).auto("format").fit("max");
}

export function resolveImageUrl(source: unknown, fallback: string) {
  if (!source) return fallback;
  if (typeof source === "string") return source;

  try {
    return urlForImage(source)?.url() || fallback;
  } catch {
    return fallback;
  }
}
