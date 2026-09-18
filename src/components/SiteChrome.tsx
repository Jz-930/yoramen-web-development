"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { localeOptions, type Locale } from "@/i18n/config";
import type { SiteSettingsContent } from "@/sanity/types";

export default function SiteChrome({
  children,
  modal,
  settings,
  locale,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  settings?: SiteSettingsContent | null;
  locale: Locale;
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  useEffect(() => {
    document.documentElement.lang = localeOptions[locale].htmlLang;
  }, [locale]);

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar settings={settings} locale={locale} />
      <main className="flex-grow">{children}</main>
      <Footer settings={settings} locale={locale} />
      {modal}
    </>
  );
}
