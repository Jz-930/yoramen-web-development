import "server-only";

import { headers } from "next/headers";
import { cache } from "react";
import {
  SOURCE_LOCALE,
  isSupportedLocale,
  localeFromSegment,
  stripLocaleFromPathname,
  type SupportedLocale,
} from "./locales";

export const REQUEST_LOCALE_HEADER = "x-yoramen-locale" as const;
export const REQUEST_PATH_HEADER = "x-yoramen-path" as const;

export type RequestLocaleContext = {
  locale: SupportedLocale;
  pathname: string;
  search: string;
  englishPathname: string;
};

function safeHeaderLocation(value: string | null): { pathname: string; search: string } {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return { pathname: "/", search: "" };
  }

  try {
    const parsed = new URL(value, "https://yoramen.local");
    return {
      pathname: parsed.pathname || "/",
      search: parsed.search,
    };
  } catch {
    return { pathname: "/", search: "" };
  }
}

function parseHeaderLocale(value: string | null): SupportedLocale | null {
  if (!value) return null;
  if (isSupportedLocale(value)) return value;
  return localeFromSegment(value);
}

/**
 * Reads request metadata set by the locale routing layer. If either header is
 * absent or malformed, the public unprefixed English route is the safe default.
 */
async function readRequestLocaleContext(): Promise<RequestLocaleContext> {
  const requestHeaders = await headers();
  const { pathname, search } = safeHeaderLocation(requestHeaders.get(REQUEST_PATH_HEADER));
  const parsedPath = stripLocaleFromPathname(pathname);
  const locale = parseHeaderLocale(requestHeaders.get(REQUEST_LOCALE_HEADER)) ?? parsedPath.locale;

  return {
    locale,
    pathname,
    search,
    englishPathname: parsedPath.pathname,
  };
}

export const getRequestLocaleContext = cache(readRequestLocaleContext);

export async function getRequestLocale(): Promise<SupportedLocale> {
  return (await getRequestLocaleContext()).locale ?? SOURCE_LOCALE;
}
