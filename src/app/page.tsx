import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-ink overflow-x-hidden">

      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-brand-ink/40 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#0A1118_100%)]"></div>
          <Image
            src="/images/ramen-placeholder.png"
            alt="Delicious Japanese Ramen"
            fill
            className="object-cover animate-ken-burns scale-105 opacity-80"
            priority
          />
        </div>



        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 flex flex-col md:flex-row items-center justify-between gap-12">

          <div className="md:w-3/5 text-left">
            <div className="inline-block border border-brand-red/30 bg-brand-red/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-8">
              <span className="text-brand-red text-xs tracking-[0.2em] uppercase font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                Freshly made. Boldly flavored.
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-[1.05] text-shadow-glow">
              Eat a ramen bowl <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-gold italic">with actual soul.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 font-light leading-relaxed max-w-xl border-l-2 border-brand-red/50 pl-6">
              Slow-simmered, made to order, and layered with flavor. We turned "delicious" into a daily standard.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Link href="/order" className="bg-brand-red hover:bg-brand-red-light text-white px-10 py-5 rounded-full text-sm uppercase tracking-[0.2em] font-semibold transition-all hover-lift flex items-center gap-3 group relative overflow-hidden">
                <span className="relative z-10">Order Now</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
              </Link>
              <Link href="/menu" className="border border-white/20 hover:border-white text-white px-10 py-5 rounded-full text-sm uppercase tracking-[0.2em] font-semibold transition-all hover-lift">
                View Menu
              </Link>
            </div>
          </div>

          <div className="hidden md:flex flex-col justify-end items-end w-2/5">
            <div className="relative w-64 h-80 rounded-[2rem] overflow-hidden border border-white/20 shadow-[-20px_20px_0px_rgba(178,30,43,0.2)] hover:-translate-y-2 hover:shadow-[-20px_30px_0px_rgba(178,30,43,0.3)] transition-all duration-500">
              <Image src="/images/ramen-placeholder.png" alt="Preparation" fill className="object-cover" />
            </div>
          </div>

        </div>

      </section>

      {/* Cross Marquee Banners */}
      <div className="relative z-30 w-full mb-16 md:mb-24 h-40 mt-4">

        {/* Trapezoid Filler Layer to flawlessly bridge the angled wedge gap without edge bleeding */}
        <div
          className="absolute left-0 w-[110%] -ml-[5%] h-16 md:h-[100px] top-4 bg-[#3F4B5B] z-0"
          style={{
            clipPath: 'polygon(0% 0%, 100% 35%, 100% 60%, 0% 100%)'
          }}
        ></div>

        {/* Dark/Red Ribbon (Background, Rotated Up-Right) */}
        <div className="absolute top-0 left-0 w-[110%] -ml-[5%] bg-brand-red py-6 md:py-8 overflow-hidden flex whitespace-nowrap rotate-[1deg] shadow-[0_20px_50px_rgba(0,0,0,0.5)] -mt-8 md:-mt-10 border-y border-brand-red-light z-10">
          <div className="animate-[slide_30s_linear_infinite] inline-block font-sans uppercase tracking-[0.4em] text-white font-bold text-sm md:text-lg">
            Unmistakably Japanese <span className="mx-8 text-gold">•</span> Fresh Prep Daily <span className="mx-8 text-gold">•</span> Signature Flavor <span className="mx-8 text-gold">•</span> Made To Order <span className="mx-8 text-gold">•</span>
            Unmistakably Japanese <span className="mx-8 text-gold">•</span> Fresh Prep Daily <span className="mx-8 text-gold">•</span> Signature Flavor <span className="mx-8 text-gold">•</span> Made To Order <span className="mx-8 text-gold">•</span>
            Unmistakably Japanese <span className="mx-8 text-gold">•</span> Fresh Prep Daily <span className="mx-8 text-gold">•</span> Signature Flavor <span className="mx-8 text-gold">•</span> Made To Order <span className="mx-8 text-gold">•</span>
          </div>
        </div>

        {/* Light Ribbon (Foreground, Rotated Up-Left) */}
        <div className="absolute top-12 md:top-16 left-0 w-[110%] -ml-[5%] bg-[#E8E4D9] py-6 md:py-8 overflow-hidden flex whitespace-nowrap -rotate-[2deg] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-y border-[#D0CBB8] z-20">
          <div className="animate-[slide_reverse_30s_linear_infinite] inline-block font-sans uppercase tracking-[0.4em] text-brand-ink font-bold text-sm md:text-lg">
            Established 2018 <span className="mx-8 text-brand-red">•</span> Modern Ramen Experience <span className="mx-8 text-brand-red">•</span> No Compromises <span className="mx-8 text-brand-red">•</span> Downtown Flagship <span className="mx-8 text-brand-red">•</span>
            Established 2018 <span className="mx-8 text-brand-red">•</span> Modern Ramen Experience <span className="mx-8 text-brand-red">•</span> No Compromises <span className="mx-8 text-brand-red">•</span> Downtown Flagship <span className="mx-8 text-brand-red">•</span>
            Established 2018 <span className="mx-8 text-brand-red">•</span> Modern Ramen Experience <span className="mx-8 text-brand-red">•</span> No Compromises <span className="mx-8 text-brand-red">•</span> Downtown Flagship <span className="mx-8 text-brand-red">•</span>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes slide_reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}} />

      {/* Brand Intro - Overlapping Layout */}
      <section className="py-32 md:py-48 bg-brand-ink relative">
        {/* Desaturated, background image wrapper with dedicated hidden overflow to prevent cropping the red glow blob above */}
        <div className="absolute top-0 right-0 bottom-0 w-full md:w-2/3 lg:w-[60%] z-0 overflow-hidden">
          <Image
            src="/images/bg-1.webp"
            alt="Ramen Background Pattern"
            fill
            className="object-cover object-[right_top] opacity-[0.15] mix-blend-luminosity grayscale"
            quality={60}
          />
          {/* Subtle vignette gradients to bleed the image softly into the dark background */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/50 to-transparent"></div>
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-brand-ink to-transparent z-10"></div>
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-brand-ink to-transparent z-10"></div>
        </div>

        {/* Floating Ambient Glow (The 'Orange Block') - Restored without sharp horizontal crop */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-red/15 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-16 items-center">

            {/* Split Images */}
            <div className="w-full lg:w-1/2 relative min-h-[500px] md:min-h-[600px] mb-16 lg:mb-0">
              <div className="absolute top-0 left-0 w-3/4 h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-10 hover:scale-105 transition-transform duration-700">
                <Image src="/images/ramen-placeholder.png" alt="Chef preparing ramen" fill className="object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-2/3 h-[350px] rounded-3xl overflow-hidden border border-gold/20 shadow-[0_30px_60px_rgba(0,0,0,0.6)] z-20 hover:scale-105 transition-transform duration-700">
                <Image src="/images/ramen-placeholder.png" alt="Premium Bowl" fill className="object-cover" />
                <div className="absolute inset-0 bg-brand-ink/20 mix-blend-multiply"></div>
              </div>
            </div>

            {/* Typography Heavy Text */}
            <div className="w-full lg:w-1/2 lg:pl-10">
              <span className="text-gold font-sans tracking-[0.3em] uppercase text-xs font-bold block mb-6">Our Philosophy</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-[1.1]">
                A ramen house <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white italic font-light">built around flavor.</span>
              </h2>

              <div className="space-y-6 border-l border-white/10 pl-8 mb-12">
                <p className="text-lg text-gray-400 leading-relaxed font-light">
                  We believe a great ramen bowl should do more than fill you up. It should make you feel genuinely taken care of in the middle of a busy day.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed font-light">
                  From broth to noodles to toppings, we never cut corners. Every ingredient is deliberately chosen and meticulously prepared.
                </p>
              </div>

              <Link href="/about" className="inline-flex items-center gap-4 text-white hover:text-brand-red uppercase tracking-[0.2em] text-sm font-bold transition-colors group">
                <span className="w-12 h-[1px] bg-white group-hover:bg-brand-red transition-colors"></span>
                Discover Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Grid - Value Proposition */}
      <section className="py-32 bg-[#05090C] border-t border-white/5 relative overflow-hidden">
        {/* Decorative background removed */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white max-w-2xl leading-[1.1]">
              Why this bowl keeps people coming back.
            </h2>
            <Link href="/menu" className="shrink-0 flex items-center gap-3 text-gold hover:text-white uppercase tracking-widest text-xs font-bold transition-colors group">
              Explore Menu
              <div className="w-8 h-8 rounded-full border border-gold group-hover:border-white flex items-center justify-center transition-colors">
                <MoveRight size={14} />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Layered Broth", desc: "Rich up front, clean on the finish, never heavy. Simmered for 14 hours daily.", img: "/images/ramen-placeholder.png" },
              { title: "Perfect Bite", desc: "Springy texture in every mouthful. Custom-crafted noodles with exact hydration.", img: "/images/ramen-placeholder.png" },
              { title: "Toppings", desc: "Chashu, soft-boiled egg, and savory sauce build flavor in every layer.", img: "/images/ramen-placeholder.png" }
            ].map((prop, idx) => (
              <div key={idx} className="group relative rounded-3xl overflow-hidden h-[450px] border border-white/5 hover:border-gold/30 transition-colors duration-500">
                <Image src={prop.img} alt={prop.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>

                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="text-gold font-serif text-5xl opacity-20 mb-[-20px] font-bold">0{idx + 1}</div>
                  <h3 className="text-2xl font-serif text-white mb-3">{prop.title}</h3>
                  <p className="text-gray-400 font-light leading-relaxed">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heavy Stylized Seasonal Promotion */}
      <section className="py-24 bg-brand-ink overflow-hidden border-t border-white/5 relative">
        {/* Decorative Background Image for Seasonal Promotion */}
        <div className="absolute inset-y-0 -left-[10%] w-[120%] z-0 pointer-events-none">
          <Image
            src="/images/bg-2.webp"
            alt="Seasonal Promotion Background"
            fill
            className="object-cover object-left opacity-[0.35] mix-blend-screen"
            quality={85}
          />
          {/* Subtle vignette gradients to bleed the image softly into the dark background */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/50 to-transparent z-10"></div>
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-brand-ink to-transparent z-10"></div>
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-brand-ink to-transparent z-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="bg-brand-red rounded-[2rem] p-1 md:p-2 overflow-hidden shadow-[0_0_50px_rgba(178,30,43,0.3)]">
            <div className="bg-[#0A1118] rounded-[1.5rem] relative overflow-hidden flex flex-col md:flex-row">

              <div className="w-full md:w-1/2 p-10 md:p-16 lg:p-24 flex flex-col justify-center relative z-10">
                <div className="inline-block bg-white text-brand-ink text-xs font-bold px-4 py-1.5 uppercase tracking-widest mb-8 rounded-full w-max shadow-lg">
                  Limited Time Drop
                </div>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-4 leading-[1.05]">Spring Light<br />Series</h2>
                <p className="text-xl md:text-2xl text-brand-red-light italic font-serif mb-8">Yuzu-inspired clear broth.</p>

                <p className="text-gray-300 font-light leading-relaxed text-lg mb-10 max-w-md">
                  Bright, clean, and deeply satisfying. Miss it now, wait another season.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link href="/order" className="w-full sm:w-auto text-center bg-brand-red hover:bg-white hover:text-brand-ink text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest font-bold transition-all">
                    Order This Bowl
                  </Link>
                  <span className="text-sm text-gray-500 tracking-widest uppercase font-semibold">
                    03.15 - 05.31
                  </span>
                </div>
              </div>

              <div className="w-full md:w-1/2 h-[400px] md:h-auto relative clip-path-slant object-cover">
                <Image
                  src="/images/ramen-placeholder.png"
                  alt="Spring Light Series"
                  fill
                  className="object-cover"
                />
                {/* Slant overlay for cool design aesthetic */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A1118] to-transparent hidden md:block"></div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
