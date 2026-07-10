import { decidePageFallback } from "./fallback";
import { hashSourceText, isSha256Hex, normalizeSourceText } from "./hash";
import { SOURCE_LOCALE } from "./locales";
import {
  DEFAULT_TRANSLATION_GRACE_PERIOD_MS,
  TRANSLATION_BUNDLE_SCHEMA_VERSION,
  type BundleHealth,
  type FallbackBlockSets,
  type ResolveTranslationOptions,
  type ResolvedBlockHealth,
  type ResolvedEntryHealth,
  type SourceTextEntry,
  type TranslationBundle,
  type TranslationHealthStatus,
  type TranslationPathSegment,
  type TranslationResolution,
  type TranslationUnavailableReason,
} from "./types";

type ResolvedCandidate = {
  source: SourceTextEntry;
  health: ResolvedEntryHealth;
  translation?: string;
};

type MutableBlock = {
  blockId: string;
  critical: boolean;
  status: TranslationHealthStatus;
  entryKeys: string[];
  unavailableEntryKeys: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function countKeys(values: readonly SourceTextEntry[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value.key, (counts.get(value.key) ?? 0) + 1);
  return counts;
}

function hasValidPath(path: readonly TranslationPathSegment[]): boolean {
  return (
    path.length > 0 &&
    path.every(
      (segment) =>
        (typeof segment === "string" && segment.length > 0) ||
        (typeof segment === "number" && Number.isSafeInteger(segment) && segment >= 0),
    )
  );
}

function readPath(root: unknown, path: readonly TranslationPathSegment[]): unknown {
  let value = root;

  for (const segment of path) {
    if (typeof segment === "number") {
      if (!Array.isArray(value) || segment >= value.length) return undefined;
      value = value[segment];
      continue;
    }

    if (!isRecord(value) || !Object.prototype.hasOwnProperty.call(value, segment)) return undefined;
    value = value[segment];
  }

  return value;
}

function setPathImmutable<T>(
  root: T,
  path: readonly TranslationPathSegment[],
  translatedValue: string,
): T {
  function visit(value: unknown, index: number): unknown {
    if (index === path.length) return translatedValue;

    const segment = path[index];
    if (typeof segment === "number") {
      if (!Array.isArray(value) || segment >= value.length) return value;
      const copy = value.slice();
      copy[segment] = visit(copy[segment], index + 1);
      return copy;
    }

    if (!isRecord(value) || !Object.prototype.hasOwnProperty.call(value, segment)) return value;
    return { ...value, [segment]: visit(value[segment], index + 1) };
  }

  return visit(root, 0) as T;
}

function validateBundle(
  bundle: TranslationBundle | null | undefined,
  locale: ResolveTranslationOptions<unknown>["locale"],
  expectedSchemaVersion: number,
  expectedBaselineId?: string,
): BundleHealth {
  if (!bundle) return { status: "missing" };
  if (!isRecord(bundle) || !Array.isArray(bundle.entries)) {
    return { status: "invalid", reason: "malformed" };
  }
  if (bundle.schemaVersion !== expectedSchemaVersion) {
    return { status: "invalid", reason: "schema-version-mismatch" };
  }
  if (bundle.sourceLocale !== SOURCE_LOCALE) {
    return { status: "invalid", reason: "source-locale-mismatch" };
  }
  if (bundle.locale !== locale) {
    return { status: "invalid", reason: "locale-mismatch" };
  }
  if (expectedBaselineId !== undefined && bundle.baselineId !== expectedBaselineId) {
    return { status: "invalid", reason: "baseline-mismatch" };
  }

  const keys = new Set<string>();
  for (const entry of bundle.entries) {
    if (!isRecord(entry) || typeof entry.key !== "string") {
      return { status: "invalid", reason: "malformed" };
    }
    if (keys.has(entry.key)) {
      return { status: "invalid", reason: "duplicate-entry-key" };
    }
    keys.add(entry.key);
  }

  return { status: "valid" };
}

function unavailableHealth(
  source: SourceTextEntry,
  reason: TranslationUnavailableReason,
  extra: Partial<ResolvedEntryHealth> = {},
): ResolvedEntryHealth {
  return {
    key: source.key,
    blockId: source.blockId,
    critical: source.critical,
    status: "unavailable",
    unavailableReason: reason,
    translationApplied: false,
    ...extra,
  };
}

function parseTimestamp(value: string | undefined): number | null {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

async function resolveCandidate(
  englishData: unknown,
  source: SourceTextEntry,
  sourceKeyCount: number,
  bundle: TranslationBundle | null | undefined,
  bundleHealth: BundleHealth,
  now: number,
  gracePeriodMs: number,
): Promise<ResolvedCandidate> {
  if (
    typeof source.key !== "string" ||
    source.key.length === 0 ||
    typeof source.blockId !== "string" ||
    source.blockId.length === 0 ||
    typeof source.source !== "string" ||
    typeof source.critical !== "boolean"
  ) {
    return { source, health: unavailableHealth(source, "invalid-source-definition") };
  }

  if (sourceKeyCount > 1) {
    return { source, health: unavailableHealth(source, "duplicate-source-key") };
  }

  if (!hasValidPath(source.path)) {
    return { source, health: unavailableHealth(source, "invalid-source-path") };
  }

  const currentValue = readPath(englishData, source.path);
  if (typeof currentValue !== "string") {
    return { source, health: unavailableHealth(source, "invalid-source-path") };
  }
  if (normalizeSourceText(currentValue) !== normalizeSourceText(source.source)) {
    return { source, health: unavailableHealth(source, "source-value-mismatch") };
  }

  if (bundleHealth.status === "missing") {
    return { source, health: unavailableHealth(source, "bundle-missing") };
  }
  if (bundleHealth.status === "invalid" || !bundle) {
    return { source, health: unavailableHealth(source, "bundle-invalid") };
  }

  const entry = bundle.entries.find((candidate) => candidate.key === source.key);
  if (!entry) return { source, health: unavailableHealth(source, "entry-missing") };
  if (entry.blockId !== source.blockId) {
    return { source, health: unavailableHealth(source, "block-mismatch") };
  }
  if (entry.critical !== source.critical) {
    return { source, health: unavailableHealth(source, "criticality-mismatch") };
  }
  if (entry.disabled === true) {
    return { source, health: unavailableHealth(source, "disabled") };
  }
  if (entry.reviewed !== true) {
    return { source, health: unavailableHealth(source, "unreviewed") };
  }
  if (typeof entry.value !== "string" || entry.value.trim().length === 0) {
    return { source, health: unavailableHealth(source, "empty-translation") };
  }
  if (!isSha256Hex(entry.sourceHash)) {
    return { source, health: unavailableHealth(source, "invalid-source-hash") };
  }

  const currentSourceHash = await hashSourceText(source.source);
  if (entry.sourceHash.toLowerCase() === currentSourceHash) {
    return {
      source,
      translation: entry.value,
      health: {
        key: source.key,
        blockId: source.blockId,
        critical: source.critical,
        status: "fresh",
        currentSourceHash,
        translatedSourceHash: entry.sourceHash.toLowerCase(),
        translationApplied: true,
      },
    };
  }

  // A numeric path segment is position-derived. If an array item is inserted
  // or reordered, the previous translation at this position is unsafe.
  if (source.path.some((segment) => typeof segment === "number")) {
    return {
      source,
      health: unavailableHealth(source, "stale", {
        currentSourceHash,
        translatedSourceHash: entry.sourceHash.toLowerCase(),
      }),
    };
  }

  const staleSinceValue = source.sourceUpdatedAt ?? bundle.sourceUpdatedAt;
  const staleSince = parseTimestamp(staleSinceValue);
  if (staleSince === null) {
    return {
      source,
      health: unavailableHealth(source, "invalid-source-updated-at", {
        currentSourceHash,
        translatedSourceHash: entry.sourceHash.toLowerCase(),
      }),
    };
  }

  const elapsed = Math.max(0, now - staleSince);
  if (elapsed <= gracePeriodMs) {
    return {
      source,
      translation: entry.value,
      health: {
        key: source.key,
        blockId: source.blockId,
        critical: source.critical,
        status: "grace",
        currentSourceHash,
        translatedSourceHash: entry.sourceHash.toLowerCase(),
        staleSince: new Date(staleSince).toISOString(),
        translationApplied: true,
      },
    };
  }

  return {
    source,
    health: unavailableHealth(source, "stale", {
      currentSourceHash,
      translatedSourceHash: entry.sourceHash.toLowerCase(),
      staleSince: new Date(staleSince).toISOString(),
    }),
  };
}

function aggregateBlocks(candidates: readonly ResolvedCandidate[]): ResolvedBlockHealth[] {
  const blocks = new Map<string, MutableBlock>();

  for (const candidate of candidates) {
    const { source, health } = candidate;
    const block = blocks.get(source.blockId) ?? {
      blockId: source.blockId,
      critical: false,
      status: "fresh" as const,
      entryKeys: [],
      unavailableEntryKeys: [],
    };

    block.critical ||= source.critical;
    block.entryKeys.push(source.key);
    if (health.status === "unavailable") {
      block.status = "unavailable";
      block.unavailableEntryKeys.push(source.key);
    } else if (health.status === "grace" && block.status === "fresh") {
      block.status = "grace";
    }
    blocks.set(source.blockId, block);
  }

  return [...blocks.values()]
    .sort((left, right) => left.blockId.localeCompare(right.blockId))
    .map((block) => ({
      ...block,
      entryKeys: uniqueSorted(block.entryKeys),
      unavailableEntryKeys: uniqueSorted(block.unavailableEntryKeys),
      fallbackToEnglish: block.status === "unavailable",
    }));
}

function fallbackBlockSets(blocks: readonly ResolvedBlockHealth[]): FallbackBlockSets {
  const unavailable = blocks.filter((block) => block.status === "unavailable");
  return {
    all: unavailable.map((block) => block.blockId),
    critical: unavailable.filter((block) => block.critical).map((block) => block.blockId),
    ordinary: unavailable.filter((block) => !block.critical).map((block) => block.blockId),
  };
}

/**
 * Overlays healthy translated text without mutating the English source object.
 * If one entry in a block is unavailable, the resolver leaves the whole block
 * in English so a partially translated block can never be rendered.
 */
export async function resolveTranslation<T>(
  options: ResolveTranslationOptions<T>,
): Promise<TranslationResolution<T>> {
  const expectedSchemaVersion =
    options.expectedSchemaVersion ?? TRANSLATION_BUNDLE_SCHEMA_VERSION;
  const gracePeriodMs = options.gracePeriodMs ?? DEFAULT_TRANSLATION_GRACE_PERIOD_MS;
  if (!Number.isFinite(gracePeriodMs) || gracePeriodMs < 0) {
    throw new RangeError("gracePeriodMs must be a finite, non-negative number.");
  }

  const now = options.now instanceof Date ? options.now.getTime() : (options.now ?? Date.now());
  if (!Number.isFinite(now)) throw new RangeError("now must be a valid Date or timestamp.");

  const bundleHealth = validateBundle(
    options.bundle,
    options.locale,
    expectedSchemaVersion,
    options.expectedBaselineId,
  );
  const sourceKeyCounts = countKeys(options.sourceEntries);
  const candidates = await Promise.all(
    options.sourceEntries.map((source) =>
      resolveCandidate(
        options.englishData,
        source,
        sourceKeyCounts.get(source.key) ?? 0,
        options.bundle,
        bundleHealth,
        now,
        gracePeriodMs,
      ),
    ),
  );

  const blocks = aggregateBlocks(candidates);
  const unavailableBlockIds = new Set(
    blocks.filter((block) => block.status === "unavailable").map((block) => block.blockId),
  );

  let data = options.englishData;
  const entries = candidates.map((candidate) => {
    const blockFallsBack = unavailableBlockIds.has(candidate.source.blockId);
    if (!blockFallsBack && candidate.translation !== undefined) {
      data = setPathImmutable(data, candidate.source.path, candidate.translation);
    }
    return blockFallsBack && candidate.health.translationApplied
      ? { ...candidate.health, translationApplied: false }
      : candidate.health;
  });

  const fallbackBlocks = fallbackBlockSets(blocks);
  const health: TranslationHealthStatus =
    fallbackBlocks.all.length > 0
      ? "unavailable"
      : blocks.some((block) => block.status === "grace")
        ? "grace"
        : "fresh";

  return {
    data,
    health,
    bundleHealth,
    entries,
    blocks,
    fallbackBlocks,
    decision: decidePageFallback(fallbackBlocks),
  };
}
