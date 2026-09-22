import type { L, Locale, Section } from "./types";

/** Localised value with Spanish fallback. */
export const loc = <T>(field: L<T> | null | undefined, locale: Locale): T | undefined =>
  field ? ((field[locale] as T | undefined) ?? field.es) : undefined;

export const anchorOf = (s: Section): string =>
  typeof s.anchor === "string" ? s.anchor : s.anchor?.current ?? s._key;

/** Portable-text (or plain string[]) body → paragraphs of HTML-safe text with <em> preserved. */
export function paragraphs(body: L<unknown[]> | undefined, locale: Locale): string[] {
  const blocks = loc(body, locale) as any[] | undefined;
  if (!blocks) return [];
  return blocks
    .map((b) => {
      if (typeof b === "string") return escape(b);
      if (b?._type !== "block") return "";
      return (b.children || [])
        .map((c: any) => {
          const text = escape(c.text || "");
          return (c.marks || []).includes("em") ? `<em>${text}</em>` : text;
        })
        .join("");
    })
    .filter(Boolean);
}

export const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
