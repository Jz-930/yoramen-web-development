import "server-only";

import { createHash } from "node:crypto";
import { cache } from "react";
import { client } from "@/sanity/client";
import {
  UI_CATALOG_SOURCE_STRINGS,
  UI_CATALOG_UPDATED_AT,
} from "@/sanity/localization/catalog";
import { extractSourceEntries } from "@/sanity/localization/extract";
import { PUBLISHED_LOCALIZATION_SOURCE_QUERY } from "@/sanity/localization/source-query";
import {
  SOURCE_DOCUMENT_TYPES,
  type SourceDocument,
  type SourceEntry,
} from "@/sanity/localization/types";
import { baselineText, hasBaselineTranslation } from "./baseline";
import { decidePageFallback } from "./fallback";
import { isSha256Hex, normalizeSourceText } from "./hash";
import {
  SOURCE_LOCALE,
  type SupportedLocale,
  type TargetLocale,
} from "./locales";
import {
  getLocaleGate,
  globalTranslationBlockId,
  globalTranslationKey,
  loadCombinedTranslationBundleResult,
} from "./sanity";
import type {
  FallbackBlockSets,
  PageFallbackDecision,
  TranslationBundle,
} from "./types";

export type ServerTextTranslator = {
  locale: SupportedLocale;
  text: (source: string) => string;
  deep: <T>(value: T) => T;
  remoteBundleLoaded: boolean;
  pageDecision: (englishPathname: string) => PageFallbackDecision;
};

type RuntimeEntryDecision = {
  sourceEntry: SourceEntry;
  globalBlockId: string;
  normalizedSource: string;
  available: boolean;
  value?: string;
};

type RuntimeBlockHealth = {
  blockId: string;
  critical: boolean;
  unavailable: boolean;
  uiCatalog: boolean;
  uiBlockId?: string;
  sourceBlockIds: Set<string>;
  sourceDocumentTypes: Set<string>;
};

function hashSourceTextSync(source: string): string {
  return createHash("sha256").update(normalizeSourceText(source), "utf8").digest("hex");
}

function hasPositionDerivedKey(key: string): boolean {
  return /\[\d+\](?:\.|$)/.test(key);
}

const PAGE_DOCUMENT_TYPES: Record<string, ReadonlySet<string>> = {
  "/": new Set(["homePage", "promotion"]),
  "/about": new Set(["aboutPage"]),
  "/contact": new Set(["contactPage"]),
  "/gallery": new Set(["galleryPage"]),
  "/locations": new Set(["location"]),
  "/menu": new Set(["menuPage", "menuCategory", "menuItem"]),
  "/order": new Set(["orderPage"]),
};

const loadRuntimeSourceEntries = cache(async (): Promise<SourceEntry[] | null> => {
  try {
    const documents = await client.fetch<SourceDocument[]>(
      PUBLISHED_LOCALIZATION_SOURCE_QUERY,
      { sourceTypes: [...SOURCE_DOCUMENT_TYPES] },
      { cache: "no-store" },
    );
    if (!Array.isArray(documents)) return null;
    return extractSourceEntries(documents, UI_CATALOG_SOURCE_STRINGS, UI_CATALOG_UPDATED_AT);
  } catch (error) {
    console.warn("Sanity localization source fetch failed. Falling back to English.", error);
    return null;
  }
});

function isBuiltinPreviewEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_I18N_ENABLED === "true" &&
    process.env.I18N_BUILTIN_PREVIEW === "true"
  );
}

function deepTranslate<T>(value: T, translate: (source: string) => string): T {
  if (typeof value === "string") return translate(value) as T;
  if (Array.isArray(value)) return value.map((item) => deepTranslate(item, translate)) as T;
  if (!value || typeof value !== "object") return value;

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return value;

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [
      key,
      deepTranslate(nestedValue, translate),
    ]),
  ) as T;
}

