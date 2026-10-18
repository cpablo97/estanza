# Estanza

Landing page for Estanza (CX consulting). Static site built with **Astro** from content in **Sanity**, deployed on **Netlify**.

```
site/     Astro site  →  npm run dev | npm run build   (falls back to src/content/seed.json without Sanity)
studio/   Sanity Studio  →  npm run dev | npm run deploy
scripts/  seed.mjs — pushes the original content and images into a fresh Sanity dataset
docs/     editing.md — guide for the client (Spanish)
```

## First-time setup
1. `cd studio && npx sanity login && npx sanity init --env` (creates the project and writes `.env`); copy the project id into `site/.env` as `PUBLIC_SANITY_PROJECT_ID`.
2. Create a write token in sanity.io/manage → API → Tokens, then from the repo root:
   `SANITY_STUDIO_PROJECT_ID=… SANITY_WRITE_TOKEN=… node scripts/seed.mjs`
3. `cd studio && npm run deploy` → https://estanza.sanity.studio. Add CORS origins (localhost:4321, the Netlify domain) in sanity.io/manage → API.
4. Netlify: new site from this repo (settings are in `netlify.toml`); set `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SITE_URL`. Create a Build Hook and register it as a webhook in Sanity (API → Webhooks, trigger on create/update/delete).
5. Invite the client as Editor in sanity.io/manage → Members.

## Local development
`cd site && npm install && npm run dev` — works with or without Sanity credentials.

## Buscadores
El sitio publica `robots.txt`, `sitemap-index.xml` (con alternativas es/en), una página 404 propia y
datos estructurados (ProfessionalService + WebSite) generados desde *Ajustes*. Pasos únicos en cuentas
externas:
1. **Google Search Console**: añadir la propiedad `estanzacx.com` (tipo *Dominio*), verificar con el registro
   TXT en el DNS del dominio y en *Sitemaps* enviar `https://www.estanzacx.com/sitemap-index.xml`.
2. **Bing Webmaster Tools**: importar desde Search Console o enviar el mismo sitemap.
3. Revisar los datos estructurados con https://validator.schema.org pegando la URL.

## Formulario de contacto (Netlify Forms)

El formulario ya está preparado para Netlify Forms (`name="contacto"`, campo oculto `form-name`,
honeypot). Lo que falta se configura una sola vez en el panel de Netlify, no en el código:

1. **Activar la detección**: Site configuration → Forms → *Enable form detection*. Después hace
   falta un deploy nuevo (Deploys → *Trigger deploy*) para que Netlify lea el HTML y registre el
   formulario. Al terminar, en **Forms** aparece `contacto` con sus campos (nombre, apellido,
   email, prefijo, telefono, organizacion, privacidad).
2. **Correo por cada envío**: Site configuration → Notifications → *Emails and webhooks* →
   *Form submission notifications* → *Add notification* → *Email notification*; evento
   *New form submission*, formulario `contacto`, y la dirección que debe recibirlo. Se pueden
   añadir varias direcciones creando una notificación por cada una.
3. **Exportar a Excel**: Forms → `contacto` → *Download CSV*. El CSV abre directamente en Excel
   o Google Sheets. Los envíos marcados como spam quedan en la pestaña *Spam* y no se exportan.

Límites del plan gratuito: 100 envíos al mes y los datos se conservan mientras exista el sitio.
Si se superan, Netlify cobra el nivel siguiente o deja de almacenar; en ese caso la alternativa
es un servicio tipo Formspree, que el sitio ya admite poniendo su URL en *Ajustes → Servicio del
formulario*.
