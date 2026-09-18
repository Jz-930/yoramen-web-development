import { defaultLocale, localeOptions, type Locale } from "./config";
import { getManualTranslation } from "./dictionary";

const translationCache = new Map<string, string>();

const skippedKeys = new Set([
  "_id",
  "_key",
  "_ref",
  "_type",
  "align",
  "asset",
  "buttonHref",
  "categoryNavEnabled",
  "className",
  "color",
  "directionsUrl",
  "enabled",
  "externalOrderUrl",
  "generalEmail",
  "href",
  "id",
  "iframeUrl",
  "image",
  "img",
  "isPrimary",
  "logoDark",
  "logoLight",
  "mapEmbedUrl",
  "openInNewTab",
  "partnershipsEmail",
  "phone",
  "price",
  "slug",
  "style",
  "url",
]);

const protectedTerms = ["Yoramen", "MealKeyWay"];

function shouldSkipKey(key: string) {
  const normalized = key.toLowerCase();
  return (
    skippedKeys.has(key) ||
    normalized.endsWith("url") ||
    normalized.endsWith("href") ||
    normalized.includes("email") ||
    normalized.includes("phone") ||
    normalized.includes("address") ||
    normalized.includes("image")
  );
}

function shouldTranslateText(text: string) {
  const trimmed = text.trim();

  if (!trimmed) return false;
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return false;
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return false;
  if (/^[\d\s.,:$%+()/-]+$/.test(trimmed)) return false;
  if (/^[\w.-]+@[\w.-]+\.\w+$/.test(trimmed)) return false;

  return true;
}

function protectTerms(text: string) {
  const replacements: Array<[string, string]> = [];
  let protectedText = text;

  protectedTerms.forEach((term, index) => {
    const token = `__YORAMEN_TERM_${index}__`;
    if (!protectedText.includes(term)) return;
    protectedText = protectedText.replaceAll(term, token);
    replacements.push([token, term]);
  });

  return { protectedText, replacements };
}

function restoreTerms(text: string, replacements: Array<[string, string]>) {
  return replacements.reduce((result, [token, term]) => result.replaceAll(token, term), text);
}

async function translateWithPublicGoogle(text: string, locale: Locale) {
  const target = localeOptions[locale].translateTarget;
  const { protectedText, replacements } = protectTerms(text);
  const params = new URLSearchParams({
    client: "gtx",
    sl: "en",
    tl: target,
    dt: "t",
    q: protectedText,
  });
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params.toString()}`, {
    next: { revalidate: 60 * 60 * 24 * 7 },
  });

  if (!response.ok) {
    throw new Error(`Translation request failed with ${response.status}`);
  }

  const payload = (await response.json()) as unknown;

  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    throw new Error("Unexpected translation response");
  }

  const translated = payload[0]
    .map((segment) => (Array.isArray(segment) && typeof segment[0] === "string" ? segment[0] : ""))
    .join("");

  return restoreTerms(translated || text, replacements);
}

export async function translateText(text: string, locale: Locale) {
  if (locale === defaultLocale || !shouldTranslateText(text)) return text;

  const manual = getManualTranslation(text, locale);
  if (manual) return manual;

  const cacheKey = `${locale}:${text}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  try {
    const translated = await translateWithPublicGoogle(text, locale);
    translationCache.set(cacheKey, translated);
    return translated;
  } catch (error) {
    console.warn(`Translation failed for locale "${locale}". Falling back to English text.`, error);
    translationCache.set(cacheKey, text);
    return text;
  }
}

function isSkippableObject(value: Record<string, unknown>) {
  const type = value._type;
  return type === "image" || type === "file" || type === "reference";
}

export async function localizeContent<T>(value: T, locale: Locale, key = ""): Promise<T> {
  if (locale === defaultLocale) return value;
  if (key && shouldSkipKey(key)) return value;
  if (typeof value === "string") return (await translateText(value, locale)) as T;
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return (await Promise.all(value.map((item) => localizeContent(item, locale)))) as T;
  }

  if (typeof value === "object") {
    const source = value as Record<string, unknown>;

    if (isSkippableObject(source)) return value;

    const entries = await Promise.all(
      Object.entries(source).map(async ([entryKey, entryValue]) => [
        entryKey,
        await localizeContent(entryValue, locale, entryKey),
      ])
    );

    return Object.fromEntries(entries) as T;
  }

  return value;
}
