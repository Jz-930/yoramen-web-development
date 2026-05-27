import { defineField, defineType } from "sanity";

export const contactPageType = defineType({
  name: "contactPage",
  title: "Contact Page",
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
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "infoCard",
      title: "Info Card",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({ name: "generalLabel", title: "General Label", type: "string" }),
        defineField({ name: "partnershipsLabel", title: "Partnerships Label", type: "string" }),
      ],
    }),
    defineField({
      name: "form",
      title: "Form Text",
      type: "object",
      fields: [
        defineField({ name: "nameLabel", title: "Name Label", type: "string" }),
        defineField({ name: "namePlaceholder", title: "Name Placeholder", type: "string" }),
        defineField({ name: "phoneLabel", title: "Phone Label", type: "string" }),
        defineField({ name: "phonePlaceholder", title: "Phone Placeholder", type: "string" }),
        defineField({ name: "emailLabel", title: "Email Label", type: "string" }),
        defineField({ name: "emailPlaceholder", title: "Email Placeholder", type: "string" }),
        defineField({ name: "messageLabel", title: "Message Label", type: "string" }),
        defineField({ name: "messagePlaceholder", title: "Message Placeholder", type: "string" }),
        defineField({ name: "buttonLabel", title: "Button Label", type: "string" }),
        defineField({ name: "submittingLabel", title: "Submitting Label", type: "string" }),
        defineField({ name: "successMessage", title: "Success Message", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Contact Page" }),
  },
});
