import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ── Animated Hero Section ── */}
      <HeroSection />

      {/* ── Japanese Decorative Divider ── */}
      <div className="py-12 flex items-center justify-center gap-4 bg-rice-paper">
        <div className="w-16 h-px bg-light-border"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-brand-red"></div>
        <div className="w-16 h-px bg-light-border"></div>
      </div>

      {/* ── Brand Intro ── */}
      <section className="py-24 md:py-32 bg-rice-paper">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

            {/* Images */}
            <div className="w-full lg:w-1/2 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image src="/images/ramen-placeholder.png" alt="Chef preparing ramen" fill className="object-cover" />
                </div>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mt-8">
                  <Image src="/images/ramen-placeholder.png" alt="Premium Bowl" fill className="object-cover" />
                </div>
              </div>
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

              <Link href="/about" className="inline-flex items-center gap-3 text-sumi hover:text-brand-red text-sm tracking-[0.15em] uppercase font-medium transition-colors group">
                <span className="w-8 h-px bg-sumi group-hover:bg-brand-red group-hover:w-12 transition-all"></span>
                Discover Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Value Proposition Grid ── */}
      <section className="py-24 md:py-32 bg-section-warm">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
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
              <div key={prop.num} className="bg-warm-white rounded-2xl overflow-hidden border border-light-border hover-rise group">
                <div className="relative h-64 overflow-hidden">
                  <Image src={prop.img} alt={prop.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <span className="text-brand-red/30 font-serif text-3xl font-bold block mb-2">{prop.num}</span>
                  <h3 className="text-xl font-serif text-sumi mb-3">{prop.title}</h3>
                  <p className="text-stone text-sm leading-relaxed">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seasonal Promotion ── */}
      <section className="py-24 md:py-32 bg-rice-paper">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          <div className="bg-warm-white rounded-3xl overflow-hidden border border-light-border shadow-sm">
            <div className="flex flex-col md:flex-row">

              {/* Text Side */}
              <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                <div className="inline-block bg-brand-red/10 text-brand-red text-xs font-medium px-4 py-1.5 tracking-[0.15em] uppercase mb-8 rounded-full w-max">
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
