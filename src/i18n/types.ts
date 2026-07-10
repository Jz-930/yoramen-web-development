import type { SourceLocale, TargetLocale } from "./locales";

export const TRANSLATION_BUNDLE_SCHEMA_VERSION = 1 as const;
export const DEFAULT_TRANSLATION_GRACE_DAYS = 30 as const;
export const DEFAULT_TRANSLATION_GRACE_PERIOD_MS =
  DEFAULT_TRANSLATION_GRACE_DAYS * 24 * 60 * 60 * 1000;

export type TranslationHealthStatus = "fresh" | "grace" | "unavailable";
export type TranslationPathSegment = string | number;

/** A translated leaf stored in Sanity. English remains the source of truth. */
export type TranslationEntry = {
  key: string;
  blockId: string;
  critical: boolean;
  sourceHash: string;
  value: string;
  reviewed: boolean;
  disabled?: boolean;
};

/** Additive translation data; it does not duplicate an English CMS document. */
export type TranslationBundle = {
  schemaVersion: number;
  sourceLocale: SourceLocale;
  locale: TargetLocale;
  baselineId: string;
  sourceDocumentId?: string;
  uiCatalog?: boolean;
  sourceUpdatedAt?: string;
  entries: readonly TranslationEntry[];
};

/**
 * Connects a stable exchange key to a leaf in the current English value.
 * `sourceUpdatedAt` is required to grant grace after the source hash changes;
 * otherwise a mismatched entry becomes unavailable immediately.
 */
export type SourceTextEntry = {
  key: string;
  blockId: string;
  critical: boolean;
  path: readonly TranslationPathSegment[];
  source: string;
  sourceUpdatedAt?: string;
};

export type BundleInvalidReason =
  | "malformed"
  | "schema-version-mismatch"
  | "source-locale-mismatch"
  | "locale-mismatch"
  | "baseline-mismatch"
  | "duplicate-entry-key";

export type BundleHealth =
  | { status: "valid" }
  | { status: "missing" }
  | { status: "invalid"; reason: BundleInvalidReason };

export type TranslationUnavailableReason =
  | "bundle-missing"
  | "bundle-invalid"
  | "duplicate-source-key"
  | "invalid-source-definition"
  | "invalid-source-path"
  | "source-value-mismatch"
  | "entry-missing"
  | "block-mismatch"
  | "criticality-mismatch"
  | "unreviewed"
  | "disabled"
  | "empty-translation"
  | "invalid-source-hash"
  | "invalid-source-updated-at"
  | "stale";

export type ResolvedEntryHealth = {
  key: string;
  blockId: string;
  critical: boolean;
  status: TranslationHealthStatus;
  currentSourceHash?: string;
  translatedSourceHash?: string;
  staleSince?: string;
  unavailableReason?: TranslationUnavailableReason;
  translationApplied: boolean;
};

export type ResolvedBlockHealth = {
  blockId: string;
  critical: boolean;
  status: TranslationHealthStatus;
  entryKeys: readonly string[];
  unavailableEntryKeys: readonly string[];
  fallbackToEnglish: boolean;
};

export type FallbackBlockSets = {
  /** Every block rendered from English because one or more entries are unavailable. */
  all: readonly string[];
  critical: readonly string[];
  ordinary: readonly string[];
};

export type PageFallbackDecision =
  | { action: "render-localized"; blockIds: readonly [] }
  | { action: "in-place-english"; blockIds: readonly [string] }
  | {
      action: "redirect-to-english";
      reason: "critical-block-unavailable" | "multiple-ordinary-blocks-unavailable";
      blockIds: readonly string[];
    };

export type TranslationResolution<T> = {
  /** A new value; the input English object is never mutated. */
  data: T;
  health: TranslationHealthStatus;
  bundleHealth: BundleHealth;
  entries: readonly ResolvedEntryHealth[];
  blocks: readonly ResolvedBlockHealth[];
  fallbackBlocks: FallbackBlockSets;
  decision: PageFallbackDecision;
};

export type ResolveTranslationOptions<T> = {
  englishData: T;
  sourceEntries: readonly SourceTextEntry[];
  bundle: TranslationBundle | null | undefined;
  locale: TargetLocale;
  expectedBaselineId?: string;
  expectedSchemaVersion?: number;
  gracePeriodMs?: number;
  now?: Date | number;
};
