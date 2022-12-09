import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://mikeesto.com/",
  markdown: {
    shikiConfig: {
      theme: "dracula",
      // Enable word wrap to prevent horizontal scrolling
      // wrap: true,
    },
  },
});
