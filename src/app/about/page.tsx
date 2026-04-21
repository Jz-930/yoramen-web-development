import Image from "next/image";
import StoryTimeline from "./StoryTimeline";

export const metadata = {
    title: "Our Story | Yoramen",
    description: "It started with an obsession for flavor. Learn about the craft and history behind Yoramen.",
};

export default function AboutPage() {
    return (
        <div className="pt-28 pb-24 min-h-screen bg-white relative overflow-hidden">
            {/* ── Abstract Vector Flourishes (Stamp effect) ── */}
            <div className="absolute top-[10%] left-[-20%] w-[600px] h-[600px] opacity-[0.02] pointer-events-none z-30 transform rotate-[15deg]">
                <Image src="/images/icons/mochi, dessert, rice, japanese, sweet.svg" alt="mochi" fill className="object-contain" style={{ filter: "invert(32%) sepia(85%) saturate(3015%) hue-rotate(346deg)" }} />
            </div>
            <div className="absolute top-[60%] right-[-15%] w-[700px] h-[700px] opacity-[0.02] pointer-events-none z-30 transform -rotate-[25deg]">
                <Image src="/images/icons/yakitori, chicken, skewer, grilled, japanese.svg" alt="yakitori" fill className="object-contain" style={{ filter: "invert(32%) sepia(85%) saturate(3015%) hue-rotate(346deg)" }} />
            </div>

            {/* Intro Header & Section Container (White Background layer to block timeline bleed) */}
            <div className="relative z-20 bg-white shadow-[0_-50px_50px_0_white] w-full">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="text-center mb-20 max-w-3xl mx-auto pt-8">
                        <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">About</span>
                        <h1 className="text-4xl md:text-6xl font-serif text-sumi mb-6">Our Story</h1>
                        <div className="relative w-20 h-5 mx-auto mb-8 -ml-4 md:ml-auto">
                            <Image src="/images/Asset 20.png" alt="brush" fill className="object-contain opacity-80" style={{ filter: "invert(32%) sepia(85%) saturate(3015%) hue-rotate(346deg) brightness(88%) contrast(92%)" }} />
                        </div>
                        <p className="text-lg text-stone font-serif italic">
                            It started with an obsession for flavor.
                        </p>
                    </div>

                    {/* Content Section 1: Intro */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pb-32">
                        <div className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100 shadow-sm">
                            <Image
                                src="/images/img-3.webp"
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
                            <div className="pl-6 border-l-2 border-brand-red py-3 mt-8 bg-gray-50/50">
                                <p className="text-sumi font-serif text-xl italic leading-relaxed">
                                    &quot;To us, ramen is more than food. It is warmth, craft, and connection in one bowl. Come in and claim the best part of your day.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">

                {/* Timeline Section */}
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif text-sumi mb-4">The Journey</h2>
                        <div className="relative w-20 h-5 mx-auto mb-2 -ml-4 md:ml-auto">
                            <Image src="/images/Asset 20.png" alt="brush" fill className="object-contain opacity-80" style={{ filter: "invert(32%) sepia(85%) saturate(3015%) hue-rotate(346deg) brightness(88%) contrast(92%)" }} />
                        </div>
                    </div>

                    <StoryTimeline />
                </div>

            </div>
        </div>
    );
}
