import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ── Zen Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center bg-rice-paper pt-20">
        {/* Subtle background texture — very faint */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232C2C2C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        ></div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* Text Side */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-8">
              <span className="w-8 h-px bg-brand-red"></span>
              <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium">
                Freshly Made · Boldly Flavored
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-sumi mb-6 leading-[1.15]">
              A ramen bowl <br />
              <span className="text-brand-red">with actual soul.</span>
            </h1>

            <p className="text-lg text-stone mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Slow-simmered, made to order, and layered with flavor. We turned &quot;delicious&quot; into a daily standard.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
              <Link href="/order" className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium transition-all hover-rise flex items-center gap-3 group">
                <span>Order Now</span>
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/menu" className="border border-sumi/20 hover:border-sumi text-sumi px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium transition-all hover-rise">
                View Menu
              </Link>
            </div>
          </div>

          {/* Image Side */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-80 h-96 md:w-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-lg">
              <Image
                src="/images/ramen-placeholder.png"
                alt="Signature Ramen Bowl"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

        </div>

        {/* Quick highlights — bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-light-border bg-warm-white/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-5 flex justify-center gap-12 text-xs tracking-[0.2em] uppercase text-stone">
            <span>Fresh Prep Daily</span>
            <span className="text-brand-red">·</span>
            <span>Signature Flavor</span>
            <span className="text-brand-red">·</span>
            <span>Made to Order</span>
          </div>
        </div>
      </section>

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
