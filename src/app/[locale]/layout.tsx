import type { Metadata } from "next";
import "@/app/globals.css";
import PublicSiteLayout from "@/components/PublicSiteLayout";
import { SITE_URL } from "@/i18n/metadata";
import { TARGET_LOCALES, localeFromSegment, segmentFromLocale } from "@/i18n";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: "Yoramen | Japanese Ramen House",
  description: "Signature Japanese ramen and seasonal limited specials, with online ordering and dine-in available.",
  icons: { icon: "/images/logo/logo-32.webp", apple: "/images/logo/logo-256.webp" },
};

export const dynamic = "error";
// Permit regeneration after webhook invalidation; the layout and route helper
// still reject every locale outside the three canonical generated segments.
export const dynamicParams = true;
export const revalidate = false;

export function generateStaticParams() {
  return TARGET_LOCALES.map(locale => ({locale: segmentFromLocale(locale)}));
}

export default async function LocalizedLayout({children, modal, params}: {children: React.ReactNode; modal: React.ReactNode; params: Promise<{locale: string}>}) {
  const {locale: segment} = await params;
  const locale = localeFromSegment(segment);
  if (!locale || segmentFromLocale(locale) !== segment) notFound();
  return <PublicSiteLayout locale={locale} modal={modal}>{children}</PublicSiteLayout>;
}
