import type { Metadata } from "next";
import { Noto_Serif_JP, Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { fetchSiteSettings } from "@/sanity/fetchers";
import { localeOptions } from "@/i18n/config";
import { getRequestLocale } from "@/i18n/request";
import { localizeContent } from "@/i18n/translate";

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Yoramen | Japanese Ramen House",
  description: "Signature Japanese ramen and seasonal limited specials, with online ordering and dine-in available.",
  icons: {
    icon: "/images/logo/logo-32.webp",
    apple: "/images/logo/logo-256.webp",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const siteSettings = await fetchSiteSettings();
  const localizedSiteSettings = await localizeContent(siteSettings, locale);

  return (
    <html lang={localeOptions[locale].htmlLang}>
      <body className={`${notoSerifJP.variable} ${inter.variable} min-h-screen flex flex-col`}>
        <SiteChrome modal={modal} settings={localizedSiteSettings} locale={locale}>{children}</SiteChrome>
      </body>
    </html>
  );
}
