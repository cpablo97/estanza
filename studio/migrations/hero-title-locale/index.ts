import { at, defineMigration, set } from "sanity/migrate";

// One-off: the hero's brand line was a plain string; it is now a localeString
// so the English page can carry its own wording. The existing phrase is copied
// into both languages.
export default defineMigration({
  title: "Make the hero title bilingual",
  documentTypes: ["landing"],
  migrate: {
    object(node) {
      if (node._type !== "heroSection" || typeof node.title !== "string") return;
      return at("title", set({ _type: "localeString", es: node.title, en: node.title }));
    },
  },
});
