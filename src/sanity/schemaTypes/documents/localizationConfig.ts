import { defineField, defineType } from "sanity";

export const localizationConfigType = defineType({
  name: "localizationConfig",
  title: "Localization Configuration",
  type: "document",
  description:
    "Singleton-compatible controls for safely enabling localized routes. Use the fixed document ID localizationConfig when wiring the Studio tool.",
  initialValue: {
    enabled: false,
    locales: {
      frCA: false,
      zhHant: false,
      jaJP: false,
    },
    graceDays: 30,
  },
  fields: [
    defineField({
      name: "enabled",
      title: "Enable Localization",
      type: "boolean",
      description:
        "Master switch for localized routes and the Navbar language selector. English routes do not depend on this setting.",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "locales",
      title: "Enabled Locales",
      type: "object",
      initialValue: {
        frCA: false,
        zhHant: false,
        jaJP: false,
      },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "frCA",
          title: "French (Canada) - fr-CA",
          type: "boolean",
          initialValue: false,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "zhHant",
          title: "Traditional Chinese - zh-Hant",
          type: "boolean",
          initialValue: false,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "jaJP",
          title: "Japanese (Japan) - ja-JP",
          type: "boolean",
          initialValue: false,
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "activeBaselineId",
      title: "Active Baseline ID",
      type: "string",
      description:
        "The approved translation baseline served by enabled localized routes.",
      validation: (rule) =>
        rule.custom((activeBaselineId, context) => {
          const document = context.document;
          const localeStates = document?.locales as
            | { frCA?: boolean; zhHant?: boolean; jaJP?: boolean }
            | undefined;
          const needsBaseline =
            document?.enabled === true ||
            localeStates?.frCA === true ||
            localeStates?.zhHant === true ||
            localeStates?.jaJP === true;

          return !needsBaseline || Boolean(activeBaselineId)
            ? true
            : "Set an active baseline before enabling localization or a locale.";
        }),
    }),
    defineField({
      name: "graceDays",
      title: "Stale Translation Grace Period (Days)",
      type: "number",
      description:
        "An older translation remains available for 30 days after its English source text changes.",
      initialValue: 30,
      validation: (rule) =>
        rule
          .required()
          .integer()
          .custom((value) => value === 30 || "The agreed grace period is fixed at 30 days."),
    }),
  ],
  preview: {
    select: {
      enabled: "enabled",
      baselineId: "activeBaselineId",
    },
    prepare({ enabled, baselineId }) {
      return {
        title: "Localization Configuration",
        subtitle: `${enabled ? "Enabled" : "Disabled"} - Baseline ${baselineId || "not set"}`,
      };
    },
  },
});
