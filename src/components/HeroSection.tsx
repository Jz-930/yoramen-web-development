"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { arrayOr, textOr } from "@/sanity/fallback";
import { resolveImageUrl } from "@/sanity/image";
import type { HomePageContent } from "@/sanity/types";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const fadeSlideUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE },
});

type HeroSectionProps = {
  content?: HomePageContent["hero"] | null;
};

const fallbackHero = {
  eyebrow: "Freshly Made 路 Boldly Flavored",
  headlineLine1: "A ramen bowl",
  headlineEmphasis: "with actual soul.",
  body: 'Slow-simmered, made to order, and layered with flavor. We turned "delicious" into a daily standard.',
  primaryCta: { label: "Order Now", href: "/order" },
  secondaryCta: { label: "View Menu", href: "/menu" },
  bottomBadges: ["Fresh Prep Daily", "Signature Flavor", "Authentic Craft"],
  backgroundImage: "/images/bg-3.webp",
  bowlImage: "/images/Ramen-01.png",
  patternImage: "/images/bg-1.webp",
};

export default function HeroSection({ content }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 80 };

  const imgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [40, -40]), springConfig);
  const imgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [40, -40]), springConfig);
  const bgArtX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const bgArtY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);

  const eyebrow = textOr(content?.eyebrow, fallbackHero.eyebrow);
  const headlineLine1 = textOr(content?.headlineLine1, fallbackHero.headlineLine1);
  const headlineEmphasis = textOr(content?.headlineEmphasis, fallbackHero.headlineEmphasis);
  const body = textOr(content?.body, fallbackHero.body);
  const primaryCta = {
    label: textOr(content?.primaryCta?.label, fallbackHero.primaryCta.label),
    href: textOr(content?.primaryCta?.href, fallbackHero.primaryCta.href),
    openInNewTab: content?.primaryCta?.openInNewTab,
  };
  const secondaryCta = {
    label: textOr(content?.secondaryCta?.label, fallbackHero.secondaryCta.label),
    href: textOr(content?.secondaryCta?.href, fallbackHero.secondaryCta.href),
    openInNewTab: content?.secondaryCta?.openInNewTab,
  };
  const bottomBadges = arrayOr(content?.bottomBadges, fallbackHero.bottomBadges);
  const backgroundImage = resolveImageUrl(content?.backgroundImage, fallbackHero.backgroundImage);
  const bowlImage = resolveImageUrl(content?.bowlImage, fallbackHero.bowlImage);
  const patternImage = resolveImageUrl(content?.patternImage, fallbackHero.patternImage);

  useEffect(() => {
    setIsMounted(true);
    const handleMouse = (event: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[95vh] flex items-center justify-center bg-white pt-24 overflow-hidden"
    >
      <motion.div
        className="absolute inset-[-5%] pointer-events-none opacity-[0.35]"
        style={{ x: bgArtX, y: bgArtY }}
      >
        <Image
          src={backgroundImage}
          alt="Ramen Chef Background"
          fill
          className="object-cover mix-blend-multiply"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
      </motion.div>

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
        <div className="lg:w-1/2 text-center lg:text-left relative z-20">
          <motion.div className="inline-flex items-center gap-3 mb-6" {...fadeSlideUp(0.1)}>
            <div className="relative w-12 h-4 overflow-hidden">
              <Image
                src="/images/Asset 20.png"
                alt="brush"
                fill
                className="object-contain object-left opacity-80"
                style={{ filter: "invert(32%) sepia(85%) saturate(3015%) hue-rotate(346deg) brightness(88%) contrast(92%)" }}
              />
            </div>
            <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-bold">
              {eyebrow}
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-serif text-sumi mb-6 leading-[1.1] tracking-tight"
            {...fadeSlideUp(0.25)}
          >
            {headlineLine1} <br />
            <span className="italic font-light text-stone/80">{headlineEmphasis}</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-stone mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0"
            {...fadeSlideUp(0.4)}
          >
            {body}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4"
            {...fadeSlideUp(0.55)}
          >
            <Link
              href={primaryCta.href}
              target={primaryCta.openInNewTab ? "_blank" : undefined}
              className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-bold transition-all hover:-translate-y-1 shadow-md flex items-center gap-3 group"
            >
              <span>{primaryCta.label}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={secondaryCta.href}
              target={secondaryCta.openInNewTab ? "_blank" : undefined}
              className="border-2 border-stone/20 hover:border-sumi text-sumi px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-bold transition-all hover:bg-gray-50"
            >
              {secondaryCta.label}
            </Link>
          </motion.div>
        </div>

        <div className="lg:w-1/2 flex justify-center items-center relative h-[400px] md:h-[550px] w-full">
          {isMounted && (
            <>
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-[0.12] pointer-events-none"
                style={{ x: bgArtX, y: bgArtY, rotate: bgArtX }}
              >
                <Image src={patternImage} alt="Japanese Pattern Background" fill className="object-contain mix-blend-multiply" priority />
              </motion.div>

              <motion.div
                className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] z-10"
                style={{ x: imgX, y: imgY }}
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={bowlImage}
                    alt="Signature Ramen Illustration"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </motion.div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 right-0 w-32 h-32 pointer-events-none hidden md:block"
              >
                <Image src={patternImage} alt="pattern detail" fill className="object-cover rounded-full mix-blend-multiply" />
              </motion.div>
            </>
          )}
        </div>
      </div>

      <motion.div
        className="absolute bottom-4 left-0 right-0 py-6 z-10 hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto flex justify-center gap-10 text-xs tracking-[0.2em] uppercase text-stone font-bold">
          {bottomBadges.map((badge, index) => (
            <span key={`${badge}-${index}`} className="inline-flex items-center gap-10">
              {index > 0 && <span className="text-brand-red opacity-50">路</span>}
              {badge}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
