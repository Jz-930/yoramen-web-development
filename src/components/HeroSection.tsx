"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const fadeSlideUp = (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
});

export default function HeroSection() {
    const heroRef = useRef<HTMLElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    /* mouse parallax */
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 20, stiffness: 80 };
    
    // Reverse movement for the bowl to create floating feeling
    const imgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [40, -40]), springConfig);
    const imgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [40, -40]), springConfig);
    
    // Background ink elements move slightly in the same direction
    const bgArtX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
    const bgArtY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);

    useEffect(() => {
        setIsMounted(true);
        const handleMouse = (e: MouseEvent) => {
            if (!heroRef.current) return;
            const rect = heroRef.current.getBoundingClientRect();
            mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
            mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
        };
        window.addEventListener("mousemove", handleMouse);
        return () => window.removeEventListener("mousemove", handleMouse);
    }, [mouseX, mouseY]);

    return (
        <section
            ref={heroRef}
            className="relative min-h-[95vh] flex items-center justify-center bg-white pt-24 overflow-hidden"
        >
            {/* ── Core Background: Render the requested bg-3.webp with parallax and subtle styling ── */}
            <motion.div 
                className="absolute inset-[-5%] pointer-events-none opacity-[0.35]" 
                style={{ x: bgArtX, y: bgArtY }}
            >
                <Image 
                    src="/images/bg-3.webp" 
                    alt="Ramen Chef Background" 
                    fill 
                    className="object-cover mix-blend-multiply" 
                    priority 
                />
                {/* ── Soft gradient fade to keep text readable ── */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
            </motion.div>

            {/* ── Lantern Embers Dynamics (Hearth Warmth) ── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                <div className="jp-ember jp-ember-1"></div>
                <div className="jp-ember jp-ember-2"></div>
                <div className="jp-ember jp-ember-3"></div>
                <div className="jp-ember jp-ember-4"></div>
                <div className="jp-ember jp-ember-5"></div>
                <div className="jp-ember jp-ember-6"></div>
                <div className="jp-ember jp-ember-7"></div>
                <div className="jp-ember jp-ember-8"></div>
            </div>

            <div className="relative z-20 w-full max-w-6xl mx-auto px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-8">
                
                {/* Text Side */}
                <div className="lg:w-1/2 text-center lg:text-left relative z-20">
                    <motion.div className="inline-flex items-center gap-3 mb-6" {...fadeSlideUp(0.1)}>
                        {/* Authentic Japanese Brush stroke indicator instead of straight line */}
                        <div className="relative w-12 h-4 overflow-hidden">
                             <Image src="/images/Asset 20.png" alt="brush" fill className="object-contain object-left opacity-80" style={{ filter: "invert(32%) sepia(85%) saturate(3015%) hue-rotate(346deg) brightness(88%) contrast(92%)" }} />
                        </div>
                        <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-bold">
                            Freshly Made · Boldly Flavored
                        </span>
                    </motion.div>

                    <motion.h1 
                        className="text-5xl md:text-6xl lg:text-7xl font-serif text-sumi mb-6 leading-[1.1] tracking-tight"
                        {...fadeSlideUp(0.25)}
                    >
                        A ramen bowl <br />
                        <span className="italic font-light text-stone/80">with actual soul.</span>
                    </motion.h1>

                    <motion.p 
                        className="text-lg md:text-xl text-stone mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0"
                        {...fadeSlideUp(0.4)}
                    >
                        Slow-simmered, made to order, and layered with flavor. 
                        We turned &quot;delicious&quot; into a daily standard.
                    </motion.p>

                    <motion.div 
                        className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4"
                        {...fadeSlideUp(0.55)}
                    >
                        <Link href="/order" className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-bold transition-all hover:-translate-y-1 shadow-md flex items-center gap-3 group">
                            <span>Order Now</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/menu" className="border-2 border-stone/20 hover:border-sumi text-sumi px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-bold transition-all hover:bg-gray-50">
                            View Menu
                        </Link>
                    </motion.div>
                </div>

                {/* Hand-drawn Illustration Side */}
                <div className="lg:w-1/2 flex justify-center items-center relative h-[400px] md:h-[550px] w-full">
                    {isMounted && (
                        <>
                            {/* Defensive Replacement: The requested bg-1 pattern as the dynamic backdrop layer instead of ink splashes */}
                            <motion.div 
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-[0.12] pointer-events-none"
                                style={{ x: bgArtX, y: bgArtY, rotate: bgArtX }}
                            >
                                <Image src="/images/bg-1.webp" alt="Japanese Pattern Background" fill className="object-contain mix-blend-multiply" priority />
                            </motion.div>

                            {/* Floating Ramen Cartoon */}
                            <motion.div 
                                className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] z-10"
                                style={{ x: imgX, y: imgY }}
                                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                            >
                                {/* Floating animation using keyframes for continuous hover */}
                                <motion.div 
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-full h-full relative"
                                >
                                    <Image
                                        src="/images/Ramen-01.png"
                                        alt="Signature Ramen Illustration"
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        priority
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Faint subtle secondary drifting element from bg-1 package to maintain Japanese flavor */}
                            <motion.div 
                                animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-10 right-0 w-32 h-32 pointer-events-none hidden md:block"
                            >
                                <Image src="/images/bg-1.webp" alt="pattern detail" fill className="object-cover rounded-full mix-blend-multiply" />
                            </motion.div>
                        </>
                    )}
                </div>
            </div>
            
            {/* Minimalist Bottom Bar */}
            <motion.div 
                className="absolute bottom-4 left-0 right-0 py-6 z-10 hidden md:block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
            >
                <div className="max-w-6xl mx-auto flex justify-center gap-16 text-xs tracking-[0.2em] uppercase text-stone font-bold">
                    <span>Fresh Prep Daily</span>
                    <span className="text-brand-red opacity-50">·</span>
                    <span>Signature Flavor</span>
                    <span className="text-brand-red opacity-50">·</span>
                    <span>Authentic Craft</span>
                </div>
            </motion.div>
        </section>
    );
}
