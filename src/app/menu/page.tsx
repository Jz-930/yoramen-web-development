import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { fetchMenuCmsContent } from "@/sanity/fetchers";
import { resolveImageUrl } from "@/sanity/image";
import type { MenuCategoryContent, MenuPageContent } from "@/sanity/types";

export const metadata = {
    title: "Menu | Yoramen",
    description: "Explore the full Yoramen menu, including signature ramen, sides, drinks, and seasonal limited offerings.",
};

export const dynamic = "force-dynamic";

const fallbackMenuPage: Required<MenuPageContent> = {
    eyebrow: "Explore",
    title: "Menu",
    description: "From classics to limited editions, find your perfect bowl.",
    categoryNavEnabled: true,
    comboCta: {
        title: "Better value with combos",
        description: "Bowl + side + drink. One set, fully satisfying. Built for your appetite.",
        buttonLabel: "View Combo Deals",
        buttonHref: "/order",
    },
};

const fallbackMenuCategories: MenuCategoryContent[] = [
    {
        id: "signature",
        name: "Signature Series",
        items: [
            {
                name: "Yoramen Classic Tonkotsu",
                desc: "Rich tonkotsu broth with slow-roasted chashu and soft-boiled egg, full-bodied yet balanced.",
                price: "$16.50",
                tags: ["Popular", "Signature"],
                image: "/images/ramen-placeholder.png"
            },
            {
                name: "Black Garlic Shio",
                desc: "Clear shio broth elevated with house-made black garlic oil. Complex, aromatic, and deep.",
                price: "$17.50",
                tags: ["Chef's Pick"],
                image: "/images/ramen-placeholder.png"
            }
        ]
    },
    {
        id: "spicy",
        name: "Spicy Series",
        items: [
            {
                name: "Hellfire Miso",
                desc: "Deep red miso base blended with five types of chili. Intensely spicy with an umami finish.",
                price: "$18.00",
                tags: ["Spicy", "Popular"],
                image: "/images/ramen-placeholder.png"
            },
            {
                name: "Spicy Tantanmen",
                desc: "Rich sesame and chili broth topped with spiced ground pork and fresh scallions.",
                price: "$17.00",
                tags: ["Spicy"],
                image: "/images/ramen-placeholder.png"
            }
        ]
    },
    {
        id: "sides",
        name: "Sides & Add-ons",
        items: [
            {
                name: "Crispy Karaage",
                desc: "Japanese-style fried chicken bites, perfectly crisp outside and juicy inside. Served with yuzu mayo.",
                price: "$8.50",
                tags: [],
                image: "/images/ramen-placeholder.png"
            },
            {
                name: "Pork Gyoza",
                desc: "Pan-fried dumplings filled with seasoned pork and cabbage, crispy bottoms.",
                price: "$7.00",
                tags: ["Popular"],
                image: "/images/ramen-placeholder.png"
            }
        ]
    }
];

export default async function MenuPage() {
    const cmsContent = await fetchMenuCmsContent();
    const pageContent = {
        ...fallbackMenuPage,
        ...cmsContent.page,
        comboCta: {
            ...fallbackMenuPage.comboCta,
            ...cmsContent.page?.comboCta,
        },
    };
    const comboCta = {
        title: pageContent.comboCta.title || "Better value with combos",
        description:
            pageContent.comboCta.description ||
            "Bowl + side + drink. One set, fully satisfying. Built for your appetite.",
        buttonLabel: pageContent.comboCta.buttonLabel || "View Combo Deals",
        buttonHref: pageContent.comboCta.buttonHref || "/order",
    };

    const cmsCategoriesWithItems = cmsContent.categories.filter(
        (category) => Array.isArray(category.items) && category.items.length > 0
    );
    const menuCategories =
        cmsCategoriesWithItems.length > 0 ? cmsCategoriesWithItems : fallbackMenuCategories;

    return (
        <div className="pt-28 min-h-screen bg-section-warm">
            <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">

                {/* Page Header */}
                <div className="text-center mb-16">
                    <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">{pageContent.eyebrow}</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-sumi mb-4">{pageContent.title}</h1>
                    <div className="jp-divider mb-6"></div>
                    <p className="text-base text-stone max-w-xl mx-auto">
                        {pageContent.description}
                    </p>
                </div>

                {/* Category Navigation (Sticky) */}
                {pageContent.categoryNavEnabled && (
                    <div className="sticky top-[64px] z-40 bg-section-warm/90 backdrop-blur-md py-4 border-b border-light-border mb-16 flex overflow-x-auto md:overflow-visible md:flex-wrap hide-scrollbar gap-4 md:gap-6 justify-start md:justify-center -mx-6 px-6 sm:mx-0 sm:px-0">
                        {menuCategories.map((cat) => (
                            <a
                                key={cat.id}
                                href={`#${cat.id}`}
                                className="text-xs uppercase tracking-[0.15em] text-stone hover:text-sumi whitespace-nowrap transition-colors font-medium"
                            >
                                {cat.name}
                            </a>
                        ))}
                    </div>
                )}

                {/* Menu Items */}
                <div className="space-y-24">
                    {menuCategories.map((category) => (
                        <section key={category.id} id={category.id} className="scroll-mt-32">
                            <div className="flex items-center gap-6 mb-10">
                                <h2 className="text-2xl md:text-3xl font-serif text-sumi">{category.name}</h2>
                                <div className="flex-1 h-px bg-light-border"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {category.items.map((item, idx) => (
                                    <div key={idx} className="group flex flex-col sm:flex-row gap-5 bg-warm-white rounded-2xl p-4 border border-light-border hover-rise transition-all">
                                        <div className="relative w-full sm:w-36 h-44 sm:h-36 rounded-xl overflow-hidden shrink-0">
                                            <Image
                                                src={resolveImageUrl(item.image, "/images/ramen-placeholder.png")}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>

                                        <div className="flex flex-col flex-grow py-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-serif text-sumi">{item.name}</h3>
                                                {item.price && (
                                                    <span className="text-brand-red font-medium text-sm">{item.price}</span>
                                                )}
                                            </div>

                                            <div className="flex gap-2 mb-3 flex-wrap">
                                                {(item.tags || []).map(tag => (
                                                    <span key={tag} className="text-[10px] uppercase tracking-wider bg-brand-red/10 text-brand-red px-2.5 py-0.5 rounded-full font-medium">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {item.desc && (
                                                <p className="text-sm text-stone leading-relaxed mb-4 flex-grow">
                                                    {item.desc}
                                                </p>
                                            )}

                                            <Link href="/order" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-sumi hover:text-brand-red transition-colors w-max font-medium">
                                                <Plus size={14} /> Add to Order
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Combos CTA */}
                <section className="mt-24 max-w-3xl mx-auto rounded-2xl overflow-hidden border border-light-border relative bg-warm-white">
                    <div className="p-12 md:p-16 text-center">
                        <h2 className="text-2xl md:text-4xl font-serif text-sumi mb-4">{comboCta.title}</h2>
                        <p className="text-stone mb-8 max-w-md mx-auto">
                            {comboCta.description}
                        </p>
                        <Link
                            href={comboCta.buttonHref}
                            className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3.5 rounded-full text-sm uppercase tracking-[0.12em] font-medium transition-all hover-rise inline-block"
                        >
                            {comboCta.buttonLabel}
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
}
