import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-white">

      {/* ── Animated Hero Section ── */}
      <HeroSection />

      {/* ── Brand Intro (Minimalist version) ── */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden text-sumi">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

            {/* Images - Clean, no overlays */}
            <div className="w-full lg:w-1/2 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
                  <Image src="/images/img-2.webp" alt="Chef preparing ramen" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mt-8 shadow-sm">
                  <Image src="/images/img-2.webp" alt="Premium Bowl" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="w-full lg:w-1/2">
              <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">Our Philosophy</span>
              <div className="relative w-16 h-4 mb-8">
                <Image src="/images/Asset 20.png" alt="brush" fill className="object-contain object-left opacity-80" style={{ filter: "invert(32%) sepia(85%) saturate(3015%) hue-rotate(346deg) brightness(88%) contrast(92%)" }} />
              </div>

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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Value Proposition (Minimalist version with Japanese Touch) ── */}
      <section className="py-24 md:py-32 bg-white border-t border-gray-100">
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
              { num: "01", title: "Layered Broth", desc: "Rich up front, clean on the finish, never heavy. Simmered for 14 hours daily.", img: "/images/img-2.webp" },
              { num: "02", title: "Perfect Bite", desc: "Springy texture in every mouthful. Custom-crafted noodles with exact hydration.", img: "/images/img-2.webp" },
              { num: "03", title: "Memorable Toppings", desc: "Chashu, soft-boiled egg, and savory sauce build flavor in every layer.", img: "/images/img-2.webp" }
            ].map((prop) => (
              <div key={prop.num} className="bg-white rounded-xl overflow-hidden border border-gray-100 group relative">
                <div className="relative h-64 overflow-hidden">
                  <Image src={prop.img} alt={prop.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-gray-300 font-serif text-3xl font-light">{prop.num}</span>
                  </div>
                  <h3 className="text-xl font-serif text-sumi mb-3">{prop.title}</h3>
                  <p className="text-stone text-sm leading-relaxed">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seasonal Promotions Swipe Carousel ── */}
      <section className="py-24 md:py-32 bg-gray-50 border-t border-gray-100 relative overflow-hidden jp-pattern-geo" id="specials">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 mb-12">
          <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">Limited Time</span>
          <h2 className="text-3xl md:text-5xl font-serif text-sumi leading-[1.15]">
            Special Offers
          </h2>
          <p className="text-stone mt-4 max-w-xl">
            Swipe to see our currently running specials. Great taste, exceptional value.
          </p>
        </div>

        {/* ── Abstract Vector Flourishes for Specials Context ── */}
        <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] opacity-[0.02] pointer-events-none z-0 transform rotate-12">
          <Image src="/images/icons/ramen, noodles, soup, japanese, food.svg" alt="Ramen" fill className="object-contain" />
        </div>
        <div className="absolute bottom-[-15%] left-[-15%] w-[800px] h-[800px] opacity-[0.015] pointer-events-none z-0 transform -rotate-[15deg]">
          <Image src="/images/icons/sushi, roll, japanese, food, rice.svg" alt="Sushi" fill className="object-contain" />
        </div>

        {/* Carousel Container */}
        <div className="w-full relative z-10">
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-6 lg:px-8 pb-8 max-w-6xl mx-auto">
            
            {[
              { title: "Lunch Power Combo", price: "$14.99", desc: "Signature Ramen + Edamame + Iced Tea. The perfect midday refuel.", img: "/images/img-2.webp" },
              { title: "Lucky Happy Hour", price: "$4.99", desc: "Draft beer and gyoza appetizers every weekday from 4PM to 6PM.", img: "/images/img-2.webp" },
              { title: "Student Night", price: "20% OFF", desc: "Show your valid student ID on Thursdays for 20% off all ramen bowls.", img: "/images/img-2.webp" },
              { title: "Weekend Treat", price: "$22.99", desc: "Any Ramen + Any Side + Matcha Cheesecake. Treat yourself.", img: "/images/img-2.webp" }
            ].map((offer, idx) => (
              <div key={idx} className="snap-center shrink-0 w-[85vw] md:w-[350px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
                <div className="relative h-[220px] w-full">
                  <Image src={offer.img} alt={offer.title} fill className="object-cover" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-serif text-sumi font-medium w-2/3">{offer.title}</h3>
                    <span className="text-brand-red font-semibold text-lg">{offer.price}</span>
                  </div>
                  <p className="text-stone text-sm leading-relaxed mb-6">{offer.desc}</p>
                  <div className="mt-auto">
                    <span className="inline-block border-b border-black text-xs tracking-widest uppercase pb-1 font-medium hover:text-brand-red hover:border-brand-red transition-colors cursor-pointer">
                      Available in-store
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Email Subscription Banner ── */}
      <section className="py-20 bg-white border-t border-gray-100 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-sumi mb-4">Join Our Exclusive Community</h2>
          <p className="text-stone mb-10 max-w-lg mx-auto">
            Become a Yoramen member. Receive exclusive coupons, limited-time offers, and updates on our new locations.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-sumi w-full transition-colors"
              required
            />
            <button 
              type="button"
              className="bg-sumi text-white px-8 py-4 rounded-full font-medium tracking-wide hover:bg-brand-red transition-colors shrink-0"
            >
              Sign Up
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
