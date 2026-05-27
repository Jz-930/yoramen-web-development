import Image from "next/image";
import StoryTimeline, { type StoryTimelineItem } from "./StoryTimeline";
import { arrayOr, textOr } from "@/sanity/fallback";
import { fetchAboutPage } from "@/sanity/fetchers";
import { resolveImageUrl } from "@/sanity/image";

export const metadata = {
  title: "Our Story | Yoramen",
  description: "It started with an obsession for flavor. Learn about the craft and history behind Yoramen.",
};

export const dynamic = "force-dynamic";

const fallbackAbout = {
  header: {
    eyebrow: "About",
    title: "Our Story",
    intro: "It started with an obsession for flavor.",
  },
  introSection: {
    image: "/images/img-3.webp",
    paragraphs: [
      "We opened this ramen house to do one thing exceptionally well: make every bowl with real discipline. Truly memorable flavor is never built on gimmicks. It comes from getting every fundamental step right.",
      "From broth depth to noodle texture, from heat control to service pace, we refine every detail so that no matter when you visit, your bowl feels consistent, premium, and worth returning for.",
    ],
    quote: '"To us, ramen is more than food. It is warmth, craft, and connection in one bowl. Come in and claim the best part of your day."',
  },
  timelineSection: {
    title: "The Journey",
  },
  timelineItems: [
    { year: "2021", img: "/images/story/story-2021-clean.webp", align: "left", title: "Tokyo Inspiration", desc: "Inspired by a family member running a successful ramen shop in Tokyo, the idea of bringing authentic, high-quality Japanese flavor to our local town was born." },
    { year: "2022", img: "/images/story/story-2022-clean.webp", align: "right", title: "Local Pop-ups", desc: "Started quietly by setting up local food stalls across Scarborough. The lines grew, and the feedback validated our obsession with proper tonkotsu broth." },
    { year: "2024", img: "/images/story/story-2024-clean.webp", align: "left", title: "Scaling Operations", desc: "Expanded our reach to more community events and began building a serious following. Handcrafting noodles at this volume forced us to innovate." },
    { year: "2025", img: "/images/story/story-2025-clean.webp", align: "right", title: "Engineering Consistency", desc: "Successfully developed and integrated specialized automated noodle machinery to ensure every single strand meets our exact texture and hydration requirements." },
    { year: "2026", img: "/images/story/story-2026-clean.webp", align: "left", title: "Flagship Store Opens", desc: "Finally set down permanent roots. The first official Yoramen physical location opens, bringing the complete dining experience to life." },
  ] satisfies StoryTimelineItem[],
};

function normalizeAlign(value: string | undefined, fallback: "left" | "right") {
  return value === "left" || value === "right" ? value : fallback;
}

export default async function AboutPage() {
  const page = await fetchAboutPage();
  const introParagraphs = arrayOr(page?.introSection?.paragraphs, fallbackAbout.introSection.paragraphs);
  const timelineCount = Math.max(fallbackAbout.timelineItems.length, page?.timelineItems?.length || 0);
  const timelineItems = Array.from({ length: timelineCount }, (_, index) => {
    const fallback = fallbackAbout.timelineItems[index] || fallbackAbout.timelineItems[fallbackAbout.timelineItems.length - 1];
    const item = page?.timelineItems?.[index];

    return {
      year: textOr(item?.year, fallback.year),
      title: textOr(item?.title, fallback.title),
      desc: textOr(item?.description, fallback.desc),
      img: resolveImageUrl(item?.image, fallback.img),
      align: normalizeAlign(item?.align, fallback.align),
    };
  });

  const header = {
    eyebrow: textOr(page?.header?.eyebrow, fallbackAbout.header.eyebrow),
    title: textOr(page?.header?.title, fallbackAbout.header.title),
    intro: textOr(page?.header?.intro, fallbackAbout.header.intro),
  };
  const introImage = resolveImageUrl(page?.introSection?.image, fallbackAbout.introSection.image);
  const quote = textOr(page?.introSection?.quote, fallbackAbout.introSection.quote);
  const timelineTitle = textOr(page?.timelineSection?.title, fallbackAbout.timelineSection.title);

  return (
    <div className="pt-28 pb-24 min-h-screen bg-white relative overflow-hidden">
      <div className="absolute top-[10%] left-[-20%] w-[600px] h-[600px] opacity-[0.02] pointer-events-none z-30 transform rotate-[15deg]">
        <Image src="/images/icons/mochi, dessert, rice, japanese, sweet.svg" alt="mochi" fill className="object-contain" style={{ filter: "invert(32%) sepia(85%) saturate(3015%) hue-rotate(346deg)" }} />
      </div>
      <div className="absolute top-[60%] right-[-15%] w-[700px] h-[700px] opacity-[0.02] pointer-events-none z-30 transform -rotate-[25deg]">
        <Image src="/images/icons/yakitori, chicken, skewer, grilled, japanese.svg" alt="yakitori" fill className="object-contain" style={{ filter: "invert(32%) sepia(85%) saturate(3015%) hue-rotate(346deg)" }} />
      </div>

      <div className="relative z-20 bg-white shadow-[0_-50px_50px_0_white] w-full">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto pt-8">
            <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">{header.eyebrow}</span>
            <h1 className="text-4xl md:text-6xl font-serif text-sumi mb-6">{header.title}</h1>
            <div className="relative w-20 h-5 mx-auto mb-8 -ml-4 md:ml-auto">
              <Image src="/images/Asset 20.png" alt="brush" fill className="object-contain opacity-80" style={{ filter: "invert(32%) sepia(85%) saturate(3015%) hue-rotate(346deg) brightness(88%) contrast(92%)" }} />
            </div>
            <p className="text-lg text-stone font-serif italic">
              {header.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pb-32">
            <div className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100 shadow-sm">
              <Image
                src={introImage}
                alt="Ramen Prep"
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-1000"
              />
            </div>
            <div className="space-y-6">
              {introParagraphs.map((paragraph, index) => (
                <p key={`${paragraph}-${index}`} className="text-base text-stone leading-[1.9]">
                  {paragraph}
                </p>
              ))}
              <div className="pl-6 border-l-2 border-brand-red py-3 mt-8 bg-gray-50/50">
                <p className="text-sumi font-serif text-xl italic leading-relaxed">
                  {quote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-sumi mb-4">{timelineTitle}</h2>
            <div className="relative w-20 h-5 mx-auto mb-2 -ml-4 md:ml-auto">
              <Image src="/images/Asset 20.png" alt="brush" fill className="object-contain opacity-80" style={{ filter: "invert(32%) sepia(85%) saturate(3015%) hue-rotate(346deg) brightness(88%) contrast(92%)" }} />
            </div>
          </div>

          <StoryTimeline items={timelineItems} />
        </div>
      </div>
    </div>
  );
}
