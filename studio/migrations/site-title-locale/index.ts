import { at, defineMigration, set } from "sanity/migrate";

// One-off: the site title (browser tab, search results, Open Graph) was a
// single string shown on both languages; it is now a localeString. The
// existing text is copied into both languages for the client to refine.
export default defineMigration({
  title: "Make the site title bilingual",
  documentTypes: ["settings"],
  migrate: {
    document(doc) {
      if (typeof doc.siteTitle !== "string") return;
      return at("siteTitle", set({ _type: "localeString", es: doc.siteTitle, en: doc.siteTitle }));
    },
  },
});
