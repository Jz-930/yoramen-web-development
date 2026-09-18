export const locales = ["en", "fr", "ja", "zh-cn", "zh-tw"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localeHeader = "x-yoramen-locale";

export const localeOptions: Record<
  Locale,
  {
    label: string;
    shortLabel: string;
    htmlLang: string;
    translateTarget: string;
  }
> = {
  en: {
    label: "English",
    shortLabel: "EN",
    htmlLang: "en",
    translateTarget: "en",
  },
  fr: {
    label: "Français",
    shortLabel: "FR",
    htmlLang: "fr",
    translateTarget: "fr",
  },
  ja: {
    label: "日本語",
    shortLabel: "日本",
    htmlLang: "ja",
    translateTarget: "ja",
  },
  "zh-cn": {
    label: "简体中文",
    shortLabel: "简",
    htmlLang: "zh-CN",
    translateTarget: "zh-CN",
  },
  "zh-tw": {
    label: "繁體中文",
    shortLabel: "繁",
    htmlLang: "zh-TW",
    translateTarget: "zh-TW",
  },
};

export function isLocale(value: string | null | undefined): value is Locale {
  if (!value) return false;
  return locales.includes(value.toLowerCase() as Locale);
}

export function normalizeLocale(value: string | null | undefined): Locale {
  const normalized = value?.toLowerCase();
  return isLocale(normalized) ? normalized : defaultLocale;
}

export function getLocaleFromPathname(pathname: string | null | undefined): Locale {
  const firstSegment = pathname?.split("/").filter(Boolean)[0];
  return normalizeLocale(firstSegment);
}

export function stripLocaleFromPathname(pathname: string | null | undefined) {
  if (!pathname || pathname === "/") return "/";

  const parts = pathname.split("/");
  const firstSegment = parts[1]?.toLowerCase();

  if (!isLocale(firstSegment)) return pathname;

  const stripped = `/${parts.slice(2).join("/")}`;
  return stripped === "/" || stripped === "" ? "/" : stripped;
}

export function localizePath(href: string | null | undefined, locale: Locale) {
  if (!href) return "#";

  const trimmed = href.trim();

  if (
    trimmed === "#" ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  if (!trimmed.startsWith("/")) return trimmed;

  const hashIndex = trimmed.indexOf("#");
  const hash = hashIndex >= 0 ? trimmed.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? trimmed.slice(0, hashIndex) : trimmed;
  const queryIndex = withoutHash.indexOf("?");
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : "";
  const pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const strippedPathname = stripLocaleFromPathname(pathname);
  const localizedPathname = strippedPathname === "/" ? `/${locale}` : `/${locale}${strippedPathname}`;

  return `${localizedPathname}${query}${hash}`;
}
