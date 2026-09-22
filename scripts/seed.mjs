/**
 * One-off: pushes the prototype content (site/src/content/seed.json) into Sanity,
 * uploading the original images from assets/images.
 *
 *   SANITY_STUDIO_PROJECT_ID=xxxx SANITY_WRITE_TOKEN=sk... node scripts/seed.mjs
 *
 * Run from the repo root. Requires a token with Editor rights (Studio → API → Tokens).
 */
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set SANITY_STUDIO_PROJECT_ID and SANITY_WRITE_TOKEN.");
  process.exit(1);
}
const client = createClient({ projectId, dataset, token, apiVersion: "2025-01-01", useCdn: false });
const seed = JSON.parse(await readFile(path.join(root, "site/src/content/seed.json"), "utf8"));

// local fallback path -> original file to upload (highest quality source we have)
const ORIGINALS = {
  "hero-1": "assets/images/hero-1.png",
  "hero-2": "assets/images/hero-2.png",
  "hero-3": "assets/images/hero-3.png",
  "sobre-estanza": "assets/images/sobre-estanza.png",
  "laura-dueri": "assets/images/laura-dueri.png",
  "patron-03": "assets/images/patron-03.png",
  "patron-04": "assets/images/patron-04.png",
  "patron-05": "assets/images/patron-05.png",
  "og": "site/public/assets/og.jpg",
};
const uploaded = new Map();
async function toAsset(img) {
  if (!img?.local) return img;
  const base = path.basename(img.local.fallback).replace(/-(\d+)\.(webp|jpg)$/, "").replace(/\.jpg$/, "");
  const file = ORIGINALS[base];
  if (!file) throw new Error(`No original for ${base}`);
  if (!uploaded.has(base)) {
    process.stdout.write(`uploading ${file}… `);
    const asset = await client.assets.upload("image", createReadStream(path.join(root, file)), { filename: path.basename(file) });
    console.log(asset._id);
    uploaded.set(base, asset._id);
  }
  return { _type: "image", asset: { _type: "reference", _ref: uploaded.get(base) }, alt: img.alt };
}

const sections = [];
for (const s of seed.landing.sections) {
  const out = { ...s, anchor: { _type: "slug", current: s.anchor } };
  if (out.menuLabel === null) delete out.menuLabel;
  if (out.photos) out.photos = await Promise.all(out.photos.map(toAsset));
  if (out.image) out.image = await toAsset(out.image);
  if (out.items) out.items = await Promise.all(out.items.map(async (it) => ({ ...it, _type: "service", stripe: await toAsset(it.stripe) })));
  if (out.steps) out.steps = out.steps.map((st) => ({ ...st, _type: "step" }));
  if (out.body) out.body = Object.fromEntries(Object.entries(out.body).map(([k, ps]) => [k, ps.map((t, i) => ({ _type: "block", _key: `${s._key}-${k}-${i}`, style: "normal", markDefs: [], children: [{ _type: "span", _key: `${s._key}-${k}-${i}-s`, text: t, marks: [] }] }))]));
  sections.push(out);
}
const settings = { ...seed.settings, ogImage: await toAsset(seed.settings.ogImage) };
delete settings.ogImage.alt;

await client.createOrReplace({ ...settings, _id: "settings", _type: "settings" });
await client.createOrReplace({ _id: "landing", _type: "landing", sections });
console.log("Seeded: settings + landing with", sections.length, "sections.");
