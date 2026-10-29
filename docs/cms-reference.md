# Estanza — CMS reference for writing the client manual

> **Purpose of this file.** This is a complete, code-verified description of the Sanity Studio that the
> client uses to edit estanzacx.com. It is written for Claude (Claude Desktop) to use as the single
> source of truth when writing the client-facing user manual. Everything below was derived from the
> schema files in `studio/schemas/`, the front-end in `site/src/`, the scripts in `site/public/js/`
> and the stylesheet, on 2026-10-23. Where the behaviour is subtle or counter-intuitive it is spelled
> out; do not soften or "improve" those statements in the manual.

---

## 0. Instructions for Claude when writing the manual

- **Audience:** the client. A non-technical marketing/business person who runs a Client Experience
  consultancy in Bogotá, Colombia. Comfortable with web forms and Word, not with code or SEO jargon.
- **Language of the manual:** Spanish (Colombia), using *tú*. Keep the exact Spanish labels that appear
  in the Studio (listed throughout this file in **bold**) so the client can match screen to manual.
  Explain SEO and accessibility terms the first time they appear. If the user asks for an English
  manual instead, keep the Spanish Studio labels in bold and translate the explanations.
- **Tone:** calm, concrete, reassuring. Say what each field does on the live site, what happens when it
  is empty, and what the client should write in it. Prefer "what you see on the page" over "what the
  system does internally".
- **Do not** mention file names, field identifiers (`anchor`, `menuGroup`…), GROQ, Netlify
  configuration details, or code. Those appear in this file only so Claude can reason precisely.
- **Do not invent** fields, buttons or behaviours that are not in this file. If the manual needs
  something this file does not cover, say so to the user instead of guessing.
- **Structure suggestion** (adapt as needed): 1) what the site is and how publishing works,
  2) getting into the Studio and the two documents, 3) concepts that apply everywhere
  (ES/EN texts, images, anchors, menu groups, colours), 4) **Página** section by section,
  5) **Ajustes** tab by tab, 6) step-by-step recipes, 7) troubleshooting, 8) what is *not* editable
  and needs the developer.
- A short glossary of exact Studio labels → plain meaning is useful at the end.

---

## 1. The site in one paragraph

A single-page, bilingual (Spanish `/`, English `/en/`) landing page for **Estanza**, a Client
Experience consultancy. The page is a horizontal sequence of full-screen **"rooms"** (sections), each
with its own background colour. A fixed **sidebar menu** on the left lists the sections in numbered
groups (I., II., III.…), shows the language switch (*español / english*), and at the bottom shows the
name of the room currently on screen with a counter like **03 / 07**. On phones the sidebar becomes a
hamburger drawer. All content comes from Sanity; the site is rebuilt and redeployed automatically on
Netlify every time something is **published** in the Studio (about one to two minutes). Until launch the
whole site is behind a username/password prompt (username `estanza`); that is a Netlify setting, not
something in the Studio.

Live site: https://www.estanzacx.com — Studio: https://estanza.sanity.studio

---

## 2. The Studio at a glance

- **Login:** https://estanza.sanity.studio with the client's e-mail (invited as *Editor*). The Studio
  interface language is whatever Sanity shows (English by default); all *field labels* are in Spanish
  because they were written in Spanish.
- **Left-hand list "Contenido"** has exactly two entries:
  - **Página** — the landing page. It contains one thing: the ordered list of sections.
  - **Ajustes** — everything that is not a section: SEO, e-mail, social links, form settings,
    privacy PDF, and all the small interface texts.
- Both are **singletons**: there is no "create new", no duplicate, no delete, no unpublish. The only
  document actions available are **Publish** (*Publicar*), **Discard changes** (*Descartar cambios*,
  returns to the last published version) and **Restore** (from the document's history/*Revisar
  cambios*, to go back to an earlier published version).
- **Drafts:** every keystroke is saved automatically as a draft. Nothing reaches the website until
  **Publish** is pressed (bottom right). The Publish button is **disabled while any validation error
  exists** (see §7). Yellow *warnings* do not block publishing.
