import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({
      name: "header",
      title: "Header",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "introSection",
      title: "Intro Section",
      type: "object",
      fields: [
        defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
        defineField({
          name: "paragraphs",
          title: "Paragraphs",
          type: "array",
          of: [defineArrayMember({ type: "text", rows: 3 })],
        }),
        defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "timelineSection",
      title: "Timeline Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
      ],
    }),
    defineField({
      name: "timelineItems",
      title: "Timeline Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "year", title: "Year", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
            defineField({
              name: "align",
              title: "Image Side",
              type: "string",
              options: {
                list: [
                  { title: "Left", value: "left" },
                  { title: "Right", value: "right" },
                ],
              },
              initialValue: "left",
            }),
          ],
          preview: { select: { title: "title", subtitle: "year", media: "image" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "About Page" }),
  },
});
