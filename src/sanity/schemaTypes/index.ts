import { ctaType } from "./objects/cta";
import { imageWithAltType } from "./objects/imageWithAlt";
import { linkItemType } from "./objects/linkItem";
import { seoType } from "./objects/seo";
import { aboutPageType } from "./documents/aboutPage";
import { contactPageType } from "./documents/contactPage";
import { galleryPageType } from "./documents/galleryPage";
import { homePageType } from "./documents/homePage";
import { locationType } from "./documents/location";
import { localizationConfigType } from "./documents/localizationConfig";
import { menuCategoryType } from "./documents/menuCategory";
import { menuItemType } from "./documents/menuItem";
import { menuPageType } from "./documents/menuPage";
import { orderPageType } from "./documents/orderPage";
import { promotionType } from "./documents/promotion";
import { siteSettingsType } from "./documents/siteSettings";
import { translationBundleType } from "./documents/translationBundle";

export const schemaTypes = [
  seoType,
  ctaType,
  linkItemType,
  imageWithAltType,
  siteSettingsType,
  homePageType,
  aboutPageType,
  galleryPageType,
  contactPageType,
  menuPageType,
  orderPageType,
  menuCategoryType,
  menuItemType,
  promotionType,
  locationType,
  translationBundleType,
  localizationConfigType,
];
