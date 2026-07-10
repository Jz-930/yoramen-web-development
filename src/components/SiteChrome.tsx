"use client";

import { usePathname } from "next/navigation";
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
      <Navbar settings={settings} locale={locale} enabledLocales={enabledLocales} copy={copy} />
      <main className="flex-grow">{children}</main>
      <Footer settings={settings} locale={locale} copy={copy} />
      {modal}
    </>
  );
}
