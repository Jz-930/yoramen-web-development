import ContactContent from "./ContactContent";
import { textOr } from "@/sanity/fallback";
import { fetchContactPage, fetchSiteSettings } from "@/sanity/fetchers";

export const dynamic = "force-dynamic";

const fallbackContact = {
  header: {
    eyebrow: "Reach Out",
    title: "Contact Us",
    description: "Partnerships, feedback, and suggestions are all welcome. We read every message carefully.",
  },
  infoCard: {
    title: "Get in Touch",
    description: "Whether you want to share your dining experience, inquire about catering, or just say hello, drop us a line.",
    generalLabel: "General Inquiries",
    partnershipsLabel: "Partnerships & PR",
    generalEmail: "info@yoramen.ca",
    partnershipsEmail: "info@yoramen.ca",
  },
  form: {
    nameLabel: "Name",
    namePlaceholder: "Your name",
    phoneLabel: "Phone",
    phonePlaceholder: "(optional)",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    messageLabel: "Message",
    messagePlaceholder: "What's on your mind?",
    buttonLabel: "Send Message",
    submittingLabel: "Sending...",
    successMessage: "Message sent successfully. We will get back to you soon.",
  },
};

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    fetchContactPage(),
    fetchSiteSettings(),
  ]);

  const content = {
    header: {
      eyebrow: textOr(page?.header?.eyebrow, fallbackContact.header.eyebrow),
      title: textOr(page?.header?.title, fallbackContact.header.title),
      description: textOr(page?.header?.description, fallbackContact.header.description),
    },
    infoCard: {
      title: textOr(page?.infoCard?.title, fallbackContact.infoCard.title),
      description: textOr(page?.infoCard?.description, fallbackContact.infoCard.description),
      generalLabel: textOr(page?.infoCard?.generalLabel, fallbackContact.infoCard.generalLabel),
      partnershipsLabel: textOr(page?.infoCard?.partnershipsLabel, fallbackContact.infoCard.partnershipsLabel),
      generalEmail: textOr(settings?.contact?.generalEmail, fallbackContact.infoCard.generalEmail),
      partnershipsEmail: textOr(settings?.contact?.partnershipsEmail, settings?.contact?.generalEmail || fallbackContact.infoCard.partnershipsEmail),
    },
    form: {
      nameLabel: textOr(page?.form?.nameLabel, fallbackContact.form.nameLabel),
      namePlaceholder: textOr(page?.form?.namePlaceholder, fallbackContact.form.namePlaceholder),
      phoneLabel: textOr(page?.form?.phoneLabel, fallbackContact.form.phoneLabel),
      phonePlaceholder: textOr(page?.form?.phonePlaceholder, fallbackContact.form.phonePlaceholder),
      emailLabel: textOr(page?.form?.emailLabel, fallbackContact.form.emailLabel),
      emailPlaceholder: textOr(page?.form?.emailPlaceholder, fallbackContact.form.emailPlaceholder),
      messageLabel: textOr(page?.form?.messageLabel, fallbackContact.form.messageLabel),
      messagePlaceholder: textOr(page?.form?.messagePlaceholder, fallbackContact.form.messagePlaceholder),
      buttonLabel: textOr(page?.form?.buttonLabel, fallbackContact.form.buttonLabel),
      submittingLabel: textOr(page?.form?.submittingLabel, fallbackContact.form.submittingLabel),
      successMessage: textOr(page?.form?.successMessage, fallbackContact.form.successMessage),
    },
  };

  return <ContactContent content={content} />;
}
