"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  SOURCE_LOCALE,
  localizeInternalHref,
  pathnameForLocale,
  type SupportedLocale,
  type TargetLocale,
} from "@/i18n";
import { textFromDictionary, type TextDictionary } from "@/i18n/client-copy";
import { textOr } from "@/sanity/fallback";
import { resolveImageUrl } from "@/sanity/image";
import type { LinkItemContent, SiteSettingsContent } from "@/sanity/types";

type NavbarProps = {
  settings?: SiteSettingsContent | null;
  locale?: SupportedLocale;
  enabledLocales?: TargetLocale[];
  copy?: TextDictionary;
};

const fallbackNavLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Our Story", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Locations", href: "/locations" },
  { label: "Contact", href: "/contact" },
];

const fallbackCta = { label: "Order Now", href: "/order" };

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

export default function Navbar({
  settings,
  locale = SOURCE_LOCALE,
  enabledLocales = [],
  copy,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname() || "/";
  const t = (source: string) => textFromDictionary(copy, source);

  const isDarkBackgroundPath = false;
  const fallbackLogoSrc = isDarkBackgroundPath && !isScrolled ? "/images/logo-full-w.webp" : "/images/logo-full.webp";
  const logoSource = isDarkBackgroundPath && !isScrolled ? settings?.brand?.logoLight : settings?.brand?.logoDark;
  const logoSrc = resolveImageUrl(logoSource, fallbackLogoSrc);
  const logoAlt = t(textOr(settings?.brand?.altText, "Yoramen Logo"));
  const navLinks = mergeLinks(settings?.navigation, fallbackNavLinks).map((link) => ({
    ...link,
    label: t(link.label || ""),
    href: localizeInternalHref(link.href || "#", locale),
  }));
  const primaryCta = {
    label: t(textOr(settings?.primaryCta?.label, fallbackCta.label)),
    href: localizeInternalHref(textOr(settings?.primaryCta?.href, fallbackCta.href), locale),
    openInNewTab: settings?.primaryCta?.openInNewTab,
  };
  const showLanguageSelector = enabledLocales.length > 0;

  const switchLocale = (nextLocale: SupportedLocale) => {
    const targetPath = pathnameForLocale(pathname, nextLocale);
    const suffix = typeof window === "undefined" ? "" : `${window.location.search}${window.location.hash}`;
    setMobileMenuOpen(false);
    window.location.assign(`${targetPath}${suffix}`);
  };

  const languageSelector = (mobile = false) => (
    <label className={mobile ? "mt-2" : "shrink-0"}>
      <span className="sr-only">{t("Language")}</span>
      <select
        value={locale}
        onChange={(event) => switchLocale(event.target.value as SupportedLocale)}
        aria-label={t("Language")}
        className={
          mobile
            ? "rounded-full border border-light-border bg-white px-5 py-2.5 text-sm tracking-[0.08em] text-sumi"
            : "rounded-full border border-stone/20 bg-white/70 px-3 py-2 text-[12px] tracking-[0.08em] text-sumi outline-none transition-colors hover:border-stone/50"
        }
      >
        <option value={SOURCE_LOCALE}>EN</option>
        {enabledLocales.includes("fr-CA") && <option value="fr-CA">FR</option>}
        {enabledLocales.includes("zh-Hant") && <option value="zh-Hant">繁中</option>}
        {enabledLocales.includes("ja-JP") && <option value="ja-JP">日本語</option>}
      </select>
    </label>
  );

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
          <Link href={localizeInternalHref("/", locale)} className="flex items-center">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={140}
              height={48}
              className="object-contain w-auto h-9 md:h-10"
              priority
            />
          </Link>

          <nav className={`hidden md:flex items-center ${showLanguageSelector ? "gap-5 lg:gap-7" : "gap-8"}`}>
            {navLinks.map((link, index) => (
              <Link
                key={`${link.href}-${index}`}
                href={link.href || "#"}
                target={link.openInNewTab ? "_blank" : undefined}
                rel={link.openInNewTab ? "noreferrer" : undefined}
                className="text-[13px] tracking-[0.12em] text-stone hover:text-sumi transition-colors duration-300 uppercase"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={primaryCta.href}
              target={primaryCta.openInNewTab ? "_blank" : undefined}
              rel={primaryCta.openInNewTab ? "noreferrer" : undefined}
              className="bg-brand-red hover:bg-brand-red-hover text-white px-6 py-2.5 rounded-full text-[13px] tracking-[0.12em] uppercase transition-all hover-rise"
            >
              {primaryCta.label}
            </Link>
            {showLanguageSelector && languageSelector()}
          </nav>

          <button
            className="md:hidden text-sumi"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t("Toggle navigation menu")}
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
              href={link.href || "#"}
              target={link.openInNewTab ? "_blank" : undefined}
              rel={link.openInNewTab ? "noreferrer" : undefined}
              className="text-lg tracking-[0.15em] text-sumi hover:text-brand-red transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={primaryCta.href}
            target={primaryCta.openInNewTab ? "_blank" : undefined}
            rel={primaryCta.openInNewTab ? "noreferrer" : undefined}
            className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3 mt-4 rounded-full text-base tracking-[0.12em] uppercase transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            {primaryCta.label}
          </Link>
          {showLanguageSelector && languageSelector(true)}
        </div>
      )}
    </header>
  );
}
