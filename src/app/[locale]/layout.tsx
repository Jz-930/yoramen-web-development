import type { Metadata } from "next";
import "@/app/globals.css";
import SiteChrome from "@/components/SiteChrome";
import { TARGET_LOCALES, localeFromSegment, type TargetLocale } from "@/i18n";
import { notFound } from "next/navigation";
import { buildTextDictionary, GLOBAL_UI_SOURCE_STRINGS } from "@/i18n/client-copy";
import { SITE_URL } from "@/i18n/metadata";
import {
  createServerTextTranslator,
  getLocaleGate,
  getPageTranslationDecision,
  getRequestLocaleContext,
} from "@/i18n/server";
import { fetchSiteSettings } from "@/sanity/fetchers";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: "Yoramen | Japanese Ramen House",
  description: "Signature Japanese ramen and seasonal limited specials, with online ordering and dine-in available.",
  icons: {
    icon: "/images/logo/logo-32.webp",
    apple: "/images/logo/logo-256.webp",
  },
};

export default async function RootLayout({
  children,
  modal,
  params,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Reject unknown paths before loading CMS content or translation bundles.
  if (!localeFromSegment((await params).locale)) notFound();
  const requestLocale = await getRequestLocaleContext();
  const locale = requestLocale.locale;
  const currentLocaleGate = await getLocaleGate(locale);
  const [siteSettings, translator, targetLocaleAvailability] = await Promise.all([
    currentLocaleGate.allowed ? fetchSiteSettings() : Promise.resolve(null),
    createServerTextTranslator(locale),
    Promise.all(
      TARGET_LOCALES.map(async (targetLocale) => {
        const gate = await getLocaleGate(targetLocale);
        if (!gate.allowed) return false;
        const decision = await getPageTranslationDecision(
          targetLocale,
          requestLocale.englishPathname,
        );
        return decision.action !== "redirect-to-english";
      }),
    ),
  ]);
  const enabledLocales: TargetLocale[] = TARGET_LOCALES.filter(
    (_targetLocale, index) => targetLocaleAvailability[index],
  );
  const globalCopy = buildTextDictionary(GLOBAL_UI_SOURCE_STRINGS, translator.text);

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col">
        <SiteChrome
          modal={modal}
          settings={translator.deep(siteSettings)}
          locale={locale}
          enabledLocales={enabledLocales}
          copy={globalCopy}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
