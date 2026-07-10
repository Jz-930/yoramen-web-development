/**
 * Published English content that can actually reach the public UI.
 * Keep this projection aligned with src/sanity/queries.ts so hidden or
 * non-rendered fields cannot make a localized page fail its health gate.
 */
export const PUBLISHED_LOCALIZATION_SOURCE_QUERY = `*[
  _type in $sourceTypes &&
  !(_id in path("drafts.**")) &&
  (
    (_type == "siteSettings" && _id == "siteSettings") ||
    (_type == "homePage" && _id == "homePage") ||
    (_type == "aboutPage" && _id == "aboutPage") ||
    (_type == "galleryPage" && _id == "galleryPage") ||
    (_type == "contactPage" && _id == "contactPage") ||
    (_type == "menuPage" && _id == "menuPage") ||
    (_type == "orderPage" && _id == "orderPage") ||
    (_type == "menuCategory" && visible != false) ||
    (
      _type == "menuItem" &&
      available != false &&
      defined(category._ref) &&
      category->_type == "menuCategory" &&
      category->visible != false
    ) ||
    (
      _type == "promotion" &&
      active != false &&
      (!defined(startsAt) || startsAt <= now()) &&
      (!defined(endsAt) || endsAt >= now())
    ) ||
    (_type == "location" && visible != false)
  )
] | order(_type asc, _id asc) {
  _id,
  _type,
  _updatedAt,
  _type == "siteSettings" => {
    brand{altText},
    navigation[]{_key, label},
    primaryCta{label},
    footer{
      brandBlurb,
      exploreLinks[]{_key, label},
      visitLinks[]{_key, label},
      socialLinks[]{_key, label},
      legalLinks[]{_key, label}
    },
    defaultSeo{metaTitle, metaDescription}
  },
  _type == "homePage" => {
    hero{
      eyebrow,
      headlineLine1,
      headlineEmphasis,
      body,
      primaryCta{label},
      secondaryCta{label},
      bottomBadges
    },
    philosophySection{eyebrow, title, emphasis, paragraphs, cta{label}},
    promiseSection{eyebrow, title, cta{label}},
    promiseCards[]{_key, number, title, description},
    specialsSection{eyebrow, title, description},
    newsletterSection{title, description, inputPlaceholder, buttonLabel},
    seo{metaTitle, metaDescription}
  },
  _type == "aboutPage" => {
    header{eyebrow, title, intro},
    introSection{paragraphs, quote},
    timelineSection{title},
    timelineItems[]{_key, year, title, description},
    seo{metaTitle, metaDescription}
  },
  _type == "galleryPage" => {
    header{eyebrow, title, description},
    categories,
    galleryItems[]{_key, title},
    testimonials[]{_key, quote, author, date},
    seo{metaTitle, metaDescription}
  },
  _type == "contactPage" => {
    header{eyebrow, title, description},
    infoCard{title, description, generalLabel, partnershipsLabel},
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
    },
    seo{metaTitle, metaDescription}
  },
  _type == "menuPage" => {
    eyebrow,
    title,
    description,
    comboCta{title, description, buttonLabel},
    seo{metaTitle, metaDescription}
  },
  _type == "orderPage" => {
    title,
    description,
    fallbackTitle,
    fallbackMessage,
    seo{metaTitle, metaDescription}
  },
  _type == "menuCategory" => {title, description},
  _type == "menuItem" => {name, description, price, tags},
  _type == "promotion" => {title, priceOrBadge, description, ctaLabel, availabilityText},
  _type == "location" => {name, label, hours, waitNote}
}`;
