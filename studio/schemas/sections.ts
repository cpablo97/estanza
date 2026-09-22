import { defineField, defineType, defineArrayMember } from "sanity";

export const BACKGROUNDS = [
  { title: "Arena", value: "#dfd8cb" },
  { title: "Arena oscura", value: "#d3cbbc" },
  { title: "Borgoña", value: "#431919" },
  { title: "Marrón", value: "#684433" },
];

// Fields every room shares. Order in the page array = order of the rooms.
const shared = [
  defineField({
    name: "anchor",
    title: "Ancla (URL)",
    type: "slug",
    description: "Identificador en la dirección, p. ej. #servicios. Sin espacios ni acentos.",
    options: { source: (_doc, ctx) => (ctx.parent as any)?.title?.es || (ctx.parent as any)?.roomLabel?.es || "" },
    validation: (r) => r.required(),
  }),
  defineField({
    name: "menuGroup",
    title: "Grupo del menú",
    type: "localeString",
    description: "Secciones seguidas con el mismo grupo se agrupan bajo un numeral (I., II., …).",
    validation: (r) => r.required(),
  }),
  defineField({ name: "menuLabel", title: "Enlace en el menú", type: "localeString", description: "Vacío = sin enlace propio." }),
  defineField({ name: "roomLabel", title: "Nombre corto (pie del menú)", type: "localeString", validation: (r) => r.required() }),
  defineField({
    name: "background",
    title: "Color de fondo",
    type: "string",
    options: { list: BACKGROUNDS },
    initialValue: "#dfd8cb",
    validation: (r) => r.required(),
  }),
  defineField({ name: "customBackground", title: "Color personalizado (hex)", type: "string", description: "Opcional; sustituye al color de fondo. Formato #rrggbb.", validation: (r) => r.regex(/^#[0-9a-fA-F]{6}$/).warning("Usa formato #rrggbb") }),
];

const eyebrowTitle = [
  defineField({ name: "eyebrow", title: "Antetítulo", type: "localeString" }),
  defineField({ name: "title", title: "Título", type: "localeString", validation: (r) => r.required() }),
];

const preview = (subtitle: string) => ({
  select: { title: "title.es", label: "roomLabel.es" },
  prepare: ({ title, label }: any) => ({ title: title || label || "Sección", subtitle }),
});

export const heroSection = defineType({
  name: "heroSection",
  title: "Portada",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Título (frase de marca)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "ctaLabel", title: "Botón", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "ctaTarget", title: "El botón lleva a (ancla)", type: "string", description: "Escribe el ancla de otra sección, p. ej. contacto.", validation: (r) => r.required() }),
    defineField({
      name: "photos",
      title: "Fotos flotantes",
      type: "array",
      of: [defineArrayMember({ type: "localeImage" })],
      validation: (r) => r.min(2).max(4),
    }),
    ...shared,
  ],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title, subtitle: "Portada" }) },
});

export const textImageSection = defineType({
  name: "textImageSection",
  title: "Texto + imagen",
  type: "object",
  fields: [
    ...eyebrowTitle,
    defineField({ name: "body", title: "Cuerpo", type: "localeBlock", validation: (r) => r.required() }),
    defineField({ name: "image", title: "Imagen", type: "localeImage", validation: (r) => r.required() }),
    defineField({ name: "imageSide", title: "Imagen a la", type: "string", options: { list: [{ title: "derecha", value: "right" }, { title: "izquierda", value: "left" }], layout: "radio" }, initialValue: "right" }),
    ...shared,
  ],
  preview: preview("Texto + imagen"),
});

export const servicesSection = defineType({
  name: "servicesSection",
  title: "Servicios (carrusel)",
  type: "object",
  fields: [
    ...eyebrowTitle,
    defineField({
      name: "items",
      title: "Servicios",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "service",
          fields: [
            defineField({ name: "menuLabel", title: "Enlace en el menú", type: "localeString", validation: (r) => r.required() }),
            defineField({ name: "title", title: "Título", type: "localeString", validation: (r) => r.required() }),
            defineField({ name: "body", title: "Descripción", type: "localeText", validation: (r) => r.required() }),
            defineField({ name: "stripe", title: "Patrón lateral", type: "image", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title.es" } },
        }),
      ],
      validation: (r) => r.min(1),
    }),
    ...shared,
  ],
  preview: preview("Servicios"),
});

export const stepsSection = defineType({
  name: "stepsSection",
  title: "Pasos numerados",
  type: "object",
  fields: [
    ...eyebrowTitle,
    defineField({
      name: "steps",
      title: "Pasos",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [
            defineField({ name: "title", title: "Título", type: "localeString", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Texto", type: "localeText", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title.es" } },
        }),
      ],
      validation: (r) => r.min(1),
    }),
    ...shared,
  ],
  preview: preview("Pasos"),
});

export const contactSection = defineType({
  name: "contactSection",
  title: "Contacto (formulario)",
  type: "object",
  fields: [
    ...eyebrowTitle,
    defineField({ name: "lede", title: "Entradilla", type: "localeText" }),
    defineField({ name: "disclaimer", title: "Aviso del formulario", type: "localeText", validation: (r) => r.required() }),
    ...shared,
  ],
  preview: preview("Contacto"),
});

export const closingSection = defineType({
  name: "closingSection",
  title: "Cierre",
  type: "object",
  fields: [
    ...eyebrowTitle,
    defineField({ name: "line", title: "Frase", type: "localeText" }),
    defineField({ name: "showLinkedin", title: "Mostrar LinkedIn", type: "boolean", initialValue: true }),
    ...shared,
  ],
  preview: preview("Cierre"),
});

export const genericSection = defineType({
  name: "genericSection",
  title: "Sección nueva (texto, imagen opcional)",
  type: "object",
  fields: [
    ...eyebrowTitle,
    defineField({ name: "body", title: "Cuerpo", type: "localeBlock" }),
    defineField({ name: "image", title: "Imagen (opcional)", type: "localeImage" }),
    defineField({ name: "imageSide", title: "Imagen a la", type: "string", options: { list: [{ title: "derecha", value: "right" }, { title: "izquierda", value: "left" }], layout: "radio" }, initialValue: "right" }),
    ...shared,
  ],
  preview: preview("Sección"),
});
