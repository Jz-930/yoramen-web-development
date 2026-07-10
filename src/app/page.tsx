import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import MangaCollage from "@/components/MangaCollage";
import SpecialOffersCarousel from "@/components/SpecialOffersCarousel";
import { SOURCE_LOCALE, localizeInternalHref } from "@/i18n";
import { buildTextDictionary, HERO_UI_SOURCE_STRINGS } from "@/i18n/client-copy";
import { buildLocalizedMetadata, ENGLISH_PAGE_METADATA } from "@/i18n/metadata";
import { createServerTextTranslator, getRequestLocale } from "@/i18n/server";
import { arrayOr, textOr } from "@/sanity/fallback";
import { fetchHomeCmsContent, fetchSiteSettings } from "@/sanity/fetchers";
import { resolveImageUrl } from "@/sanity/image";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const [{ page }, settings] = await Promise.all([
    fetchHomeCmsContent(),
    fetchSiteSettings(),
  ]);
  return buildLocalizedMetadata({
    locale: SOURCE_LOCALE,
    englishPathname: "/",
    englishTitle: ENGLISH_PAGE_METADATA.home.title,
    englishDescription: ENGLISH_PAGE_METADATA.home.description,
    seo: page?.seo ?? settings?.defaultSeo,
  });
}

const fallbackPhilosophy = {
  eyebrow: "Our Philosophy",
  title: "A ramen house",
  emphasis: "built around flavor.",
  paragraphs: [
    "We believe a great ramen bowl should do more than fill you up. It should make you feel genuinely taken care of in the middle of a busy day.",
    "From broth to noodles to toppings, we never cut corners. Every ingredient is deliberately chosen and meticulously prepared.",
  ],
  cta: { label: "Discover Our Story", href: "/about" },
};

const fallbackPromiseSection = {
  eyebrow: "Our Promise",
  title: "Why this bowl keeps\npeople coming back.",
  cta: { label: "Explore Menu", href: "/menu" },
};

const fallbackPromiseCards = [
  {
    num: "01",
    title: "Layered Broth",
    desc: "Rich up front, clean on the finish, never heavy. Simmered for 14 hours daily.",
    img: "/images/img-2.webp",
  },
  {
    num: "02",
    title: "Perfect Bite",
    desc: "Springy texture in every mouthful. Custom-crafted noodles with exact hydration.",
    img: "/images/img-2.webp",
  },
  {
    num: "03",
    title: "Memorable Toppings",
    desc: "Chashu, soft-boiled egg, and savory sauce build flavor in every layer.",
    img: "/images/img-2.webp",
  },
];

const fallbackSpecialsSection = {
  eyebrow: "Limited Time",
  title: "Special Offers",
  description: "Swipe to see our currently running specials. Great taste, exceptional value.",
};

const fallbackOffers = [
  {
    title: "Lunch Power Combo",
    price: "$14.99",
    desc: "Signature Ramen + Edamame + Iced Tea. The perfect midday refuel.",
    img: "/images/img-2.webp",
    availabilityText: "Available in-store",
  },
  {
    title: "Lucky Happy Hour",
    price: "$4.99",
    desc: "Draft beer and gyoza appetizers every weekday from 4PM to 6PM.",
    img: "/images/img-2.webp",
    availabilityText: "Available in-store",
  },
  {
    title: "Student Night",
    price: "20% OFF",
    desc: "Show your valid student ID on Thursdays for 20% off all ramen bowls.",
    img: "/images/img-2.webp",
    availabilityText: "Available in-store",
  },
  {
    title: "Weekend Treat",
    price: "$22.99",
    desc: "Any Ramen + Any Side + Matcha Cheesecake. Treat yourself.",
    img: "/images/img-2.webp",
    availabilityText: "Available in-store",
  },
];

const fallbackNewsletter = {
  title: "Join Our Exclusive Community",
  description: "Become a Yoramen member. Receive exclusive coupons, limited-time offers, and updates on our new locations.",
  inputPlaceholder: "Enter your email address",
  buttonLabel: "Sign Up",
};

function renderLineBreaks(text: string) {
  const lines = text.split(/\r?\n/);
  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {index > 0 && <br />}
      {line}
    </span>
  ));
}

