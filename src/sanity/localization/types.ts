export const API_VERSION = "2026-05-24";
export const SOURCE_LOCALE = "en-CA" as const;
export const SCHEMA_VERSION = 1 as const;
export const CONFIG_DOCUMENT_ID = "localizationConfig";

export const TARGET_LOCALES = ["fr-CA", "zh-Hant", "ja-JP"] as const;
export type TargetLocale = (typeof TARGET_LOCALES)[number];
export type ExportMode = "full" | "delta";

export const TARGET_LOCALE_LABELS: Record<TargetLocale, string> = {
  "fr-CA": "French (Canada)",
  "zh-Hant": "Traditional Chinese",
  "ja-JP": "Japanese (Japan)",
};

export const SOURCE_DOCUMENT_TYPES = [
  "siteSettings",
  "homePage",
  "aboutPage",
  "galleryPage",
  "contactPage",
  "menuPage",
  "orderPage",
  "menuCategory",
  "menuItem",
  "promotion",
  "location",
] as const;

export interface SourceDocument {
  _id: string;
  _type: string;
  _updatedAt: string;
  [key: string]: unknown;
}

export interface UiSourceString {
  key: string;
  value: string;
  context?: string;
  blockId?: string;
  critical?: boolean;
}

export interface SourceEntry {
  key: string;
  blockId: string;
  critical: boolean;
  source: string;
  sourceHash: string;
  context: string;
  sourceDocumentId?: string;
  sourceDocumentType?: string;
  sourceUpdatedAt: string;
  uiCatalog: boolean;
}

export interface ExchangeEntry {
  key: string;
  blockId: string;
  critical: boolean;
  source: string;
  sourceHash: string;
  context: string;
  sourceDocumentId?: string;
  uiCatalog?: boolean;
  translation: string;
}

export interface TranslationExchange {
  schemaVersion: number;
  mode: ExportMode;
  generatedAt: string;
  sourceLocale: typeof SOURCE_LOCALE;
  targetLocale: TargetLocale;
  baselineId: string;
  entries: ExchangeEntry[];
}

export interface StoredTranslationEntry {
  _key?: string;
  key: string;
  blockId: string;
  critical: boolean;
  sourceHash: string;
  value: string;
  reviewed: boolean;
  disabled: boolean;
}

export interface TranslationBundle {
  _id: string;
  _type: "translationBundle";
  locale: TargetLocale;
  sourceDocumentId?: string;
  uiCatalog: boolean;
  baselineId: string;
  schemaVersion: number;
  sourceUpdatedAt: string;
  entries: StoredTranslationEntry[];
}

export interface LocalizationConfig {
  enabled: boolean;
  locales: {
    frCA: boolean;
    zhHant: boolean;
    jaJP: boolean;
  };
  activeBaselineId: string;
  graceDays: 30;
}

export interface ImportIssue {
  severity: "error" | "warning";
  key?: string;
  message: string;
}

export interface ImportPreview {
  exchange?: TranslationExchange;
  issues: ImportIssue[];
  fileName: string;
}

export interface LocaleSummary {
  total: number;
  fresh: number;
  grace: number;
  expired: number;
  missing: number;
  disabled: number;
  pendingReview: number;
  coverage: number;
}

export const DEFAULT_CONFIG: LocalizationConfig = {
  enabled: false,
  locales: {
    frCA: false,
    zhHant: false,
    jaJP: false,
  },
  activeBaselineId: "",
  graceDays: 30,
};
