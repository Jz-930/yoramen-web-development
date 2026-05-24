import { defineField, defineType } from "sanity";

export const promotionType = defineType({
  name: "promotion",
  title: "Promotion",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priceOrBadge",
      title: "Price or Badge",
      type: "string",
      description: "Examples: $14.99, 20% OFF, Limited Time.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "ctaLabel", title: "CTA Label", type: "string" }),
    defineField({ name: "ctaHref", title: "CTA Link", type: "string" }),
    defineField({ name: "availabilityText", title: "Availability Text", type: "string" }),
    defineField({ name: "startsAt", title: "Starts At", type: "datetime" }),
    defineField({ name: "endsAt", title: "Ends At", type: "datetime" }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "priceOrBadge",
      media: "image",
    },
  },
});
