"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Languages, Menu, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getLocaleFromPathname, isLocale, localeOptions, localizePath, stripLocaleFromPathname, type Locale } from "@/i18n/config";
import { t } from "@/i18n/dictionary";
import { textOr } from "@/sanity/fallback";
import { resolveImageUrl } from "@/sanity/image";
import type { LinkItemContent, SiteSettingsContent } from "@/sanity/types";

type NavbarProps = {
  settings?: SiteSettingsContent | null;
  locale: Locale;
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

function getFallbackNavLinks(locale: Locale) {
  return [
    { label: t(locale, "nav.home"), href: "/" },
    { label: t(locale, "nav.menu"), href: "/menu" },
    { label: t(locale, "nav.ourStory"), href: "/about" },
    { label: t(locale, "nav.gallery"), href: "/gallery" },
    { label: t(locale, "nav.locations"), href: "/locations" },
    { label: t(locale, "nav.contact"), href: "/contact" },
  ];
}

function LanguageSwitcher({ locale, className = "" }: { locale: Locale; className?: string }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstSegment = pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const activeLocale = isLocale(firstSegment) ? getLocaleFromPathname(pathname) : locale;
  const basePathname = stripLocaleFromPathname(pathname);
  const query = searchParams.toString();

  return (
    <label
      className={`inline-flex items-center gap-2 rounded-full border border-stone/15 bg-white/70 px-3 py-2 text-xs uppercase tracking-[0.12em] text-stone transition-colors hover:border-brand-red/40 hover:text-sumi ${className}`}
    >
      <Languages size={14} aria-hidden="true" />
      <span className="sr-only">{t(locale, "language.select")}</span>
      <select
        value={activeLocale}
        aria-label={t(locale, "language.select")}
        onChange={(event) => {
          const nextLocale = event.target.value as Locale;
          const nextHref = localizePath(`${basePathname}${query ? `?${query}` : ""}`, nextLocale);
          router.push(nextHref);
        }}
        className="bg-transparent text-xs font-medium uppercase tracking-[0.12em] outline-none"
      >
        {Object.entries(localeOptions).map(([code, option]) => (
          <option key={code} value={code}>
            {option.shortLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Navbar({ settings, locale }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDarkBackgroundPath = false;
  const fallbackLogoSrc = isDarkBackgroundPath && !isScrolled ? "/images/logo-full-w.webp" : "/images/logo-full.webp";
  const logoSource = isDarkBackgroundPath && !isScrolled ? settings?.brand?.logoLight : settings?.brand?.logoDark;
  const logoSrc = resolveImageUrl(logoSource, fallbackLogoSrc);
  const logoAlt = textOr(settings?.brand?.altText, "Yoramen Logo");
  const navLinks = mergeLinks(settings?.navigation, getFallbackNavLinks(locale));
  const primaryCta = {
    label: textOr(settings?.primaryCta?.label, t(locale, "nav.orderNow")),
    href: textOr(settings?.primaryCta?.href, "/order"),
    openInNewTab: settings?.primaryCta?.openInNewTab,
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "frosted-nav py-3 shadow-sm" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href={localizePath("/", locale)} className="flex items-center">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={140}
              height={48}
              className="object-contain w-auto h-9 md:h-10"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={`${link.href}-${index}`}
                href={localizePath(link.href || "#", locale)}
                target={link.openInNewTab ? "_blank" : undefined}
                rel={link.openInNewTab ? "noreferrer" : undefined}
                className="text-[13px] tracking-[0.12em] text-stone hover:text-sumi transition-colors duration-300 uppercase"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={localizePath(primaryCta.href, locale)}
              target={primaryCta.openInNewTab ? "_blank" : undefined}
              rel={primaryCta.openInNewTab ? "noreferrer" : undefined}
              className="bg-brand-red hover:bg-brand-red-hover text-white px-6 py-2.5 rounded-full text-[13px] tracking-[0.12em] uppercase transition-all hover-rise"
            >
              {primaryCta.label}
            </Link>
            <LanguageSwitcher locale={locale} />
          </nav>

          <button
            className="md:hidden text-sumi"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t(locale, "a11y.toggleNavigation")}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-rice-paper/95 backdrop-blur-lg absolute top-full left-0 w-full h-screen flex flex-col pt-12 px-8 gap-7 items-center border-t border-light-border">
          {navLinks.map((link, index) => (
            <Link
              key={`${link.href}-${index}`}
              href={localizePath(link.href || "#", locale)}
              target={link.openInNewTab ? "_blank" : undefined}
              rel={link.openInNewTab ? "noreferrer" : undefined}
              className="text-lg tracking-[0.15em] text-sumi hover:text-brand-red transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={localizePath(primaryCta.href, locale)}
            target={primaryCta.openInNewTab ? "_blank" : undefined}
            rel={primaryCta.openInNewTab ? "noreferrer" : undefined}
            className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3 mt-4 rounded-full text-base tracking-[0.12em] uppercase transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            {primaryCta.label}
          </Link>
          <LanguageSwitcher locale={locale} className="mt-1 bg-white" />
        </div>
      )}
    </header>
  );
}
