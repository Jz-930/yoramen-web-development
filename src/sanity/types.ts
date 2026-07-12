export type Cta = {
  label?: string;
  href?: string;
  style?: string;
  openInNewTab?: boolean;
};

export type LinkItemContent = {
  label?: string;
  href?: string;
  openInNewTab?: boolean;
};

export type SeoContent = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: unknown;
  noIndex?: boolean;
};

export type SiteSettingsContent = {
  title?: string;
  defaultSeo?: SeoContent;
  brand?: {
    logoDark?: unknown;
    logoLight?: unknown;
    altText?: string;
  };
  navigation?: LinkItemContent[];
  primaryCta?: Cta;
  footer?: {
    brandBlurb?: string;
    exploreLinks?: LinkItemContent[];
    visitLinks?: LinkItemContent[];
    socialLinks?: LinkItemContent[];
    legalLinks?: LinkItemContent[];
  };
  contact?: {
    generalEmail?: string;
    partnershipsEmail?: string;
    phone?: string;
  };
};

export type HomePageContent = {
  seo?: SeoContent;
  hero?: {
    eyebrow?: string;
    headlineLine1?: string;
    headlineEmphasis?: string;
    body?: string;
    primaryCta?: Cta;
    secondaryCta?: Cta;
    bottomBadges?: string[];
    backgroundImage?: unknown;
    bowlImage?: unknown;
    patternImage?: unknown;
  };
  philosophySection?: {
    eyebrow?: string;
    title?: string;
    emphasis?: string;
    paragraphs?: string[];
    cta?: Cta;
  };
  promiseSection?: {
    eyebrow?: string;
    title?: string;
    cta?: Cta;
  };
  promiseCards?: PromiseCardContent[];
  specialsSection?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    emptyStateEyebrow?: string;
    emptyStateTitle?: string;
    emptyStateDescription?: string;
  };
  newsletterSection?: {
    title?: string;
    description?: string;
    inputPlaceholder?: string;
    buttonLabel?: string;
  };
};

export type PromiseCardContent = {
  number?: string;
  title?: string;
  description?: string;
  image?: unknown;
};

export type PromotionContent = {
  title?: string;
  priceOrBadge?: string;
  description?: string;
  image?: unknown;
  ctaLabel?: string;
  ctaHref?: string;
  availabilityText?: string;
};

export type MenuPageContent = {
  seo?: SeoContent;
  eyebrow?: string;
  title?: string;
  description?: string;
  categoryNavEnabled?: boolean;
  comboCta?: {
    title?: string;
    description?: string;
    buttonLabel?: string;
    buttonHref?: string;
  };
};

export type MenuItemContent = {
  name: string;
  desc?: string;
  price?: string;
  tags?: string[];
  image?: unknown;
};

export type MenuCategoryContent = {
  id: string;
  name: string;
  description?: string;
  items: MenuItemContent[];
};

export type OrderPageContent = {
  seo?: SeoContent;
  title?: string;
  description?: string;
  providerName?: string;
  iframeUrl?: string;
  externalOrderUrl?: string;
  fallbackTitle?: string;
  fallbackMessage?: string;
  enabled?: boolean;
};

export type LocationContent = {
  name?: string;
  label?: string;
  address?: string;
  phone?: string;
  hours?: string;
  waitNote?: string;
  mapEmbedUrl?: string;
  directionsUrl?: string;
  image?: unknown;
  isPrimary?: boolean;
};

export type AboutPageContent = {
  seo?: SeoContent;
  header?: {
    eyebrow?: string;
    title?: string;
    intro?: string;
  };
  introSection?: {
    image?: unknown;
    paragraphs?: string[];
    quote?: string;
  };
  timelineSection?: {
    title?: string;
  };
  timelineItems?: TimelineItemContent[];
};

export type TimelineItemContent = {
  year?: string;
  title?: string;
  description?: string;
  image?: unknown;
  align?: "left" | "right";
};

export type GalleryPageContent = {
  seo?: SeoContent;
  header?: {
    eyebrow?: string;
    title?: string;
    description?: string;
  };
  categories?: string[];
  galleryItems?: GalleryItemContent[];
  testimonials?: TestimonialContent[];
};

export type GalleryItemContent = {
  category?: string;
  title?: string;
  image?: unknown;
  aspect?: string;
};

export type TestimonialContent = {
  quote?: string;
  author?: string;
  date?: string;
  style?: string;
};

export type ContactPageContent = {
  seo?: SeoContent;
  header?: {
    eyebrow?: string;
    title?: string;
    description?: string;
  };
  infoCard?: {
    title?: string;
    description?: string;
    generalLabel?: string;
    partnershipsLabel?: string;
  };
  form?: {
    nameLabel?: string;
    namePlaceholder?: string;
    phoneLabel?: string;
    phonePlaceholder?: string;
    emailLabel?: string;
    emailPlaceholder?: string;
    messageLabel?: string;
    messagePlaceholder?: string;
    buttonLabel?: string;
    submittingLabel?: string;
    successMessage?: string;
  };
};
