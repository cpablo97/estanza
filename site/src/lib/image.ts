import imageUrlBuilder from "@sanity/image-url";
import type { Img } from "./types";
import { sanityConfig } from "./content";

type Sources = { srcset: string; fallback: string; width: number; height: number; position?: string };

/** WebP srcset + JPEG fallback for a Sanity asset, or for a local seed image. */
export function sources(img: Img | undefined, widths: number[] = [480, 960]): Sources | null {
  if (!img) return null;
  if (img.asset && sanityConfig) {
    const b = imageUrlBuilder(sanityConfig).image(img).auto("format");
    const dims = img.asset.metadata?.dimensions;
    const max = widths[widths.length - 1];
    // The CDN applies the crop, so the delivered image has the cropped proportions.
    const cw = 1 - (img.crop?.left ?? 0) - (img.crop?.right ?? 0);
    const ch = 1 - (img.crop?.top ?? 0) - (img.crop?.bottom ?? 0);
    return {
      srcset: widths.map((w) => `${b.width(w).format("webp").quality(82).url()} ${w}w`).join(", "),
      fallback: b.width(max).format("jpg").quality(80).url(),
      width: dims ? Math.round(dims.width * cw) : max,
      height: dims ? Math.round(dims.height * ch) : max,
      position: focalPosition(img),
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

/** CSS object-position that keeps the hotspot in view when the image is cropped by its frame
 *  (object-fit: cover). Sanity stores the hotspot relative to the original image, while the CDN
 *  delivers the cropped area, so it is re-expressed relative to the crop. Undefined = centred. */
export function focalPosition(img: Img): string | undefined {
  const h = img.hotspot;
  if (!h || typeof h.x !== "number" || typeof h.y !== "number") return undefined;
  const c = img.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const rel = (v: number, start: number, end: number) => {
    const size = 1 - start - end;
    return size > 0 ? Math.min(1, Math.max(0, (v - start) / size)) : 0.5;
  };
  const x = rel(h.x, c.left, c.right);
  const y = rel(h.y, c.top, c.bottom);
  if (Math.abs(x - 0.5) < 0.005 && Math.abs(y - 0.5) < 0.005) return undefined;
  const pct = (n: number) => `${Math.round(n * 1000) / 10}%`;
  return `${pct(x)} ${pct(y)}`;
}
