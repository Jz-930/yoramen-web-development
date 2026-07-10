"use client";

import {
  BASELINE_ID,
  baselineText,
  hasBaselineTranslation,
} from "@/i18n/baseline";
import { normalizeSourceText } from "@/i18n/hash";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ChangeEvent } from "react";
import { useClient } from "sanity";
import { UI_CATALOG_SOURCE_STRINGS, UI_CATALOG_UPDATED_AT } from "./catalog";
import { PUBLISHED_LOCALIZATION_SOURCE_QUERY } from "./source-query";
import {
  extractSourceEntries,
  sha256,
  toExchangeEntry,
  validateExchange,
} from "./extract";
import {
  API_VERSION,
  CONFIG_DOCUMENT_ID,
  DEFAULT_CONFIG,
  SCHEMA_VERSION,
  SOURCE_DOCUMENT_TYPES,
  SOURCE_LOCALE,
  TARGET_LOCALE_LABELS,
  TARGET_LOCALES,
  type ExportMode,
  type ImportPreview,
  type LocaleSummary,
  type LocalizationConfig,
  type SourceDocument,
  type SourceEntry,
  type StoredTranslationEntry,
  type TargetLocale,
  type TranslationBundle,
  type TranslationExchange,
} from "./types";

const CONFIG_QUERY = `
  *[_id == $configId][0]{
    enabled,
    locales,
    activeBaselineId,
    graceDays
  }
`;

const BUNDLES_QUERY = `
  *[
    _type == "translationBundle" &&
    !(_id in path("drafts.**"))
  ]{
    _id,
    _type,
    locale,
    sourceDocumentId,
    uiCatalog,
    baselineId,
    schemaVersion,
    sourceUpdatedAt,
    entries[]{
      _key,
      key,
      blockId,
      critical,
      sourceHash,
      value,
      reviewed,
      disabled
    }
  }
`;

