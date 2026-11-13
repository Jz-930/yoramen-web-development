import EnglishHomePage from "@/views/home";
import { requireTargetLocale, type LocaleRouteProps } from "@/app/_localeRoute";
import {
  ENGLISH_PAGE_METADATA,
  buildLocalizedMetadata,
} from "@/i18n/metadata";
import { fetchHomeCmsContent, fetchSiteSettings } from "@/sanity/fetchers";

export async function generateMetadata({ params }: LocaleRouteProps) {
  const locale = await requireTargetLocale(params);
  const [{ page }, settings] = await Promise.all([
    fetchHomeCmsContent(),
    fetchSiteSettings(),
  ]);
  return buildLocalizedMetadata({
    locale,
    englishPathname: "/",
    englishTitle: ENGLISH_PAGE_METADATA.home.title,
    englishDescription: ENGLISH_PAGE_METADATA.home.description,
    seo: page?.seo ?? settings?.defaultSeo,
  });
}

export default async function LocalizedHomePage({ params }: LocaleRouteProps) {
  const locale = await requireTargetLocale(params);
  return <EnglishHomePage locale={locale} />;
}
