import Image from "next/image";

export const metadata = {
    title: "Gallery | Yoramen",
    description: "Every image captures a real moment from our daily craft.",
};

const galleryImages = [
    { url: "/images/ramen-placeholder.png", aspect: "aspect-[3/4]", title: "Prep Station" },
    { url: "/images/ramen-placeholder.png", aspect: "aspect-square", title: "Final Plating" },
    { url: "/images/ramen-placeholder.png", aspect: "aspect-[4/3]", title: "Store Interior" },
    { url: "/images/ramen-placeholder.png", aspect: "aspect-[3/4]", title: "Signature Bowl" },
    { url: "/images/ramen-placeholder.png", aspect: "aspect-square", title: "Spicy Details" },
    { url: "/images/ramen-placeholder.png", aspect: "aspect-[4/3]", title: "Sides Preparation" },
    { url: "/images/ramen-placeholder.png", aspect: "aspect-square", title: "Table Service" },
];

export default function GalleryPage() {
    return (
        <div className="pt-28 pb-24 min-h-screen bg-rice-paper">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">

                {/* Page Header */}
                <div className="text-center mb-16">
                    <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">Visual</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-sumi mb-4">Gallery</h1>
                    <div className="jp-divider mb-6"></div>
                    <p className="text-base text-stone max-w-xl mx-auto mb-4">
                        Every image captures a real moment from our daily craft.
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-gold-muted">
                        From prep station to final plating, from store interior to table service.
                    </p>
                </div>

                {/* Masonry-style Grid Container */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                    {galleryImages.map((img, idx) => (
                        <div key={idx} className="break-inside-avoid group cursor-pointer">
                            <div className={`relative ${img.aspect} w-full rounded-2xl overflow-hidden border border-light-border`}>
                                <Image
                                    src={img.url}
                                    alt={img.title}
                                    fill
                                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-warm-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="text-sumi font-serif tracking-wider text-lg">{img.title}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
