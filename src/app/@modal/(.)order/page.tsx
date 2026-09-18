import OrderModal from "@/components/OrderModal";
import { getRequestLocale } from "@/i18n/request";
import { localizeContent } from "@/i18n/translate";
import { fetchOrderPage } from "@/sanity/fetchers";

export const dynamic = "force-dynamic";

export default async function OrderInterceptModal() {
    const locale = await getRequestLocale();
    const order = await localizeContent(await fetchOrderPage(), locale);
    return <OrderModal order={order} locale={locale} />;
}
