import { BASELINE_UI_SOURCE_STRINGS } from "@/i18n/baseline";
import type { UiSourceString } from "./types";

/** Bump this whenever user-visible code copy in the UI catalog changes. */
export const UI_CATALOG_UPDATED_AT = "2026-07-11T00:00:00.000Z";

const NAVIGATION_COPY = new Set([
  "Home",
  "Menu",
  "Our Story",
  "Gallery",
  "Locations",
  "Contact",
  "Contact Us",
  "Order Now",
  "View Menu",
  "Toggle navigation menu",
  "Language",
]);

const PAGE_CRITICAL_COPY = new Set([
  "Freshly Made - Boldly Flavored",
  "Freshly Made · Boldly Flavored",
  "Freshly Made 路 Boldly Flavored",
  "A ramen bowl",
  "with actual soul.",
  "Order Now",
  "View Menu",
  "Enter your email address",
  "Sign Up",
  "About",
  "It started with an obsession for flavor.",
  "Visual",
  "A glimpse into our dedication to the craft.",
  "All",
  "Exterior",
  "Interior",
  "Food",
  "Moments",
  "Visit",
  "Visit us in person and enjoy your bowl at its best, right out of the kitchen.",
  "Get Directions",
  "Yoramen Menu",
  "From classics to limited editions, find your perfect bowl.",
  "Add to Order",
]);

const GROUP_STARTS = [
  { name: "seo", source: "Yoramen | Japanese Ramen House" },
  { name: "home", source: "Freshly Made - Boldly Flavored" },
  { name: "about", source: "About" },
  { name: "gallery", source: "Visual" },
  { name: "contact", source: "Reach Out" },
  { name: "locations", source: "Visit" },
  { name: "menu", source: "Yoramen Menu" },
  { name: "order", source: "Online Ordering" },
]
  .map((group) => ({
    ...group,
    index: (BASELINE_UI_SOURCE_STRINGS as readonly string[]).indexOf(group.source),
  }))
  .filter((group) => group.index >= 0)
  .sort((left, right) => left.index - right.index);

function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);

  return slug || "copy";
}

function stableSourceHash(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36).padStart(7, "0");
}

function pageGroupForIndex(index: number): string | undefined {
  return [...GROUP_STARTS].reverse().find((group) => group.index <= index)?.name;
}

function inferBlockId(source: string, index: number): string {
  if (NAVIGATION_COPY.has(source)) {
    return "uiCatalog.navigation";
  }
  if (source === "Close modal" || source === "Yoramen Online Ordering") {
    return "uiCatalog.order.critical";
  }
  if (/privacy|terms|rights reserved|explore|visit us|connect/i.test(source)) {
    return "uiCatalog.footer";
  }

  const group = pageGroupForIndex(index);
  if (group === "seo") return "uiCatalog.seo.critical";
  if (group === "contact" || group === "order") {
    return `uiCatalog.${group}.critical`;
  }
  if (group) {
    return `uiCatalog.${group}.${PAGE_CRITICAL_COPY.has(source) ? "critical" : "content"}`;
  }

  return "uiCatalog.shared";
}

function inferCritical(source: string, blockId: string): boolean {
  return (
    blockId === "uiCatalog.navigation" ||
    blockId.endsWith(".critical") ||
    /close modal|submit|error|required|failed|success/i.test(source)
  );
}

export const UI_CATALOG_SOURCE_STRINGS: UiSourceString[] = BASELINE_UI_SOURCE_STRINGS.map(
  (source, index) => {
    const blockId = inferBlockId(source, index);

    return {
      key: `uiCatalog.${slugify(source)}-${stableSourceHash(source)}`,
      value: source,
      context: "Current rendered UI/fallback copy",
      blockId,
      critical: inferCritical(source, blockId),
    };
  },
);
