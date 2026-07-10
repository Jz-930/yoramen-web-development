export type TextDictionary = Readonly<Record<string, string>>;

export const GLOBAL_UI_SOURCE_STRINGS = [
  "Home",
  "Menu",
  "Our Story",
  "Gallery",
  "Locations",
  "Contact",
  "Contact Us",
  "Order Now",
  "Explore",
  "Visit Us",
  "Connect",
  "Instagram",
  "Facebook",
  "Privacy Policy",
  "Terms of Service",
  "All rights reserved.",
  "Our most important job is simple: make every bowl right, every day.",
  "Toggle navigation menu",
  "Language",
  "Yoramen Logo",
] as const;

export const HERO_UI_SOURCE_STRINGS = [
  "Freshly Made - Boldly Flavored",
  "Freshly Made · Boldly Flavored",
  "Freshly Made 路 Boldly Flavored",
  "A ramen bowl",
  "with actual soul.",
  'Slow-simmered, made to order, and layered with flavor. We turned "delicious" into a daily standard.',
  "Order Now",
  "View Menu",
  "Fresh Prep Daily",
  "Signature Flavor",
  "Authentic Craft",
  "Ramen Chef Background",
  "brush",
  "Japanese Pattern Background",
  "Signature Ramen Illustration",
  "pattern detail",
] as const;

export const ORDER_UI_SOURCE_STRINGS = [
  "Order Online",
  "Online Ordering",
  "Secure ordering powered by MealKeyWay",
  "Open Online Ordering",
  "If the ordering screen does not load, open the secure ordering page in a new tab.",
  "Yoramen Online Ordering",
  "Open Ordering",
  "Close modal",
] as const;

export function buildTextDictionary(
  sources: readonly string[],
  translate: (source: string) => string,
): TextDictionary {
  return Object.fromEntries(sources.map((source) => [source, translate(source)]));
}

export function textFromDictionary(dictionary: TextDictionary | undefined, source: string): string {
  return dictionary?.[source] ?? source;
}
