import EnglishGalleryPage from "../../gallery/page";
import { requireTargetLocale, type LocaleRouteProps } from "@/app/_localeRoute";
import {
  ENGLISH_PAGE_METADATA,
  buildLocalizedMetadata,
} from "@/i18n/metadata";
import { fetchGalleryPage } from "@/sanity/fetchers";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LocaleRouteProps) {
  const locale = await requireTargetLocale(params);
  const page = await fetchGalleryPage();
  return buildLocalizedMetadata({
    locale,
    englishPathname: "/gallery",
    englishTitle: ENGLISH_PAGE_METADATA.gallery.title,
    englishDescription: ENGLISH_PAGE_METADATA.gallery.description,
    seo: page?.seo,
  });
}

export default async function LocalizedGalleryPage({ params }: LocaleRouteProps) {
  await requireTargetLocale(params);
  return <EnglishGalleryPage />;
}
