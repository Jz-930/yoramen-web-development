export const MENU_PAGE_QUERY = `*[_type == "menuPage"][0]{
  eyebrow,
  title,
  description,
  categoryNavEnabled,
  comboCta
}`;

export const MENU_CATEGORIES_WITH_ITEMS_QUERY = `*[_type == "menuCategory" && visible != false] | order(sortOrder asc, title asc) {
  _id,
  "id": coalesce(slug.current, _id),
  "name": title,
  description,
  "items": *[_type == "menuItem" && references(^._id) && available != false] | order(sortOrder asc, name asc) {
    name,
    "desc": description,
    price,
    tags,
    image
  }
}`;

export const ORDER_PAGE_QUERY = `*[_type == "orderPage"][0]{
  title,
  description,
  providerName,
  iframeUrl,
  externalOrderUrl,
  fallbackTitle,
  fallbackMessage,
  enabled
}`;

export const HOME_PAGE_QUERY = `*[_type == "homePage"][0]{
  hero{
    eyebrow,
    headlineLine1,
    headlineEmphasis,
    body,
    primaryCta,
    secondaryCta,
    bottomBadges,
    backgroundImage,
    bowlImage,
    patternImage
  },
  philosophySection{
    eyebrow,
    title,
    emphasis,
    paragraphs,
    cta
  },
  promiseSection{
    eyebrow,
    title,
    cta
  },
  promiseCards[]{
    number,
    title,
    description,
    image
  },
  specialsSection{
    eyebrow,
    title,
    description
  },
  newsletterSection{
    title,
    description,
    inputPlaceholder,
    buttonLabel
  }
}`;

export const ACTIVE_PROMOTIONS_QUERY = `*[
  _type == "promotion" &&
  active != false &&
  (!defined(startsAt) || startsAt <= now()) &&
  (!defined(endsAt) || endsAt >= now())
] | order(sortOrder asc, title asc) {
  title,
  priceOrBadge,
  description,
  image,
  ctaLabel,
  ctaHref,
  availabilityText
}`;

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  title,
  brand{
    logoDark,
    logoLight,
    altText
  },
  navigation[]{
    label,
    href,
    openInNewTab
  },
  primaryCta,
  footer{
    brandBlurb,
    exploreLinks[]{label, href, openInNewTab},
    visitLinks[]{label, href, openInNewTab},
    socialLinks[]{label, href, openInNewTab},
    legalLinks[]{label, href, openInNewTab}
  },
  contact{
    generalEmail,
    partnershipsEmail,
    phone
  }
}`;

export const LOCATIONS_QUERY = `*[_type == "location" && visible != false] | order(sortOrder asc, name asc) {
  name,
  label,
  address,
  phone,
  hours,
  waitNote,
  mapEmbedUrl,
  directionsUrl,
  image,
  isPrimary
}`;

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]{
  header{
    eyebrow,
    title,
    intro
  },
  introSection{
    image,
    paragraphs,
    quote
  },
  timelineSection{
    title
  },
  timelineItems[]{
    year,
    title,
    description,
    image,
    align
  }
}`;

export const GALLERY_PAGE_QUERY = `*[_type == "galleryPage"][0]{
  header{
    eyebrow,
    title,
    description
  },
  categories,
  galleryItems[]{
    category,
    title,
    image,
    aspect
  },
  testimonials[]{
    quote,
    author,
    date,
    style
  }
}`;

export const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0]{
  header{
    eyebrow,
    title,
    description
  },
  infoCard{
    title,
    description,
    generalLabel,
    partnershipsLabel
  },
  form{
    nameLabel,
    namePlaceholder,
    phoneLabel,
    phonePlaceholder,
    emailLabel,
    emailPlaceholder,
    messageLabel,
    messagePlaceholder,
    buttonLabel,
    submittingLabel,
    successMessage
  }
}`;
