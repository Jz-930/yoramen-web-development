"use client";

import { useState } from "react";
import Image from "next/image";

export type StoryTimelineItem = {
    year: string;
    img: string;
    align: "left" | "right";
    title: string;
    desc: string;
};

const timelineData: StoryTimelineItem[] = [
    { year: "2021", img: "/images/story/story-2021-clean.webp", align: "left", title: "Tokyo Inspiration", desc: "Inspired by a family member running a successful ramen shop in Tokyo, the idea of bringing authentic, high-quality Japanese flavor to our local town was born." },
    { year: "2022", img: "/images/story/story-2022-clean.webp", align: "right", title: "Local Pop-ups", desc: "Started quietly by setting up local food stalls across Scarborough. The lines grew, and the feedback validated our obsession with proper tonkotsu broth." },
    { year: "2024", img: "/images/story/story-2024-clean.webp", align: "left", title: "Scaling Operations", desc: "Expanded our reach to more community events and began building a serious following. Handcrafting noodles at this volume forced us to innovate." },
    { year: "2025", title: "Engineering Consistency", img: "/images/story/story-2025-clean.webp", align: "right", desc: "Successfully developed and integrated specialized automated noodle machinery to ensure every single strand meets our exact texture and hydration requirements." },
    { year: "2026", img: "/images/story/story-2026-clean.webp", align: "left", title: "Flagship Store Opens", desc: "Finally set down permanent roots. The first official Yoramen physical location opens, bringing the complete dining experience to life." }
];

export default function StoryTimeline({ items = timelineData }: { items?: StoryTimelineItem[] }) {
    const [activeStory, setActiveStory] = useState<string | null>(null);

    return (
        <>
            {/* ── Cinematic Fixed Background Hover Images ── */}
            {items.map((milestone) => (
                <div 
                    key={`bg-${milestone.year}`}
                    className={`fixed top-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[1000px] lg:h-[1000px] pointer-events-none -z-10 transition-all ease-out ${
                        milestone.align === 'left' ? 'left-[-10%]' : 'right-[-10%]'
                    } ${
                        activeStory === milestone.year ? 'opacity-[0.65] scale-100' : 'opacity-0 scale-[0.85]'
                    } ${
                        activeStory !== null && activeStory !== milestone.year ? 'duration-0' : 'duration-1000'
                    }`}
                    style={{
                        WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)',
                        maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)'
                    }}
                >
                    <Image 
                        src={milestone.img} 
                        alt={milestone.title} 
                        fill 
                        className="object-contain" 
                        priority={true}
                    />
                </div>
            ))}

            {/* ── Timeline Interactive Nodes ── */}
            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-1/2 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent z-10 w-full">
                {items.map((milestone) => (
                    <div 
                        key={milestone.year} 
                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-16"
                        onMouseEnter={() => setActiveStory(milestone.year)}
                        onMouseLeave={() => setActiveStory(null)}
                    >
                        {/* Interactive Dot */}
                        <div className={`absolute left-0 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-5 h-5 rounded-full border-[3px] border-white transition-all duration-500 shadow-sm z-10 ${activeStory === milestone.year ? 'bg-brand-red scale-150 border-brand-red/20' : 'bg-gray-200 group-hover:bg-brand-red group-hover:scale-125'}`}></div>
                        
                        {/* Hover Detection Trigger Wrapper containing actual Content Box */}
                        <div className={`w-[calc(100%-2rem)] ml-8 md:ml-0 md:w-5/12 bg-white/95 backdrop-blur-md border rounded-xl p-8 transition-all duration-700 cursor-pointer ${
                            activeStory === milestone.year 
                            ? 'shadow-2xl -translate-y-2 border-brand-red/30' 
                            : 'border-gray-100 shadow-sm group-hover:shadow-md group-hover:-translate-y-1'
                        }`}>
                            <span className={`text-sm font-bold tracking-[0.15em] block mb-2 transition-colors duration-500 ${activeStory === milestone.year ? 'text-brand-red' : 'text-stone group-hover:text-brand-red'}`}>{milestone.year}</span>
                            <h3 className="text-2xl font-serif text-sumi mb-4">{milestone.title}</h3>
                            <p className="text-stone text-sm leading-relaxed">{milestone.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
