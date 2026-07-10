import type {
  ExchangeEntry,
  ImportIssue,
  SourceDocument,
  SourceEntry,
  TranslationExchange,
  UiSourceString,
} from "./types";
import { SCHEMA_VERSION, SOURCE_LOCALE, TARGET_LOCALES } from "./types";
import { normalizeSourceText } from "@/i18n/hash";

const SKIPPED_FIELDS = new Set([
  "_id",
  "_type",
  "_key",
  "_ref",
  "_rev",
  "_createdAt",
  "_updatedAt",
  "_weak",
  "_system",
  "base",
  "rev",
  "asset",
  "image",
  "file",
  "slug",
  "crop",
  "hotspot",
  "current",
  "marks",
  "markDefs",
  "style",
  "listItem",
  "level",
  "sortOrder",
  "spiceLevel",
  "aspect",
  "align",
  "address",
  "providerName",
  "startsAt",
  "endsAt",
]);

const SKIPPED_FIELD_PATTERN =
  /(?:^|_)(?:id|url|uri|href|email|phone|telephone|slug|link|file|asset|reference|ref|datetime)(?:$|_)/i;
const URL_PATTERN = /^(?:https?:\/\/|mailto:|tel:|\/|#)/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NUMBER_OR_PRICE_PATTERN = /^[\s\d.,+\-:$%/()]+$/;
const SKIPPED_OBJECT_TYPES = new Set(["image", "file", "reference", "slug"]);
const CRITICAL_PATTERN =
  /(?:^|\.)(?:navigation|primaryCta|hero|header|pageTitle|heading|headline|form|seo|defaultSeo|validation|errorMessage|submitLabel)(?:\.|\[|$)/i;
const COLLECTION_TYPES = new Set(["menuCategory", "menuItem", "promotion", "location"]);

type CandidateEntry = Omit<SourceEntry, "sourceHash">;

export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function shouldSkipObject(value: Record<string, unknown>, fieldName: string): boolean {
  const objectType = typeof value._type === "string" ? value._type : "";

  return (
    SKIPPED_OBJECT_TYPES.has(objectType) ||
    fieldName === "image" ||
    fieldName === "asset" ||
    Boolean(value._ref)
  );
}

function shouldExtractString(fieldName: string, value: string): boolean {
  const normalized = value.trim();
  const normalizedFieldName = fieldName.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();

  if (
    !normalized ||
    SKIPPED_FIELDS.has(fieldName) ||
    SKIPPED_FIELD_PATTERN.test(normalizedFieldName)
  ) {
    return false;
  }

  return (
    !URL_PATTERN.test(normalized) &&
    !EMAIL_PATTERN.test(normalized) &&
    !NUMBER_OR_PRICE_PATTERN.test(normalized)
  );
}

function arraySegment(value: unknown, index: number): string {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const key = (value as Record<string, unknown>)._key;
    if (typeof key === "string" && key) {
      return `[${key}]`;
    }
  }

  return `[${index}]`;
}

function topLevelField(path: string): string {
  return path.split(/[.[]/, 1)[0] || "content";
}

function firstArrayToken(path: string): string {
  const match = path.match(/^[^.[]+\[[^\]]+\]/);
  return match?.[0] || topLevelField(path);
}

function getBlockId(document: SourceDocument, path: string): string {
  if (COLLECTION_TYPES.has(document._type)) {
    return document._id;
  }

  return `${document._id}.${firstArrayToken(path)}`;
}

function isCritical(document: SourceDocument, path: string): boolean {
  if (CRITICAL_PATTERN.test(path)) {
    return true;
  }

  if (document._type === "siteSettings") {
    return /^(?:title|navigation|primaryCta)(?:\.|\[|$)/i.test(path);
  }

  if (document._type === "orderPage") return true;
  if (document._type === "homePage") {
    return /^(?:hero|newsletterSection|seo)(?:\.|\[|$)/i.test(path);
  }
  if (document._type === "contactPage") {
    return /^(?:header|form|seo)(?:\.|\[|$)/i.test(path);
  }
  if (document._type === "galleryPage") {
    return /^(?:header|categories|seo)(?:\.|\[|$)/i.test(path);
  }
  if (document._type === "aboutPage") {
    return /^(?:header|seo)(?:\.|\[|$)/i.test(path);
  }
  if (document._type === "menuPage") {
    return /^(?:eyebrow|title|description|seo)(?:\.|\[|$)/i.test(path);
  }

  return false;
}

function walkValue(
  value: unknown,
  fieldName: string,
  path: string,
  document: SourceDocument,
  output: CandidateEntry[],
): void {
  if (typeof value === "string") {
    if (shouldExtractString(fieldName, value)) {
      const source = normalizeSourceText(value);
      output.push({
        key: `${document._id}.${path}`,
        blockId: getBlockId(document, path),
        critical: isCritical(document, path),
        source,
        context: `${document._type} (${document._id}) > ${path}`,
        sourceDocumentId: document._id,
        sourceDocumentType: document._type,
        sourceUpdatedAt: document._updatedAt,
        uiCatalog: false,
      });
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      walkValue(item, fieldName, `${path}${arraySegment(item, index)}`, document, output);
    });
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  const objectValue = value as Record<string, unknown>;
  if (shouldSkipObject(objectValue, fieldName)) {
    return;
  }

  Object.entries(objectValue).forEach(([childName, childValue]) => {
    if (SKIPPED_FIELDS.has(childName)) {
      return;
    }

    const childPath = path ? `${path}.${childName}` : childName;
    walkValue(childValue, childName, childPath, document, output);
  });
}

export async function extractSourceEntries(
  documents: SourceDocument[],
  uiStrings: UiSourceString[],
  uiUpdatedAt: string,
): Promise<SourceEntry[]> {
  const candidates: CandidateEntry[] = [];

  documents.forEach((document) => {
    Object.entries(document).forEach(([fieldName, value]) => {
      if (SKIPPED_FIELDS.has(fieldName)) {
        return;
      }
      walkValue(value, fieldName, fieldName, document, candidates);
    });
  });

  const seenUiSources = new Set<string>();
  uiStrings.forEach((item) => {
    const source = normalizeSourceText(item.value);
    if (!source || seenUiSources.has(source)) {
      return;
    }

    const stableKey = item.key.startsWith("uiCatalog.") ? item.key : `uiCatalog.${item.key}`;
    candidates.push({
      key: stableKey,
      blockId: item.blockId || `uiCatalog.${item.key.split(".")[0] || "shared"}`,
      critical: item.critical ?? CRITICAL_PATTERN.test(item.key),
      source,
      context: item.context || `Shared UI > ${item.key}`,
      sourceUpdatedAt: uiUpdatedAt,
      uiCatalog: true,
    });
    seenUiSources.add(source);
  });

  const uniqueCandidates = candidates.filter(
    (entry, index, all) => all.findIndex((candidate) => candidate.key === entry.key) === index,
  );
  const entries = await Promise.all(
    uniqueCandidates.map(async (entry) => ({
      ...entry,
      sourceHash: await sha256(entry.source),
    })),
  );

  return entries.sort((left, right) => left.key.localeCompare(right.key));
}

export function extractPlaceholders(value: string): string[] {
  const matches = value.match(/\{\{[^{}]+\}\}|\$\{[^{}]+\}|\{[a-zA-Z_][\w.-]*\}|%(?:\d+\$)?[sdif]/g);
  return (matches || []).sort();
}

function extractHtmlTokens(value: string): string[] {
  return Array.from(value.matchAll(/<\/?([a-z][\w-]*)(?:\s[^<>]*)?\s*\/?>/gi), (match) => {
    const raw = match[0];
    const closing = /^<\//.test(raw) ? "/" : "";
    const selfClosing = /\/>$/.test(raw) ? "/" : "";
    return `${closing}${match[1].toLowerCase()}${selfClosing}`;
  });
}

function validateHtml(source: string, translation: string): string | null {
  if (/<\s*(?:script|style|iframe|object|embed)\b|\son\w+\s*=|javascript\s*:/i.test(translation)) {
    return "Translation contains unsafe HTML.";
  }

  const sourceTokens = extractHtmlTokens(source);
  const translationTokens = extractHtmlTokens(translation);
  if (sourceTokens.join("|") !== translationTokens.join("|")) {
    return "HTML tags must exactly match the source tag sequence.";
  }

  const sourceAngles = (source.match(/[<>]/g) || []).length;
  const translationAngles = (translation.match(/[<>]/g) || []).length;
  return sourceAngles === translationAngles ? null : "Translation contains malformed HTML brackets.";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function validateExchange(
  value: unknown,
  sourceEntries: SourceEntry[],
  expectedDeltaKeys: Set<string>,
): { exchange?: TranslationExchange; issues: ImportIssue[] } {
  const issues: ImportIssue[] = [];
  if (!isRecord(value)) {
    return { issues: [{ severity: "error", message: "The selected file is not a JSON object." }] };
  }

  if (value.schemaVersion !== SCHEMA_VERSION) {
    issues.push({ severity: "error", message: `schemaVersion must be ${SCHEMA_VERSION}.` });
  }
  if (value.sourceLocale !== SOURCE_LOCALE) {
    issues.push({ severity: "error", message: `sourceLocale must be ${SOURCE_LOCALE}.` });
  }
  if (!TARGET_LOCALES.includes(value.targetLocale as (typeof TARGET_LOCALES)[number])) {
    issues.push({ severity: "error", message: "targetLocale is not supported." });
  }
  if (value.mode !== "full" && value.mode !== "delta") {
    issues.push({ severity: "error", message: "mode must be full or delta." });
  }
  if (typeof value.baselineId !== "string" || !value.baselineId.trim()) {
    issues.push({ severity: "error", message: "baselineId is required." });
  }
  if (!Array.isArray(value.entries)) {
    issues.push({ severity: "error", message: "entries must be an array." });
    return { issues };
  }

  const sourceMap = new Map(sourceEntries.map((entry) => [entry.key, entry]));
  const importedKeys = new Set<string>();
  const translationsBySource = new Map<string, Map<string, string[]>>();

  value.entries.forEach((rawEntry, index) => {
    if (!isRecord(rawEntry)) {
      issues.push({ severity: "error", message: `Entry ${index + 1} is not an object.` });
      return;
    }

    const key = typeof rawEntry.key === "string" ? rawEntry.key : "";
    const sourceEntry = sourceMap.get(key);
    if (!key) {
      issues.push({ severity: "error", message: `Entry ${index + 1} has no key.` });
      return;
    }
    if (importedKeys.has(key)) {
      issues.push({ severity: "error", key, message: "Duplicate key in import file." });
      return;
    }
    importedKeys.add(key);

    if (!sourceEntry) {
      issues.push({ severity: "error", key, message: "Key no longer exists in the English source." });
      return;
    }
    if (rawEntry.sourceHash !== sourceEntry.sourceHash) {
      issues.push({ severity: "error", key, message: "Source hash is stale. Export this entry again." });
    }
    if (rawEntry.source !== sourceEntry.source) {
      issues.push({ severity: "error", key, message: "English source text was modified in the import file." });
    }
    if (rawEntry.blockId !== sourceEntry.blockId) {
      issues.push({ severity: "error", key, message: "blockId was changed in the import file." });
    }
    if (rawEntry.critical !== sourceEntry.critical) {
      issues.push({ severity: "error", key, message: "critical was changed in the import file." });
    }
    if (rawEntry.context !== sourceEntry.context) {
      issues.push({ severity: "error", key, message: "context was changed in the import file." });
    }
    if (rawEntry.sourceDocumentId !== sourceEntry.sourceDocumentId) {
      issues.push({ severity: "error", key, message: "sourceDocumentId does not match the key." });
    }
    if (sourceEntry.uiCatalog && rawEntry.uiCatalog !== true) {
      issues.push({ severity: "error", key, message: "The uiCatalog marker was removed or changed." });
    }

    const translation = typeof rawEntry.translation === "string" ? rawEntry.translation : "";
    if (!translation.trim()) {
      issues.push({ severity: "error", key, message: "Translation is empty." });
      return;
    }

    const normalizedSource = normalizeSourceText(sourceEntry.source);
    const sourceTranslations = translationsBySource.get(normalizedSource) ?? new Map<string, string[]>();
    sourceTranslations.set(translation, [...(sourceTranslations.get(translation) ?? []), key]);
    translationsBySource.set(normalizedSource, sourceTranslations);

    const sourcePlaceholders = extractPlaceholders(sourceEntry.source);
    const translationPlaceholders = extractPlaceholders(translation);
    if (sourcePlaceholders.join("|") !== translationPlaceholders.join("|")) {
      issues.push({ severity: "error", key, message: "Placeholders do not match the English source." });
    }

    const htmlError = validateHtml(sourceEntry.source, translation);
    if (htmlError) {
      issues.push({ severity: "error", key, message: htmlError });
    }
  });

  for (const [source, translations] of translationsBySource) {
    if (translations.size <= 1) continue;
    const keys = [...translations.values()].flat();
    issues.push({
      severity: "error",
      key: keys[0],
      message: `The same English source has conflicting translations (${keys.join(", ")}): ${source}`,
    });
  }

  if (value.mode === "full") {
    sourceMap.forEach((_entry, key) => {
      if (!importedKeys.has(key)) {
        issues.push({ severity: "error", key, message: "Full import is missing this current source key." });
      }
    });
  } else {
    expectedDeltaKeys.forEach((key) => {
      if (!importedKeys.has(key)) {
        issues.push({ severity: "error", key, message: "Delta import is missing a key from the current delta export." });
      }
    });
  }

  if (issues.some((issue) => issue.severity === "error")) {
    return { issues };
  }

  return { exchange: value as unknown as TranslationExchange, issues };
}

export function toExchangeEntry(entry: SourceEntry): ExchangeEntry {
  return {
    key: entry.key,
    blockId: entry.blockId,
    critical: entry.critical,
    source: entry.source,
    sourceHash: entry.sourceHash,
    context: entry.context,
    ...(entry.sourceDocumentId ? { sourceDocumentId: entry.sourceDocumentId } : { uiCatalog: true }),
    translation: "",
  };
}
