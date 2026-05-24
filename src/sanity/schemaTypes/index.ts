import { ctaType } from "./objects/cta";
import { imageWithAltType } from "./objects/imageWithAlt";
import { linkItemType } from "./objects/linkItem";
import { seoType } from "./objects/seo";
import { homePageType } from "./documents/homePage";
import { locationType } from "./documents/location";
import { menuCategoryType } from "./documents/menuCategory";
import { menuItemType } from "./documents/menuItem";
import { menuPageType } from "./documents/menuPage";
import { orderPageType } from "./documents/orderPage";
import { promotionType } from "./documents/promotion";
import { siteSettingsType } from "./documents/siteSettings";

export const schemaTypes = [
  seoType,
  ctaType,
  linkItemType,
  imageWithAltType,
  siteSettingsType,
  homePageType,
  menuPageType,
  orderPageType,
  menuCategoryType,
  menuItemType,
  promotionType,
  locationType,
];
