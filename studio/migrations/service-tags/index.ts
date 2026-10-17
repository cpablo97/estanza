import { at, defineMigration, set, type NodePatch } from "sanity/migrate";

// One-off: the client typed service 1's three deliverables into the Spanish
// description as a dash list. Move them into the new `tags` field and strip
// them from the body. English wording follows the existing English body;
// the client should review it in the studio.
const TAGS = [
  { es: "Diagnóstico integral", en: "Comprehensive diagnosis" },
  { es: "Sesión de trabajo con el equipo", en: "Working session with the team" },
  { es: "Hoja de ruta y recomendaciones", en: "Roadmap and recommendations" },
];

export default defineMigration({
  title: "Move service 1's dash list into the tags field",
  documentTypes: ["landing"],
  migrate: {
    object(node, path) {
      if (node._type !== "service" || node._key !== "s1") return;
      const body = node.body as { es?: string } | undefined;
      const es = body?.es ?? "";
      const cut = es.indexOf("\n\n- ");
      const patches: NodePatch[] = [
        at("tags", set(TAGS.map((t, i) => ({ _type: "localeString", _key: `s1-tag-${i + 1}`, ...t })))),
      ];
      if (cut !== -1) patches.push(at(["body", "es"], set(es.slice(0, cut).trim())));
      return patches;
    },
  },
});
