import EnglishContactPage from "@/views/contact";
import { requireTargetLocale, type LocaleRouteProps } from "@/app/_localeRoute";
import {
  ENGLISH_PAGE_METADATA,
  buildLocalizedMetadata,
} from "@/i18n/metadata";
import { fetchContactPage } from "@/sanity/fetchers";

export async function generateMetadata({ params }: LocaleRouteProps) {
  const locale = await requireTargetLocale(params, "/contact");
  const page = await fetchContactPage();
  return buildLocalizedMetadata({
    locale,
    englishPathname: "/contact",
    englishTitle: ENGLISH_PAGE_METADATA.contact.title,
    englishDescription: ENGLISH_PAGE_METADATA.contact.description,
    seo: page?.seo,
  });
}

export default async function LocalizedContactPage({ params }: LocaleRouteProps) {
  const locale = await requireTargetLocale(params, "/contact");
  return <EnglishContactPage locale={locale} />;
}
