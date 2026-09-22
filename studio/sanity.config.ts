import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "REPLACE_WITH_PROJECT_ID";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

// The two documents the client edits are singletons: no "create new" for them.
const singletons = new Set(["landing", "settings"]);

export default defineConfig({
  name: "estanza",
  title: "Estanza",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items([
            S.listItem()
              .title("Página")
              .id("landing")
              .child(S.document().schemaType("landing").documentId("landing").title("Página")),
            S.listItem()
              .title("Ajustes")
              .id("settings")
              .child(S.document().schemaType("settings").documentId("settings").title("Ajustes")),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => prev.filter((t) => !singletons.has(t.schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      singletons.has(schemaType)
        ? prev.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : prev,
  },
});
