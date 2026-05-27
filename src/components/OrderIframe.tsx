import type { OrderPageContent } from "@/sanity/types";
import { boolOr, textOr } from "@/sanity/fallback";

type OrderIframeProps = {
    order?: OrderPageContent | null;
};

const ORDERING_URL =
    "https://order.mealkeyway.com/customer/release/index?mid=324b374b756a537145386a32333732614673364638513d3d";

const fallbackOrder: Required<OrderPageContent> = {
    title: "Online Ordering",
    description: "Secure ordering powered by MealKeyWay",
    providerName: "MealKeyWay",
    iframeUrl: ORDERING_URL,
    externalOrderUrl: ORDERING_URL,
    fallbackTitle: "Open Online Ordering",
    fallbackMessage: "If the ordering screen does not load, open the secure ordering page in a new tab.",
    enabled: true,
};

export default function OrderIframe({ order }: OrderIframeProps) {
    const iframeUrl = textOr(order?.iframeUrl, fallbackOrder.iframeUrl);
    const externalOrderUrl = textOr(order?.externalOrderUrl, fallbackOrder.externalOrderUrl);
    const cmsHasOrderUrl = Boolean(order?.iframeUrl?.trim() || order?.externalOrderUrl?.trim());

    const content = {
        title: textOr(order?.title, fallbackOrder.title),
        description: cmsHasOrderUrl ? textOr(order?.description, fallbackOrder.description) : fallbackOrder.description,
        providerName: cmsHasOrderUrl ? textOr(order?.providerName, fallbackOrder.providerName) : fallbackOrder.providerName,
        iframeUrl,
        externalOrderUrl,
        fallbackTitle: cmsHasOrderUrl ? textOr(order?.fallbackTitle, fallbackOrder.fallbackTitle) : fallbackOrder.fallbackTitle,
        fallbackMessage: cmsHasOrderUrl ? textOr(order?.fallbackMessage, fallbackOrder.fallbackMessage) : fallbackOrder.fallbackMessage,
        enabled: cmsHasOrderUrl ? boolOr(order?.enabled, fallbackOrder.enabled) : fallbackOrder.enabled,
    };
    const canEmbed = content.enabled !== false && Boolean(content.iframeUrl);
    const canOpenExternal = content.enabled !== false && Boolean(content.externalOrderUrl);

    return (
        <div className="flex-1 w-full bg-white relative z-10 min-h-[600px] h-full">
            {canEmbed && (
                <iframe
                    src={content.iframeUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    title="Yoramen Online Ordering"
                    allow="geolocation; payment"
                />
            )}
            
            {!canEmbed && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm px-6">
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-5 h-5 text-stone" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="font-serif text-xl mb-2 text-sumi">{content.fallbackTitle}</h3>
                    <p className="text-stone text-sm">
                        {content.fallbackMessage}
                    </p>
                    {canOpenExternal && (
                        <a
                            href={content.externalOrderUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-6 inline-flex rounded-full bg-brand-red px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-red-hover"
                        >
                            Open Ordering
                        </a>
                    )}
                </div>
            </div>
            )}
        </div>
    );
}
