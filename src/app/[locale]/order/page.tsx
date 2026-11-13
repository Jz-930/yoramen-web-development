import EnglishOrderPage from "@/views/order";
import { requireTargetLocale, type LocaleRouteProps } from "@/app/_localeRoute";
import { buildLocalizedMetadata, ENGLISH_PAGE_METADATA } from "@/i18n/metadata";
import { fetchOrderPage } from "@/sanity/fetchers";

export async function generateMetadata({ params }: LocaleRouteProps) {
  const locale = await requireTargetLocale(params, "/order");
  const order = await fetchOrderPage();
  return buildLocalizedMetadata({
    locale,
    englishPathname: "/order",
    englishTitle: ENGLISH_PAGE_METADATA.order.title,
    englishDescription: ENGLISH_PAGE_METADATA.order.description,
    seo: order?.seo,
  });
}

export default async function LocalizedOrderPage({ params }: LocaleRouteProps) {
  const locale = await requireTargetLocale(params, "/order");
  return <EnglishOrderPage locale={locale} />;
}
