import { defineArrayMember, defineField, defineType } from "sanity";

export const galleryPageType = defineType({
  name: "galleryPage",
  title: "Gallery Page",
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
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "categories",
      title: "Filter Categories",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "galleryItems",
      title: "Gallery Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "category", title: "Category", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
            defineField({
              name: "aspect",
              title: "Aspect Ratio",
              type: "string",
              options: {
                list: [
                  { title: "Portrait 3:4", value: "aspect-[3/4]" },
                  { title: "Square", value: "aspect-square" },
                  { title: "Landscape 4:3", value: "aspect-[4/3]" },
                ],
              },
              initialValue: "aspect-square",
            }),
          ],
          preview: { select: { title: "title", subtitle: "category", media: "image" } },
        }),
      ],
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }),
            defineField({ name: "author", title: "Author", type: "string" }),
            defineField({ name: "date", title: "Date", type: "string" }),
            defineField({
              name: "style",
              title: "Card Style",
              type: "string",
              options: {
                list: [
                  { title: "Warm gray", value: "bg-gray-50" },
                  { title: "White bordered", value: "bg-white border flex flex-col border-gray-100 shadow-sm" },
                ],
              },
              initialValue: "bg-gray-50",
            }),
          ],
          preview: { select: { title: "author", subtitle: "date" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Gallery Page" }),
  },
});
