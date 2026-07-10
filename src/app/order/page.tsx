import Image from "next/image";
import OrderIframe from "@/components/OrderIframe";
import { SOURCE_LOCALE } from "@/i18n";
import { buildTextDictionary, ORDER_UI_SOURCE_STRINGS } from "@/i18n/client-copy";
import { buildLocalizedMetadata, ENGLISH_PAGE_METADATA } from "@/i18n/metadata";
import { createServerTextTranslator, getRequestLocale } from "@/i18n/server";
import { fetchOrderPage } from "@/sanity/fetchers";
import { textOr } from "@/sanity/fallback";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
    const order = await fetchOrderPage();
    return buildLocalizedMetadata({
        locale: SOURCE_LOCALE,
        englishPathname: "/order",
        englishTitle: ENGLISH_PAGE_METADATA.order.title,
        englishDescription: ENGLISH_PAGE_METADATA.order.description,
        seo: order?.seo,
    });
}

export default async function OrderPage() {
    const locale = await getRequestLocale();
    const translator = await createServerTextTranslator(locale);
    const t = translator.text;
    const orderCopy = buildTextDictionary(ORDER_UI_SOURCE_STRINGS, t);
    const order = await fetchOrderPage();
    const cmsHasOrderUrl = Boolean(order?.iframeUrl?.trim() || order?.externalOrderUrl?.trim());
    const title = t(textOr(order?.title, "Online Ordering"));
    const description = cmsHasOrderUrl
        ? t(textOr(order?.description, "Secure ordering powered by MealKeyWay"))
        : t("Secure ordering powered by MealKeyWay");

    return (
        <div className="pt-24 min-h-screen bg-gray-50 flex flex-col relative overflow-hidden jp-pattern-geo">
            {/* ── Abstract Vector Watermarks ── */}
            <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] opacity-[0.02] pointer-events-none z-0 transform -rotate-[15deg]">
                <Image src="/images/icons/gyoza, dumpling, japanese, food, appetizer.svg" alt={t("gyoza")} fill className="object-contain" />
            </div>
            <div className="absolute bottom-0 -right-20 w-[700px] h-[700px] opacity-[0.02] pointer-events-none z-0 transform rotate-[10deg]">
                <Image src="/images/icons/tempura, shrimp, fried, japanese, food.svg" alt={t("tempura")} fill className="object-contain" />
            </div>

            <div className="text-center py-8 relative z-10">
                <h1 className="text-3xl font-serif text-sumi">{title}</h1>
                <p className="text-stone mt-2 text-sm">{description}</p>
            </div>
            
            <OrderIframe order={translator.deep(order)} copy={orderCopy} />
        </div>
    );
}