const TRANSLATION_PROMPT = `You are localizing the Yoramen website from Canadian English.

Return only valid JSON. Do not add Markdown or commentary.
Edit only each entry's "translation" value. Do not change, add, remove, or reorder keys, entries, source text, hashes, locale codes, placeholders, or HTML tags.

Write natural local copy for targetLocale, not literal machine-sounding translation:
- fr-CA: idiomatic Canadian French suitable for a Toronto restaurant.
- zh-Hant: natural Traditional Chinese, concise and locally fluent.
- ja-JP: natural customer-facing Japanese, polite without sounding overly formal.

Preserve Yoramen, product names that are intentionally branded, placeholders such as {name}, {{name}}, %s and dollar-brace placeholders, all line breaks, and the exact HTML tag sequence. Keep headings and buttons compact. Translate every empty "translation" value.`;

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100%",
    padding: "clamp(16px, 3vw, 36px)",
    background: "var(--card-bg-color, #f6f6f8)",
    color: "var(--card-fg-color, #1b1b1f)",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  shell: { maxWidth: 1180, margin: "0 auto" },
  header: { marginBottom: 24 },
  eyebrow: { margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" },
  title: { margin: "6px 0 8px", fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.1 },
  muted: { color: "#62626b", lineHeight: 1.55 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 },
  card: {
    padding: 20,
    border: "1px solid #dedee5",
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  section: {
    marginTop: 18,
    padding: 22,
    border: "1px solid #dedee5",
    borderRadius: 12,
    background: "#fff",
  },
  sectionTitle: { margin: "0 0 6px", fontSize: 20 },
  label: { display: "grid", gap: 6, fontSize: 13, fontWeight: 650 },
  input: { width: "100%", padding: "10px 11px", border: "1px solid #c9c9d2", borderRadius: 6, background: "#fff", color: "#161619" },
  row: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10 },
  button: { padding: "10px 14px", border: 0, borderRadius: 6, background: "#d9212d", color: "#fff", fontWeight: 700, cursor: "pointer" },
  secondaryButton: { padding: "10px 14px", border: "1px solid #b8b8c2", borderRadius: 6, background: "#fff", color: "#25252a", fontWeight: 650, cursor: "pointer" },
  disabledButton: { opacity: 0.45, cursor: "not-allowed" },
  stat: { margin: "4px 0", fontSize: 28, fontWeight: 750 },
  tiny: { margin: 0, color: "#6b6b74", fontSize: 12, lineHeight: 1.45 },
  badge: { display: "inline-block", padding: "3px 7px", borderRadius: 999, background: "#eeeeF2", fontSize: 11, fontWeight: 700 },
  success: { marginTop: 12, padding: 12, borderRadius: 7, background: "#e8f6ed", color: "#166534" },
  error: { marginTop: 12, padding: 12, borderRadius: 7, background: "#fdeced", color: "#9f1239" },
  warning: { marginTop: 12, padding: 12, borderRadius: 7, background: "#fff7dd", color: "#854d0e" },
  tableWrap: { maxHeight: 360, overflow: "auto", border: "1px solid #e0e0e6", borderRadius: 7 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
  cell: { padding: "8px 10px", borderBottom: "1px solid #ececf0", textAlign: "left", verticalAlign: "top" },
};

type EntryHealthStatus =
  | "fresh"
  | "grace"
  | "expired"
  | "missing"
  | "disabled"
  | "invalid"
  | "pending-review";

type BlockHealth = {
  blockId: string;
  critical: boolean;
  status: EntryHealthStatus;
  reason: string;
  entryCount: number;
  storedEntryCount: number;
  canToggle: boolean;
};

type BaselineLocaleReadiness = {
  locale: TargetLocale;
  total: number;
  ready: number;
  missing: number;
  disabled: number;
  pendingReview: number;
  stale: number;
  invalid: number;
  duplicateKeys: number;
  schemaMismatch: number;
  conflictingSources: number;
  complete: boolean;
};

function mergeConfig(value: Partial<LocalizationConfig> | null): LocalizationConfig {
  return {
    enabled: value?.enabled ?? DEFAULT_CONFIG.enabled,
    locales: {
      frCA: value?.locales?.frCA ?? false,
      zhHant: value?.locales?.zhHant ?? false,
      jaJP: value?.locales?.jaJP ?? false,
    },
    activeBaselineId: value?.activeBaselineId || "",
    graceDays: 30,
  };
}

function makeBaselineId(): string {
  return `yoramen-${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}`;
}

function localeConfigKey(locale: TargetLocale): keyof LocalizationConfig["locales"] {
  if (locale === "fr-CA") return "frCA";
  if (locale === "zh-Hant") return "zhHant";
  return "jaJP";
}

function downloadJson(value: TranslationExchange): void {
  const blob = new Blob([`${JSON.stringify(value, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeBaseline = value.baselineId.replace(/[^a-z0-9._-]+/gi, "-");
  anchor.href = url;
  anchor.download = `yoramen-${safeBaseline}-${value.targetLocale}-${value.mode}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function bundleEntryIndex(
  bundles: TranslationBundle[],
  locale: TargetLocale,
  baselineId: string,
) {
  const index = new Map<string, { entry: StoredTranslationEntry; bundle: TranslationBundle }>();
  const duplicateKeys = new Set<string>();
  bundles
    .filter((bundle) => bundle.locale === locale && bundle.baselineId === baselineId)
    .forEach((bundle) => {
      (bundle.entries || []).forEach((entry) => {
        if (index.has(entry.key)) duplicateKeys.add(entry.key);
        index.set(entry.key, { entry, bundle });
      });
    });
  return { entries: index, duplicateKeys };
}

function sourceTranslationConflicts(
  sourceEntries: SourceEntry[],
  valueForKey: (key: string) => string | undefined,
): Array<{ source: string; keys: string[] }> {
  const grouped = new Map<string, { source: string; values: Map<string, string[]> }>();

  sourceEntries.forEach((sourceEntry) => {
    const value = valueForKey(sourceEntry.key);
    if (!value?.trim()) return;

    const normalizedSource = normalizeSourceText(sourceEntry.source);
    const group = grouped.get(normalizedSource) ?? {
      source: sourceEntry.source,
      values: new Map<string, string[]>(),
    };
    group.values.set(value, [...(group.values.get(value) ?? []), sourceEntry.key]);
    grouped.set(normalizedSource, group);
  });

  return [...grouped.values()]
    .filter(({ values }) => values.size > 1)
    .map(({ source, values }) => ({ source, keys: [...values.values()].flat() }));
}

function entryHealth(
  source: SourceEntry,
  saved: { entry: StoredTranslationEntry; bundle: TranslationBundle } | undefined,
  graceDays: number,
): EntryHealthStatus {
  if (!saved || !saved.entry.value?.trim()) return "missing";
  if (saved.entry.disabled) return "disabled";
  const scopeMatches = source.uiCatalog
    ? saved.bundle.uiCatalog === true
    : saved.bundle.uiCatalog !== true && saved.bundle.sourceDocumentId === source.sourceDocumentId;
  if (
    !scopeMatches ||
    saved.entry.blockId !== source.blockId ||
    saved.entry.critical !== source.critical
  ) return "invalid";
  if (!saved.entry.reviewed) return "pending-review";
  if (saved.entry.sourceHash === source.sourceHash) return "fresh";
  if (/\[\d+\](?:\.|$)/.test(source.key)) return "expired";

  const changedAt = source.sourceUpdatedAt;
  const ageDays = (Date.now() - new Date(changedAt).getTime()) / 86_400_000;
  return Number.isFinite(ageDays) && ageDays <= graceDays ? "grace" : "expired";
}

const BLOCK_STATUS_PRIORITY: Record<EntryHealthStatus, number> = {
  disabled: 7,
  invalid: 6,
  missing: 5,
  "pending-review": 4,
  expired: 3,
  grace: 2,
  fresh: 1,
};

function blockHealthForLocale(
  locale: TargetLocale,
  baselineId: string,
  sourceEntries: SourceEntry[],
  bundles: TranslationBundle[],
  graceDays: number,
): BlockHealth[] {
  const stored = bundleEntryIndex(bundles, locale, baselineId);
  const grouped = new Map<string, SourceEntry[]>();
  sourceEntries.forEach((source) => {
    grouped.set(source.blockId, [...(grouped.get(source.blockId) || []), source]);
  });

  return [...grouped.entries()]
    .map(([blockId, sources]) => {
      const statuses = sources.map((source) =>
        stored.duplicateKeys.has(source.key)
          ? "invalid" as const
          : entryHealth(source, stored.entries.get(source.key), graceDays),
      );
      const status = statuses.reduce<EntryHealthStatus>(
        (worst, current) =>
          BLOCK_STATUS_PRIORITY[current] > BLOCK_STATUS_PRIORITY[worst] ? current : worst,
        "fresh",
      );
      const counts = statuses.reduce<Record<EntryHealthStatus, number>>(
        (result, current) => ({ ...result, [current]: result[current] + 1 }),
        { fresh: 0, grace: 0, expired: 0, missing: 0, disabled: 0, invalid: 0, "pending-review": 0 },
      );
      const duplicateCount = sources.filter((source) => stored.duplicateKeys.has(source.key)).length;
      const reasonParts = [
        duplicateCount ? `${duplicateCount} duplicate key${duplicateCount === 1 ? "" : "s"}` : "",
        counts.invalid ? `${counts.invalid} structurally invalid` : "",
        counts.missing ? `${counts.missing} missing` : "",
        counts.disabled ? `${counts.disabled} disabled` : "",
        counts["pending-review"] ? `${counts["pending-review"]} pending review` : "",
        counts.expired ? `${counts.expired} expired` : "",
        counts.grace ? `${counts.grace} in grace` : "",
      ].filter(Boolean);
      const storedEntryCount = sources.filter((source) => stored.entries.has(source.key)).length;

      return {
        blockId,
        critical: sources.some((source) => source.critical),
        status,
        reason: reasonParts.length ? reasonParts.join("; ") : "All entries are current and reviewed.",
        entryCount: sources.length,
        storedEntryCount,
        canToggle: storedEntryCount > 0 && duplicateCount === 0,
      };
    })
    .sort((left, right) => {
      const priority = BLOCK_STATUS_PRIORITY[right.status] - BLOCK_STATUS_PRIORITY[left.status];
      return priority || left.blockId.localeCompare(right.blockId);
    });
}

function baselineReadiness(
  baselineId: string,
  sourceEntries: SourceEntry[],
  bundles: TranslationBundle[],
): BaselineLocaleReadiness[] {
  return TARGET_LOCALES.map((locale) => {
    const localeBundles = bundles.filter(
      (bundle) => bundle.locale === locale && bundle.baselineId === baselineId,
    );
    const stored = bundleEntryIndex(localeBundles, locale, baselineId);
    const result: BaselineLocaleReadiness = {
      locale,
      total: sourceEntries.length,
      ready: 0,
      missing: 0,
      disabled: 0,
      pendingReview: 0,
      stale: 0,
      invalid: 0,
      duplicateKeys: stored.duplicateKeys.size,
      schemaMismatch: localeBundles.filter((bundle) => bundle.schemaVersion !== SCHEMA_VERSION).length,
      conflictingSources: 0,
      complete: false,
    };

    sourceEntries.forEach((source) => {
      const savedRecord = stored.entries.get(source.key);
      const saved = savedRecord?.entry;
      if (!saved || !saved.value?.trim()) {
        result.missing += 1;
      } else if (stored.duplicateKeys.has(source.key)) {
        result.invalid += 1;
      } else if (saved.disabled) {
        result.disabled += 1;
      } else if (entryHealth(source, savedRecord, 30) === "invalid") {
        result.invalid += 1;
      } else if (!saved.reviewed) {
        result.pendingReview += 1;
      } else if (saved.sourceHash !== source.sourceHash) {
        result.stale += 1;
      } else {
        result.ready += 1;
      }
    });

    result.conflictingSources = sourceTranslationConflicts(
      sourceEntries,
      (key) => stored.entries.get(key)?.entry.value,
    ).length;

    result.complete =
      result.total > 0 &&
      result.ready === result.total &&
      result.missing === 0 &&
      result.disabled === 0 &&
      result.pendingReview === 0 &&
      result.stale === 0 &&
      result.invalid === 0 &&
      result.duplicateKeys === 0 &&
      result.schemaMismatch === 0 &&
      result.conflictingSources === 0;
    return result;
  });
}

function deltaKeysForLocale(
  sourceEntries: SourceEntry[],
  bundles: TranslationBundle[],
  locale: TargetLocale,
  baselineId: string,
): Set<string> {
  const stored = bundleEntryIndex(bundles, locale, baselineId).entries;
  const conflictingKeys = new Set(
    sourceTranslationConflicts(
      sourceEntries,
      (key) => stored.get(key)?.entry.value,
    ).flatMap(({ keys }) => keys),
  );
  return new Set(
    sourceEntries
      .filter((source) => {
        const saved = stored.get(source.key)?.entry;
        return (
          !saved ||
          saved.sourceHash !== source.sourceHash ||
          saved.disabled ||
          conflictingKeys.has(source.key)
        );
      })
      .map(({ key }) => key),
  );
}

function summarizeLocale(
  locale: TargetLocale,
  sourceEntries: SourceEntry[],
  bundles: TranslationBundle[],
  baselineId: string,
  graceDays: number,
): LocaleSummary {
  const stored = bundleEntryIndex(bundles, locale, baselineId).entries;
  const summary: LocaleSummary = {
    total: sourceEntries.length,
    fresh: 0,
    grace: 0,
    expired: 0,
    missing: 0,
    disabled: 0,
    pendingReview: 0,
    coverage: 0,
  };

  sourceEntries.forEach((source) => {
    const status = entryHealth(source, stored.get(source.key), graceDays);
    if (status === "pending-review") summary.pendingReview += 1;
    else if (status === "invalid") summary.missing += 1;
    else summary[status] += 1;
  });

  summary.coverage = summary.total ? Math.round((summary.fresh / summary.total) * 100) : 100;
  return summary;
}

async function stableBundleId(
  locale: TargetLocale,
  baselineId: string,
  sourceDocumentId?: string,
): Promise<string> {
  const source = sourceDocumentId || "uiCatalog";
  const normalizedBaseline = baselineId
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "baseline";
  const safeBaseline = `${normalizedBaseline.slice(0, 20)}-${(await sha256(baselineId)).slice(0, 10)}`;
  let token = source.replace(/[^a-zA-Z0-9._-]/g, "-");
  if (token.length > 60) {
    token = `${token.slice(0, 43)}-${(await sha256(source)).slice(0, 12)}`;
  }
  return `translationBundle.${locale}.${safeBaseline}.${token}`;
}

export function LocalizationTool() {
  const studioClient = useClient({ apiVersion: API_VERSION });
  const publishedClient = useMemo(
    () => studioClient.withConfig({ perspective: "published", useCdn: false }),
    [studioClient],
  );
  const rawClient = useMemo(
    () => studioClient.withConfig({ perspective: "raw", useCdn: false }),
    [studioClient],
  );
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ tone: "success" | "error" | "warning"; text: string }>();
  const [sourceEntries, setSourceEntries] = useState<SourceEntry[]>([]);
  const [bundles, setBundles] = useState<TranslationBundle[]>([]);
  const [config, setConfig] = useState<LocalizationConfig>(DEFAULT_CONFIG);
  const [baselineId, setBaselineId] = useState<string>(BASELINE_ID || makeBaselineId());
  const [mode, setMode] = useState<ExportMode>("full");
  const [importPreview, setImportPreview] = useState<ImportPreview>();
  const [savedDraftIds, setSavedDraftIds] = useState<string[]>([]);
  const [savedBaselineId, setSavedBaselineId] = useState("");
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [blockLocale, setBlockLocale] = useState<TargetLocale>("fr-CA");
  const baselineInitialized = useRef(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setStatus(undefined);
    try {
      const [documents, savedConfig, publishedBundles] = await Promise.all([
        publishedClient.fetch<SourceDocument[]>(PUBLISHED_LOCALIZATION_SOURCE_QUERY, {
          sourceTypes: [...SOURCE_DOCUMENT_TYPES],
        }),
        publishedClient.fetch<Partial<LocalizationConfig> | null>(CONFIG_QUERY, {
          configId: CONFIG_DOCUMENT_ID,
        }),
        publishedClient.fetch<TranslationBundle[]>(BUNDLES_QUERY),
      ]);
      const nextConfig = mergeConfig(savedConfig);
      const extracted = await extractSourceEntries(
        documents,
        UI_CATALOG_SOURCE_STRINGS,
        UI_CATALOG_UPDATED_AT,
      );

      setSourceEntries(extracted);
      setBundles(publishedBundles);
      setConfig(nextConfig);
      if (!baselineInitialized.current) {
        baselineInitialized.current = true;
        setBaselineId(nextConfig.activeBaselineId || BASELINE_ID || makeBaselineId());
      }
    } catch (error) {
      setStatus({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not load localization data.",
      });
    } finally {
      setLoading(false);
    }
  }, [publishedClient]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [refresh]);

  const summaryBaselineId = config.activeBaselineId || baselineId.trim();
  const summaries = useMemo(
    () =>
      Object.fromEntries(
        TARGET_LOCALES.map((locale) => [
          locale,
          summarizeLocale(locale, sourceEntries, bundles, summaryBaselineId, config.graceDays),
        ]),
      ) as Record<TargetLocale, LocaleSummary>,
    [bundles, config.graceDays, sourceEntries, summaryBaselineId],
  );
  const inspectedBaselineId = baselineId.trim() || config.activeBaselineId;
  const blockHealth = useMemo(
    () => blockHealthForLocale(
      blockLocale,
      inspectedBaselineId,
      sourceEntries,
      bundles,
      config.graceDays,
    ),
    [blockLocale, bundles, config.graceDays, inspectedBaselineId, sourceEntries],
  );
  const candidateBaselineId = baselineId.trim();
  const candidateReadiness = useMemo(
    () => baselineReadiness(candidateBaselineId, sourceEntries, bundles),
    [bundles, candidateBaselineId, sourceEntries],
  );
  const candidateCanActivate =
    candidateBaselineId.length > 0 && candidateReadiness.every(({ complete }) => complete);

  const exportForLocale = useCallback(
    (locale: TargetLocale, shouldDownload = true): TranslationExchange | undefined => {
      const cleanBaselineId = baselineId.trim();
      if (!cleanBaselineId) {
        setStatus({ tone: "error", text: "Set a baseline ID before exporting." });
        return undefined;
      }
      const deltaKeys = deltaKeysForLocale(sourceEntries, bundles, locale, cleanBaselineId);
      const selectedEntries =
        mode === "full" ? sourceEntries : sourceEntries.filter(({ key }) => deltaKeys.has(key));
      const exchange: TranslationExchange = {
        schemaVersion: SCHEMA_VERSION,
        mode,
        generatedAt: new Date().toISOString(),
        sourceLocale: SOURCE_LOCALE,
        targetLocale: locale,
        baselineId: cleanBaselineId,
        entries: selectedEntries.map(toExchangeEntry),
      };
      if (shouldDownload) downloadJson(exchange);
      return exchange;
    },
    [baselineId, bundles, mode, sourceEntries],
  );

  const exportAll = () => {
    TARGET_LOCALES.forEach((locale) => exportForLocale(locale));
    setStatus({
      tone: "success",
      text: `Prepared one ${mode} JSON file for each target locale. Your browser may ask permission for multiple downloads.`,
    });
  };

  const seedBundledV1Drafts = async () => {
    const missing = TARGET_LOCALES.flatMap((locale) =>
      sourceEntries
        .filter((entry) => !hasBaselineTranslation(locale, entry.source))
        .map((entry) => `${locale}: ${entry.key}`),
    );
    if (!sourceEntries.length || missing.length) {
      setStatus({
        tone: "error",
        text: !sourceEntries.length
          ? "No published English source entries are available."
          : `The bundled V1 is missing ${missing.length} current source translation(s). Export a fresh full baseline instead.`,
      });
      return;
    }
    if (!window.confirm(
      `Create unreviewed ${BASELINE_ID} translation drafts for all three languages from the bundled V1 copy? Existing English documents will not be changed.`,
    )) return;

    setBusy(true);
    setStatus(undefined);
    try {
      const existing = await rawClient.fetch<Array<{ _id: string }>>(
        `*[
          _type == "translationBundle" &&
          baselineId == $baselineId &&
          !(_id in path("versions.**"))
        ]{_id}`,
        { baselineId: BASELINE_ID },
      );
      if (existing.length) {
        throw new Error(
          `Baseline ${BASELINE_ID} already has translation documents or drafts. Use export/import so existing work is never overwritten.`,
        );
      }

      const draftDocuments: TranslationBundle[] = [];
      for (const locale of TARGET_LOCALES) {
        const grouped = new Map<string, SourceEntry[]>();
        sourceEntries.forEach((entry) => {
          const groupKey = entry.uiCatalog ? "uiCatalog" : entry.sourceDocumentId || "";
          grouped.set(groupKey, [...(grouped.get(groupKey) || []), entry]);
        });

        for (const [groupKey, groupEntries] of grouped) {
          if (!groupEntries.length) continue;
          const sourceDocumentId = groupKey === "uiCatalog" ? undefined : groupKey;
          const publishedId = await stableBundleId(locale, BASELINE_ID, sourceDocumentId);
          const entries = await Promise.all(
            groupEntries
              .slice()
              .sort((left, right) => left.key.localeCompare(right.key))
              .map(async (entry) => ({
                _key: (await sha256(entry.key)).slice(0, 20),
                key: entry.key,
                blockId: entry.blockId,
                critical: entry.critical,
                sourceHash: entry.sourceHash,
                value: baselineText(locale, entry.source),
                reviewed: false,
                disabled: false,
              })),
          );
          const sourceUpdatedAt = groupEntries.reduce(
            (latest, entry) => entry.sourceUpdatedAt > latest ? entry.sourceUpdatedAt : latest,
            groupEntries[0].sourceUpdatedAt,
          );
          draftDocuments.push({
            _id: `drafts.${publishedId}`,
            _type: "translationBundle",
            locale,
            ...(sourceDocumentId ? { sourceDocumentId, uiCatalog: false } : { uiCatalog: true }),
            baselineId: BASELINE_ID,
            schemaVersion: SCHEMA_VERSION,
            sourceUpdatedAt,
            entries,
          });
        }
      }

      let transaction = rawClient.transaction();
      draftDocuments.forEach((document) => {
        transaction = transaction.create(document);
      });
      await transaction.commit();
      setBaselineId(BASELINE_ID);
      setSavedBaselineId(BASELINE_ID);
      setSavedDraftIds(draftDocuments.map(({ _id }) => _id));
      setReviewConfirmed(false);
      await refresh();
      setStatus({
        tone: "success",
        text: `Created ${draftDocuments.length} bundled V1 drafts for all three languages. Complete the human review confirmation, publish, then activate the baseline.`,
      });
    } catch (error) {
      setStatus({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not create the bundled V1 drafts.",
      });
    } finally {
      setBusy(false);
    }
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(TRANSLATION_PROMPT);
      setStatus({ tone: "success", text: "Fixed translation prompt copied." });
    } catch {
      setStatus({ tone: "warning", text: "Clipboard access was blocked. Select and copy the prompt manually." });
    }
  };

  const readImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSavedDraftIds([]);
    setReviewConfirmed(false);
    try {
      const parsed = JSON.parse((await file.text()).replace(/^\uFEFF/, "")) as unknown;
      const targetLocale =
        parsed && typeof parsed === "object" && "targetLocale" in parsed
          ? (parsed as { targetLocale?: TargetLocale }).targetLocale
          : undefined;
      const importedBaselineId =
        parsed && typeof parsed === "object" && "baselineId" in parsed
          ? (parsed as { baselineId?: string }).baselineId?.trim() || ""
          : "";
      const expectedDelta = targetLocale && TARGET_LOCALES.includes(targetLocale)
        ? deltaKeysForLocale(sourceEntries, bundles, targetLocale, importedBaselineId)
        : new Set<string>();
      const result = validateExchange(parsed, sourceEntries, expectedDelta);
      if (
        result.exchange &&
        candidateBaselineId &&
        result.exchange.baselineId !== candidateBaselineId
      ) {
        result.issues.push({
          severity: "error",
          message: `File baseline ${result.exchange.baselineId} does not match the working baseline ${candidateBaselineId}.`,
        });
        result.exchange = undefined;
      }
      if (result.exchange) {
        const exchange = result.exchange;
        const importedValues = new Map(
          exchange.entries.map((entry) => [entry.key, entry.translation]),
        );
        const existing = bundleEntryIndex(
          bundles,
          exchange.targetLocale,
          exchange.baselineId,
        ).entries;
        const conflicts = sourceTranslationConflicts(
          sourceEntries,
          (key) => importedValues.get(key) ?? existing.get(key)?.entry.value,
        );

        conflicts.slice(0, 25).forEach((conflict) => {
          result.issues.push({
            severity: "error",
            key: conflict.keys[0],
            message: `Conflicting translations for the same English source (${conflict.keys.join(", ")}): ${conflict.source}`,
          });
        });
        if (conflicts.length > 0) result.exchange = undefined;
      }
      setImportPreview({ fileName: file.name, exchange: result.exchange, issues: result.issues });
      setStatus(
        result.exchange
          ? { tone: "success", text: "Import file passed blocking validation. Review the preview before saving drafts." }
          : { tone: "error", text: "Import file has blocking validation errors." },
      );
    } catch (error) {
      setImportPreview({
        fileName: file.name,
        issues: [{ severity: "error", message: error instanceof Error ? error.message : "Invalid JSON file." }],
      });
      setStatus({ tone: "error", text: "The selected file could not be parsed as JSON." });
    }
  };

  const saveImportDrafts = async () => {
    const exchange = importPreview?.exchange;
    if (!exchange) return;
    setBusy(true);
    setStatus(undefined);
    try {
      const currentByKey = new Map(sourceEntries.map((entry) => [entry.key, entry]));
      const grouped = new Map<string, typeof exchange.entries>();
      exchange.entries.forEach((entry) => {
        const current = currentByKey.get(entry.key);
        if (!current) return;
        const groupKey = current.uiCatalog ? "uiCatalog" : current.sourceDocumentId || "";
        const group = grouped.get(groupKey) || [];
        group.push(entry);
        grouped.set(groupKey, group);
      });

      const existingBundles = await rawClient.fetch<TranslationBundle[]>(
        `*[
          _type == "translationBundle" &&
          locale == $locale &&
          baselineId == $baselineId &&
          !(_id in path("versions.**"))
        ]{
          _id, _type, locale, sourceDocumentId, uiCatalog, baselineId, schemaVersion,
          sourceUpdatedAt, entries[]{_key,key,blockId,critical,sourceHash,value,reviewed,disabled}
        }`,
        { locale: exchange.targetLocale, baselineId: exchange.baselineId },
      );
      const draftDocuments: TranslationBundle[] = [];

      for (const [groupKey, importedEntries] of grouped) {
        const sourceDocumentId = groupKey === "uiCatalog" ? undefined : groupKey;
        const scopeMatches = existingBundles.filter((bundle) =>
          sourceDocumentId
            ? bundle.uiCatalog !== true && bundle.sourceDocumentId === sourceDocumentId
            : bundle.uiCatalog === true,
        );
        const scopeDrafts = scopeMatches.filter(({ _id }) => _id.startsWith("drafts."));
        const scopePublished = scopeMatches.filter(({ _id }) => !(_id.startsWith("drafts.")));
        if (scopeDrafts.length > 1 || scopePublished.length > 1) {
          throw new Error(
            `Multiple translation bundles exist for ${sourceDocumentId || "the UI catalog"} and ${exchange.targetLocale}. Resolve the duplicates before importing.`,
          );
        }
        const publishedId =
          scopeDrafts[0]?._id.replace(/^drafts\./, "") ||
          scopePublished[0]?._id ||
          await stableBundleId(exchange.targetLocale, exchange.baselineId, sourceDocumentId);
        const draftId = `drafts.${publishedId}`;
        const existing =
          scopeDrafts.find(({ _id }) => _id === draftId) ||
          scopePublished.find(({ _id }) => _id === publishedId);
        const merged = new Map<string, StoredTranslationEntry>();

        if (exchange.mode === "delta") {
          (existing?.entries || []).forEach((entry) => merged.set(entry.key, entry));
        }
        for (const importedEntry of importedEntries) {
          merged.set(importedEntry.key, {
            _key: (await sha256(importedEntry.key)).slice(0, 20),
            key: importedEntry.key,
            blockId: importedEntry.blockId,
            critical: importedEntry.critical,
            sourceHash: importedEntry.sourceHash,
            value: importedEntry.translation,
            reviewed: false,
            disabled: false,
          });
        }

        const currentGroupEntries = sourceEntries.filter((entry) =>
          sourceDocumentId ? entry.sourceDocumentId === sourceDocumentId : entry.uiCatalog,
        );
        const allowedKeys = new Set(currentGroupEntries.map(({ key }) => key));
        const entries = Array.from(merged.values())
          .filter(({ key }) => allowedKeys.has(key))
          .sort((left, right) => left.key.localeCompare(right.key));
        const sourceUpdatedAt = currentGroupEntries.reduce(
          (latest, entry) => entry.sourceUpdatedAt > latest ? entry.sourceUpdatedAt : latest,
          currentGroupEntries[0]?.sourceUpdatedAt || new Date().toISOString(),
        );

        draftDocuments.push({
          _id: draftId,
          _type: "translationBundle",
          locale: exchange.targetLocale,
          ...(sourceDocumentId ? { sourceDocumentId, uiCatalog: false } : { uiCatalog: true }),
          baselineId: exchange.baselineId,
          schemaVersion: SCHEMA_VERSION,
          sourceUpdatedAt,
          entries,
        });
      }

      if (!draftDocuments.length) {
        throw new Error("This import contains no entries that can be saved.");
      }

      let transaction = rawClient.transaction();
      draftDocuments.forEach((document) => {
        transaction = transaction.createOrReplace(document);
      });
      await transaction.commit();

      setSavedDraftIds(draftDocuments.map(({ _id }) => _id));
      setSavedBaselineId(exchange.baselineId);
      setStatus({
        tone: "success",
        text: `Saved ${draftDocuments.length} translation bundle draft${draftDocuments.length === 1 ? "" : "s"}. English documents were not changed.`,
      });
    } catch (error) {
      setStatus({ tone: "error", text: error instanceof Error ? error.message : "Could not save translation drafts." });
    } finally {
      setBusy(false);
    }
  };

  const publishReviewedDrafts = async () => {
    if (!reviewConfirmed || !savedDraftIds.length) return;
    setBusy(true);
    setStatus(undefined);
    try {
      const draftDocuments = await rawClient.fetch<TranslationBundle[]>(
        `*[_id in $ids]{
          _id, _type, locale, sourceDocumentId, uiCatalog, baselineId, schemaVersion,
          sourceUpdatedAt, entries[]{_key,key,blockId,critical,sourceHash,value,reviewed,disabled}
        }`,
        { ids: savedDraftIds },
      );
      if (draftDocuments.length !== savedDraftIds.length) {
        throw new Error("One or more imported drafts could not be found. Import the file again.");
      }

      let transaction = rawClient.transaction();
      draftDocuments.forEach((draft) => {
        const publishedId = draft._id.replace(/^drafts\./, "");
        const publishedDocument: TranslationBundle = {
          ...draft,
          _id: publishedId,
          entries: (draft.entries || []).map((entry) => ({ ...entry, reviewed: true })),
        };
        transaction = transaction.createOrReplace(publishedDocument).delete(draft._id);
      });
      await transaction.commit();

      const publishedBaselineId = savedBaselineId;
      setSavedDraftIds([]);
      setReviewConfirmed(false);
      await refresh();
      if (publishedBaselineId) setBaselineId(publishedBaselineId);
      setStatus({
        tone: "success",
        text: "Reviewed bundles were published. The active baseline was not changed; activate it separately only after all three languages pass the readiness gate.",
      });
    } catch (error) {
      setStatus({ tone: "error", text: error instanceof Error ? error.message : "Could not publish translation drafts." });
    } finally {
      setBusy(false);
    }
  };

  const saveConfiguration = async () => {
    const anyLocaleEnabled = Object.values(config.locales).some(Boolean);
    if ((config.enabled || anyLocaleEnabled) && !config.activeBaselineId.trim()) {
      setStatus({ tone: "error", text: "Set an active baseline before enabling localization or a locale." });
      return;
    }
    setBusy(true);
    try {
      await rawClient.createOrReplace({
        _id: CONFIG_DOCUMENT_ID,
        _type: "localizationConfig",
        enabled: config.enabled,
        locales: config.locales,
        ...(config.activeBaselineId.trim() ? { activeBaselineId: config.activeBaselineId.trim() } : {}),
        graceDays: 30,
      });
      setStatus({ tone: "success", text: "Localization configuration saved. English routes remain independent." });
    } catch (error) {
      setStatus({ tone: "error", text: error instanceof Error ? error.message : "Could not save configuration." });
    } finally {
      setBusy(false);
    }
  };

  const setBlockDisabled = async (blockId: string, disabled: boolean) => {
    if (!inspectedBaselineId) {
      setStatus({ tone: "error", text: "There is no active or working baseline to update." });
      return;
    }
    const action = disabled ? "disable" : "restore";
    if (!window.confirm(
      `${action === "disable" ? "Disable" : "Restore"} every ${blockLocale} translation entry in block ${blockId}? English source documents will not be changed.`,
    )) return;

    setBusy(true);
    setStatus(undefined);
    try {
      const documents = await rawClient.fetch<TranslationBundle[]>(
        `*[
          _type == "translationBundle" &&
          locale == $locale &&
          baselineId == $baselineId &&
          !(_id in path("versions.**")) &&
          count(entries[blockId == $blockId]) > 0
        ]{
          _id, entries[]{_key,key,blockId,critical,sourceHash,value,reviewed,disabled}
        }`,
        { locale: blockLocale, baselineId: inspectedBaselineId, blockId },
      );
      if (!documents.length) {
        throw new Error("No stored translation entries were found for this block and baseline.");
      }

      let transaction = rawClient.transaction();
      documents.forEach((document) => {
        const entries = (document.entries || []).map((entry) =>
          entry.blockId === blockId ? { ...entry, disabled } : entry,
        );
        transaction = transaction.patch(document._id, { set: { entries } });
      });
      await transaction.commit();
      await refresh();
      setStatus({
        tone: disabled ? "warning" : "success",
        text: `${blockLocale} block ${blockId} was ${disabled ? "disabled" : "restored"}. Only translationBundle documents were updated.`,
      });
    } catch (error) {
      setStatus({
        tone: "error",
        text: error instanceof Error ? error.message : `Could not ${action} the translation block.`,
      });
    } finally {
      setBusy(false);
    }
  };

  const activateCandidateBaseline = async () => {
    if (!candidateCanActivate) {
      const failedLocales = candidateReadiness
        .filter(({ complete }) => !complete)
        .map(({ locale }) => locale)
        .join(", ");
      setStatus({
        tone: "error",
        text: `Baseline ${candidateBaselineId || "(empty)"} cannot be activated. Complete and publish current, reviewed translations for all three languages${failedLocales ? `: ${failedLocales}` : ""}.`,
      });
      return;
    }
    if (!window.confirm(
      `Activate baseline ${candidateBaselineId} for all localized routes? The previous baseline bundles will be retained for rollback.`,
    )) return;

    setBusy(true);
    setStatus(undefined);
    try {
      const previousBaselineId = config.activeBaselineId;
      const nextConfig = { ...config, activeBaselineId: candidateBaselineId, graceDays: 30 as const };
      await rawClient.createOrReplace({
        _id: CONFIG_DOCUMENT_ID,
        _type: "localizationConfig",
        enabled: nextConfig.enabled,
        locales: nextConfig.locales,
        activeBaselineId: nextConfig.activeBaselineId,
        graceDays: 30,
      });
      setConfig(nextConfig);
      await refresh();
      setStatus({
        tone: "success",
        text: `Activated baseline ${candidateBaselineId}.${previousBaselineId && previousBaselineId !== candidateBaselineId ? ` Previous baseline ${previousBaselineId} was retained.` : ""}`,
      });
    } catch (error) {
      setStatus({ tone: "error", text: error instanceof Error ? error.message : "Could not activate the baseline." });
    } finally {
      setBusy(false);
    }
  };

  const statusStyle = status?.tone === "success" ? styles.success : status?.tone === "warning" ? styles.warning : styles.error;
  const blockingImportErrors = importPreview?.issues.some(({ severity }) => severity === "error") ?? true;

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <p style={styles.eyebrow}>Provider-independent workflow</p>
          <h1 style={styles.title}>Localization</h1>
          <p style={{ ...styles.muted, maxWidth: 780, margin: 0 }}>
            English remains the only source of truth. Export structured JSON, translate it in any
            browser AI or translation service, validate it here, then review and publish isolated
            translation bundles.
          </p>
        </header>

        {status && <div style={statusStyle}>{status.text}</div>}

        <section style={styles.section}>
          <div style={{ ...styles.row, justifyContent: "space-between" }}>
            <div>
              <h2 style={styles.sectionTitle}>Coverage and freshness</h2>
              <p style={styles.tiny}>{loading ? "Loading published English and translation bundles..." : `${sourceEntries.length} current translatable strings found.`}</p>
              <p style={styles.tiny}>Showing published health for baseline: <strong>{summaryBaselineId || "not selected"}</strong></p>
            </div>
            <button type="button" style={styles.secondaryButton} onClick={() => void refresh()} disabled={loading || busy}>
              Refresh
            </button>
          </div>
          <div style={{ ...styles.grid, marginTop: 16 }}>
            {TARGET_LOCALES.map((locale) => {
              const summary = summaries[locale];
              return (
                <article key={locale} style={styles.card}>
                  <span style={styles.badge}>{locale}</span>
                  <h3 style={{ margin: "10px 0 0" }}>{TARGET_LOCALE_LABELS[locale]}</h3>
                  <p style={styles.stat}>{summary.coverage}%</p>
                  <p style={styles.tiny}>Fresh and reviewed: {summary.fresh} / {summary.total}</p>
                  <p style={styles.tiny}>Grace: {summary.grace} · Expired: {summary.expired}</p>
                  <p style={styles.tiny}>Missing: {summary.missing} · Disabled: {summary.disabled} · Review: {summary.pendingReview}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Release controls</h2>
          <p style={styles.tiny}>These switches affect localized routes only. They never alter English documents or English publishing.</p>
          <div style={{ ...styles.grid, marginTop: 16 }}>
            <label style={styles.label}>
              <span>Active baseline ID</span>
              <input
                style={styles.input}
                value={config.activeBaselineId}
                placeholder={BASELINE_ID}
                readOnly
              />
              <small style={styles.tiny}>Read-only here. Use the guarded activation step after publishing all three languages.</small>
            </label>
            <label style={{ ...styles.label, alignContent: "center" }}>
              <span><input type="checkbox" checked={config.enabled} onChange={(event) => setConfig((current) => ({ ...current, enabled: event.target.checked }))} /> Enable localization master switch</span>
              <small style={styles.tiny}>Keep off until all launch checks pass.</small>
            </label>
          </div>
          <div style={{ ...styles.row, marginTop: 14 }}>
            {TARGET_LOCALES.map((locale) => {
              const key = localeConfigKey(locale);
              return (
                <label key={locale} style={{ ...styles.label, display: "flex", gridTemplateColumns: "auto 1fr", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={config.locales[key]}
                    onChange={(event) => setConfig((current) => ({
                      ...current,
                      locales: { ...current.locales, [key]: event.target.checked },
                    }))}
                  />
                  {TARGET_LOCALE_LABELS[locale]}
                </label>
              );
            })}
            <span style={styles.badge}>Grace period: 30 days</span>
          </div>
          <button type="button" style={{ ...styles.button, marginTop: 16, ...(busy ? styles.disabledButton : {}) }} disabled={busy} onClick={() => void saveConfiguration()}>
            Save configuration
          </button>
        </section>

        <section style={styles.section}>
          <div style={{ ...styles.row, justifyContent: "space-between" }}>
            <div>
              <h2 style={styles.sectionTitle}>Block health and emergency controls</h2>
              <p style={styles.tiny}>
                Inspect baseline <strong>{inspectedBaselineId || "not selected"}</strong>. Disabling or restoring a block updates only matching translationBundle entries, including any matching draft.
              </p>
            </div>
            <label style={{ ...styles.label, minWidth: 220 }}>
              <span>Language</span>
              <select
                style={styles.input}
                value={blockLocale}
                onChange={(event) => setBlockLocale(event.target.value as TargetLocale)}
              >
                {TARGET_LOCALES.map((locale) => (
                  <option key={locale} value={locale}>{TARGET_LOCALE_LABELS[locale]}</option>
                ))}
              </select>
            </label>
          </div>
          <div style={{ ...styles.tableWrap, marginTop: 16 }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.cell}>Block</th>
                  <th style={styles.cell}>Type</th>
                  <th style={styles.cell}>Status</th>
                  <th style={styles.cell}>Reason</th>
                  <th style={styles.cell}>Action</th>
                </tr>
              </thead>
              <tbody>
                {blockHealth.map((block) => (
                  <tr key={block.blockId}>
                    <td style={{ ...styles.cell, fontFamily: "ui-monospace, monospace" }}>
                      {block.blockId}
                      <div style={styles.tiny}>{block.storedEntryCount} / {block.entryCount} stored entries</div>
                    </td>
                    <td style={styles.cell}>{block.critical ? "Critical" : "Ordinary"}</td>
                    <td style={styles.cell}><span style={styles.badge}>{block.status}</span></td>
                    <td style={styles.cell}>{block.reason}</td>
                    <td style={styles.cell}>
                      <button
                        type="button"
                        style={{
                          ...(block.status === "disabled" ? styles.secondaryButton : styles.button),
                          padding: "7px 10px",
                          ...((busy || !block.canToggle) ? styles.disabledButton : {}),
                        }}
                        disabled={busy || !block.canToggle}
                        onClick={() => void setBlockDisabled(block.blockId, block.status !== "disabled")}
                      >
                        {block.status === "disabled" ? "Restore block" : "Disable block"}
                      </button>
                    </td>
                  </tr>
                ))}
                {!blockHealth.length && (
                  <tr><td style={styles.cell} colSpan={5}>No current blocks are available for this baseline.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Export English source JSON</h2>
          <p style={styles.tiny}>Full export contains every current string. Delta export contains missing, changed, or disabled translations for each locale.</p>
          <p style={styles.tiny}>A new baseline is versioned separately. Its first delta export will therefore contain every current string; the active baseline remains available until explicit activation.</p>
          <div style={{ ...styles.card, marginTop: 14 }}>
            <strong>Initial launch: bundled, pretranslated V1</strong>
            <p style={{ ...styles.tiny, marginTop: 6 }}>
              Creates isolated, unreviewed Sanity drafts for French, Traditional Chinese, and Japanese from the V1 copy included with this project. No AI or translation API is called, and English documents are untouched.
            </p>
            <button
              type="button"
              style={{ ...styles.secondaryButton, marginTop: 12, ...((loading || busy) ? styles.disabledButton : {}) }}
              disabled={loading || busy}
              onClick={() => void seedBundledV1Drafts()}
            >
              Create bundled V1 drafts
            </button>
          </div>
          <div style={{ ...styles.grid, marginTop: 16 }}>
            <label style={styles.label}>
              <span>Export mode</span>
              <select style={styles.input} value={mode} onChange={(event) => setMode(event.target.value as ExportMode)}>
                <option value="full">Full baseline</option>
                <option value="delta">Changed strings only</option>
              </select>
            </label>
            <label style={styles.label}>
              <span>Working / candidate baseline ID</span>
              <input style={styles.input} value={baselineId} onChange={(event) => setBaselineId(event.target.value)} />
            </label>
          </div>
          <div style={{ ...styles.row, marginTop: 14 }}>
            {TARGET_LOCALES.map((locale) => (
              <button key={locale} type="button" style={styles.secondaryButton} disabled={loading} onClick={() => exportForLocale(locale)}>
                Export {locale}
              </button>
            ))}
            <button type="button" style={styles.button} disabled={loading} onClick={exportAll}>Export all 3 files</button>
          </div>
        </section>

        <section style={styles.section}>
          <div style={{ ...styles.row, justifyContent: "space-between" }}>
            <div>
              <h2 style={styles.sectionTitle}>2. Translate with the fixed prompt</h2>
              <p style={styles.tiny}>The website does not call an AI API. Copy this prompt and attach one exported file in the browser service chosen by the customer.</p>
            </div>
            <button type="button" style={styles.secondaryButton} onClick={() => void copyPrompt()}>Copy prompt</button>
          </div>
          <textarea readOnly value={TRANSLATION_PROMPT} style={{ ...styles.input, minHeight: 230, marginTop: 14, resize: "vertical", fontFamily: "ui-monospace, monospace", fontSize: 12 }} />
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Validate and save import drafts</h2>
          <p style={styles.tiny}>The importer blocks changed keys or hashes, empty translations, placeholder changes, and unsafe or mismatched HTML.</p>
          <input type="file" accept="application/json,.json" onChange={(event) => void readImportFile(event)} style={{ marginTop: 14 }} />

          {importPreview && (
            <div style={{ marginTop: 16 }}>
              <p><strong>{importPreview.fileName}</strong>{importPreview.exchange ? ` · ${importPreview.exchange.targetLocale} · ${importPreview.exchange.entries.length} entries` : ""}</p>
              {importPreview.issues.length === 0 ? (
                <div style={styles.success}>No validation issues found.</div>
              ) : (
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead><tr><th style={styles.cell}>Severity</th><th style={styles.cell}>Key</th><th style={styles.cell}>Issue</th></tr></thead>
                    <tbody>
                      {importPreview.issues.slice(0, 250).map((issue, index) => (
                        <tr key={`${issue.key || "file"}-${index}`}>
                          <td style={styles.cell}>{issue.severity}</td>
                          <td style={{ ...styles.cell, fontFamily: "ui-monospace, monospace" }}>{issue.key || "File"}</td>
                          <td style={styles.cell}>{issue.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <button
                type="button"
                style={{ ...styles.button, marginTop: 14, ...((blockingImportErrors || busy) ? styles.disabledButton : {}) }}
                disabled={blockingImportErrors || busy}
                onClick={() => void saveImportDrafts()}
              >
                Save grouped translationBundle drafts
              </button>
            </div>
          )}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Confirm human review and publish</h2>
          <p style={styles.tiny}>{savedDraftIds.length ? `${savedDraftIds.length} imported bundle draft(s) are ready for review.` : "Import and save a valid file first."} Publishing never changes the active baseline.</p>
          {savedDraftIds.length > 0 && (
            <>
              <details style={{ marginTop: 12 }}><summary>Draft document IDs</summary><ul>{savedDraftIds.map((id) => <li key={id}><code>{id}</code></li>)}</ul></details>
              <label style={{ ...styles.label, display: "flex", gridTemplateColumns: "auto 1fr", alignItems: "start", marginTop: 14 }}>
                <input type="checkbox" checked={reviewConfirmed} onChange={(event) => setReviewConfirmed(event.target.checked)} />
                I confirm that a qualified human reviewer checked this locale for meaning, tone, placeholders, layout length, and brand terminology.
              </label>
              <button
                type="button"
                style={{ ...styles.button, marginTop: 14, ...((!reviewConfirmed || busy) ? styles.disabledButton : {}) }}
                disabled={!reviewConfirmed || busy}
                onClick={() => void publishReviewedDrafts()}
              >
                Mark reviewed and publish bundles
              </button>
            </>
          )}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Validate and activate a complete baseline</h2>
          <p style={styles.tiny}>
            Candidate: <strong>{candidateBaselineId || "not selected"}</strong>. Activation is available only when all current source entries are published, current-hash, reviewed, enabled, and unique in all three languages. Older baseline documents are retained for rollback.
          </p>
          <div style={{ ...styles.grid, marginTop: 16 }}>
            {candidateReadiness.map((readiness) => (
              <article key={readiness.locale} style={styles.card}>
                <div style={{ ...styles.row, justifyContent: "space-between" }}>
                  <strong>{TARGET_LOCALE_LABELS[readiness.locale]}</strong>
                  <span style={styles.badge}>{readiness.complete ? "READY" : "BLOCKED"}</span>
                </div>
                <p style={{ ...styles.stat, fontSize: 22 }}>{readiness.ready} / {readiness.total}</p>
                <p style={styles.tiny}>Current, reviewed, enabled entries</p>
                <p style={{ ...styles.tiny, marginTop: 8 }}>
                  Missing: {readiness.missing} · Invalid: {readiness.invalid} · Disabled: {readiness.disabled} · Review: {readiness.pendingReview} · Stale: {readiness.stale}
                </p>
                <p style={styles.tiny}>
                  Duplicate keys: {readiness.duplicateKeys} · Conflicting sources: {readiness.conflictingSources} · Schema mismatch bundles: {readiness.schemaMismatch}
                </p>
              </article>
            ))}
          </div>
          <button
            type="button"
            style={{ ...styles.button, marginTop: 16, ...((busy || !candidateCanActivate) ? styles.disabledButton : {}) }}
            disabled={busy || !candidateCanActivate}
            onClick={() => void activateCandidateBaseline()}
          >
            Activate complete baseline
          </button>
          {!candidateCanActivate && (
            <p style={{ ...styles.tiny, marginTop: 8 }}>Activation remains locked until every card is READY.</p>
          )}
        </section>
      </div>
    </main>
  );
}
