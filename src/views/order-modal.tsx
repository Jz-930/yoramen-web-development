import { SOURCE_LOCALE, type SupportedLocale } from "@/i18n";
import OrderModal from "@/components/OrderModal";
import { buildTextDictionary, ORDER_UI_SOURCE_STRINGS } from "@/i18n/client-copy";
import { createServerTextTranslator } from "@/i18n/server";
import { fetchOrderPage } from "@/sanity/fetchers";

export default async function OrderInterceptModal({ locale = SOURCE_LOCALE }: { locale?: SupportedLocale } = {}) {
    const translator = await createServerTextTranslator(locale);
    const orderCopy = buildTextDictionary(ORDER_UI_SOURCE_STRINGS, translator.text);
    const order = await fetchOrderPage();
    return <OrderModal order={translator.deep(order)} copy={orderCopy} />;
}
