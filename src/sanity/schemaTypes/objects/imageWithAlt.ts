import { defineField, defineType } from "sanity";

export const imageWithAltType = defineType({
  name: "imageWithAlt",
  title: "Image With Alt Text",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "alt",
      subtitle: "caption",
      media: "image",
    },
  },
});
