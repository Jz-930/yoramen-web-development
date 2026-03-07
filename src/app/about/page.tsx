import Image from "next/image";

export const metadata = {
    title: "Our Story | Yoramen",
    description: "It started with an obsession for flavor. Learn about the craft and history behind Yoramen.",
};

export default function AboutPage() {
    return (
        <div className="pt-32 pb-24 min-h-screen bg-brand-ink">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Our Story</h1>
                    <p className="text-xl md:text-2xl text-gold font-serif italic mb-12">
                        It started with an obsession for flavor.
                    </p>
                </div>

                {/* Content Section 1: Intro */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/10 group">
                        <Image
                            src="/images/ramen-placeholder.png"
                            alt="Ramen Prep"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-ink/40 to-transparent"></div>
                    </div>
                    <div className="space-y-8 text-lg text-gray-300 font-light leading-relaxed">
                        <p>
                            We opened this ramen house to do one thing exceptionally well: make every bowl with real discipline. Truly memorable flavor is never built on gimmicks. It comes from getting every fundamental step right.
                        </p>
                        <p>
                            From broth depth to noodle texture, from heat control to service pace, we refine every detail so that no matter when you visit, your bowl feels consistent, premium, and worth returning for.
                        </p>
                        <div className="pl-6 border-l-2 border-brand-red py-2 mt-8">
                            <p className="text-white font-serif text-2xl italic">
                                &quot;To us, ramen is more than food. It is warmth, craft, and connection in one bowl. Come in and claim the best part of your day.&quot;
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-serif text-center text-white mb-20">The Journey</h2>

                    <div className="relative border-l border-white/10 ml-6 md:ml-1/2 md:-translate-x-px space-y-16 py-8">

                        {[
                            { year: "2018", title: "Brand Origin", desc: "Started as a small pop-up testing broths with an unrelenting focus on depth without heaviness." },
                            { year: "2019", title: "First Store Opened", desc: "The original 12-seat counter opened, establishing the daily line-up." },
                            { year: "2020", title: "Signature Products Established", desc: "The Yoramen Classic Tonkotsu reached its final, perfected recipe iteration." },
                            { year: "2022", title: "Store Upgrades and Expansion", desc: "Expanded to larger spaces designed specifically for optimal guest comfort and culinary speed." },
                            { year: "2024", title: "Continuous Innovation", desc: "Launch of the Seasonal Limiteds program, pushing boundaries while respecting tradition." }
                        ].map((milestone, i) => (
                            <div key={i} className={`relative flex flex-col md:flex-row items-center group w-full ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                {/* Connector Dot */}
                                <div className="absolute left-[-24px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-brand-ink border-2 border-gold group-hover:bg-gold group-hover:scale-125 transition-all z-10"></div>

                                {/* Content */}
                                <div className={`w-full md:w-1/2 pl-8 md:pl-0 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} transition-all duration-500 group-hover:-translate-y-1`}>
                                    <div className={`inline-block border border-brand-red/30 bg-brand-red/10 px-3 py-1 rounded-full mb-4 ${i % 2 === 0 ? 'md:ml-auto' : ''}`}>
                                        <span className="text-brand-red font-bold tracking-widest text-sm">{milestone.year}</span>
                                    </div>
                                    <h3 className="text-3xl font-serif text-white mb-4">{milestone.title}</h3>
                                    <p className="text-gray-400 font-light leading-relaxed text-lg">{milestone.desc}</p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

            </div>
        </div>
    );
}
