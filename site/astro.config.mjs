import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";
import { createClient } from "@sanity/client";

const env = { ...loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), ""), ...process.env };
const site = (env.PUBLIC_SITE_URL || "https://www.estanzacx.com").replace(/\/$/, "");
const clean = (v) => (typeof v === "string" ? v.trim().replace(/^["']|["']$/g, "") : "");

/** <lastmod> for the sitemap: the last time the Página or Ajustes document was published in Sanity
 *  (a real content change, never the build date). Without Sanity, or if the request fails, the
 *  sitemap simply has no dates. */
async function lastModified() {
  const projectId = clean(env.PUBLIC_SANITY_PROJECT_ID);
  if (!projectId) return undefined;
  try {
    const client = createClient({ projectId, dataset: clean(env.PUBLIC_SANITY_DATASET) || "production", apiVersion: "2025-01-01", useCdn: false });
    return (await client.fetch(`*[_id in ["landing", "settings"]] | order(_updatedAt desc)[0]._updatedAt`)) || undefined;
  } catch (e) {
    console.warn("[estanza] sitemap: could not read the last-modified date from Sanity:", e.message);
    return undefined;
  }
}
const lastmod = await lastModified();

export default defineConfig({
  output: "static",
  site,
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "never" },
  compressHTML: true,
  integrations: [
    // sitemap-index.xml with hreflang alternates for the two locales; 404 stays out.
    sitemap({
      i18n: { defaultLocale: "es", locales: { es: "es", en: "en" } },
      filter: (page) => !page.includes("/404"),
      serialize: (item) => (lastmod ? { ...item, lastmod } : item),
    }),
  ],
});
