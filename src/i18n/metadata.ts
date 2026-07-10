import "server-only";

import type { Metadata } from "next";
import { resolveImageUrl } from "@/sanity/image";
import type { SeoContent } from "@/sanity/types";
import {
  SUPPORTED_LOCALES,
  pathnameForLocale,
  type SupportedLocale,
} from "./locales";
import {
  createServerTextTranslator,
  getLocaleGate,
  getPageTranslationDecision,
} from "./server";

export const DEFAULT_ENGLISH_METADATA = {
  title: "Yoramen | Japanese Ramen House",
  description:
    "Signature Japanese ramen and seasonal limited specials, with online ordering and dine-in available.",
} as const;

export const ENGLISH_PAGE_METADATA = {
  home: DEFAULT_ENGLISH_METADATA,
  about: {
    title: "Our Story | Yoramen",
    description:
      "It started with an obsession for flavor. Learn about the craft and history behind Yoramen.",
  },
  contact: {
    title: "Contact | Yoramen",
    description:
      "Contact Yoramen for general inquiries, partnerships, feedback, and catering.",
  },
  gallery: {
    title: "Gallery | Yoramen",
    description:
      "Explore photos of Yoramen dishes, interiors, and moments from our community.",
  },
  locations: {
    title: "Locations | Yoramen",
    description:
      "Find store addresses, business hours, contact details, and directions to your nearest Yoramen location.",
  },
  menu: {
    title: "Menu | Yoramen",
    description:
      "Explore the full Yoramen menu, including signature ramen, sides, drinks, and seasonal limited offerings.",
  },
  order: {
    title: "Order Online | Yoramen",
    description: "Order your favorite ramen bowls directly.",
  },
} as const;

function absoluteSiteUrl(value: string | undefined): URL {
  const candidate = value?.trim() || "yoramen.ca";
  try {
    return new URL(/^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`);
  } catch {
    return new URL("https://yoramen.ca");
  }
}

export const SITE_URL = absoluteSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL,
);

type LocalizedMetadataOptions = {
  locale: SupportedLocale;
  englishPathname: string;
  englishTitle: string;
  englishDescription: string;
  seo?: SeoContent | null;
};

/** Builds locale-specific metadata without depending on request-only server APIs. */
export async function buildLocalizedMetadata({
  locale,
  englishPathname,
  englishTitle,
  englishDescription,
  seo,
}: LocalizedMetadataOptions): Promise<Metadata> {
  const [translator, localeAvailability] = await Promise.all([
    createServerTextTranslator(locale),
    Promise.all(
      SUPPORTED_LOCALES.map(async (alternateLocale) => {
        const gate = await getLocaleGate(alternateLocale);
        if (!gate.allowed) return false;
        const decision = await getPageTranslationDecision(alternateLocale, englishPathname);
        return decision.action !== "redirect-to-english";
      }),
    ),
  ]);
  const enabledLocales = SUPPORTED_LOCALES.filter(
    (_alternateLocale, index) => localeAvailability[index],
  );
  const englishCanonical = pathnameForLocale(englishPathname, "en-CA");
  const languages = {
    ...Object.fromEntries(
      enabledLocales.map((alternateLocale) => [
        alternateLocale,
        pathnameForLocale(englishPathname, alternateLocale),
      ]),
    ),
    "x-default": englishCanonical,
  };
  const decision = translator.pageDecision(englishPathname);
  const sourceTitle = seo?.metaTitle?.trim() || englishTitle;
  const sourceDescription = seo?.metaDescription?.trim() || englishDescription;
  const title = translator.text(sourceTitle);
  const description = translator.text(sourceDescription);
  const canonical = pathnameForLocale(englishPathname, locale);
  const ogImage = resolveImageUrl(seo?.ogImage, "");
  const shouldNoIndex = seo?.noIndex === true || decision.action === "in-place-english";

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    ...(shouldNoIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
