import EnglishLocationsPage from "../../locations/page";
import { requireTargetLocale, type LocaleRouteProps } from "@/app/_localeRoute";
import { buildLocalizedMetadata, ENGLISH_PAGE_METADATA } from "@/i18n/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LocaleRouteProps) {
  const locale = await requireTargetLocale(params);
  return buildLocalizedMetadata({
    locale,
    englishPathname: "/locations",
    englishTitle: ENGLISH_PAGE_METADATA.locations.title,
    englishDescription: ENGLISH_PAGE_METADATA.locations.description,
  });
}

export default async function LocalizedLocationsPage({ params }: LocaleRouteProps) {
  await requireTargetLocale(params);
  return <EnglishLocationsPage />;
}
