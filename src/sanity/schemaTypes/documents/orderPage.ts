import { defineField, defineType } from "sanity";

const ORDERING_URL =
  "https://order.mealkeyway.com/customer/release/index?mid=324b374b756a537145386a32333732614673364638513d3d";

export const orderPageType = defineType({
  name: "orderPage",
  title: "Order Page",
  type: "document",
  fields: [
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Online Ordering",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      initialValue: "Secure ordering powered by our POS partner",
    }),
    defineField({
      name: "providerName",
      title: "Provider Name",
      type: "string",
      description: "Example: Toast, Square, Uber Eats, DoorDash.",
      initialValue: "MealKeyWay",
    }),
    defineField({
      name: "enabled",
      title: "Enable Ordering",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "iframeUrl",
      title: "Iframe URL",
      type: "url",
      description: "Use only if the ordering provider allows iframe embedding.",
      initialValue: ORDERING_URL,
    }),
    defineField({
      name: "externalOrderUrl",
      title: "External Order URL",
      type: "url",
      description: "Fallback link if iframe embedding is blocked.",
      initialValue: ORDERING_URL,
    }),
    defineField({
      name: "fallbackTitle",
      title: "Fallback Title",
      type: "string",
      initialValue: "Open Online Ordering",
    }),
    defineField({
      name: "fallbackMessage",
      title: "Fallback Message",
      type: "text",
      rows: 3,
      initialValue: "If the ordering screen does not load, open the secure ordering page in a new tab.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Order Page" }),
  },
});
