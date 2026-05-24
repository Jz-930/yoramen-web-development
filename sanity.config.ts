import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemaTypes";

const singletonTypes = new Set([
  "siteSettings",
  "homePage",
  "menuPage",
  "orderPage",
]);

const singletonListItem = (S: any, typeName: string, title: string) =>
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
              (item: any) => !singletonTypes.has(item.getId())
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
