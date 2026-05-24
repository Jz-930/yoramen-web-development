export const metadata = {
    title: "Order Online | Yoramen",
    description: "Order your favorite ramen bowls directly.",
};

import Image from "next/image";
import OrderIframe from "@/components/OrderIframe";
import { fetchOrderPage } from "@/sanity/fetchers";

export const dynamic = "force-dynamic";

export default async function OrderPage() {
    const order = await fetchOrderPage();
    const title = order?.title || "Online Ordering";
    const description = order?.description || "Secure ordering powered by our POS partner";

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