- **Página** and **Ajustes** are published independently. If both were edited, publish both.
- **Vision** (a tab/plug-in in the Studio top bar) is a developer query tool. The client should ignore it.
- Images and the PDF live in Sanity's **media library**: when choosing an image you can **Upload**
  (*Subir*) a new file or **Select** (*Seleccionar*) one already uploaded. Reusing the same photo in
  two places is fine.

---

## 3. Concepts that apply everywhere

### 3.1 Bilingual texts (ES / EN)
Almost every text field is a pair of columns: **Español** and **English**.
- **Español is required**; the Publish button is blocked if a required Spanish field is empty.
- **English is optional**. If English is empty, the English page shows the Spanish text in its place.
  That is the fallback rule everywhere on the site, including interface labels and alt texts.
- There are three kinds of text fields, visually different in the Studio:
  1. **Texto (ES / EN)** — one line. Used for titles, labels, menu entries, buttons, tags.
  2. **Párrafo (ES / EN)** — a plain multi-line box (4 rows). Rendered on the site as **one
     paragraph**; line breaks typed inside are *not* preserved as separate paragraphs. Used for service
     descriptions, step texts, the contact lede and disclaimer, the closing line, the meta description.
  3. **Cuerpo (ES / EN)** — a small rich-text editor. Each paragraph in the editor becomes a paragraph
     on the page. **The only formatting available is *Cursiva* (italic).** There is no bold, no links,
     no headings, no bullet lists, no colours. Used for the body of **Texto + imagen** and **Sección nueva**.

### 3.2 Images
- Image fields open Sanity's image input: **Upload**, **Select** from the library, and, once an image
  is set, a menu with **Edit hotspot and crop** (*Editar punto de interés / recorte*) and *Remove*.
- Accepted: JPG, PNG, WebP (any common web format). The site converts and resizes automatically
  (WebP with JPEG fallback), so the client should upload good-quality originals and not worry about
  file size optimisation; 1,000–2,000 px on the long side is plenty.
- **Crop vs. hotspot — important nuance:** in the hotspot/crop editor, the **crop** (the rectangle
  with corner handles) *is* applied on the site: anything outside is cut. The **hotspot** (the circle)
  currently has **no visible effect** on this site, because images are requested by width only and
  then centred inside their frame. Tell the client: *to control which part of a photo is visible, drag
  the crop handles; the circle can be ignored.*
- **Texto alternativo (ES / EN)** appears under most images and is **required (Spanish)**. It is the
  description read by screen readers and used by search engines; it is not shown visually. One short
  sentence describing the photo ("Equipo de Estanza conversando en la oficina").
- Two image fields have **no alt text and no hotspot**: the **Patrón lateral** of a service (decorative
  pattern, deliberately silent for screen readers) and **Imagen para redes** in Ajustes.
- Frames on the site are fixed; images are scaled to fill them ("cover"):
  - Hero floating photos: portrait, ratio 407:647 (roughly 2:3). Upload portrait photos.
  - Texto + imagen with image on the **right**: ratio 265:300 (almost square, slightly tall).
  - Texto + imagen with image on the **left**: ratio 265:368 (taller) and the photo spans the height
    of title + text.
  - Service pattern: a thin vertical band 123 px wide at the full height of the card on desktop; on
    phones it becomes a horizontal band 48 px tall at the top of the card. Square ~512 px abstract
    patterns work well; it is cropped heavily either way.
  - Social-share image: 1200×630 px landscape, shown as-is by WhatsApp/LinkedIn/etc.

### 3.3 Anchors (**Ancla (URL)**)
Every section has an **Ancla**: a short identifier like `servicios` or `contacto`.
- It becomes the section's address: `https://www.estanzacx.com/#servicios`. Menu links, the hero
  button and the logo all jump to anchors.
- Lowercase, no spaces, no accents, hyphens allowed (`tu-proyecto`). The **Generate** button next to
  the field derives it from the section's Spanish title (or its short name).
- **Must be unique** across all sections; a duplicate blocks publishing.
- **Changing an anchor** has side effects: the hero button field **El botón lleva a (ancla)** must be
  updated if it pointed to it, and any link someone has already shared with the old `#ancla` will open
  the page at the top instead of at that section. Advise: choose once, change rarely.

