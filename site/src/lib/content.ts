import { createClient } from "@sanity/client";
import type { Content } from "./types";
import seed from "../content/seed.json";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) || "production";

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
      if (!sanityConfig) return seed as unknown as Content;
      const client = createClient({ ...sanityConfig, apiVersion: "2025-01-01", useCdn: false });
      const data = await client.fetch<Content>(QUERY);
      if (!data?.landing?.sections?.length) throw new Error("Sanity returned no landing sections; publish the Página document first.");
      return data;
    })();
  }
  return cache;
}
