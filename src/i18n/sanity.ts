import "server-only";

import { client } from "@/sanity/client";
import { cache } from "react";
import { BASELINE_ID } from "./baseline";
import {
  SOURCE_LOCALE,
  isTargetLocale,
  type SupportedLocale,
  type TargetLocale,
} from "./locales";
import {
  DEFAULT_TRANSLATION_GRACE_DAYS,
  TRANSLATION_BUNDLE_SCHEMA_VERSION,
  type TranslationBundle,
  type TranslationEntry,
} from "./types";

const fetchOptions = { cache: "no-store" as const };

export const LOCALIZATION_CONFIG_QUERY = `*[
  _type == "localizationConfig" &&
  _id == "localizationConfig"
][0]{
  enabled,
  locales{
    frCA,
    zhHant,
    jaJP
  },
  activeBaselineId,
  graceDays
}`;

export const TRANSLATION_BUNDLES_QUERY = `*[
  _type == "translationBundle" &&
  locale == $locale &&
  baselineId == $baselineId
] | order(_id asc){
  _id,
  locale,
  sourceDocumentId,
  uiCatalog,
  baselineId,
  schemaVersion,
  sourceUpdatedAt,
  entries[]{
    key,
    blockId,
    critical,
    sourceHash,
    value,
    reviewed,
    disabled
  }
}`;

export type LocalizationLocaleConfig = {
  frCA: boolean;
  zhHant: boolean;
  jaJP: boolean;
};

export type LocalizationConfig = {
  enabled: boolean;
  locales: LocalizationLocaleConfig;
  activeBaselineId: string | null;
  graceDays: number;
};

export const DISABLED_LOCALIZATION_CONFIG: LocalizationConfig = Object.freeze({
  enabled: false,
  locales: Object.freeze({
    frCA: false,
    zhHant: false,
    jaJP: false,
  }),
  activeBaselineId: null,
  graceDays: DEFAULT_TRANSLATION_GRACE_DAYS,
});

type RawLocalizationConfig = {
  enabled?: unknown;
  locales?: {
    frCA?: unknown;
    zhHant?: unknown;
    jaJP?: unknown;
  } | null;
  activeBaselineId?: unknown;
  graceDays?: unknown;
};

export type SanityTranslationBundle = {
  _id: string;
  locale: TargetLocale;
  sourceDocumentId?: string;
  uiCatalog?: boolean;
  baselineId: string;
  schemaVersion: number;
  sourceUpdatedAt?: string;
  entries: readonly TranslationEntry[];
};

export type TranslationBundleSelection = {
  sourceDocumentIds?: readonly string[];
  includeUiCatalog?: boolean;
};

export type TranslationBundleLoadResult =
  | { status: "loaded"; bundle: TranslationBundle | null }
  | { status: "unavailable"; bundle: null };

export type LocaleGateReason =
  | "environment-disabled"
  | "configuration-disabled"
  | "locale-disabled"
  | "missing-baseline";

export type LocaleGate =
  | {
      allowed: true;
      locale: typeof SOURCE_LOCALE;
      mode: "english";
      baselineId: null;
      graceDays: number;
    }
  | {
      allowed: true;
      locale: TargetLocale;
      mode: "localized";
      baselineId: string;
      graceDays: number;
      config: LocalizationConfig;
    }
  | {
      allowed: false;
      locale: TargetLocale;
      mode: "fallback-to-english";
      reason: LocaleGateReason;
    };

export function isI18nEnvironmentEnabled(): boolean {
  return process.env.NEXT_PUBLIC_I18N_ENABLED === "true";
}

function isBuiltinPreviewConfig(): boolean {
  return process.env.I18N_BUILTIN_PREVIEW === "true";
}

function normalizeConfig(value: RawLocalizationConfig | null): LocalizationConfig {
  if (!value || typeof value !== "object") return DISABLED_LOCALIZATION_CONFIG;

  const baseline =
    typeof value.activeBaselineId === "string" && value.activeBaselineId.trim().length > 0
      ? value.activeBaselineId.trim()
      : null;
  const graceDays =
    typeof value.graceDays === "number" && Number.isFinite(value.graceDays) && value.graceDays >= 0
      ? Math.floor(value.graceDays)
      : DEFAULT_TRANSLATION_GRACE_DAYS;

  return {
    enabled: value.enabled === true,
    locales: {
      frCA: value.locales?.frCA === true,
      zhHant: value.locales?.zhHant === true,
      jaJP: value.locales?.jaJP === true,
    },
    activeBaselineId: baseline,
    graceDays,
  };
}

