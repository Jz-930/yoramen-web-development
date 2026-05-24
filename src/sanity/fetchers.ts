import { client } from "./client";
import {
  MENU_CATEGORIES_WITH_ITEMS_QUERY,
  MENU_PAGE_QUERY,
  ORDER_PAGE_QUERY,
} from "./queries";
import type {
  MenuCategoryContent,
  MenuPageContent,
  OrderPageContent,
} from "./types";

export async function fetchMenuCmsContent() {
  try {
    const fetchOptions = { cache: "no-store" as const };
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
    return await client.fetch<OrderPageContent | null>(ORDER_PAGE_QUERY, {}, { cache: "no-store" });
  } catch (error) {
    console.warn("Sanity order page fetch failed. Falling back to local content.", error);
    return null;
  }
}
