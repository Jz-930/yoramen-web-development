export type Cta = {
  label?: string;
  href?: string;
  style?: string;
  openInNewTab?: boolean;
};

export type MenuPageContent = {
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
  title?: string;
  description?: string;
  providerName?: string;
  iframeUrl?: string;
  externalOrderUrl?: string;
  fallbackTitle?: string;
  fallbackMessage?: string;
  enabled?: boolean;
};
