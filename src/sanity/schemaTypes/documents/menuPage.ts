import { defineField, defineType } from "sanity";

export const menuPageType = defineType({
  name: "menuPage",
  title: "Menu Page",
  type: "document",
  fields: [
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "categoryNavEnabled",
      title: "Show Category Navigation",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "comboCta",
      title: "Combo CTA",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({ name: "buttonLabel", title: "Button Label", type: "string" }),
        defineField({ name: "buttonHref", title: "Button Link", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Menu Page" }),
  },
});
