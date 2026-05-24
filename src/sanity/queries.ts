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
