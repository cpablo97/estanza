import { at, defineMigration, set, type NodePatch } from "sanity/migrate";

// One-off: default wording for the three interface labels added with the
// data-policy checkbox, so the live Settings document stays valid and the
// form has text to show. Editable afterwards in Ajustes → Textos de interfaz.
const LABELS: Record<string, { es: string; en: string }> = {
  privacyAccept: { es: "He leído y acepto la", en: "I have read and accept the" },
  privacyPolicy: { es: "política de tratamiento de datos", en: "data protection policy" },
  statusPrivacy: {
    es: "Debes aceptar la política de tratamiento de datos para enviar.",
    en: "Please accept the data protection policy to send.",
  },
};

export default defineMigration({
  title: "Add the data-policy checkbox labels to Settings",
  documentTypes: ["settings"],
  migrate: {
    document(doc) {
      const labels = (doc.labels ?? {}) as Record<string, unknown>;
      const patches: NodePatch[] = [];
      for (const [key, value] of Object.entries(LABELS)) {
        if (!labels[key]) patches.push(at(["labels", key], set({ _type: "localeString", ...value })));
      }
      return patches;
    },
  },
});
