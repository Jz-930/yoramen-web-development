import ContactContent from "./ContactContent";
import { SOURCE_LOCALE } from "@/i18n";
import { buildLocalizedMetadata, ENGLISH_PAGE_METADATA } from "@/i18n/metadata";
import { createServerTextTranslator, getRequestLocale } from "@/i18n/server";
import { textOr } from "@/sanity/fallback";
import { fetchContactPage, fetchSiteSettings } from "@/sanity/fetchers";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await fetchContactPage();
  return buildLocalizedMetadata({
    locale: SOURCE_LOCALE,
    englishPathname: "/contact",
    englishTitle: ENGLISH_PAGE_METADATA.contact.title,
    englishDescription: ENGLISH_PAGE_METADATA.contact.description,
    seo: page?.seo,
  });
}

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
  const locale = await getRequestLocale();
  const t = (await createServerTextTranslator(locale)).text;
  const [page, settings] = await Promise.all([
    fetchContactPage(),
    fetchSiteSettings(),
  ]);

  const content = {
    header: {
      eyebrow: t(textOr(page?.header?.eyebrow, fallbackContact.header.eyebrow)),
      title: t(textOr(page?.header?.title, fallbackContact.header.title)),
      description: t(textOr(page?.header?.description, fallbackContact.header.description)),
    },
    infoCard: {
      title: t(textOr(page?.infoCard?.title, fallbackContact.infoCard.title)),
      description: t(textOr(page?.infoCard?.description, fallbackContact.infoCard.description)),
      generalLabel: t(textOr(page?.infoCard?.generalLabel, fallbackContact.infoCard.generalLabel)),
      partnershipsLabel: t(textOr(page?.infoCard?.partnershipsLabel, fallbackContact.infoCard.partnershipsLabel)),
      generalEmail: textOr(settings?.contact?.generalEmail, fallbackContact.infoCard.generalEmail),
      partnershipsEmail: textOr(settings?.contact?.partnershipsEmail, settings?.contact?.generalEmail || fallbackContact.infoCard.partnershipsEmail),
    },
    form: {
      nameLabel: t(textOr(page?.form?.nameLabel, fallbackContact.form.nameLabel)),
      namePlaceholder: t(textOr(page?.form?.namePlaceholder, fallbackContact.form.namePlaceholder)),
      phoneLabel: t(textOr(page?.form?.phoneLabel, fallbackContact.form.phoneLabel)),
      phonePlaceholder: t(textOr(page?.form?.phonePlaceholder, fallbackContact.form.phonePlaceholder)),
      emailLabel: t(textOr(page?.form?.emailLabel, fallbackContact.form.emailLabel)),
      emailPlaceholder: t(textOr(page?.form?.emailPlaceholder, fallbackContact.form.emailPlaceholder)),
      messageLabel: t(textOr(page?.form?.messageLabel, fallbackContact.form.messageLabel)),
      messagePlaceholder: t(textOr(page?.form?.messagePlaceholder, fallbackContact.form.messagePlaceholder)),
      buttonLabel: t(textOr(page?.form?.buttonLabel, fallbackContact.form.buttonLabel)),
      submittingLabel: t(textOr(page?.form?.submittingLabel, fallbackContact.form.submittingLabel)),
      successMessage: t(textOr(page?.form?.successMessage, fallbackContact.form.successMessage)),
    },
  };

  return <ContactContent content={content} />;
}
