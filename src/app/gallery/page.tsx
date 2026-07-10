import GalleryContent, { type GalleryItem, type GalleryTestimonial } from "./GalleryContent";
import { SOURCE_LOCALE } from "@/i18n";
import { buildLocalizedMetadata, ENGLISH_PAGE_METADATA } from "@/i18n/metadata";
import { createServerTextTranslator, getRequestLocale } from "@/i18n/server";
import { arrayOr, textOr } from "@/sanity/fallback";
import { fetchGalleryPage } from "@/sanity/fetchers";
import { resolveImageUrl } from "@/sanity/image";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await fetchGalleryPage();
  return buildLocalizedMetadata({
    locale: SOURCE_LOCALE,
    englishPathname: "/gallery",
    englishTitle: ENGLISH_PAGE_METADATA.gallery.title,
    englishDescription: ENGLISH_PAGE_METADATA.gallery.description,
    seo: page?.seo,
  });
}

const fallbackGallery = {
  header: {
    eyebrow: "Visual",
    title: "Gallery",
    description: "A glimpse into our dedication to the craft.",
  },
  categories: ["All", "Food", "Interior", "Moments"],
  galleryItems: [
    { category: "Food", url: "/images/img-4.webp", aspect: "aspect-[3/4]", title: "Signature Bowl" },
    { category: "Food", url: "/images/img-4.webp", aspect: "aspect-square", title: "Perfect Egg" },
    { category: "Interior", url: "/images/img-4.webp", aspect: "aspect-[4/3]", title: "Open Kitchen" },
    { category: "Moments", url: "/images/img-4.webp", aspect: "aspect-[3/4]", title: "Chef Preparation" },
    { category: "Interior", url: "/images/img-4.webp", aspect: "aspect-square", title: "Kitchen Steam" },
    { category: "Food", url: "/images/img-4.webp", aspect: "aspect-[4/3]", title: "Chashu Pork" },
    { category: "Moments", url: "/images/img-4.webp", aspect: "aspect-square", title: "Quality Check" },
    { category: "Food", url: "/images/img-4.webp", aspect: "aspect-square", title: "Dark Broth" },
    { category: "Interior", url: "/images/img-4.webp", aspect: "aspect-[3/4]", title: "City Atmosphere" },
  ] satisfies GalleryItem[],
  testimonials: [
    { quote: "The broth is incredibly deep without feeling heavy. Easily the best addition to Scarborough's food scene this year.", author: "Local Guide", date: "April 2026", color: "bg-gray-50" },
    { quote: "It's the attention to detail for me. You can tell they perfected their automated noodle machine-the texture is flawless every time.", author: "Food Blogger", date: "April 2026", color: "bg-white border flex flex-col border-gray-100 shadow-sm" },
    { quote: "Yoramen brings that quiet, deliberate Tokyo ramen stall energy right to our neighborhood. The spicy tonkotsu is unforgettable.", author: "Neighborhood Regular", date: "May 2026", color: "bg-gray-50" },
  ] satisfies GalleryTestimonial[],
};

const allowedAspectClasses = new Set(["aspect-[3/4]", "aspect-square", "aspect-[4/3]"]);
const allowedTestimonialStyles = new Set(["bg-gray-50", "bg-white border flex flex-col border-gray-100 shadow-sm"]);

function normalizeAspect(value: string | undefined, fallback: string) {
  return value && allowedAspectClasses.has(value) ? value : fallback;
}

function normalizeStyle(value: string | undefined, fallback: string) {
  return value && allowedTestimonialStyles.has(value) ? value : fallback;
}

export default async function GalleryPage() {
  const locale = await getRequestLocale();
  const t = (await createServerTextTranslator(locale)).text;
  const page = await fetchGalleryPage();
  const sourceCategories = arrayOr(page?.categories, fallbackGallery.categories).includes("All")
    ? arrayOr(page?.categories, fallbackGallery.categories)
    : ["All", ...arrayOr(page?.categories, fallbackGallery.categories)];
  const categories = sourceCategories.map((category) => ({
    id: category === "All" ? "all" : category,
    label: t(category),
  }));

  const galleryCount = Math.max(fallbackGallery.galleryItems.length, page?.galleryItems?.length || 0);
  const galleryItems = Array.from({ length: galleryCount }, (_, index) => {
    const fallback = fallbackGallery.galleryItems[index] || fallbackGallery.galleryItems[fallbackGallery.galleryItems.length - 1];
    const item = page?.galleryItems?.[index];

    return {
      category: textOr(item?.category, fallback.category),
      title: t(textOr(item?.title, fallback.title)),
      url: resolveImageUrl(item?.image, fallback.url),
      aspect: normalizeAspect(item?.aspect, fallback.aspect),
    };
  });

  const testimonialCount = Math.max(fallbackGallery.testimonials.length, page?.testimonials?.length || 0);
  const testimonials = Array.from({ length: testimonialCount }, (_, index) => {
    const fallback = fallbackGallery.testimonials[index] || fallbackGallery.testimonials[fallbackGallery.testimonials.length - 1];
    const testimonial = page?.testimonials?.[index];

    return {
      quote: t(textOr(testimonial?.quote, fallback.quote)),
      author: t(textOr(testimonial?.author, fallback.author)),
      date: t(textOr(testimonial?.date, fallback.date)),
      color: normalizeStyle(testimonial?.style, fallback.color),
    };
  });

  return (
    <GalleryContent
      header={{
        eyebrow: t(textOr(page?.header?.eyebrow, fallbackGallery.header.eyebrow)),
        title: t(textOr(page?.header?.title, fallbackGallery.header.title)),
        description: t(textOr(page?.header?.description, fallbackGallery.header.description)),
      }}
      categories={categories}
      galleryItems={galleryItems}
      testimonials={testimonials}
      communityLabel={t("Community")}
      testimonialsTitle={t("What people are saying")}
      decorativeAlts={{
        bento: t("bento"),
        matcha: t("matcha"),
        brush: t("brush"),
      }}
    />
  );
}
