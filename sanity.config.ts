import { defineConfig } from "sanity";
import { structureTool, type StructureBuilder } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { localizationTool } from "@/sanity/localization";
import { schemaTypes } from "@/sanity/schemaTypes";

const singletonTypes = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "galleryPage",
  "contactPage",
  "menuPage",
  "orderPage",
  "translationBundle",
  "localizationConfig",
]);

const singletonListItem = (S: StructureBuilder, typeName: string, title: string) =>
  S.listItem()
    .title(title)
    .id(typeName)
    .schemaType(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title));

export default defineConfig({
  name: "default",
  title: "Yoramen CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "08xf72v9",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Yoramen Content")
          .items([
            S.listItem()
              .title("Site")
              .child(
                S.list()
                  .title("Site")
                  .items([
                    singletonListItem(S, "siteSettings", "Site Settings"),
                    singletonListItem(S, "homePage", "Home Page"),
                    singletonListItem(S, "aboutPage", "About Page"),
                    singletonListItem(S, "galleryPage", "Gallery Page"),
                    singletonListItem(S, "contactPage", "Contact Page"),
                    singletonListItem(S, "menuPage", "Menu Page"),
                    singletonListItem(S, "orderPage", "Order Page"),
                  ])
              ),
            S.divider(),
            S.listItem()
              .title("Menu")
              .child(
                S.list()
                  .title("Menu")
                  .items([
                    S.documentTypeListItem("menuCategory").title("Menu Categories"),
                    S.documentTypeListItem("menuItem").title("Menu Items"),
                  ])
              ),
            S.listItem()
              .title("Marketing")
              .child(
                S.list()
                  .title("Marketing")
                  .items([S.documentTypeListItem("promotion").title("Promotions")])
              ),
            S.listItem()
              .title("Operations")
              .child(
                S.list()
                  .title("Operations")
                  .items([S.documentTypeListItem("location").title("Locations")])
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !singletonTypes.has(item.getId() || "")
            ),
          ]),
    }),
    localizationTool(),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
