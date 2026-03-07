import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = {
    title: "Menu | Yoramen",
    description: "Explore the full Yoramen menu, including signature ramen, sides, drinks, and seasonal limited offerings.",
};

const menuCategories = [
    {
        id: "signature",
        name: "Signature Series",
        items: [
            {
                name: "Yoramen Classic Tonkotsu",
                desc: "Rich tonkotsu broth with slow-roasted chashu and soft-boiled egg, full-bodied yet balanced.",
                price: "$16.50",
                tags: ["Popular", "Signature"],
                img: "/images/ramen-placeholder.png"
            },
            {
                name: "Black Garlic Shio",
                desc: "Clear shio broth elevated with house-made black garlic oil. Complex, aromatic, and deep.",
                price: "$17.50",
                tags: ["Chef's Pick"],
                img: "/images/ramen-placeholder.png"
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
                img: "/images/ramen-placeholder.png"
            },
            {
                name: "Spicy Tantanmen",
                desc: "Rich sesame and chili broth topped with spiced ground pork and fresh scallions.",
                price: "$17.00",
                tags: ["Spicy"],
                img: "/images/ramen-placeholder.png"
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
                img: "/images/ramen-placeholder.png"
            },
            {
                name: "Pork Gyoza",
                desc: "Pan-fried dumplings filled with seasoned pork and cabbage, crispy bottoms.",
                price: "$7.00",
                tags: ["Popular"],
                img: "/images/ramen-placeholder.png"
            }
        ]
    }
];

export default function MenuPage() {
    return (
        <div className="pt-24 min-h-screen bg-brand-ink">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Page Header */}
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Menu</h1>
                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
                        From classics to limited editions, find your perfect bowl.
                    </p>
                </div>

                {/* Category Navigation (Sticky) */}
                <div className="sticky top-[72px] lg:top-[64px] z-40 bg-brand-ink/90 backdrop-blur-md py-4 border-b border-white/10 mb-16 flex overflow-x-auto hide-scrollbar gap-8 justify-start md:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
                    {menuCategories.map((cat) => (
                        <a
                            key={cat.id}
                            href={`#${cat.id}`}
                            className="text-sm uppercase tracking-widest text-gray-400 hover:text-white whitespace-nowrap transition-colors"
                        >
                            {cat.name}
                        </a>
                    ))}
                </div>

                {/* Menu Items */}
                <div className="space-y-32">
                    {menuCategories.map((category) => (
                        <section key={category.id} id={category.id} className="scroll-mt-40">
                            <div className="flex items-center gap-6 mb-12">
                                <h2 className="text-3xl md:text-4xl font-serif text-white">{category.name}</h2>
                                <div className="flex-1 h-[1px] bg-white/10"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {category.items.map((item, idx) => (
                                    <div key={idx} className="group flex flex-col sm:flex-row gap-6 bg-[#0E1721] rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1">
                                        <div className="relative w-full sm:w-40 h-48 sm:h-40 rounded-xl overflow-hidden shrink-0">
                                            <Image
                                                src={item.img}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>

                                        <div className="flex flex-col flex-grow py-2">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-serif text-white">{item.name}</h3>
                                                <span className="text-gold font-semibold">{item.price}</span>
                                            </div>

                                            <div className="flex gap-2 mb-3 flex-wrap">
                                                {item.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] uppercase tracking-wider bg-brand-red/20 text-brand-red-light px-2 py-0.5 rounded-sm">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <p className="text-sm text-gray-400 font-light leading-relaxed mb-4 flex-grow">
                                                {item.desc}
                                            </p>

                                            <Link href="/order" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white hover:text-brand-red transition-colors w-max">
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
                <section className="mt-32 max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/10 relative">
                    <div className="absolute inset-0 bg-[url('/images/ramen-placeholder.png')] bg-cover bg-center"></div>
                    <div className="absolute inset-[-10px] bg-brand-ink/80 backdrop-blur-md"></div>
                    <div className="relative z-10 p-12 md:p-16 text-center">
                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Better value with combos</h2>
                        <p className="text-gray-300 font-light mb-8 max-w-lg mx-auto">
                            Bowl + side + drink. One set, fully satisfying. Built to give you the massive flavor you need.
                        </p>
                        <Link
                            href="/order"
                            className="bg-brand-red hover:bg-brand-red-light text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest font-semibold transition-all hover-lift inline-block"
                        >
                            View Combo Deals
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
}
