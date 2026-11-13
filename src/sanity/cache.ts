/** Published website content only. Draft editing never invalidates this tag. */
export const PUBLIC_CONTENT_TAG = "yoramen-published-content-v2";
export const publishedFetchOptions = {
  cache: "force-cache" as const,
  next: { revalidate: false as const, tags: [PUBLIC_CONTENT_TAG] },
};