### 3.4 Menu groups and numerals (**Grupo del menú**, **Enlace en el menú**, **Nombre corto**)
The sidebar is generated from the sections, in page order:
- **Grupo del menú** (ES/EN, required): the heading of a numbered group in the sidebar. **Consecutive
  sections that have the same group text are merged under one numeral** (I., II., III.… up to X.).
  Sections with the same group text that are *not* next to each other produce two separate numerals
  with the same name. The comparison is done per language, so if two sections share the Spanish group
  text they must also share the English one, or the English menu will split differently.
- **Enlace en el menú** (ES/EN, optional): the clickable link shown under the group heading for this
  section. **Empty = no link** for that section (the group heading still appears). The Hero (Portada)
  normally has none. The **Servicios** section does not show this field: each service provides its
  own link instead (see §4.4).
- The **Contacto** section's group also receives, automatically, the contact **e-mail** and the
  **social links** from Ajustes, shown as small arrow links.
- **Nombre corto (pie del menú)** (ES/EN, required): the name shown at the bottom of the sidebar next
  to the counter (e.g. *servicios — 04 / 07*) while that room is on screen. Keep it short and
  lowercase to match the design (`inicio`, `sobre estanza`, `servicios`…).
- The logo in the sidebar always links to the **first** section in the list.
- The counter total is simply the number of sections.

### 3.5 Background colour and automatic light/dark text (**Color de fondo**, **Color personalizado**)
- **Color de fondo** (required) is a choice of four brand colours:

  | Label in Studio | Hex | Text becomes |
  |---|---|---|
  | **Arena** (default) | #dfd8cb | dark text |
  | **Arena oscura** | #d3cbbc | dark text |
  | **Borgoña** | #431919 | light text |
  | **Marrón** | #684433 | light text |

- **Color personalizado (hex)** (optional): any colour in `#rrggbb` form **replaces** the chosen
  preset. An invalid value shows a yellow warning and is silently ignored on the site. The site decides
  light or dark text automatically from the colour's brightness (dark text on light colours, light text
  on dark ones); mid-tone colours can give poor contrast, so advise sticking to the presets or testing.
- The whole room (and the sidebar while that room is active) takes the colour; the slide transition
  reveals it like a page turn.

### 3.6 Order of sections
The order of the list in **Página → Secciones** is the order of the rooms on the site, the order of
the menu, and the basis for numerals and the counter. Drag the handle (⋮⋮) at the left of each item to
reorder. The first item should be the **Portada** (the design assumes it; the logo links there).

---

## 4. **Página** → **Secciones (arrastra para reordenar)**

One array of sections. **Añadir elemento** (*Add item*) offers seven section types. Rules enforced
when publishing (§7): exactly **one Portada**, at most **one Contacto**, at most **one Cierre**,
unique anchors. Each item shows its Spanish title and type in the list; click to expand.

### 4.0 Fields shared by every section type (appear at the bottom of each section)

| Studio label | Required | What it does on the site |
|---|---|---|
| **Ancla (URL)** | yes | Section address `#ancla`; target of menu links and the hero button. Unique. See §3.3 |
| **Grupo del menú** (ES/EN) | yes | Sidebar group heading; consecutive equal groups share a numeral. See §3.4 |
| **Enlace en el menú** (ES/EN) | no | Link under the group heading; empty = none; not shown on Servicios |
| **Nombre corto (pie del menú)** (ES/EN) | yes | Room name beside the counter in the sidebar footer |
| **Color de fondo** | yes | Room background; drives light/dark text. See §3.5 |
| **Color personalizado (hex)** | no | Overrides the preset when valid `#rrggbb` |

### 4.1 **Portada** (hero) — exactly one, normally first
Full-screen opening room: a very large brand line, one button, and 2–4 photos that float slowly
across the room behind the text.

