import { defineField, defineType } from "sanity";

export const ctaType = defineType({
  name: "cta",
  title: "CTA",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description: "Internal route like /menu or full external URL.",
    }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
          { title: "Text", value: "text" },
        ],
      },
      initialValue: "primary",
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in New Tab",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
