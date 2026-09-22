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
