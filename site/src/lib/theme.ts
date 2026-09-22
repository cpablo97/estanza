/** Light or dark chrome for a room, from the relative luminance of its background. */
export function themeFor(hex: string): "light" | "dark" {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "light";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return lum < 0.35 ? "dark" : "light";
}

export const backgroundOf = (s: { background: string; customBackground?: string }) =>
  (s.customBackground && /^#[0-9a-f]{6}$/i.test(s.customBackground) ? s.customBackground : s.background) || "#dfd8cb";
