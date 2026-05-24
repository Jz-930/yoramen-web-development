import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      initialValue: "Yoramen",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "object",
      fields: [
        defineField({
          name: "logoDark",
          title: "Dark Logo",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "logoLight",
          title: "Light Logo",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "altText",
          title: "Logo Alt Text",
          type: "string",
          initialValue: "Yoramen Logo",
        }),
      ],
    }),
    defineField({
      name: "navigation",
      title: "Navigation Links",
      type: "array",
      of: [defineArrayMember({ type: "linkItem" })],
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "cta",
    }),
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      fields: [
        defineField({
          name: "brandBlurb",
          title: "Brand Blurb",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "exploreLinks",
          title: "Explore Links",
          type: "array",
          of: [defineArrayMember({ type: "linkItem" })],
        }),
        defineField({
          name: "visitLinks",
          title: "Visit Links",
          type: "array",
          of: [defineArrayMember({ type: "linkItem" })],
        }),
        defineField({
          name: "socialLinks",
          title: "Social Links",
          type: "array",
          of: [defineArrayMember({ type: "linkItem" })],
        }),
        defineField({
          name: "legalLinks",
          title: "Legal Links",
          type: "array",
          of: [defineArrayMember({ type: "linkItem" })],
        }),
      ],
    }),
    defineField({
      name: "contact",
      title: "Contact",
      type: "object",
      fields: [
        defineField({ name: "generalEmail", title: "General Email", type: "string" }),
        defineField({ name: "partnershipsEmail", title: "Partnerships Email", type: "string" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
