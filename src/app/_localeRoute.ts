import { localeFromSegment, segmentFromLocale, type TargetLocale } from "@/i18n";
import {
  getLocaleGate,
  getPageTranslationDecision,
} from "@/i18n/server";
import { notFound, redirect } from "next/navigation";

export type LocaleRouteProps = {
  params: Promise<{ locale: string }>;
};

/** Accepts only the three canonical, lowercase public locale segments. */
export async function requireTargetLocale(
  params: LocaleRouteProps["params"],
  englishPathname: string,
): Promise<TargetLocale> {
  const { locale: segment } = await params;
  const locale = localeFromSegment(segment);

  if (!locale || segmentFromLocale(locale) !== segment) {
    notFound();
  }

  const gate = await getLocaleGate(locale);
  if (!gate.allowed) {
    redirect(englishPathname);
  }

  const decision = await getPageTranslationDecision(locale, englishPathname);
  if (decision.action === "redirect-to-english") {
    redirect(englishPathname);
  }

  return locale;
}