export default async function Home() {
  const locale = await getRequestLocale();
  const translator = await createServerTextTranslator(locale);
  const t = translator.text;
  const heroCopy = buildTextDictionary(HERO_UI_SOURCE_STRINGS, t);
  const { page, promotions } = await fetchHomeCmsContent();
  const cmsPhilosophyTitle = page?.philosophySection?.title?.trim();
  const cmsPhilosophyEmphasis = page?.philosophySection?.emphasis?.trim();
  const fallbackEmphasisAlreadyInTitle =
    Boolean(cmsPhilosophyTitle) && cmsPhilosophyTitle!.includes(fallbackPhilosophy.emphasis);
  const cmsEmphasisAlreadyInTitle =
    Boolean(cmsPhilosophyTitle && cmsPhilosophyEmphasis) && cmsPhilosophyTitle!.includes(cmsPhilosophyEmphasis!);

  const philosophy = {
    eyebrow: t(textOr(page?.philosophySection?.eyebrow, fallbackPhilosophy.eyebrow)),
    title: t(textOr(cmsPhilosophyTitle, fallbackPhilosophy.title)),
    emphasis: cmsEmphasisAlreadyInTitle
      ? ""
      : t(textOr(cmsPhilosophyEmphasis, fallbackEmphasisAlreadyInTitle ? "" : fallbackPhilosophy.emphasis)),
    paragraphs: arrayOr(page?.philosophySection?.paragraphs, fallbackPhilosophy.paragraphs).map(t),
    cta: {
      label: t(textOr(page?.philosophySection?.cta?.label, fallbackPhilosophy.cta.label)),
      href: localizeInternalHref(textOr(page?.philosophySection?.cta?.href, fallbackPhilosophy.cta.href), locale),
      openInNewTab: page?.philosophySection?.cta?.openInNewTab,
    },
  };

  const promiseSection = {
    eyebrow: t(textOr(page?.promiseSection?.eyebrow, fallbackPromiseSection.eyebrow)),
    title: t(textOr(page?.promiseSection?.title, fallbackPromiseSection.title)),
    cta: {
      label: t(textOr(page?.promiseSection?.cta?.label, fallbackPromiseSection.cta.label)),
      href: localizeInternalHref(textOr(page?.promiseSection?.cta?.href, fallbackPromiseSection.cta.href), locale),
      openInNewTab: page?.promiseSection?.cta?.openInNewTab,
    },
  };

  const cmsPromiseCards = page?.promiseCards || [];
  const promiseCardCount = Math.max(fallbackPromiseCards.length, cmsPromiseCards.length);
  const promiseCards = Array.from({ length: promiseCardCount }, (_, index) => {
    const fallback = fallbackPromiseCards[index] || fallbackPromiseCards[fallbackPromiseCards.length - 1];
    const cmsCard = cmsPromiseCards[index];

    return {
      num: textOr(cmsCard?.number, fallback.num),
      title: t(textOr(cmsCard?.title, fallback.title)),
      desc: t(textOr(cmsCard?.description, fallback.desc)),
      img: resolveImageUrl(cmsCard?.image, fallback.img),
    };
  });

  const specialsSection = {
    eyebrow: t(textOr(page?.specialsSection?.eyebrow, fallbackSpecialsSection.eyebrow)),
    title: t(textOr(page?.specialsSection?.title, fallbackSpecialsSection.title)),
    description: t(textOr(page?.specialsSection?.description, fallbackSpecialsSection.description)),
  };

  const offerCount = Math.max(fallbackOffers.length, promotions.length);
  const offers = Array.from({ length: offerCount }, (_, index) => {
    const fallback = fallbackOffers[index] || fallbackOffers[fallbackOffers.length - 1];
    const cmsOffer = promotions[index];

    return {
      title: t(textOr(cmsOffer?.title, fallback.title)),
      price: t(textOr(cmsOffer?.priceOrBadge, fallback.price)),
      desc: t(textOr(cmsOffer?.description, fallback.desc)),
      img: resolveImageUrl(cmsOffer?.image, fallback.img),
      availabilityText: t(textOr(cmsOffer?.availabilityText || cmsOffer?.ctaLabel, fallback.availabilityText)),
      href: cmsOffer?.ctaHref ? localizeInternalHref(cmsOffer.ctaHref, locale) : undefined,
    };
  });

  const newsletter = {
    title: t(textOr(page?.newsletterSection?.title, fallbackNewsletter.title)),
    description: t(textOr(page?.newsletterSection?.description, fallbackNewsletter.description)),
    inputPlaceholder: t(textOr(page?.newsletterSection?.inputPlaceholder, fallbackNewsletter.inputPlaceholder)),
    buttonLabel: t(textOr(page?.newsletterSection?.buttonLabel, fallbackNewsletter.buttonLabel)),
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-white">
      <HeroSection content={translator.deep(page?.hero)} locale={locale} copy={heroCopy} />

      <section className="py-24 md:py-32 bg-white relative overflow-hidden text-sumi">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            <div className="w-full lg:w-1/2 relative min-h-[500px] lg:min-h-[600px] flex items-center justify-center -mt-10 lg:mt-0 z-0">
              <MangaCollage
                alt2022={t("Ramen Manga Art 2022")}
                alt2024={t("Ramen Manga Art 2024")}
              />
            </div>

            <div className="w-full lg:w-1/2">
              <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">{philosophy.eyebrow}</span>
              <div className="relative w-16 h-4 mb-8">
                <Image src="/images/Asset 20.png" alt={t("brush")} fill className="object-contain object-left opacity-80" style={{ filter: "invert(32%) sepia(85%) saturate(3015%) hue-rotate(346deg) brightness(88%) contrast(92%)" }} />
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-sumi mb-8 leading-[1.2]">
                {philosophy.title}
                {philosophy.emphasis && (
                  <>
                    <br />
                    <span className="text-stone font-light italic">{philosophy.emphasis}</span>
                  </>
                )}
              </h2>

              <div className="space-y-5 mb-10">
                {philosophy.paragraphs.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`} className="text-base text-stone leading-[1.85]">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="flex items-center gap-6">
                <Link href={philosophy.cta.href} target={philosophy.cta.openInNewTab ? "_blank" : undefined} className="inline-flex items-center gap-3 text-sumi hover:text-brand-red text-sm tracking-[0.15em] uppercase font-medium transition-colors group">
                  <span className="w-8 h-px bg-sumi group-hover:bg-brand-red group-hover:w-12 transition-all"></span>
                  {philosophy.cta.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">{promiseSection.eyebrow}</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-sumi leading-[1.15]">
                {renderLineBreaks(promiseSection.title)}
              </h2>
            </div>
            <Link href={promiseSection.cta.href} target={promiseSection.cta.openInNewTab ? "_blank" : undefined} className="shrink-0 flex items-center gap-3 text-stone hover:text-sumi text-xs tracking-[0.15em] uppercase font-medium transition-colors group">
              {promiseSection.cta.label}
              <div className="w-8 h-8 rounded-full border border-stone/30 group-hover:border-sumi flex items-center justify-center transition-colors">
                <MoveRight size={14} />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {promiseCards.map((prop, index) => (
              <div key={`${prop.num}-${index}`} className="bg-white rounded-xl overflow-hidden border border-gray-100 group relative">
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

      <section className="py-24 md:py-32 bg-gray-50 border-t border-gray-100 relative overflow-hidden jp-pattern-geo" id="specials">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 mb-12">
          <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">{specialsSection.eyebrow}</span>
          <h2 className="text-3xl md:text-5xl font-serif text-sumi leading-[1.15]">
            {specialsSection.title}
          </h2>
          <p className="text-stone mt-4 max-w-xl">
            {specialsSection.description}
          </p>
        </div>

        <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] opacity-[0.02] pointer-events-none z-0 transform rotate-12">
          <Image src="/images/icons/ramen, noodles, soup, japanese, food.svg" alt={t("Ramen")} fill className="object-contain" />
        </div>
        <div className="absolute bottom-[-15%] left-[-15%] w-[800px] h-[800px] opacity-[0.015] pointer-events-none z-0 transform -rotate-[15deg]">
          <Image src="/images/icons/sushi, roll, japanese, food, rice.svg" alt={t("Sushi")} fill className="object-contain" />
        </div>

        <SpecialOffersCarousel offers={offers} ariaLabel={t("Special offers")} />
      </section>

      <section className="py-20 bg-white border-t border-gray-100 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-sumi mb-4">{newsletter.title}</h2>
          <p className="text-stone mb-10 max-w-lg mx-auto">
            {newsletter.description}
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder={newsletter.inputPlaceholder}
              className="px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-sumi w-full transition-colors"
              required
            />
            <button
              type="button"
              className="bg-sumi text-white px-8 py-4 rounded-full font-medium tracking-wide hover:bg-brand-red transition-colors shrink-0"
            >
              {newsletter.buttonLabel}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
