import Image from "next/image";
import { Clock, MapPin, Phone } from "lucide-react";
import { SOURCE_LOCALE } from "@/i18n";
import { buildLocalizedMetadata, ENGLISH_PAGE_METADATA } from "@/i18n/metadata";
import { createServerTextTranslator, getRequestLocale } from "@/i18n/server";
import { textOr } from "@/sanity/fallback";
import { fetchLocations } from "@/sanity/fetchers";
import { resolveImageUrl } from "@/sanity/image";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildLocalizedMetadata({
    locale: SOURCE_LOCALE,
    englishPathname: "/locations",
    englishTitle: ENGLISH_PAGE_METADATA.locations.title,
    englishDescription: ENGLISH_PAGE_METADATA.locations.description,
  });
}

const fallbackLocations = [
  {
    name: "Downtown Flagship",
    label: "Flagship Store",
    address: "36 Canterbury Street, Saint John, NB E2L 2C5",
    phone: "506-898-1909",
    hours: "Mon-Sun: 11:30 AM - 10:00 PM",
    waitNote: "* Peak hours 12PM-1PM & 6PM-8PM may involve a wait.",
    mapEmbedUrl: "https://maps.google.com/maps?q=36%20Canterbury%20Street,%20Saint%20John,%20NB%20E2L%202C5&t=&z=15&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://maps.google.com/?q=36%20Canterbury%20Street%2C%20Saint%20John%2C%20NB%20E2L%202C5",
  },
];

export default async function LocationsPage() {
  const locale = await getRequestLocale();
  const t = (await createServerTextTranslator(locale)).text;
  const cmsLocations = await fetchLocations();
  const count = Math.max(fallbackLocations.length, cmsLocations.length);
  const locations = Array.from({ length: count }, (_, index) => {
    const fallback = fallbackLocations[index] || fallbackLocations[fallbackLocations.length - 1];
    const cmsLocation = cmsLocations[index];
    const address = textOr(cmsLocation?.address, fallback.address);

    return {
      name: t(textOr(cmsLocation?.name, fallback.name)),
      label: t(textOr(cmsLocation?.label, fallback.label)),
      address,
      phone: textOr(cmsLocation?.phone, fallback.phone),
      hours: t(textOr(cmsLocation?.hours, fallback.hours)),
      waitNote: t(textOr(cmsLocation?.waitNote, fallback.waitNote)),
      mapEmbedUrl: textOr(cmsLocation?.mapEmbedUrl, fallback.mapEmbedUrl),
      directionsUrl: textOr(cmsLocation?.directionsUrl, `https://maps.google.com/?q=${encodeURIComponent(address)}`),
      image: cmsLocation?.image,
    };
  });

  return (
    <div className="pt-28 pb-24 min-h-screen bg-section-warm">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">{t("Visit")}</span>
          <h1 className="text-4xl md:text-6xl font-serif text-sumi mb-4">{t("Locations")}</h1>
          <div className="jp-divider mb-6"></div>
          <p className="text-base text-stone max-w-xl mx-auto leading-relaxed">
            {t("Visit us in person and enjoy your bowl at its best, right out of the kitchen.")}
          </p>
        </div>

        <div className="space-y-8">
          {locations.map((location, index) => {
            const imageSrc = location.image ? resolveImageUrl(location.image, "") : "";

            return (
              <div key={`${location.name}-${index}`} className="flex flex-col lg:flex-row bg-warm-white rounded-2xl overflow-hidden border border-light-border mx-auto max-w-5xl shadow-sm">
                <div className="w-full lg:w-1/2 p-10 md:p-14 flex flex-col justify-center">
                  <div className="inline-block bg-brand-red/10 text-brand-red text-xs font-medium px-4 py-1.5 tracking-[0.15em] uppercase rounded-full mb-8 w-max">
                    {location.label}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-serif text-sumi mb-10">{location.name}</h2>

                  <div className="space-y-8 mb-12">
                    <div className="flex items-start gap-4 group">
                      <div className="mt-0.5 w-10 h-10 rounded-full bg-section-warm border border-light-border flex items-center justify-center shrink-0 group-hover:bg-brand-red/10 transition-colors">
                        <MapPin className="text-brand-red" size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-[0.15em] text-stone mb-1.5 font-medium">{t("Address")}</h4>
                        <span className="block text-sumi text-base">{location.address}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="mt-0.5 w-10 h-10 rounded-full bg-section-warm border border-light-border flex items-center justify-center shrink-0 group-hover:bg-brand-red/10 transition-colors">
                        <Clock className="text-brand-red" size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-[0.15em] text-stone mb-1.5 font-medium">{t("Hours")}</h4>
                        <span className="block text-sumi text-base">{location.hours}</span>
                        <p className="text-xs text-brand-red mt-1.5 italic">{location.waitNote}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="mt-0.5 w-10 h-10 rounded-full bg-section-warm border border-light-border flex items-center justify-center shrink-0 group-hover:bg-brand-red/10 transition-colors">
                        <Phone className="text-brand-red" size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-[0.15em] text-stone mb-1.5 font-medium">{t("Phone")}</h4>
                        <span className="block text-sumi text-base">{location.phone}</span>
                      </div>
                    </div>
                  </div>

                  <a href={location.directionsUrl} target="_blank" rel="noreferrer" className="w-full text-center bg-brand-red hover:bg-brand-red-hover text-white py-3.5 rounded-full text-sm uppercase tracking-[0.12em] font-medium transition-all hover-rise">
                    {t("Get Directions")}
                  </a>
                </div>

                <div className="w-full lg:w-1/2 h-[350px] lg:h-auto relative bg-section-warm">
                  {imageSrc ? (
                    <Image src={imageSrc} alt={location.name} fill className="object-cover" />
                  ) : (
                    <iframe
                      src={location.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 grayscale contrast-125 opacity-90"
                    ></iframe>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
