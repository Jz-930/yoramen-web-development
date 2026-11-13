import EnglishLocationsPage from "@/views/locations";
import { requireTargetLocale, type LocaleRouteProps } from "@/app/_localeRoute";
import { buildLocalizedMetadata, ENGLISH_PAGE_METADATA } from "@/i18n/metadata";

export async function generateMetadata({ params }: LocaleRouteProps) {
  const locale = await requireTargetLocale(params, "/locations");
  return buildLocalizedMetadata({
    locale,
    englishPathname: "/locations",
    englishTitle: ENGLISH_PAGE_METADATA.locations.title,
    englishDescription: ENGLISH_PAGE_METADATA.locations.description,
  });
}

export default async function LocalizedLocationsPage({ params }: LocaleRouteProps) {
  const locale = await requireTargetLocale(params, "/locations");
  return <EnglishLocationsPage locale={locale} />;
}
