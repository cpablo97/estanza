import imageUrlBuilder from "@sanity/image-url";
import type { Img } from "./types";
import { sanityConfig } from "./content";

type Sources = { srcset: string; fallback: string; width: number; height: number };

/** WebP srcset + JPEG fallback for a Sanity asset, or for a local seed image. */
export function sources(img: Img | undefined, widths: number[] = [480, 960]): Sources | null {
  if (!img) return null;
  if (img.asset && sanityConfig) {
    const b = imageUrlBuilder(sanityConfig).image(img).auto("format");
    const dims = img.asset.metadata?.dimensions;
    const max = widths[widths.length - 1];
    return {
      srcset: widths.map((w) => `${b.width(w).format("webp").quality(82).url()} ${w}w`).join(", "),
      fallback: b.width(max).format("jpg").quality(80).url(),
      width: dims?.width ?? max,
      height: dims?.height ?? max,
    };
  }
  if (img.local) {
    const ws = img.local.webp.length ? widths.slice(0, img.local.webp.length) : [];
    return {
      srcset: img.local.webp.map((u, i) => `${u} ${ws[i] ?? widths[i]}w`).join(", "),
      fallback: img.local.fallback,
      width: img.local.width,
      height: img.local.height,
    };
  }
  return null;
}
