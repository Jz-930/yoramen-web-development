"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { SupportedLocale, TargetLocale } from "@/i18n";
import type { TextDictionary } from "@/i18n/client-copy";
import type { SiteSettingsContent } from "@/sanity/types";

export default function SiteChrome({
  children,
  modal,
  settings,
  locale,
  enabledLocales,
  copy,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  settings?: SiteSettingsContent | null;
  locale: SupportedLocale;
  enabledLocales: TargetLocale[];
  copy: TextDictionary;
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18296558792"
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-18296558792');
        `}
      </Script>
      <Navbar settings={settings} locale={locale} enabledLocales={enabledLocales} copy={copy} />
      <main className="flex-grow">{children}</main>
      <Footer settings={settings} locale={locale} copy={copy} />
      {modal}
    </>
  );
}
