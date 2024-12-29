import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://mikeesto.com/",
  markdown: {
    shikiConfig: {
      theme: "dracula",
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
    },
  },
  integrations: [sitemap(), tailwind()],
});