| Studio label | Required | Behaviour |
|---|---|---|
| **Título (frase de marca)** (ES/EN) | yes | The big headline (the page's main heading for search engines). Help text in the Studio: if the phrase is the same in both languages, repeat it in both fields. Current value: "Turning clients into guests" in both. If the Spanish page shows the English phrase, the site marks it as English for screen readers automatically. |
| **Botón** (ES/EN) | yes | Text of the single call-to-action button (current: *Conversemos* / *Let's talk*). |
| **El botón lleva a (ancla)** | yes | The **anchor of another section**, typed exactly, without `#` (current: `contacto`). If it does not match any section's Ancla the button scrolls nowhere. |
| **Fotos flotantes** | 2 to 4 | Each is an image with **Texto alternativo (ES/EN)** required. Portrait frames (≈2:3). Desktop/tablet: all photos float in lanes (first and third in the upper band, second in the lower band). **Phones (< 600 px wide): only the first two photos are shown**, stacked under the text; the third and fourth are hidden. The first photo is loaded with priority, so it should be the strongest one. Order in the list = order of the lanes. |
| shared fields | | Hero normally has **Enlace en el menú** empty; its group is just the heading of numeral I. |

No eyebrow, no body text, no colour switch beyond the shared background field.

### 4.2 **Texto + imagen**
Classic two-column room: small eyebrow, title, one or more paragraphs, one photo.

| Studio label | Required | Behaviour |
|---|---|---|
| **Antetítulo** (ES/EN) | no | Small uppercase label above the title (e.g. *fundadora*). Empty = omitted. |
| **Título** (ES/EN) | yes | Section heading. |
| **Cuerpo** (ES/EN) | yes | Rich text: paragraphs + italic only (§3.1). Each editor paragraph = one paragraph on the page. |
| **Imagen** | yes | Photo with required alt text. Frame ratio depends on side (§3.2). |
| **Imagen a la** | — | Radio: **derecha** (default) or **izquierda**. Right: photo beside the text, frame ≈ square. Left: taller photo spanning title + text (used for the founder portrait). On phones the photo is 240 px wide, placed according to the same order. |

Currently used twice: *Sobre Estanza* (image right) and *Detrás de Estanza* (image left, founder).

### 4.3 **Sección nueva (texto, imagen opcional)**
Identical to **Texto + imagen** on the site, but **Cuerpo** and **Imagen (opcional)** are optional, so it
can be a text-only room. Intended for the client to add new content without the developer (e.g. a
"team" or "method" room). Fill the shared fields (Ancla, Grupo, Nombre corto, colour) and decide
whether it joins an existing group (same group text, placed next to it) or starts a new numeral.

### 4.4 **Servicios (carrusel)**
One room with a horizontal carousel of service cards, previous/next arrows and a **1 / 3** counter.

| Studio label | Required | Behaviour |
|---|---|---|
| **Antetítulo** (ES/EN) | no | Small label above the heading. |
| **Título** (ES/EN) | yes | Section heading (current: *Lo que hacemos*). |
| **Servicios** | at least 1 | The list of cards. Order = carousel order = order of links in the sidebar. Each card gets an automatic number **01, 02, 03…** |

Each service (**Añadir elemento** inside **Servicios**):

| Studio label | Required | Behaviour |
|---|---|---|
| **Enlace en el menú** (ES/EN) | yes | The link shown in the sidebar for this service. Clicking it opens the Servicios room **and slides the carousel to this card**; it is highlighted while that card is current. Keep it shorter than the title (*Talleres* vs *Talleres de hospitalidad y servicio*). |
| **Título** (ES/EN) | yes | Card heading. |
| **Descripción** (ES/EN) | yes | One plain paragraph. Do not put lists here — use **Incluye**. |
| **Incluye (hasta 3)** | 0 to 3 | Short phrases (deliverables / key points), each ES/EN. Shown as a ruled list under the description. Maximum three. |
| **Patrón lateral** | yes | Decorative pattern image, no alt text. Thin vertical band on the left of the card (horizontal band on phones). Heavily cropped; use the existing abstract patterns from the media library (*patron-03/04/05*) or similar. |

Notes for the manual: this section has no **Enlace en el menú** of its own (the field is hidden)
because every service already provides a link. Removing the last service blocks publishing.

### 4.5 **Pasos numerados**
A room with a heading and a vertical list of numbered steps (**01, 02, 03…** automatic).

| Studio label | Required | Behaviour |
|---|---|---|
| **Antetítulo** (ES/EN) | no | Small label above the heading. |
| **Título** (ES/EN) | yes | Section heading (current: *Cómo comenzamos*). |
| **Pasos** | at least 1 | Each step has **Título** (ES/EN, required) and **Texto** (ES/EN, required, one paragraph). Numbering follows the order; drag to reorder. No practical maximum, but the room scrolls if there are many. |

### 4.6 **Contacto (formulario)** — at most one
Two columns: intro text on the left, the contact form on the right.

| Studio label | Required | Behaviour |
|---|---|---|
| **Antetítulo** (ES/EN) | no | Small label above the heading. |
| **Título** (ES/EN) | yes | Heading (current: *Conversemos sobre la experiencia que quieres crear*). |
| **Entradilla** (ES/EN) | no | Lead paragraph under the heading. |
| **Aviso del formulario** (ES/EN) | yes | Italic note shown inside the form, just above the consent checkbox (e.g. how the data will be used / response time). |

What the client **cannot** change here, because it is fixed in the design: the set and order of form
fields — **Nombre, Apellido, Correo electrónico, Indicativo + Número de teléfono, Organización
(opcional)**, consent checkbox, **Enviar** button. What they *can* change about the form lives in
**Ajustes**: the wording of every label and message (**Textos de interfaz**), the default phone prefix,
the privacy PDF, and where submissions are sent (**Servicio del formulario**). The sidebar group of this
section automatically shows the e-mail and social links from Ajustes.

### 4.7 **Cierre** — at most one, normally last
Closing room: a title, an optional line, the contact e-mail, the social links, the © line and a back-to-top arrow.

| Studio label | Required | Behaviour |
|---|---|---|
| **Título** (ES/EN) | yes | Heading (current: *Nada en Estanza es al azar*). There is deliberately no eyebrow. |
| **Frase** (ES/EN) | no | One paragraph under the title. |
| **Mostrar redes sociales** | toggle, default on | On: lists the links from **Ajustes → Contacto → Redes sociales**. Off: hides them here (they still appear in the sidebar). |
| **Mostrar «Volver arriba»** | toggle, default on | On: a long thin arrow at the foot of the room that takes the visitor back to the first section. Off: no arrow. |
| **Texto bajo la flecha** (ES/EN) | no | Small caps label under the arrow (current: *Volver arriba* / *Back to top*). Hidden while the toggle is off. Empty = that default wording. |

Also shown, not editable in this section: the **Correo** from Ajustes (as a mailto link), and
**© {current year} {Nombre en el ©}**; the year updates itself.

---

## 5. **Ajustes**

Three tabs at the top of the document: **Sitio**, **Contacto**, **Textos de interfaz**.

### 5.1 Tab **Sitio** (search engines and social previews)

| Studio label | Required | Where it appears |
|---|---|---|
| **Título del sitio (pestaña y buscadores)** (ES/EN) | yes | Browser tab title, the blue title in Google results, the title of link previews on WhatsApp/LinkedIn, and the alt text of the share image. Help text: about 55 characters, brand + what the firm does. Current: *Estanza — Consultoría en Client Experience* / *Estanza — Client Experience consultancy*. |
| **Descripción (buscadores)** (ES/EN) | no (strongly recommended) | The grey text under the title in Google, and the description in link previews. About 150 characters. Empty = search engines pick their own snippet. |
| **Dominio** | no | The site's canonical address (current: `https://www.estanzacx.com`). Used to build the canonical URL, the es/en alternates, the sitemap, share URLs and structured data. **Should not be changed** unless the domain itself changes; a wrong value confuses search engines. |
| **Imagen para redes (1200×630)** | no | Image shown when the link is shared (Open Graph / Twitter card). Landscape 1200×630. No alt or crop controls. Empty = previews without image. |
| **Nombre en el ©** | no (default *Estanza*) | Brand name in the © line of Cierre, the site name in link previews, the organisation name in structured data, and the title of the "page not found" page. |
| **Ciudad (datos para buscadores)** | no | Not visible on the page. Sent to search engines as the firm's location (structured data). If empty, no address is sent at all. Current: *Bogotá*. |
| **País (código ISO de 2 letras)** | no (default *CO*) | Two uppercase letters; a yellow warning appears otherwise (does not block). Used with the city as country and "area served". |

### 5.2 Tab **Contacto**

| Studio label | Required | Behaviour |
|---|---|---|
| **Correo** | yes, valid e-mail | Shown as a clickable mail link in the **Cierre** room and in the sidebar under the Contacto group; also sent to search engines. **Important:** this is *not* where form submissions are delivered. Submissions go to Netlify (or the configured form service); e-mail notifications are configured in Netlify by the developer. |
| **Redes sociales (hasta 4)** | 0 to 4 | Each entry: **Nombre** (e.g. *LinkedIn*, *Instagram*) and **URL** (full address starting with https://). Shown, in this order, in the sidebar (Contacto group, opens in a new tab), in **Cierre** (if its toggle is on), and as the firm's profiles in structured data. Drag to reorder. |
| **Indicativo por defecto** | no (default *+57*) | The value pre-filled in the small country-code box of the phone field. Visitors can change it. |
| **Servicio del formulario (URL)** | no | **Empty = Netlify Forms** (submissions appear in the Netlify panel under *Forms → contacto*, with optional e-mail notifications and CSV export; free plan: 100 submissions/month). **A URL** (e.g. a Formspree endpoint) = submissions are posted there instead and Netlify no longer receives them. Changing this is a decision to make with the developer. |
| **Política de tratamiento de datos (PDF)** | no | PDF only. Linked from the consent checkbox in the form ("He leído y acepto la **política de tratamiento de datos**"), opens in a new tab. **Without a PDF the checkbox text appears without a link** (the checkbox is still required). To update the policy, upload a new PDF here and publish; the old link stops working. |

### 5.3 Tab **Textos de interfaz** (**Textos de interfaz** object, 24 labels, all ES/EN, all required)
Short texts used by the sidebar, carousel and form. Most are invisible labels for screen readers or
status messages; a few are visible form labels. Changing them never changes behaviour, only wording.

| Studio label | Shown where |
|---|---|
| **Menú principal (accesibilidad)** | Name of the sidebar for screen readers (not visible). |
| **Abrir menú** / **Cerrar menú** | Screen-reader name of the hamburger button on phones, switching as it opens/closes (not visible). |
| **Idioma** | Screen-reader name of the *español / english* switch (not visible). The words *español* and *english* themselves are fixed. |
| **Logo — ir al inicio** | Screen-reader name of the logo link (not visible). |
| **Servicio anterior** / **Servicio siguiente** | Screen-reader names of the carousel arrows (not visible). |
| **Carrusel** / **Diapositiva** | How screen readers announce the services carousel and each card (not visible). |
| **Nombre** | Visible label of the first-name field. |
| **Apellido** | Visible label of the last-name field. |
| **Correo electrónico** | Visible label of the e-mail field. |
| **Número de teléfono** | Visible label of the phone field. |
| **Indicativo del país** | Screen-reader name of the small prefix box (not visible). |
| **Organización (opcional)** | Visible label of the organisation field. Keep "(opcional)" so visitors know it is not required. |
| **Enviar** | Text of the submit button. |
| **Casilla: texto antes del enlace** | First part of the consent sentence, before the link (current: *He leído y acepto la*). |
| **Casilla: texto del enlace a la política** | The linked words (current: *política de tratamiento de datos*). Together they read as one sentence; mind the grammar between the two halves in both languages. |
| **Aviso: falta aceptar la política** | Error shown when the visitor presses Enviar without ticking the checkbox (the checkbox also shakes). |
| **Aviso: campos requeridos** | Error shown when a required field is empty or the e-mail is malformed. |
| **Aviso: enviando** | Status while sending (current: *Enviando…*). |
| **Aviso: enviado** | Success message after sending; the form clears. Keep it warm, it is the last thing the visitor reads. |
| **Aviso: sin servicio configurado** | Shown only in the unusual case where no form service is active at all. In the current setup it practically never appears, but it must have text. |
| **Aviso: error** | Shown when sending fails (network problem, service down). Good practice: include the e-mail address as an alternative, as the current text does. |

---

## 6. What happens after **Publish**

1. Sanity stores the new published version (history is kept; **Restore** can bring back an older one).
2. A webhook tells Netlify to rebuild the site. The build reads *all published content* from Sanity
   (drafts are never shown) and regenerates both language versions, the sitemap and the structured data.
3. One to two minutes later the new site is live. The browser may show the old version from cache: a
   normal reload (or opening in a private window) shows the new one.
4. If the site is still behind the launch password, publishing works exactly the same; the password is
   only a Netlify setting removed at launch.

---

## 7. Validation: what blocks publishing vs. what only warns

**Blocks (red, Publish disabled):**
- Any **Español** column of a required text field empty (titles, menu group, short name, button text,
  body of Texto + imagen, service description, step title/text, form disclaimer, site title, every
  interface label).
- **Texto alternativo** (Spanish) missing on a hero photo or a section image.
- **Página**: not exactly one **Portada**; more than one **Contacto**; more than one **Cierre**; two
  sections with the same **Ancla**; a section without **Ancla**, **Grupo del menú**, **Nombre corto** or
  **Color de fondo**.
- **Portada**: fewer than 2 or more than 4 photos; missing **El botón lleva a**.
- **Servicios**: no services; a service missing menu link, title, description or pattern; more than 3
  **Incluye** items.
- **Pasos**: no steps.
- **Texto + imagen**: missing **Cuerpo** or **Imagen**.
- **Ajustes**: **Correo** missing or not a valid e-mail; **Título del sitio** missing; more than 4
  social links; a social link without name or URL; a URL that is not a valid web address.

**Warns only (yellow, can still publish):**
- **Color personalizado** not in `#rrggbb` form (then it is ignored on the site).
- **País** not two uppercase letters.

**Not validated at all (client must take care):**
- **El botón lleva a (ancla)** matching an existing anchor.
- Lengths of the site title (~55) and description (~150).
- The English column being filled in (fallback to Spanish is silent).
- Image orientation/size versus the frame.

---

## 8. Not editable in the Studio (requires the developer)

Fonts; the colour palette beyond the four backgrounds; the logo and its subtitle; the words *español /
english* in the language switch; the set, order and names of form fields; the numbering formats
(01, 02 / I., II.); the layout of each section type; animations and transitions; the "page not found"
(404) page texts; the favicon; which hero photos are hidden on phones; the per-page Open Graph image
(there is only one); the Netlify form notifications and the launch password; the Studio's own tabs,
labels and help texts.

---

## 9. Step-by-step recipes worth including in the manual

- **Change a text:** Página → open the section → edit Español (and English) → Publish.
- **Replace a photo:** open the section → click the image → Upload/Select → drag the crop handles →
  write both alt texts → Publish.
- **Reorder sections:** drag ⋮⋮ in Página → check that groups you want merged stay adjacent → Publish.
- **Add a new room:** Página → Añadir elemento → Sección nueva → fill title/body/image, Ancla (Generate),
  Grupo del menú (copy an existing one to join its numeral, or write a new one), Enlace en el menú,
  Nombre corto, colour → Publish.
- **Add or edit a service:** Servicios → Servicios → Añadir elemento → fill all five fields → drag to
  position → Publish. The sidebar link appears automatically.
- **Add a social network:** Ajustes → Contacto → Redes sociales → Añadir elemento → Nombre + URL → Publish.
- **Replace the privacy policy:** Ajustes → Contacto → Política… → upload new PDF → Publish.
- **Change the e-mail shown on the site:** Ajustes → Contacto → Correo → Publish (and ask the developer
  to update the Netlify form notification if that address should also receive submissions).
- **Undo:** before publishing, *Discard changes*; after publishing, document menu → history → *Restore*
  an earlier version → Publish.

---

## 10. Troubleshooting entries

- **"I published but the site did not change":** wait two minutes, reload (or private window). Check
  that the right document was published (Página vs Ajustes). If it persists after 10 minutes, contact
  the developer (webhook/build issue).
- **"Publish is greyed out":** a red validation message exists somewhere; the Studio shows a red marker
  on the tab/section. Usually an empty Español field or a missing alt text.
- **"The English page shows Spanish":** the English column of that field is empty (fallback).
- **"The menu numerals changed":** two sections that shared a group are no longer adjacent, or their
  group text differs by a character/space (or differs only in English).
- **"The hero button does nothing":** **El botón lleva a** no longer matches a section's **Ancla**.
- **"The photo is cropped badly":** adjust the **crop** rectangle (not the circle) in the image editor,
  or upload a photo whose orientation matches the frame (§3.2).
- **"The checkbox has no link":** no PDF in **Política de tratamiento de datos**.
- **"Form messages are not arriving":** the Studio only controls wording; delivery is Netlify/Formspree
  — contact the developer.

---

## 11. Current content snapshot (for realistic examples in the manual)

Sections, in order (anchor · group · menu link · short name · colour):
1. **Portada** — `inicio` · *estanza* · (no link) · *inicio* · Arena. Title "Turning clients into guests", button *Conversemos* → `contacto`, 3 photos.
2. **Texto + imagen** — `sobre-estanza` · *estanza* · *Sobre Estanza* · *sobre estanza* · Arena, image right.
3. **Texto + imagen** — `detras-de-estanza` · *estanza* · *Detrás de Estanza* · *detrás de estanza* · Arena, image left (founder portrait). → Sections 1–3 form numeral **I. estanza**.
4. **Servicios (carrusel)** — `servicios` · *servicios* · *servicios* · Arena oscura. Title *Lo que hacemos*; 3 services: *Rediseño de experiencia* (3 Incluye items), *Talleres*, *Acompañamiento*. → **II. servicios** with three service links.
5. **Pasos numerados** — `tu-proyecto` · *tu proyecto* · *Cómo comenzamos* · *tu proyecto* · Arena. 3 steps. → **III. tu proyecto**.
6. **Contacto (formulario)** — `contacto` · *contacto* · *Ponte en contacto* · *contacto* · Borgoña (light text).
7. **Cierre** — `cierre` · *contacto* · (no link) · *cierre* · Marrón (light text), social on. → Sections 6–7 form **IV. contacto**, which also lists the e-mail and LinkedIn.

Ajustes: site title *Estanza — Consultoría en Client Experience* / *Estanza — Client Experience
consultancy*; domain `https://www.estanzacx.com`; e-mail `hola@estanzacx.com`; one social link
(LinkedIn, placeholder URL pending from the client); prefix *+57*; form service empty (Netlify Forms);
city *Bogotá*, country *CO*; privacy PDF not yet uploaded.

---

## 12. Glossary of Studio labels (Spanish label → plain meaning)

- **Página** → the landing page (its list of sections).
- **Ajustes** → global settings (SEO, contact, interface texts).
- **Secciones (arrastra para reordenar)** → the ordered rooms of the page.
- **Portada / Texto + imagen / Servicios (carrusel) / Pasos numerados / Contacto (formulario) / Cierre /
  Sección nueva (texto, imagen opcional)** → the seven section types.
- **Antetítulo** → small label above a title. **Título** → heading. **Cuerpo** → rich-text body.
  **Entradilla** → lead paragraph. **Frase** → closing line. **Aviso del formulario** → note above the
  consent box.
- **Ancla (URL)** → section address. **Grupo del menú** → sidebar numeral heading. **Enlace en el
  menú** → sidebar link. **Nombre corto (pie del menú)** → room name next to the counter.
- **Color de fondo / Color personalizado (hex)** → room background.
- **Fotos flotantes** → hero photos. **Imagen / Imagen (opcional)** → section photo. **Imagen a la**
  → photo side. **Patrón lateral** → decorative service band. **Texto alternativo (ES / EN)** → image
  description for accessibility/SEO.
- **Botón / El botón lleva a (ancla)** → hero call-to-action and its target.
- **Servicios / Incluye (hasta 3) / Descripción** → carousel cards and their content. **Pasos / Texto** → steps.
- **Mostrar redes sociales** → toggle for social links in Cierre.
- **Título del sitio (pestaña y buscadores) / Descripción (buscadores) / Dominio / Imagen para redes /
  Nombre en el © / Ciudad / País** → SEO and sharing.
- **Correo / Redes sociales (hasta 4) / Indicativo por defecto / Servicio del formulario (URL) /
  Política de tratamiento de datos (PDF)** → contact and form plumbing.
- **Textos de interfaz** → the 24 short labels and messages.
- **Publicar / Descartar cambios / Restaurar** → publish, undo draft, go back to an earlier version.
