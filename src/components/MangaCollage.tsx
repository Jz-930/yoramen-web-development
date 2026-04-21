"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function MangaCollage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // High-impact Parallax values
    const y1 = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
    const x1 = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
    
    // Element 2 floats in opposite direction much faster
    const y2 = useTransform(scrollYProgress, [0, 1], ["25%", "-35%"]);
    
    // Center picture floats upwards dynamically
    const yCenter = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);

    return (
        <div ref={containerRef} className="w-full relative min-h-[500px] lg:min-h-[600px] flex items-center justify-center -mt-10 lg:mt-0">
            
            {/* Manga Element 1 (2022) - Top Right spanning to Left */}
            <motion.div 
                style={{ y: y1, x: x1, rotate: 12 }}
                className="absolute top-[-25%] md:top-[-30%] left-[5%] md:left-[25%] w-[110%] md:w-[115%] aspect-square z-0 pointer-events-none opacity-[0.25]"
            >
                <div className="relative w-full h-full" style={{ 
                    WebkitMaskImage: 'radial-gradient(ellipse at 35% 50%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
                    maskImage: 'radial-gradient(ellipse at 35% 50%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)'
                }}>
                    <Image src="/images/story/story-2022-clean.webp" alt="Ramen Manga Art 2022" fill className="object-contain grayscale contrast-125 mix-blend-multiply" />
                </div>
            </motion.div>

            {/* Manga Element 2 (2024) - Bottom Left */}
            <motion.div 
                style={{ y: y2, rotate: -10 }}
                className="absolute bottom-[-20%] md:bottom-[-30%] left-[-15%] md:left-[-25%] w-[75%] md:w-[80%] aspect-square z-0 pointer-events-none opacity-30"
            >
                <div className="relative w-full h-full" style={{ 
                    WebkitMaskImage: 'radial-gradient(ellipse at 60% 40%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 75%)',
                    maskImage: 'radial-gradient(ellipse at 60% 40%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 75%)'
                }}>
                    <Image src="/images/story/story-2024-clean.webp" alt="Ramen Manga Art 2024" fill className="object-contain grayscale contrast-125 mix-blend-multiply" />
                </div>
            </motion.div>

            {/* Real World Photo Frame - Center Overlap */}
            <motion.div 
                style={{ y: yCenter }}
                className="relative w-[70%] md:w-[60%] aspect-[3/4] z-10 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] group transform rotate-3 hover:rotate-0 hover:-translate-y-2 transition-all duration-700 bg-white border-[8px] border-white ring-1 ring-gray-100"
            >
                <video 
                    src="/videos/our-philosophy.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000" 
                />
            </motion.div>

        </div>
    );
}
