import type { Metadata } from "next";
import "@/app/globals.css";
import PublicSiteLayout from "@/components/PublicSiteLayout";
import { SITE_URL } from "@/i18n/metadata";
import { SOURCE_LOCALE } from "@/i18n";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: "Yoramen | Japanese Ramen House",
  description: "Signature Japanese ramen and seasonal limited specials, with online ordering and dine-in available.",
  icons: { icon: "/images/logo/logo-32.webp", apple: "/images/logo/logo-256.webp" },
};

export const dynamic = "error";
export const revalidate = false;

export default function EnglishLayout({children, modal}: {children: React.ReactNode; modal: React.ReactNode}) {
  return <PublicSiteLayout locale={SOURCE_LOCALE} modal={modal}>{children}</PublicSiteLayout>;
}
