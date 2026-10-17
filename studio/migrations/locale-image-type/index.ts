import { at, defineMigration, set } from "sanity/migrate";

// The seed script stored hero photos and section images as plain "image";
// the schema declares them as "localeImage" (image + ES/EN alt text).
export default defineMigration({
  title: "Retype seeded hero photos and section images as localeImage",
  documentTypes: ["landing"],
  migrate: {
    object(node, path) {
      if (node._type !== "image") return;
      const field = path[path.length - 1];
      const parent = path[path.length - 2];
      if (field === "image" || parent === "photos") return at("_type", set("localeImage"));
    },
  },
});