/** Does not contact Sanity unless the deployment-level feature flag is enabled. */
async function fetchLocalizationConfig(): Promise<LocalizationConfig> {
  if (!isI18nEnvironmentEnabled()) return DISABLED_LOCALIZATION_CONFIG;
  if (isBuiltinPreviewConfig()) {
    return {
      enabled: true,
      locales: { frCA: true, zhHant: true, jaJP: true },
      activeBaselineId: BASELINE_ID,
      graceDays: DEFAULT_TRANSLATION_GRACE_DAYS,
    };
  }

  try {
    const value = await client.fetch<RawLocalizationConfig | null>(
      LOCALIZATION_CONFIG_QUERY,
      {},
      fetchOptions,
    );
    return normalizeConfig(value);
  } catch (error) {
    console.warn("Sanity localization config fetch failed. Localization stays disabled.", error);
    return DISABLED_LOCALIZATION_CONFIG;
  }
}

export const loadLocalizationConfig = cache(fetchLocalizationConfig);

export function isLocaleEnabled(config: LocalizationConfig, locale: TargetLocale): boolean {
  if (locale === "fr-CA") return config.locales.frCA;
  if (locale === "zh-Hant") return config.locales.zhHant;
  return config.locales.jaJP;
}

/**
 * English returns before either the environment flag or Sanity config is read.
 * Target locales fail closed and give routes enough information to redirect.
 */
async function resolveLocaleGate(locale: SupportedLocale): Promise<LocaleGate> {
  if (locale === SOURCE_LOCALE) {
    return {
      allowed: true,
      locale,
      mode: "english",
      baselineId: null,
      graceDays: DEFAULT_TRANSLATION_GRACE_DAYS,
    };
  }
  if (!isI18nEnvironmentEnabled()) {
    return { allowed: false, locale, mode: "fallback-to-english", reason: "environment-disabled" };
  }

  const config = await loadLocalizationConfig();
  if (!config.enabled) {
    return {
      allowed: false,
      locale,
      mode: "fallback-to-english",
      reason: "configuration-disabled",
    };
  }
  if (!isLocaleEnabled(config, locale)) {
    return { allowed: false, locale, mode: "fallback-to-english", reason: "locale-disabled" };
  }
  if (!config.activeBaselineId) {
    return { allowed: false, locale, mode: "fallback-to-english", reason: "missing-baseline" };
  }

  return {
    allowed: true,
    locale,
    mode: "localized",
    baselineId: config.activeBaselineId,
    graceDays: config.graceDays,
    config,
  };
}

export const getLocaleGate = cache(resolveLocaleGate);

export type TranslationBundleScope = Pick<
  SanityTranslationBundle,
  "sourceDocumentId" | "uiCatalog"
>;

export function translationBundleNamespace(scope: TranslationBundleScope): string | null {
  if (scope.uiCatalog === true) return "ui";
  if (typeof scope.sourceDocumentId !== "string") return null;

  const sourceDocumentId = scope.sourceDocumentId.trim();
  return sourceDocumentId.length > 0 ? `document:${sourceDocumentId}` : null;
}

export function globalTranslationKey(scope: TranslationBundleScope, key: string): string | null {
  const namespace = translationBundleNamespace(scope);
  return namespace && key.length > 0 ? `${namespace}:${key}` : null;
}

export function globalTranslationBlockId(
  scope: TranslationBundleScope,
  blockId: string,
): string | null {
  const namespace = translationBundleNamespace(scope);
  return namespace && blockId.length > 0 ? `${namespace}:${blockId}` : null;
}

function latestIsoTimestamp(values: readonly (string | undefined)[]): string | undefined {
  const valid = values
    .map((value) => ({ value, timestamp: value ? Date.parse(value) : Number.NaN }))
    .filter(
      (item): item is { value: string; timestamp: number } =>
        typeof item.value === "string" && Number.isFinite(item.timestamp),
    )
    .sort((left, right) => right.timestamp - left.timestamp);
  return valid[0]?.value;
}

