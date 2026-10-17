import { at, defineMigration, set, unset, type NodePatch } from "sanity/migrate";

// One-off: Settings.linkedin (single URL) becomes Settings.socialLinks (up to
// four name + URL entries), and the closing section's showLinkedin toggle
// becomes showSocial.
export default defineMigration({
  title: "Move the LinkedIn URL into socialLinks and rename showLinkedin",
  documentTypes: ["settings", "landing"],
  migrate: {
    document(doc) {
      if (doc._type !== "settings") return;
      const linkedin = doc.linkedin as string | undefined;
      const patches: NodePatch[] = [at("linkedin", unset())];
      if (linkedin && !doc.socialLinks) {
        patches.push(at("socialLinks", set([{ _type: "socialLink", _key: "linkedin", label: "LinkedIn", url: linkedin }])));
      }
      return patches;
    },
    object(node) {
      if (node._type !== "closingSection" || !("showLinkedin" in node)) return;
      return [at("showSocial", set(node.showLinkedin !== false)), at("showLinkedin", unset())];
    },
  },
});
