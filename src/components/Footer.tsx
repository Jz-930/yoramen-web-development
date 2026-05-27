import Link from "next/link";
import Image from "next/image";
import { textOr } from "@/sanity/fallback";
import { resolveImageUrl } from "@/sanity/image";
import type { LinkItemContent, SiteSettingsContent } from "@/sanity/types";

type FooterProps = {
  settings?: SiteSettingsContent | null;
};

const fallbackFooter = {
  brandBlurb: "Our most important job is simple: make every bowl right, every day.",
  exploreLinks: [
    { label: "Menu", href: "/menu" },
    { label: "Our Story", href: "/about" },
    { label: "Gallery", href: "/gallery" },
  ],
  visitLinks: [
    { label: "Locations", href: "/locations" },
    { label: "Contact Us", href: "/contact" },
    { label: "Order Now", href: "/order" },
  ],
  socialLinks: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

function mergeLinks(cmsLinks: LinkItemContent[] | undefined, fallbackLinks: LinkItemContent[]) {
  if (!Array.isArray(cmsLinks) || cmsLinks.length === 0) return fallbackLinks;

  const count = Math.max(fallbackLinks.length, cmsLinks.length);
  return Array.from({ length: count }, (_, index) => {
    const fallback = fallbackLinks[index] || { label: "", href: "#" };
    const cms = cmsLinks[index];

    return {
      label: textOr(cms?.label, fallback.label || ""),
      href: textOr(cms?.href, fallback.href || "#"),
      openInNewTab: cms?.openInNewTab ?? fallback.openInNewTab,
    };
  }).filter((link) => link.label && link.href);
}

function FooterLinks({ links }: { links: LinkItemContent[] }) {
  return (
    <ul className="space-y-4 text-sm text-stone">
      {links.map((link, index) => (
        <li key={`${link.href}-${index}`}>
          <Link
            href={link.href || "#"}
            target={link.openInNewTab ? "_blank" : undefined}
            rel={link.openInNewTab ? "noreferrer" : undefined}
            className="hover:text-brand-red transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer({ settings }: FooterProps) {
  const logoSrc = resolveImageUrl(settings?.brand?.logoDark, "/images/logo-full.webp");
  const logoAlt = textOr(settings?.brand?.altText, "Yoramen Logo");
  const brandBlurb = textOr(settings?.footer?.brandBlurb, fallbackFooter.brandBlurb);
  const exploreLinks = mergeLinks(settings?.footer?.exploreLinks, fallbackFooter.exploreLinks);
  const visitLinks = mergeLinks(settings?.footer?.visitLinks, fallbackFooter.visitLinks);
  const socialLinks = mergeLinks(settings?.footer?.socialLinks, fallbackFooter.socialLinks);
  const legalLinks = mergeLinks(settings?.footer?.legalLinks, fallbackFooter.legalLinks);

  return (
    <footer className="bg-section-warm relative z-20 pt-20 pb-10 border-t border-light-border">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={140}
                height={48}
                className="object-contain w-auto h-8 md:h-10"
              />
            </Link>
            <p className="text-stone text-sm leading-relaxed">
              {brandBlurb}
            </p>
          </div>

          <div>
            <h4 className="font-serif text-base mb-6 text-sumi font-semibold">Explore</h4>
            <FooterLinks links={exploreLinks} />
          </div>

          <div>
            <h4 className="font-serif text-base mb-6 text-sumi font-semibold">Visit Us</h4>
            <FooterLinks links={visitLinks} />
          </div>

          <div>
            <h4 className="font-serif text-base mb-6 text-sumi font-semibold">Connect</h4>
            <FooterLinks links={socialLinks} />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-light-border"></div>
          <div className="w-2 h-2 rounded-full bg-brand-red/30"></div>
          <div className="flex-1 h-px bg-light-border"></div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-stone">
          <p>&copy; {new Date().getFullYear()} Yoramen. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {legalLinks.map((link, index) => (
              <Link
                key={`${link.href}-${index}`}
                href={link.href || "#"}
                target={link.openInNewTab ? "_blank" : undefined}
                rel={link.openInNewTab ? "noreferrer" : undefined}
                className="hover:text-sumi transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
