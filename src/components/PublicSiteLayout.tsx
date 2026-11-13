import SiteChrome from "@/components/SiteChrome";
import { TARGET_LOCALES, type SupportedLocale } from "@/i18n";
import { buildTextDictionary, GLOBAL_UI_SOURCE_STRINGS } from "@/i18n/client-copy";
import { createServerTextTranslator, getLocaleGate } from "@/i18n/server";
import { fetchSiteSettings } from "@/sanity/fetchers";

const publicPaths = ["/", "/about", "/contact", "/gallery", "/locations", "/menu", "/order"];

export default async function PublicSiteLayout({ children, modal, locale }: {
  children: React.ReactNode;
  modal: React.ReactNode;
  locale: SupportedLocale;
}) {
  const [settings, translator, availability] = await Promise.all([
    fetchSiteSettings(),
    createServerTextTranslator(locale),
    Promise.all(TARGET_LOCALES.map(async (targetLocale) => {
      const gate = await getLocaleGate(targetLocale);
      if (!gate.allowed) return { locale: targetLocale, paths: [] };
      const translated = await createServerTextTranslator(targetLocale);
      return {
        locale: targetLocale,
        paths: publicPaths.filter((pathname) => translated.pageDecision(pathname).action !== "redirect-to-english"),
      };
    })),
  ]);
  const enabledLocalesByPath = Object.fromEntries(publicPaths.map((pathname) => [
    pathname,
    availability.filter((item) => item.paths.includes(pathname)).map((item) => item.locale),
  ]));

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col">
        <SiteChrome modal={modal} settings={translator.deep(settings)} locale={locale}
          enabledLocales={[]} enabledLocalesByPath={enabledLocalesByPath}
          copy={buildTextDictionary(GLOBAL_UI_SOURCE_STRINGS, translator.text)}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
