import { defineField, defineType } from "sanity";

export const locationType = defineType({
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "hours", title: "Hours", type: "string" }),
    defineField({ name: "waitNote", title: "Wait Note", type: "string" }),
    defineField({ name: "mapEmbedUrl", title: "Map Embed URL", type: "url" }),
    defineField({ name: "directionsUrl", title: "Directions URL", type: "url" }),
    defineField({ name: "latitude", title: "Latitude", type: "number" }),
    defineField({ name: "longitude", title: "Longitude", type: "number" }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "isPrimary", title: "Primary Location", type: "boolean", initialValue: false }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0 }),
    defineField({ name: "visible", title: "Visible", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "address",
      media: "image",
    },
  },
});
