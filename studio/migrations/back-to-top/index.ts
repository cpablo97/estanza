import { at, defineMigration, set } from "sanity/migrate";

// One-off: default wording for the back-to-top arrow added to the closing
// section, so the field shows its text in the studio instead of empty.
// Editable afterwards in Página → Cierre.
export default defineMigration({
  title: "Add the back-to-top label to the closing section",
  documentTypes: ["landing"],
  migrate: {
    object(node) {
      if (node._type !== "closingSection" || node.backToTopLabel) return;
      return at("backToTopLabel", set({ _type: "localeString", es: "Volver arriba", en: "Back to top" }));
    },
  },
});
