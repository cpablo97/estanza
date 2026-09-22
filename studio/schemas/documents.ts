import { defineField, defineType, defineArrayMember } from "sanity";

export const landing = defineType({
  name: "landing",
  title: "Página",
  type: "document",
  fields: [
    defineField({
      name: "sections",
      title: "Secciones (arrastra para reordenar)",
      type: "array",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "textImageSection" }),
        defineArrayMember({ type: "servicesSection" }),
        defineArrayMember({ type: "stepsSection" }),
        defineArrayMember({ type: "contactSection" }),
        defineArrayMember({ type: "closingSection" }),
        defineArrayMember({ type: "genericSection" }),
      ],
      validation: (r) =>
        r.custom((sections: any[] = []) => {
          const count = (t: string) => sections.filter((s) => s._type === t).length;
          if (count("heroSection") !== 1) return "Debe haber exactamente una Portada.";
          if (count("contactSection") > 1) return "Solo puede haber una sección de Contacto.";
          if (count("closingSection") > 1) return "Solo puede haber una sección de Cierre.";
          const anchors = sections.map((s) => s.anchor?.current).filter(Boolean);
          if (new Set(anchors).size !== anchors.length) return "Dos secciones comparten la misma ancla.";
          return true;
        }),
    }),
  ],
  preview: { prepare: () => ({ title: "Página" }) },
});

const label = (name: string, title: string) => defineField({ name, title, type: "localeString", validation: (r) => r.required() });

export const settings = defineType({
  name: "settings",
  title: "Ajustes",
  type: "document",
  groups: [
    { name: "site", title: "Sitio", default: true },
    { name: "contact", title: "Contacto" },
    { name: "labels", title: "Textos de interfaz" },
  ],
  fields: [
    defineField({ name: "siteTitle", title: "Título del sitio (pestaña y buscadores)", type: "string", group: "site", validation: (r) => r.required() }),
    defineField({ name: "metaDescription", title: "Descripción (buscadores)", type: "localeText", group: "site" }),
    defineField({ name: "siteUrl", title: "Dominio", type: "url", group: "site", description: "p. ej. https://estanzacx.com" }),
    defineField({ name: "ogImage", title: "Imagen para redes (1200×630)", type: "image", group: "site" }),
    defineField({ name: "copyrightName", title: "Nombre en el ©", type: "string", group: "site", initialValue: "Estanza" }),

    defineField({ name: "email", title: "Correo", type: "string", group: "contact", validation: (r) => r.required().email() }),
    defineField({ name: "linkedin", title: "LinkedIn (URL)", type: "url", group: "contact" }),
    defineField({ name: "phonePrefixDefault", title: "Indicativo por defecto", type: "string", group: "contact", initialValue: "+57" }),
    defineField({ name: "formEndpoint", title: "Servicio del formulario (URL)", type: "string", group: "contact", description: "Vacío = Netlify Forms. O una URL tipo Formspree." }),

    defineField({
      name: "labels",
      title: "Textos de interfaz",
      type: "object",
      group: "labels",
      fields: [
        label("menu", "Menú principal (accesibilidad)"),
        label("openMenu", "Abrir menú"),
        label("closeMenu", "Cerrar menú"),
        label("language", "Idioma"),
        label("logo", "Logo — ir al inicio"),
        label("prevService", "Servicio anterior"),
        label("nextService", "Servicio siguiente"),
        label("carousel", "Carrusel"),
        label("slide", "Diapositiva"),
        label("firstName", "Nombre"),
        label("lastName", "Apellido"),
        label("email", "Correo electrónico"),
        label("phone", "Número de teléfono"),
        label("phonePrefix", "Indicativo del país"),
        label("organisation", "Organización (opcional)"),
        label("send", "Enviar"),
        label("statusRequired", "Aviso: campos requeridos"),
        label("statusSending", "Aviso: enviando"),
        label("statusSuccess", "Aviso: enviado"),
        label("statusLogged", "Aviso: sin servicio configurado"),
        label("statusError", "Aviso: error"),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Ajustes" }) },
});
