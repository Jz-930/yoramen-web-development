export const metadata = {
    title: "Order Online | Yoramen",
    description: "Order your favorite ramen bowls directly.",
};

import Image from "next/image";
import OrderIframe from "@/components/OrderIframe";
import { fetchOrderPage } from "@/sanity/fetchers";
import { textOr } from "@/sanity/fallback";

export const dynamic = "force-dynamic";

export default async function OrderPage() {
    const order = await fetchOrderPage();
    const cmsHasOrderUrl = Boolean(order?.iframeUrl?.trim() || order?.externalOrderUrl?.trim());
    const title = textOr(order?.title, "Online Ordering");
    const description = cmsHasOrderUrl
        ? textOr(order?.description, "Secure ordering powered by MealKeyWay")
        : "Secure ordering powered by MealKeyWay";

    return (
        <div className="pt-24 min-h-screen bg-gray-50 flex flex-col relative overflow-hidden jp-pattern-geo">
            {/* ── Abstract Vector Watermarks ── */}
            <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] opacity-[0.02] pointer-events-none z-0 transform -rotate-[15deg]">
                <Image src="/images/icons/gyoza, dumpling, japanese, food, appetizer.svg" alt="gyoza" fill className="object-contain" />
            </div>
            <div className="absolute bottom-0 -right-20 w-[700px] h-[700px] opacity-[0.02] pointer-events-none z-0 transform rotate-[10deg]">
                <Image src="/images/icons/tempura, shrimp, fried, japanese, food.svg" alt="tempura" fill className="object-contain" />
            </div>

            <div className="text-center py-8 relative z-10">
                <h1 className="text-3xl font-serif text-sumi">{title}</h1>
                <p className="text-stone mt-2 text-sm">{description}</p>
            </div>
            
            <OrderIframe order={order} />
        </div>
    );
}
