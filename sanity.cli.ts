import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "08xf72v9",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
