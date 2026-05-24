import { defineField, defineType } from "sanity";

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
    }),
    defineField({
      name: "enabled",
      title: "Enable Ordering",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "iframeUrl",
      title: "Iframe URL",
      type: "url",
      description: "Use only if the ordering provider allows iframe embedding.",
    }),
    defineField({
      name: "externalOrderUrl",
      title: "External Order URL",
      type: "url",
      description: "Fallback link if iframe embedding is blocked.",
    }),
    defineField({
      name: "fallbackTitle",
      title: "Fallback Title",
      type: "string",
      initialValue: "Awaiting Integration",
    }),
    defineField({
      name: "fallbackMessage",
      title: "Fallback Message",
      type: "text",
      rows: 3,
      initialValue: "Third-party ordering system URL is not yet provided.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Order Page" }),
  },
});
