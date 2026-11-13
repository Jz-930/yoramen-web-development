import type { Metadata } from "next";
import "@/app/globals.css";
import SiteChrome from "@/components/SiteChrome";
import { SOURCE_LOCALE, TARGET_LOCALES } from "@/i18n";
import { buildTextDictionary, GLOBAL_UI_SOURCE_STRINGS } from "@/i18n/client-copy";
import { SITE_URL } from "@/i18n/metadata";
import { createServerTextTranslator, getLocaleGate } from "@/i18n/server";
import { fetchSiteSettings } from "@/sanity/fetchers";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: "Yoramen | Japanese Ramen House",
  description: "Signature Japanese ramen and seasonal limited specials, with online ordering and dine-in available.",
  icons: { icon: "/images/logo/logo-32.webp", apple: "/images/logo/logo-256.webp" },
};

// Fail the build if request-only APIs accidentally make these public pages dynamic.
export const dynamic = "error";
export const revalidate = 600;

const publicPaths = ["/", "/about", "/contact", "/gallery", "/locations", "/menu", "/order"];

export default async function EnglishLayout({ children, modal }: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const [settings, translator, availability] = await Promise.all([
    fetchSiteSettings(),
    createServerTextTranslator(SOURCE_LOCALE),
    Promise.all(TARGET_LOCALES.map(async (locale) => {
      const gate = await getLocaleGate(locale);
      if (!gate.allowed) return { locale, paths: [] };
      const translated = await createServerTextTranslator(locale);
      return {
        locale,
        paths: publicPaths.filter((pathname) => translated.pageDecision(pathname).action !== "redirect-to-english"),
      };
    })),
  ]);
  const enabledLocalesByPath = Object.fromEntries(publicPaths.map((pathname) => [
    pathname,
    availability.filter((item) => item.paths.includes(pathname)).map((item) => item.locale),
  ]));

  return (
    <html lang={SOURCE_LOCALE}>
      <body className="min-h-screen flex flex-col">
        <SiteChrome modal={modal} settings={settings} locale={SOURCE_LOCALE}
          enabledLocales={[]} enabledLocalesByPath={enabledLocalesByPath}
          copy={buildTextDictionary(GLOBAL_UI_SOURCE_STRINGS, translator.text)}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
