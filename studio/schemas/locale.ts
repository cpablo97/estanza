import { defineField, defineType } from "sanity";

const langs = [
  { id: "es", title: "Español" },
  { id: "en", title: "English" },
];

// Field-level localisation: ES and EN side by side, ES required.
export const localeString = defineType({
  name: "localeString",
  title: "Texto (ES / EN)",
  type: "object",
  options: { columns: 2 },
  fields: langs.map((l) =>
    defineField({ name: l.id, title: l.title, type: "string", validation: (r) => (l.id === "es" ? r.required() : r) })
  ),
});

export const localeText = defineType({
  name: "localeText",
  title: "Párrafo (ES / EN)",
  type: "object",
  options: { columns: 2 },
  fields: langs.map((l) =>
    defineField({ name: l.id, title: l.title, type: "text", rows: 4, validation: (r) => (l.id === "es" ? r.required() : r) })
  ),
});

export const localeBlock = defineType({
  name: "localeBlock",
  title: "Cuerpo (ES / EN)",
  type: "object",
  fields: langs.map((l) =>
    defineField({
      name: l.id,
      title: l.title,
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Párrafo", value: "normal" }],
          lists: [],
          marks: { decorators: [{ title: "Cursiva", value: "em" }], annotations: [] },
        },
      ],
      validation: (r) => (l.id === "es" ? r.required() : r),
    })
  ),
});

export const localeImage = defineType({
  name: "localeImage",
  title: "Imagen",
  type: "image",
  options: { hotspot: true },
  fields: [defineField({ name: "alt", title: "Texto alternativo (ES / EN)", type: "localeString", validation: (r) => r.required() })],
});
