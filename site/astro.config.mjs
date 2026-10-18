import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  site: process.env.PUBLIC_SITE_URL || "https://www.estanzacx.com",
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "never" },
  compressHTML: true,
  integrations: [
    // sitemap-index.xml with hreflang alternates for the two locales; 404 stays out.
    sitemap({ i18n: { defaultLocale: "es", locales: { es: "es", en: "en" } }, filter: (page) => !page.includes("/404") }),
  ],
});
