export const SOURCE_LOCALE = "en-CA" as const;

export const TARGET_LOCALES = ["fr-CA", "zh-Hant", "ja-JP"] as const;

export const SUPPORTED_LOCALES = [SOURCE_LOCALE, ...TARGET_LOCALES] as const;

export type SourceLocale = typeof SOURCE_LOCALE;
export type TargetLocale = (typeof TARGET_LOCALES)[number];
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_SEGMENTS = {
  "fr-CA": "fr-ca",
  "zh-Hant": "zh-hant",
  "ja-JP": "ja-jp",
} as const satisfies Record<TargetLocale, string>;

export type LocaleSegment = (typeof LOCALE_SEGMENTS)[TargetLocale];

const SEGMENT_LOCALES: Record<LocaleSegment, TargetLocale> = {
  "fr-ca": "fr-CA",
  "zh-hant": "zh-Hant",
  "ja-jp": "ja-JP",
};

export function isTargetLocale(value: unknown): value is TargetLocale {
  return typeof value === "string" && (TARGET_LOCALES as readonly string[]).includes(value);
}

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return value === SOURCE_LOCALE || isTargetLocale(value);
}

export function isLocaleSegment(value: unknown): value is LocaleSegment {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(SEGMENT_LOCALES, value.toLowerCase())
  );
}

/** Returns null for the unprefixed English locale and unknown route segments. */
export function localeFromSegment(segment: string | string[] | null | undefined): TargetLocale | null {
  if (typeof segment !== "string") return null;

  const normalized = segment.toLowerCase();
  return isLocaleSegment(normalized) ? SEGMENT_LOCALES[normalized] : null;
}

export function segmentFromLocale(locale: TargetLocale): LocaleSegment;
export function segmentFromLocale(locale: SourceLocale): null;
export function segmentFromLocale(locale: SupportedLocale): LocaleSegment | null;
export function segmentFromLocale(locale: SupportedLocale): LocaleSegment | null {
  return locale === SOURCE_LOCALE ? null : LOCALE_SEGMENTS[locale];
}

export type ParsedLocalePathname = {
  locale: SupportedLocale;
  /** The same route with any supported locale prefix removed. */
  pathname: string;
};

function normalizePathname(pathname: string): string {
  if (pathname.length === 0) return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

/**
 * Parses only a URL pathname. Callers should keep query strings and hashes
 * separate (for example by using URL.pathname) so they can be preserved.
 */
export function stripLocaleFromPathname(pathname: string): ParsedLocalePathname {
  const normalizedPathname = normalizePathname(pathname);
  const segments = normalizedPathname.split("/");
  const locale = localeFromSegment(segments[1]);

  if (!locale) {
    return { locale: SOURCE_LOCALE, pathname: normalizedPathname };
  }

  const unprefixedPathname = `/${segments.slice(2).join("/")}`;
  return {
    locale,
    pathname: unprefixedPathname === "/" ? "/" : unprefixedPathname,
  };
}

/** Builds a canonical internal pathname, keeping English unprefixed. */
export function pathnameForLocale(pathname: string, locale: SupportedLocale): string {
  const { pathname: englishPathname } = stripLocaleFromPathname(pathname);
  const segment = segmentFromLocale(locale);

  if (!segment) return englishPathname;
  return englishPathname === "/" ? `/${segment}` : `/${segment}${englishPathname}`;
}

/** Returns the canonical unprefixed English route for a localized pathname. */
export function englishFallbackPathname(pathname: string): string {
  return stripLocaleFromPathname(pathname).pathname;
}

function splitPathSuffix(href: string): { pathname: string; suffix: string } {
  const queryIndex = href.indexOf("?");
  const hashIndex = href.indexOf("#");
  const suffixIndex =
    queryIndex < 0
      ? hashIndex
      : hashIndex < 0
        ? queryIndex
        : Math.min(queryIndex, hashIndex);

  return suffixIndex < 0
    ? { pathname: href, suffix: "" }
    : { pathname: href.slice(0, suffixIndex), suffix: href.slice(suffixIndex) };
}

/**
 * Prefixes only root-relative public-site links. External/protocol links,
 * anchors, Studio links, and links already carrying a locale stay untouched.
 */
export function localizeInternalHref(href: string, locale: SupportedLocale): string {
  if (locale === SOURCE_LOCALE || !href.startsWith("/") || href.startsWith("//")) return href;

  const { pathname, suffix } = splitPathSuffix(href);
  const normalizedPathname = pathname.length === 0 ? "/" : pathname;
  const lowerPathname = normalizedPathname.toLowerCase();

  if (lowerPathname === "/studio" || lowerPathname.startsWith("/studio/")) return href;
  if (stripLocaleFromPathname(normalizedPathname).locale !== SOURCE_LOCALE) return href;

  return `${pathnameForLocale(normalizedPathname, locale)}${suffix}`;
}