/**
 * Combines page/document and UI bundles into the core resolver shape. Keys and
 * block IDs are namespaced globally so separately authored bundles cannot clash.
 */
export function combineTranslationBundles(
  bundles: readonly SanityTranslationBundle[],
  locale: TargetLocale,
  baselineId: string,
): TranslationBundle | null {
  if (bundles.length === 0) return null;

  const entries: TranslationEntry[] = [];
  const globalKeys = new Set<string>();
  for (const bundle of [...bundles].sort((left, right) => left._id.localeCompare(right._id))) {
    if (
      bundle.locale !== locale ||
      bundle.baselineId !== baselineId ||
      bundle.schemaVersion !== TRANSLATION_BUNDLE_SCHEMA_VERSION ||
      !Array.isArray(bundle.entries)
    ) {
      return null;
    }

    if (!translationBundleNamespace(bundle)) return null;

    for (const entry of bundle.entries) {
      if (!entry || typeof entry.key !== "string" || typeof entry.blockId !== "string") return null;

      const key = globalTranslationKey(bundle, entry.key);
      const blockId = globalTranslationBlockId(bundle, entry.blockId);
      if (!key || !blockId) return null;
      if (globalKeys.has(key)) return null;
      globalKeys.add(key);
      entries.push({
        ...entry,
        key,
        blockId,
      });
    }
  }

  return {
    schemaVersion: TRANSLATION_BUNDLE_SCHEMA_VERSION,
    sourceLocale: SOURCE_LOCALE,
    locale,
    baselineId,
    sourceUpdatedAt: latestIsoTimestamp(bundles.map((bundle) => bundle.sourceUpdatedAt)),
    entries,
  };
}

function selectBundles(
  bundles: readonly SanityTranslationBundle[],
  selection: TranslationBundleSelection | undefined,
): SanityTranslationBundle[] {
  if (!selection) return [...bundles];

  const documentIds = new Set(selection.sourceDocumentIds ?? []);
  const includeUiCatalog = selection.includeUiCatalog === true;
  return bundles.filter(
    (bundle) =>
      (includeUiCatalog && bundle.uiCatalog === true) ||
      (typeof bundle.sourceDocumentId === "string" && documentIds.has(bundle.sourceDocumentId)),
  );
}

/**
 * English and disabled deployments return before the translationBundle query.
 * Any fetch, validation, or collision failure returns null for English fallback.
 */
export async function loadCombinedTranslationBundleResult(options: {
  locale: SupportedLocale;
  baselineId: string;
  selection?: TranslationBundleSelection;
}): Promise<TranslationBundleLoadResult> {
  if (options.locale === SOURCE_LOCALE || !isTargetLocale(options.locale)) {
    return { status: "loaded", bundle: null };
  }
  if (!isI18nEnvironmentEnabled() || options.baselineId.trim().length === 0) {
    return { status: "loaded", bundle: null };
  }
  if (isBuiltinPreviewConfig()) return { status: "loaded", bundle: null };

  if (
    options.selection &&
    options.selection.includeUiCatalog !== true &&
    (options.selection.sourceDocumentIds?.length ?? 0) === 0
  ) {
    return { status: "loaded", bundle: null };
  }

  try {
    const bundles = await client.fetch<SanityTranslationBundle[]>(
      TRANSLATION_BUNDLES_QUERY,
      { locale: options.locale, baselineId: options.baselineId },
      fetchOptions,
    );
    if (!Array.isArray(bundles)) return { status: "unavailable", bundle: null };

    const selectedBundles = selectBundles(bundles, options.selection);
    const bundle = combineTranslationBundles(
      selectedBundles,
      options.locale,
      options.baselineId,
    );
    if (selectedBundles.length > 0 && bundle === null) {
      return { status: "unavailable", bundle: null };
    }

    return { status: "loaded", bundle };
  } catch (error) {
    console.warn("Sanity translation bundle fetch failed. Falling back to English.", error);
    return { status: "unavailable", bundle: null };
  }
}

export async function loadCombinedTranslationBundle(options: {
  locale: SupportedLocale;
  baselineId: string;
  selection?: TranslationBundleSelection;
}): Promise<TranslationBundle | null> {
  return (await loadCombinedTranslationBundleResult(options)).bundle;
}
