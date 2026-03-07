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
        <div className="pt-32 pb-24 min-h-screen bg-brand-ink">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Gallery</h1>
                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto mb-6">
                        Every image captures a real moment from our daily craft.
                    </p>
                    <p className="text-sm uppercase tracking-widest text-gold">
                        From prep station to final plating, from store interior to table service.
                    </p>
                </div>

                {/* Masonry-style Grid Container */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {galleryImages.map((img, idx) => (
                        <div key={idx} className="break-inside-avoid group cursor-pointer">
                            <div className={`relative ${img.aspect} w-full rounded-2xl overflow-hidden border border-white/10`}>
                                <Image
                                    src={img.url}
                                    alt={img.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-brand-ink/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="text-white font-serif tracking-wider text-xl">{img.title}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
