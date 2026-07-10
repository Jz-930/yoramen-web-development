import { localeFromSegment, segmentFromLocale, type TargetLocale } from "@/i18n";
import {
  getLocaleGate,
  getPageTranslationDecision,
  getRequestLocaleContext,
} from "@/i18n/server";
import { notFound, redirect } from "next/navigation";

export type LocaleRouteProps = {
  params: Promise<{ locale: string }>;
};

/** Accepts only the three canonical, lowercase public locale segments. */
export async function requireTargetLocale(
  params: LocaleRouteProps["params"],
): Promise<TargetLocale> {
  const { locale: segment } = await params;
  const locale = localeFromSegment(segment);

  if (!locale || segmentFromLocale(locale) !== segment) {
    notFound();
  }

  const gate = await getLocaleGate(locale);
  const { englishPathname, search } = await getRequestLocaleContext();
  if (!gate.allowed) {
    redirect(`${englishPathname}${search}`);
  }

  const decision = await getPageTranslationDecision(locale, englishPathname);
  if (decision.action === "redirect-to-english") {
    redirect(`${englishPathname}${search}`);
  }

  return locale;
}
