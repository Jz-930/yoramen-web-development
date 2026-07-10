import EnglishMenuPage from "../../menu/page";
import { requireTargetLocale, type LocaleRouteProps } from "@/app/_localeRoute";
import { buildLocalizedMetadata, ENGLISH_PAGE_METADATA } from "@/i18n/metadata";
import { fetchMenuCmsContent } from "@/sanity/fetchers";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LocaleRouteProps) {
  const locale = await requireTargetLocale(params);
  const { page } = await fetchMenuCmsContent();
  return buildLocalizedMetadata({
    locale,
    englishPathname: "/menu",
    englishTitle: ENGLISH_PAGE_METADATA.menu.title,
    englishDescription: ENGLISH_PAGE_METADATA.menu.description,
    seo: page?.seo,
  });
}

export default async function LocalizedMenuPage({ params }: LocaleRouteProps) {
  await requireTargetLocale(params);
  return <EnglishMenuPage />;
}
