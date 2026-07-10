import OrderModal from "@/components/OrderModal";
import { buildTextDictionary, ORDER_UI_SOURCE_STRINGS } from "@/i18n/client-copy";
import { createServerTextTranslator, getRequestLocale } from "@/i18n/server";
import { fetchOrderPage } from "@/sanity/fetchers";

export const dynamic = "force-dynamic";

export default async function OrderInterceptModal() {
    const locale = await getRequestLocale();
    const translator = await createServerTextTranslator(locale);
    const orderCopy = buildTextDictionary(ORDER_UI_SOURCE_STRINGS, translator.text);
    const order = await fetchOrderPage();
    return <OrderModal order={translator.deep(order)} copy={orderCopy} />;
}
