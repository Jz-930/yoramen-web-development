"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/* ── animation presets ── */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeSlideUp = (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
});

const staggerContainer = {
    animate: { transition: { staggerChildren: 0.12 } },
};

export default function HeroSection() {
    const heroRef = useRef<HTMLElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    /* mouse parallax — STRONGER ranges for noticeable depth */
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 20, stiffness: 80 };
    /* Bowl moves 30px in each axis (was 12) */
    const imgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [30, -30]), springConfig);
    const imgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [30, -30]), springConfig);
    /* Background art moves opposite, 15px (was 6) */
    const bgArtX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
    const bgArtY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), springConfig);
    /* Pattern background — subtle shift */
    const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);
    const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-6, 6]), springConfig);

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

    const highlights = ["Fresh Prep Daily", "Signature Flavor", "Made to Order"];

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center bg-rice-paper pt-20 overflow-hidden"
        >
            {/* ── Animated pattern background layer ── */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ x: bgX, y: bgY }}
            >
                {/* Subtle cross pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232C2C2C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                    }}
                />
                {/* Floating decorative dots */}
                {isMounted && (
                    <>
                        <div className="hero-dot hero-dot-1" />
                        <div className="hero-dot hero-dot-2" />
                        <div className="hero-dot hero-dot-3" />
                        <div className="hero-dot hero-dot-4" />
                        <div className="hero-dot hero-dot-5" />
                    </>
                )}
            </motion.div>

            {/* ── Hero background art (bg-3 ramen chef) ── */}
            <motion.div
                className="absolute inset-0 pointer-events-none hero-bg-art-container"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.8, delay: 0.2, ease: EASE }}
                style={{ x: bgArtX, y: bgArtY }}
            >
                {/* Full-bleed background art — fills entire hero, scaled 110% for sway headroom */}
                <div className="absolute inset-[-5%] hero-bg-art-sway">
                    <Image
                        src="/images/bg-3.webp"
                        alt=""
                        fill
                        className="object-cover opacity-[0.14]"
                        style={{ objectPosition: "center 30%" }}
                        priority
                    />
                </div>
                {/* Soft gradient overlays so art blends into rice paper on edges */}
                <div className="absolute inset-0 bg-gradient-to-r from-rice-paper via-rice-paper/60 to-rice-paper/70" />
                <div className="absolute inset-0 bg-gradient-to-b from-rice-paper/60 via-transparent to-rice-paper/80" />
                <div className="absolute inset-0 bg-gradient-to-l from-rice-paper/40 via-transparent to-transparent" />
            </motion.div>

            {/* ── Main content ── */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
                {/* Text Side */}
                <motion.div
                    className="lg:w-1/2 text-center lg:text-left"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    {/* Tagline */}
                    <motion.div
                        className="inline-flex items-center gap-2 mb-8"
                        {...fadeSlideUp(0.1)}
                    >
                        <motion.span
                            className="w-8 h-px bg-brand-red"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                            style={{ transformOrigin: "left" }}
                        />
                        <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium">
                            Freshly Made · Boldly Flavored
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-sumi mb-6 leading-[1.15]"
                        {...fadeSlideUp(0.25)}
                    >
                        A ramen bowl <br />
                        <motion.span
                            className="text-brand-red inline-block"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
                        >
                            with actual soul.
                        </motion.span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        className="text-lg text-stone mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0"
                        {...fadeSlideUp(0.45)}
                    >
                        Slow-simmered, made to order, and layered with flavor. We turned
                        &quot;delicious&quot; into a daily standard.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
                        {...fadeSlideUp(0.6)}
                    >
                        <Link
                            href="/order"
                            className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium transition-all hover-rise flex items-center gap-3 group"
                        >
                            <span>Order Now</span>
                            <ArrowRight
                                size={16}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </Link>
                        <Link
                            href="/menu"
                            className="border border-sumi/20 hover:border-sumi text-sumi px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium transition-all hover-rise"
                        >
                            View Menu
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Image Side */}
                <motion.div
                    className="lg:w-1/2 flex justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
                >
                    <div className="relative">
                        {/* Ensō circle — slowly rotating behind the bowl */}
                        <motion.div
                            className="absolute -inset-4 md:-inset-12 rounded-full border-2 border-brand-red/10 hero-enso"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, delay: 0.6 }}
                        />
                        {/* Second ensō ring — hidden on mobile */}
                        <motion.div
                            className="absolute -inset-20 rounded-full border border-dashed border-brand-red/5 hero-enso-reverse hidden md:block"
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.4, delay: 0.8 }}
                        />

                        {/* Floating image container — STRONGER float */}
                        <motion.div
                            className="relative w-64 h-80 md:w-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-xl hero-float"
                            style={{ x: imgX, y: imgY }}
                        >
                            <Image
                                src="/images/ramen-placeholder.png"
                                alt="Signature Ramen Bowl"
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Subtle inner glow overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                        </motion.div>

                        {/* Steam wisps — MUCH larger container & more wisps */}
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-56 pointer-events-none">
                            <div className="hero-steam hero-steam-1" />
                            <div className="hero-steam hero-steam-2" />
                            <div className="hero-steam hero-steam-3" />
                            <div className="hero-steam hero-steam-4" />
                            <div className="hero-steam hero-steam-5" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── Bottom highlights bar — animated ── */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 border-t border-light-border bg-warm-white/60 backdrop-blur-sm"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
            >
                <div className="max-w-6xl mx-auto px-6 lg:px-8 py-5 flex justify-center gap-12 text-xs tracking-[0.2em] uppercase text-stone overflow-hidden">
                    {highlights.map((text, i) => (
                        <motion.span
                            key={text}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.1 + i * 0.15, ease: "easeOut" }}
                        >
                            {i > 0 && <span className="text-brand-red mr-12">·</span>}
                            {text}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
