import type { FallbackBlockSets, PageFallbackDecision } from "./types";

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

/**
 * Product fallback policy:
 * - any critical failure redirects the whole page;
 * - two or more ordinary failures redirect the whole page;
 * - exactly one ordinary failure renders that entire block in English.
 */
export function decidePageFallback(blocks: FallbackBlockSets): PageFallbackDecision {
  const critical = uniqueSorted(blocks.critical);
  const ordinary = uniqueSorted(blocks.ordinary).filter((blockId) => !critical.includes(blockId));

  if (critical.length > 0) {
    return {
      action: "redirect-to-english",
      reason: "critical-block-unavailable",
      blockIds: uniqueSorted([...critical, ...ordinary]),
    };
  }

  if (ordinary.length >= 2) {
    return {
      action: "redirect-to-english",
      reason: "multiple-ordinary-blocks-unavailable",
      blockIds: ordinary,
    };
  }

  if (ordinary.length === 1) {
    return { action: "in-place-english", blockIds: [ordinary[0]] };
  }

  return { action: "render-localized", blockIds: [] };
}
