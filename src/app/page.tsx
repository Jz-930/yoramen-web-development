import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ── Animated Hero Section ── */}
      <HeroSection />

      {/* ── 和風 Wafū Decorative Divider ── */}
      <div className="py-10 flex items-center justify-center gap-6 bg-rice-paper jp-wave-divider">
        <div className="w-20 h-px bg-light-border"></div>
        <div className="flex items-center gap-3">
          {/* Small Seigaiha arcs */}
          <svg width="24" height="12" viewBox="0 0 24 12" className="text-brand-red/30">
            <path d="M0 12 C6 12 6 0 12 0 C18 0 18 12 24 12" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
          {/* Red dot accent */}
          <div className="w-2 h-2 rounded-full bg-brand-red/60" />
          <svg width="24" height="12" viewBox="0 0 24 12" className="text-brand-red/30 scale-x-[-1]">
            <path d="M0 12 C6 12 6 0 12 0 C18 0 18 12 24 12" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <div className="w-20 h-px bg-light-border"></div>
      </div>

      {/* ── Brand Intro with Japanese Elements ── */}
      <section className="py-24 md:py-32 bg-rice-paper relative overflow-hidden">

        {/* Decorative Ensō circle watermark — hidden on mobile */}
        <svg className="absolute top-16 left-16 w-56 h-56 select-none pointer-events-none hidden lg:block" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-red/[0.06]" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-red/[0.04]" />
        </svg>

        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

            {/* Images with Asanoha overlay */}
            <div className="w-full lg:w-1/2 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden jp-asanoha-overlay">
                  <Image src="/images/ramen-placeholder.png" alt="Chef preparing ramen" fill className="object-cover" />
                </div>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mt-8 jp-asanoha-overlay">
                  <Image src="/images/ramen-placeholder.png" alt="Premium Bowl" fill className="object-cover" />
                </div>
              </div>
              {/* Subtle corner Ensō circle behind images — hidden on mobile to avoid overflow */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full border border-brand-red/10 pointer-events-none hidden lg:block" />
            </div>

            {/* Text */}
            <div className="w-full lg:w-1/2">
              <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">Our Philosophy</span>
              <div className="jp-divider-left mb-8"></div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-sumi mb-8 leading-[1.2]">
                A ramen house <br />
                <span className="text-stone font-light italic">built around flavor.</span>
              </h2>

              <div className="space-y-5 mb-10">
                <p className="text-base text-stone leading-[1.85]">
                  We believe a great ramen bowl should do more than fill you up. It should make you feel genuinely taken care of in the middle of a busy day.
                </p>
                <p className="text-base text-stone leading-[1.85]">
                  From broth to noodles to toppings, we never cut corners. Every ingredient is deliberately chosen and meticulously prepared.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <Link href="/about" className="inline-flex items-center gap-3 text-sumi hover:text-brand-red text-sm tracking-[0.15em] uppercase font-medium transition-colors group">
                  <span className="w-8 h-px bg-sumi group-hover:bg-brand-red group-hover:w-12 transition-all"></span>
                  Discover Our Story
                </Link>
                {/* Logo stamp seal */}
                <div className="jp-hanko" title="Yoramen seal">
                  <Image src="/images/logo-full.webp" alt="Yoramen" width={36} height={36} className="opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Value Proposition Grid with Seigaiha & Noren ── */}
      <section className="py-24 md:py-32 bg-section-warm jp-seigaiha-bg relative overflow-hidden">

        {/* Decorative vertical diamond pattern — hidden on mobile */}
        <svg className="absolute top-20 right-16 w-12 h-64 select-none pointer-events-none hidden lg:block" viewBox="0 0 24 200">
          {[0, 40, 80, 120, 160].map((y) => <path key={y} d={`M12 ${y} L20 ${y + 10} L12 ${y + 20} L4 ${y + 10} Z`} fill="none" stroke="currentColor" strokeWidth="0.8" className="text-brand-red/[0.06]" />)}
        </svg>

        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          {/* Noren-style header bar */}
          <div className="jp-noren mb-12">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red/30" />
            <div className="w-8 h-px bg-brand-red/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red/30" />
            <div className="w-8 h-px bg-brand-red/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red/30" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">Our Promise</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-sumi leading-[1.15]">
                Why this bowl keeps<br /> people coming back.
              </h2>
            </div>
            <Link href="/menu" className="shrink-0 flex items-center gap-3 text-stone hover:text-sumi text-xs tracking-[0.15em] uppercase font-medium transition-colors group">
              Explore Menu
              <div className="w-8 h-8 rounded-full border border-stone/30 group-hover:border-sumi flex items-center justify-center transition-colors">
                <MoveRight size={14} />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Layered Broth", desc: "Rich up front, clean on the finish, never heavy. Simmered for 14 hours daily.", img: "/images/ramen-placeholder.png" },
              { num: "02", title: "Perfect Bite", desc: "Springy texture in every mouthful. Custom-crafted noodles with exact hydration.", img: "/images/ramen-placeholder.png" },
              { num: "03", title: "Memorable Toppings", desc: "Chashu, soft-boiled egg, and savory sauce build flavor in every layer.", img: "/images/ramen-placeholder.png" }
            ].map((prop) => (
              <div key={prop.num} className="bg-warm-white rounded-2xl overflow-hidden border border-light-border hover-rise group relative">
                <div className="relative h-64 overflow-hidden">
                  <Image src={prop.img} alt={prop.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  {/* Decorative diamond overlay on image */}
                  <svg className="absolute top-4 right-4 w-8 h-8 text-white/20 drop-shadow-lg select-none pointer-events-none" viewBox="0 0 24 24">
                    <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="p-8">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-brand-red/30 font-serif text-3xl font-bold">{prop.num}</span>
                  </div>
                  <h3 className="text-xl font-serif text-sumi mb-3">{prop.title}</h3>
                  <p className="text-stone text-sm leading-relaxed">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seasonal Promotion with Sakura & Japanese Accents ── */}
      <section className="py-24 md:py-32 bg-rice-paper relative overflow-hidden">

        {/* Drifting sakura petals */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="jp-sakura jp-sakura-1" />
          <div className="jp-sakura jp-sakura-2" />
          <div className="jp-sakura jp-sakura-3" />
          <div className="jp-sakura jp-sakura-4" />
          <div className="jp-sakura jp-sakura-5" />
          <div className="jp-sakura jp-sakura-6" />
          <div className="jp-sakura jp-sakura-7" />
          <div className="jp-sakura jp-sakura-8" />
          <div className="jp-sakura jp-sakura-9" />
          <div className="jp-sakura jp-sakura-10" />
          <div className="jp-sakura jp-sakura-11" />
          <div className="jp-sakura jp-sakura-12" />
        </div>

        {/* Vertical diamond chain decoration — hidden on mobile */}
        <svg className="absolute top-16 right-16 w-12 h-72 select-none pointer-events-none hidden lg:block" viewBox="0 0 24 240">
          {[0, 48, 96, 144, 192].map((y) => <path key={y} d={`M12 ${y} L20 ${y + 12} L12 ${y + 24} L4 ${y + 12} Z`} fill="none" stroke="currentColor" strokeWidth="0.8" className="text-brand-red/[0.07]" />)}
        </svg>

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">

          <div className="bg-warm-white rounded-3xl overflow-hidden border border-light-border shadow-sm">
            <div className="flex flex-col md:flex-row">

              {/* Text Side */}
              <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative">
                {/* Ema-style tag instead of pill badge */}
                <div className="jp-ema-tag w-max mb-8">
                  Limited Time
                </div>
                <h2 className="text-3xl md:text-5xl font-serif text-sumi mb-4 leading-[1.1]">
                  Spring Light<br />Series
                </h2>
                <p className="text-lg text-brand-red italic font-serif mb-6">
                  Yuzu-inspired clear broth.
                </p>

                <p className="text-stone leading-relaxed mb-10 max-w-md">
                  Bright, clean, and deeply satisfying. Miss it now, wait another season.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link href="/order" className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3.5 rounded-full text-sm tracking-[0.12em] uppercase font-medium transition-all hover-rise">
                    Order This Bowl
                  </Link>
                  <span className="text-xs text-stone tracking-[0.15em] uppercase font-medium self-center">
                    03.15 — 05.31
                  </span>
                </div>

                {/* Logo stamp in corner */}
                <div className="absolute bottom-8 right-8 jp-hanko opacity-50 hidden md:flex" title="Season stamp">
                  <Image src="/images/logo-full.webp" alt="Yoramen" width={32} height={32} className="opacity-90" />
                </div>
              </div>

              {/* Image Side */}
              <div className="w-full md:w-1/2 h-[350px] md:h-auto relative">
                <Image
                  src="/images/ramen-placeholder.png"
                  alt="Spring Light Series"
                  fill
                  className="object-cover"
                />
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
