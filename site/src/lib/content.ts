import { createClient } from "@sanity/client";
import type { Content } from "./types";
import seed from "../content/seed.json";

// Tolerate values pasted into a hosting UI with quotes or spaces around them.
const clean = (v: unknown) => (typeof v === "string" ? v.trim().replace(/^["']|["']$/g, "") : "");
const projectId = clean(import.meta.env.PUBLIC_SANITY_PROJECT_ID) || undefined;
const dataset = clean(import.meta.env.PUBLIC_SANITY_DATASET) || "production";

export const sanityConfig = projectId ? { projectId, dataset } : null;

const asset = `asset->{url, metadata{dimensions}}`;
const image = `{..., ${asset}}`;
const QUERY = `{
  "settings": *[_id == "settings"][0]{..., ogImage${image}},
  "landing": *[_id == "landing"][0]{
    sections[]{
      ...,
      "anchor": anchor.current,
      photos[]${image},
      image${image},
      items[]{..., stripe${image}}
    }
  }
}`;

let cache: Promise<Content> | null = null;

/** Content from Sanity when a project id is configured; otherwise the local seed (identical shape). */
export function getContent(): Promise<Content> {
  if (!cache) {
    cache = (async () => {
      if (!sanityConfig) {
        if (process.env.NETLIFY) console.warn("[estanza] PUBLIC_SANITY_PROJECT_ID is not set: building from the local seed, not from Sanity.");
        return seed as unknown as Content;
      }
      const client = createClient({ ...sanityConfig, apiVersion: "2025-01-01", useCdn: false });
      const data = await client.fetch<Content>(QUERY);
      if (!data?.landing?.sections?.length) throw new Error("Sanity returned no landing sections; publish the Página document first.");
      return data;
    })();
  }
  return cache;
}
