import { headers } from "next/headers";
import { defaultLocale, localeHeader, normalizeLocale, type Locale } from "./config";

export async function getRequestLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  return normalizeLocale(requestHeaders.get(localeHeader) || defaultLocale);
}
