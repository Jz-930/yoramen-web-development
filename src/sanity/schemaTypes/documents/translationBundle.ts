import { defineArrayMember, defineField, defineType } from "sanity";

const localeOptions = [
  { title: "French (Canada)", value: "fr-CA" },
  { title: "Traditional Chinese", value: "zh-Hant" },
  { title: "Japanese (Japan)", value: "ja-JP" },
];

const localeTitles = Object.fromEntries(
  localeOptions.map(({ title, value }) => [value, title]),
) as Record<string, string>;

export const translationBundleType = defineType({
  name: "translationBundle",
  title: "Translation Bundle",
  type: "document",
  description:
    "Translated text associated with an English source document or the shared UI catalog. English source content remains authoritative.",
  fields: [
    defineField({
      name: "locale",
      title: "Target Locale",
      type: "string",
      options: {
        list: localeOptions,
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sourceDocumentId",
      title: "English Source Document ID",
      type: "string",
      description:
        "The published Sanity document ID for this bundle. Leave empty only for the shared UI catalog.",
      validation: (rule) =>
        rule.custom((sourceDocumentId, context) => {
          const isUiCatalog = context.document?.uiCatalog === true;

          if (isUiCatalog && sourceDocumentId) {
            return "A UI catalog bundle cannot also reference a source document.";
          }

          if (!isUiCatalog && !sourceDocumentId) {
            return "A source document ID is required unless this is the UI catalog.";
          }

          return true;
        }),
    }),
    defineField({
      name: "uiCatalog",
      title: "Shared UI Catalog",
      type: "boolean",
      description:
        "Enable only for code-owned interface text such as navigation, buttons, forms, validation, and fallback messages.",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "baselineId",
      title: "Baseline ID",
      type: "string",
      description: "Immutable source snapshot identifier used for export and import validation.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "schemaVersion",
      title: "Exchange Schema Version",
      type: "number",
      initialValue: 1,
      readOnly: true,
      validation: (rule) =>
        rule
          .required()
          .integer()
          .custom((value) => value === 1 || "Only translation schema version 1 is supported."),
    }),
    defineField({
      name: "sourceUpdatedAt",
      title: "Source Updated At",
      type: "datetime",
      description:
        "Timestamp of the English source snapshot used to produce these translations.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "entries",
      title: "Translation Entries",
      type: "array",
      of: [
        defineArrayMember({
          name: "translationEntry",
          title: "Translation Entry",
          type: "object",
          fields: [
            defineField({
              name: "key",
              title: "Stable Key",
              type: "string",
              description: "Stable path identifying the translatable English text leaf.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "blockId",
              title: "Content Block ID",
              type: "string",
              description: "Fallback and health checks are evaluated at this block boundary.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "critical",
              title: "Critical Content",
              type: "boolean",
              description:
                "A missing, invalid, or expired critical block redirects the localized route to English.",
              initialValue: false,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "sourceHash",
              title: "English Source Hash",
              type: "string",
              description: "Lowercase or uppercase hexadecimal SHA-256 hash of the source text.",
              validation: (rule) =>
                rule.required().custom((value) => {
                  if (!value || /^[a-f0-9]{64}$/i.test(value)) {
                    return true;
                  }

                  return "Source hash must be a 64-character SHA-256 value.";
                }),
            }),
            defineField({
              name: "value",
              title: "Translated Text",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "reviewed",
              title: "Reviewed by a Human",
              type: "boolean",
              initialValue: false,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "disabled",
              title: "Disable This Translation",
              type: "boolean",
              description:
                "Use this to remove an incorrect translation from localized output and activate fallback behavior.",
              initialValue: false,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "key",
              blockId: "blockId",
              reviewed: "reviewed",
              disabled: "disabled",
            },
            prepare({ title, blockId, reviewed, disabled }) {
              const status = disabled ? "Disabled" : reviewed ? "Reviewed" : "Needs review";

              return {
                title: title || "Untitled translation entry",
                subtitle: `${blockId || "No block"} - ${status}`,
              };
            },
          },
        }),
      ],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .custom((entries) => {
            if (!entries) {
              return true;
            }

            const keys = entries
              .map((entry) => (entry as { key?: string } | undefined)?.key)
              .filter((key): key is string => Boolean(key));
            const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index);

            return duplicateKeys.length === 0
              ? true
              : `Stable keys must be unique. Duplicate: ${[...new Set(duplicateKeys)].join(", ")}`;
          }),
    }),
  ],
  preview: {
    select: {
      locale: "locale",
      sourceDocumentId: "sourceDocumentId",
      uiCatalog: "uiCatalog",
      baselineId: "baselineId",
      entries: "entries",
    },
    prepare({ locale, sourceDocumentId, uiCatalog, baselineId, entries }) {
      const localeTitle = localeTitles[locale] || locale || "Unknown locale";
      const source = uiCatalog ? "Shared UI" : sourceDocumentId || "Missing source";
      const entryCount = Array.isArray(entries) ? entries.length : 0;

      return {
        title: `${localeTitle} - ${source}`,
        subtitle: `Baseline ${baselineId || "not set"} - ${entryCount} entries`,
      };
    },
  },
});