function normalizedEnglishPathname(pathname: string): string {
  const withoutQuery = pathname.split(/[?#]/, 1)[0] || "/";
  if (withoutQuery === "/") return "/";
  return withoutQuery.replace(/\/+$/, "") || "/";
}

function blockAppliesToPage(block: RuntimeBlockHealth, englishPathname: string): boolean {
  const pathname = normalizedEnglishPathname(englishPathname);

  if (block.uiCatalog) {
    if (block.uiBlockId?.startsWith("uiCatalog.home.")) return pathname === "/";
    if (block.uiBlockId?.startsWith("uiCatalog.about.")) return pathname === "/about";
    if (block.uiBlockId?.startsWith("uiCatalog.contact.")) return pathname === "/contact";
    if (block.uiBlockId?.startsWith("uiCatalog.gallery.")) return pathname === "/gallery";
    if (block.uiBlockId?.startsWith("uiCatalog.locations.")) return pathname === "/locations";
    if (block.uiBlockId?.startsWith("uiCatalog.menu.")) return pathname === "/menu";
    if (block.uiBlockId?.startsWith("uiCatalog.order.")) return pathname === "/order";
    return true;
  }

  if (block.sourceDocumentTypes.has("siteSettings")) {
    const onlyDefaultSeo =
      block.sourceBlockIds.size > 0 &&
      [...block.sourceBlockIds].every((blockId) => blockId === "siteSettings.defaultSeo");
    return onlyDefaultSeo ? pathname === "/" : true;
  }
  const pageTypes = PAGE_DOCUMENT_TYPES[pathname];
  if (!pageTypes || block.sourceDocumentTypes.size === 0) return true;
  return [...block.sourceDocumentTypes].some((documentType) => pageTypes.has(documentType));
}

function fallbackSetsForPage(
  blocks: readonly RuntimeBlockHealth[],
  englishPathname: string,
): FallbackBlockSets {
  const unavailable = blocks.filter(
    (block) => block.unavailable && blockAppliesToPage(block, englishPathname),
  );
  return {
    all: unavailable.map((block) => block.blockId),
    critical: unavailable.filter((block) => block.critical).map((block) => block.blockId),
    ordinary: unavailable.filter((block) => !block.critical).map((block) => block.blockId),
  };
}

function unavailableRuntimeDecision(): PageFallbackDecision {
  return decidePageFallback({
    all: ["runtime.translation-data"],
    critical: ["runtime.translation-data"],
    ordinary: [],
  });
}

function resolveRuntimeEntry(
  locale: TargetLocale,
  sourceEntry: SourceEntry,
  bundle: TranslationBundle | null,
  gracePeriodMs: number,
  now: number,
): RuntimeEntryDecision {
  const scope = sourceEntry.uiCatalog
    ? { uiCatalog: true }
    : { sourceDocumentId: sourceEntry.sourceDocumentId };
  const globalKey = globalTranslationKey(scope, sourceEntry.key);
  const globalBlockId =
    globalTranslationBlockId(scope, sourceEntry.blockId) ??
    `runtime.invalid-source:${sourceEntry.key}`;
  const normalizedSource = normalizeSourceText(sourceEntry.source);

  if (!globalKey) {
    return { sourceEntry, globalBlockId, normalizedSource, available: false };
  }

  const storedEntry = bundle?.entries.find((entry) => entry.key === globalKey);
  if (!storedEntry) {
    if (!hasBaselineTranslation(locale, sourceEntry.source)) {
      return { sourceEntry, globalBlockId, normalizedSource, available: false };
    }
    return {
      sourceEntry,
      globalBlockId,
      normalizedSource,
      available: true,
      value: baselineText(locale, sourceEntry.source),
    };
  }

  if (
    storedEntry.blockId !== globalBlockId ||
    storedEntry.critical !== sourceEntry.critical ||
    storedEntry.disabled === true ||
    storedEntry.reviewed !== true ||
    typeof storedEntry.value !== "string" ||
    storedEntry.value.trim().length === 0 ||
    !isSha256Hex(storedEntry.sourceHash)
  ) {
    return { sourceEntry, globalBlockId, normalizedSource, available: false };
  }

  const currentHash = hashSourceTextSync(sourceEntry.source);
  if (storedEntry.sourceHash.toLowerCase() === currentHash) {
    return {
      sourceEntry,
      globalBlockId,
      normalizedSource,
      available: true,
      value: storedEntry.value,
    };
  }

  // Primitive Sanity arrays have index-based keys. After an insertion, the
  // old value at that index may belong to completely different source text.
  if (hasPositionDerivedKey(sourceEntry.key)) {
    return { sourceEntry, globalBlockId, normalizedSource, available: false };
  }

  const staleSince = Date.parse(sourceEntry.sourceUpdatedAt);
  const elapsed = Number.isFinite(staleSince) ? Math.max(0, now - staleSince) : Number.POSITIVE_INFINITY;
  if (elapsed <= gracePeriodMs) {
    return {
      sourceEntry,
      globalBlockId,
      normalizedSource,
      available: true,
      value: storedEntry.value,
    };
  }

  return { sourceEntry, globalBlockId, normalizedSource, available: false };
}

function resolveAmbiguousSources(decisions: RuntimeEntryDecision[]): void {
  const sourceGroups = new Map<string, RuntimeEntryDecision[]>();
  for (const decision of decisions) {
    sourceGroups.set(decision.normalizedSource, [
      ...(sourceGroups.get(decision.normalizedSource) ?? []),
      decision,
    ]);
  }

  for (const sourceDecisions of sourceGroups.values()) {
    const values = new Set(
      sourceDecisions
        .filter((decision) => decision.available && decision.value !== undefined)
        .map((decision) => decision.value as string),
    );
    if (sourceDecisions.some((decision) => !decision.available) || values.size !== 1) {
      sourceDecisions.forEach((decision) => {
        decision.available = false;
        delete decision.value;
      });
    }
  }
}

function aggregateRuntimeBlocks(decisions: readonly RuntimeEntryDecision[]): RuntimeBlockHealth[] {
  const blocks = new Map<string, RuntimeBlockHealth>();

  for (const decision of decisions) {
    const { sourceEntry, globalBlockId } = decision;
    const block = blocks.get(globalBlockId) ?? {
      blockId: globalBlockId,
      critical: false,
      unavailable: false,
      uiCatalog: sourceEntry.uiCatalog,
      ...(sourceEntry.uiCatalog ? { uiBlockId: sourceEntry.blockId } : {}),
      sourceBlockIds: new Set<string>(),
      sourceDocumentTypes: new Set<string>(),
    };
    block.critical ||= sourceEntry.critical;
    block.unavailable ||= !decision.available;
    block.sourceBlockIds.add(sourceEntry.blockId);
    if (sourceEntry.sourceDocumentType) {
      block.sourceDocumentTypes.add(sourceEntry.sourceDocumentType);
    }
    blocks.set(globalBlockId, block);
  }

  return [...blocks.values()].sort((left, right) => left.blockId.localeCompare(right.blockId));
}

/**
 * Loads one request-scoped runtime view of translations. Reviewed Sanity
 * entries override the bundled V1 copy. A failure anywhere inside a block
 * makes that whole block English; route wrappers then apply the page-level
 * redirect policy before localized content is rendered.
 */
async function buildServerTextTranslator(
  locale: SupportedLocale,
): Promise<ServerTextTranslator> {
  if (locale === SOURCE_LOCALE) {
    return {
      locale,
      text: (source) => source,
      deep: <T>(value: T) => value,
      remoteBundleLoaded: false,
      pageDecision: () => ({ action: "render-localized", blockIds: [] }),
    };
  }

  const gate = await getLocaleGate(locale);
  if (!gate.allowed || gate.mode !== "localized") {
    const text = (source: string) => baselineText(locale, source);
    return {
      locale,
      text,
      deep: <T>(value: T) => deepTranslate(value, text),
      remoteBundleLoaded: false,
      pageDecision: unavailableRuntimeDecision,
    };
  }

  const previewCanUseBundledCopy = isBuiltinPreviewEnabled();
  const sourceEntries = previewCanUseBundledCopy ? [] : await loadRuntimeSourceEntries();
  const currentSourceDocumentIds = [
    ...new Set(
      (sourceEntries ?? [])
        .map((entry) => entry.sourceDocumentId)
        .filter((documentId): documentId is string => Boolean(documentId)),
    ),
  ];
  const bundleResult = previewCanUseBundledCopy
    ? { status: "loaded" as const, bundle: null }
    : await loadCombinedTranslationBundleResult({
        locale,
        baselineId: gate.baselineId,
        selection: {
          sourceDocumentIds: currentSourceDocumentIds,
          includeUiCatalog: true,
        },
      });
  const translationDataAvailable =
    bundleResult.status === "loaded" && (sourceEntries !== null || previewCanUseBundledCopy);
  const bundle = bundleResult.bundle;
  const decisions = (sourceEntries ?? []).map((sourceEntry) =>
    resolveRuntimeEntry(
      locale,
      sourceEntry,
      bundle,
      gate.graceDays * 24 * 60 * 60 * 1000,
      Date.now(),
    ),
  );
  resolveAmbiguousSources(decisions);

  const blocks = aggregateRuntimeBlocks(decisions);
  const unavailableBlockIds = new Set(
    blocks.filter((block) => block.unavailable).map((block) => block.blockId),
  );
  const blockedSources = new Set(
    decisions
      .filter((decision) => unavailableBlockIds.has(decision.globalBlockId))
      .map((decision) => decision.normalizedSource),
  );
  const translatedBySource = new Map<string, string>();
  for (const decision of decisions) {
    if (
      decision.available &&
      decision.value !== undefined &&
      !blockedSources.has(decision.normalizedSource)
    ) {
      translatedBySource.set(decision.normalizedSource, decision.value);
    }
  }

  const text = (source: string): string => {
    const normalizedSource = normalizeSourceText(source);
    if (blockedSources.has(normalizedSource)) return source;
    const keyedTranslation = translatedBySource.get(normalizedSource);
    if (keyedTranslation !== undefined) return keyedTranslation;

    return baselineText(locale, source);
  };

  return {
    locale,
    text,
    deep: <T>(value: T) => deepTranslate(value, text),
    remoteBundleLoaded: bundle !== null,
    pageDecision: (englishPathname) =>
      translationDataAvailable
        ? decidePageFallback(fallbackSetsForPage(blocks, englishPathname))
        : unavailableRuntimeDecision(),
  };
}

export const createServerTextTranslator = cache(buildServerTextTranslator);

export async function getPageTranslationDecision(
  locale: SupportedLocale,
  englishPathname: string,
): Promise<PageFallbackDecision> {
  return (await createServerTextTranslator(locale)).pageDecision(englishPathname);
}
