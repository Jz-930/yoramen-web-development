import { definePlugin } from "sanity";
import { LocalizationTool } from "./LocalizationTool";

export const localizationTool = definePlugin({
  name: "yoramen-localization",
  tools: [
    {
      name: "localization",
      title: "Localization",
      component: LocalizationTool,
      controlsDocumentTitle: true,
    },
  ],
});
