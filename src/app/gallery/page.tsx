"use client";

import Image from "next/image";
import { useState } from "react";

const galleryData = [
    { category: "Food", url: "/images/img-4.webp", aspect: "aspect-[3/4]", title: "Signature Bowl" },
    { category: "Food", url: "/images/img-4.webp", aspect: "aspect-square", title: "Perfect Egg" },
    { category: "Interior", url: "/images/img-4.webp", aspect: "aspect-[4/3]", title: "Open Kitchen" },
    { category: "Moments", url: "/images/img-4.webp", aspect: "aspect-[3/4]", title: "Chef Preparation" },
    { category: "Interior", url: "/images/img-4.webp", aspect: "aspect-square", title: "Kitchen Steam" },
    { category: "Food", url: "/images/img-4.webp", aspect: "aspect-[4/3]", title: "Chashu Pork" },
    { category: "Moments", url: "/images/img-4.webp", aspect: "aspect-square", title: "Quality Check" },
    { category: "Food", url: "/images/img-4.webp", aspect: "aspect-square", title: "Dark Broth" },
    { category: "Interior", url: "/images/img-4.webp", aspect: "aspect-[3/4]", title: "City Atmosphere" },
];

const testimonials = [
    { quote: "The broth is incredibly deep without feeling heavy. Easily the best addition to Scarborough's food scene this year.", author: "Local Guide", date: "April 2026", color: "bg-gray-50" },
    { quote: "It's the attention to detail for me. You can tell they perfected their automated noodle machine—the texture is flawless every time.", author: "Food Blogger", date: "April 2026", color: "bg-white border flex flex-col border-gray-100 shadow-sm" },
    { quote: "Yoramen brings that quiet, deliberate Tokyo ramen stall energy right to our neighborhood. The spicy tonkotsu is unforgettable.", author: "Neighborhood Regular", date: "May 2026", color: "bg-gray-50" }
];

export default function GalleryPage() {
    const [activeTab, setActiveTab] = useState("All");
    const categories = ["All", "Food", "Interior", "Moments"];
    
    // Filter images based on tab
    const filteredImages = activeTab === "All" 
        ? galleryData 
        : galleryData.filter(img => img.category === activeTab);

    return (
        <div className="pt-28 pb-24 min-h-screen bg-white relative overflow-hidden">
            {/* ── Abstract Vector Flourishes ── */}
            <div className="absolute -top-10 -right-20 w-[500px] h-[500px] opacity-[0.02] pointer-events-none z-0 transform rotate-12">
                <Image src="/images/icons/bento, lunch, box, japanese, food.svg" alt="bento" fill className="object-contain" />
            </div>
            <div className="absolute top-1/2 -left-20 w-[500px] h-[500px] opacity-[0.02] pointer-events-none z-0 transform -rotate-12">
                <Image src="/images/icons/matcha, tea, green, japanese, drink.svg" alt="matcha" fill className="object-contain" />
            </div>

            <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">

                {/* Page Header */}
                <div className="text-center mb-12">
                    <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">Visual</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-sumi mb-6">Gallery</h1>
                    <div className="relative w-20 h-5 mx-auto mb-8 -ml-4 md:ml-auto">
                        <Image src="/images/Asset 20.png" alt="brush" fill className="object-contain opacity-80" style={{ filter: "invert(32%) sepia(85%) saturate(3015%) hue-rotate(346deg) brightness(88%) contrast(92%)" }} />
                    </div>
                    <p className="text-base text-stone max-w-xl mx-auto mb-4">
                        A glimpse into our dedication to the craft. 
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                                activeTab === cat 
                                    ? "bg-sumi text-white shadow-md" 
                                    : "bg-gray-50 text-stone hover:bg-gray-100"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Masonry-style Grid Container */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5 mb-32">
                    {filteredImages.map((img, idx) => (
                        <div key={idx} className="break-inside-avoid group cursor-pointer">
                            <div className={`relative ${img.aspect} w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm`}>
                                <Image
                                    src={img.url}
                                    alt={img.title}
                                    fill
                                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="text-sumi font-serif tracking-wider text-xl font-medium">{img.title}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Testimonials Section */}
                <div className="pt-24 border-t border-gray-100">
                    <div className="text-center mb-16">
                        <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">Community</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-sumi mb-4">What people are saying</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((test, idx) => (
                            <div key={idx} className={`${test.color} p-8 rounded-2xl`}>
                                <svg className="w-8 h-8 text-brand-red/20 mb-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                                <p className="text-stone italic leading-relaxed mb-6 flex-grow">{test.quote}</p>
                                <div className="mt-auto">
                                    <p className="text-sumi font-medium font-serif">{test.author}</p>
                                    <p className="text-stone text-xs tracking-wider uppercase mt-1">{test.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
