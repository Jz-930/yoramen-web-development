import EnglishAboutPage from "../../about/page";
import { requireTargetLocale, type LocaleRouteProps } from "@/app/_localeRoute";
import { buildLocalizedMetadata, ENGLISH_PAGE_METADATA } from "@/i18n/metadata";
import { fetchAboutPage } from "@/sanity/fetchers";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LocaleRouteProps) {
  const locale = await requireTargetLocale(params);
  const page = await fetchAboutPage();
  return buildLocalizedMetadata({
    locale,
    englishPathname: "/about",
    englishTitle: ENGLISH_PAGE_METADATA.about.title,
    englishDescription: ENGLISH_PAGE_METADATA.about.description,
    seo: page?.seo,
  });
}

export default async function LocalizedAboutPage({ params }: LocaleRouteProps) {
  await requireTargetLocale(params);
  return <EnglishAboutPage />;
}
