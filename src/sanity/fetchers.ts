import { client } from "./client";
import {
  ABOUT_PAGE_QUERY,
  ACTIVE_PROMOTIONS_QUERY,
  CONTACT_PAGE_QUERY,
  GALLERY_PAGE_QUERY,
  HOME_PAGE_QUERY,
  LOCATIONS_QUERY,
  MENU_CATEGORIES_WITH_ITEMS_QUERY,
  MENU_PAGE_QUERY,
  ORDER_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
} from "./queries";
import type {
  AboutPageContent,
  ContactPageContent,
  GalleryPageContent,
  HomePageContent,
  LocationContent,
  MenuCategoryContent,
  MenuPageContent,
  OrderPageContent,
  PromotionContent,
  SiteSettingsContent,
} from "./types";

const fetchOptions = { cache: "no-store" as const };

export async function fetchSiteSettings() {
  try {
    return await client.fetch<SiteSettingsContent | null>(SITE_SETTINGS_QUERY, {}, fetchOptions);
  } catch (error) {
    console.warn("Sanity site settings fetch failed. Falling back to local content.", error);
    return null;
  }
}

export async function fetchHomeCmsContent() {
  try {
    const [page, promotions] = await Promise.all([
      client.fetch<HomePageContent | null>(HOME_PAGE_QUERY, {}, fetchOptions),
      client.fetch<PromotionContent[]>(ACTIVE_PROMOTIONS_QUERY, {}, fetchOptions),
    ]);

    return {
      page,
      promotions: Array.isArray(promotions) ? promotions : [],
    };
  } catch (error) {
    console.warn("Sanity home fetch failed. Falling back to local content.", error);
    return {
      page: null,
      promotions: [],
    };
  }
}

export async function fetchMenuCmsContent() {
  try {
    const [page, categories] = await Promise.all([
      client.fetch<MenuPageContent | null>(MENU_PAGE_QUERY, {}, fetchOptions),
      client.fetch<MenuCategoryContent[]>(MENU_CATEGORIES_WITH_ITEMS_QUERY, {}, fetchOptions),
    ]);

    return {
      page,
      categories: Array.isArray(categories) ? categories : [],
    };
  } catch (error) {
    console.warn("Sanity menu fetch failed. Falling back to local content.", error);
    return {
      page: null,
      categories: [],
    };
  }
}

export async function fetchOrderPage() {
  try {
    return await client.fetch<OrderPageContent | null>(ORDER_PAGE_QUERY, {}, fetchOptions);
  } catch (error) {
    console.warn("Sanity order page fetch failed. Falling back to local content.", error);
    return null;
  }
}

export async function fetchLocations() {
  try {
    const locations = await client.fetch<LocationContent[]>(LOCATIONS_QUERY, {}, fetchOptions);
    return Array.isArray(locations) ? locations : [];
  } catch (error) {
    console.warn("Sanity locations fetch failed. Falling back to local content.", error);
    return [];
  }
}

export async function fetchAboutPage() {
  try {
    return await client.fetch<AboutPageContent | null>(ABOUT_PAGE_QUERY, {}, fetchOptions);
  } catch (error) {
    console.warn("Sanity about page fetch failed. Falling back to local content.", error);
    return null;
  }
}

export async function fetchGalleryPage() {
  try {
    return await client.fetch<GalleryPageContent | null>(GALLERY_PAGE_QUERY, {}, fetchOptions);
  } catch (error) {
    console.warn("Sanity gallery page fetch failed. Falling back to local content.", error);
    return null;
  }
}

export async function fetchContactPage() {
  try {
    return await client.fetch<ContactPageContent | null>(CONTACT_PAGE_QUERY, {}, fetchOptions);
  } catch (error) {
    console.warn("Sanity contact page fetch failed. Falling back to local content.", error);
    return null;
  }
}
