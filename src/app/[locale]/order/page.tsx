import EnglishOrderPage from "../../order/page";
import { requireTargetLocale, type LocaleRouteProps } from "@/app/_localeRoute";
import { buildLocalizedMetadata, ENGLISH_PAGE_METADATA } from "@/i18n/metadata";
import { fetchOrderPage } from "@/sanity/fetchers";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LocaleRouteProps) {
  const locale = await requireTargetLocale(params);
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
  await requireTargetLocale(params);
  return <EnglishOrderPage />;
}
