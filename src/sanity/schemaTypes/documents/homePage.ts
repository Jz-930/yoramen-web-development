import { defineArrayMember, defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "headlineLine1", title: "Headline Line 1", type: "string" }),
        defineField({ name: "headlineEmphasis", title: "Headline Emphasis", type: "string" }),
        defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
        defineField({ name: "primaryCta", title: "Primary CTA", type: "cta" }),
        defineField({ name: "secondaryCta", title: "Secondary CTA", type: "cta" }),
        defineField({
          name: "bottomBadges",
          title: "Bottom Badges",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({ name: "backgroundImage", title: "Background Image", type: "image", options: { hotspot: true } }),
        defineField({ name: "bowlImage", title: "Bowl Image", type: "image", options: { hotspot: true } }),
        defineField({ name: "patternImage", title: "Pattern Image", type: "image", options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: "philosophySection",
      title: "Philosophy Section",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "emphasis", title: "Emphasis", type: "string" }),
        defineField({
          name: "paragraphs",
          title: "Paragraphs",
          type: "array",
          of: [defineArrayMember({ type: "text", rows: 3 })],
        }),
        defineField({ name: "cta", title: "CTA", type: "cta" }),
        defineField({ name: "video", title: "Video", type: "file" }),
      ],
    }),
    defineField({
      name: "promiseSection",
      title: "Promise Section",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "text", rows: 2 }),
        defineField({ name: "cta", title: "CTA", type: "cta" }),
      ],
    }),
    defineField({
      name: "promiseCards",
      title: "Promise Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "number", title: "Number", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
          ],
          preview: { select: { title: "title", subtitle: "number", media: "image" } },
        }),
      ],
    }),
    defineField({
      name: "specialsSection",
      title: "Special Offers Section",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({
          name: "emptyStateEyebrow",
          title: "Empty State Eyebrow",
          type: "string",
          description: "Shown when there are no active promotions.",
        }),
        defineField({
          name: "emptyStateTitle",
          title: "Empty State Title",
          type: "string",
          description: "Main message shown when there are no active promotions.",
        }),
        defineField({
          name: "emptyStateDescription",
          title: "Empty State Description",
          type: "text",
          rows: 2,
          description: "Supporting message shown when there are no active promotions.",
        }),
      ],
    }),
    defineField({
      name: "newsletterSection",
      title: "Newsletter Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({ name: "inputPlaceholder", title: "Input Placeholder", type: "string" }),
        defineField({ name: "buttonLabel", title: "Button Label", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
