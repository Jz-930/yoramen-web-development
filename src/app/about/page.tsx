import Image from "next/image";

export const metadata = {
    title: "Our Story | Yoramen",
    description: "It started with an obsession for flavor. Learn about the craft and history behind Yoramen.",
};

export default function AboutPage() {
    return (
        <div className="pt-28 pb-24 min-h-screen bg-rice-paper">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">

                {/* Page Header */}
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">About</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-sumi mb-6">Our Story</h1>
                    <div className="jp-divider mb-8"></div>
                    <p className="text-lg text-stone font-serif italic">
                        It started with an obsession for flavor.
                    </p>
                </div>

                {/* Content Section 1: Intro */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                    <div className="relative aspect-square rounded-2xl overflow-hidden group">
                        <Image
                            src="/images/ramen-placeholder.png"
                            alt="Ramen Prep"
                            fill
                            className="object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                        />
                    </div>
                    <div className="space-y-6">
                        <p className="text-base text-stone leading-[1.9]">
                            We opened this ramen house to do one thing exceptionally well: make every bowl with real discipline. Truly memorable flavor is never built on gimmicks. It comes from getting every fundamental step right.
                        </p>
                        <p className="text-base text-stone leading-[1.9]">
                            From broth depth to noodle texture, from heat control to service pace, we refine every detail so that no matter when you visit, your bowl feels consistent, premium, and worth returning for.
                        </p>
                        <div className="pl-6 border-l-2 border-brand-red py-3 mt-8">
                            <p className="text-sumi font-serif text-xl italic leading-relaxed">
                                &quot;To us, ramen is more than food. It is warmth, craft, and connection in one bowl. Come in and claim the best part of your day.&quot;
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif text-sumi mb-4">The Journey</h2>
                        <div className="jp-divider"></div>
                    </div>

                    <div className="space-y-0">
                        {[
                            { year: "2018", title: "Brand Origin", desc: "Started as a small pop-up testing broths with an unrelenting focus on depth without heaviness." },
                            { year: "2019", title: "First Store Opened", desc: "The original 12-seat counter opened, establishing the daily line-up." },
                            { year: "2020", title: "Signature Products Established", desc: "The Yoramen Classic Tonkotsu reached its final, perfected recipe iteration." },
                            { year: "2022", title: "Store Upgrades and Expansion", desc: "Expanded to larger spaces designed specifically for optimal guest comfort and culinary speed." },
                            { year: "2024", title: "Continuous Innovation", desc: "Launch of the Seasonal Limiteds program, pushing boundaries while respecting tradition." }
                        ].map((milestone, i) => (
                            <div key={i} className="flex gap-8 group">
                                {/* Timeline line and dot */}
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full border-2 border-brand-red bg-rice-paper group-hover:bg-brand-red transition-colors z-10 shrink-0"></div>
                                    {i < 4 && <div className="w-px flex-1 bg-light-border"></div>}
                                </div>

                                {/* Content */}
                                <div className="pb-12">
                                    <span className="text-brand-red text-sm font-medium tracking-[0.15em] block mb-2">{milestone.year}</span>
                                    <h3 className="text-xl font-serif text-sumi mb-2">{milestone.title}</h3>
                                    <p className="text-stone text-sm leading-relaxed">{milestone.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
