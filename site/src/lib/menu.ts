import type { Locale, Section, Settings } from "./types";
import { anchorOf, loc } from "./loc";

export type MenuLink = { href: string; label: string; slide?: number; external?: boolean; inline?: boolean };
export type MenuGroup = { numeral: string; label: string; rooms: string[]; links: MenuLink[] };

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** Consecutive sections sharing a menu group become one numbered group. */
export function buildMenu(sections: Section[], settings: Settings, locale: Locale): MenuGroup[] {
  const groups: MenuGroup[] = [];
  for (const s of sections) {
    const groupLabel = loc(s.menuGroup, locale) ?? "";
    let g = groups[groups.length - 1];
    if (!g || g.label !== groupLabel) {
      g = { numeral: `${ROMAN[groups.length] ?? groups.length + 1}.`, label: groupLabel, rooms: [], links: [] };
      groups.push(g);
    }
    const anchor = anchorOf(s);
    g.rooms.push(anchor);
    if (s._type === "servicesSection") {
      s.items.forEach((it, i) => g.links.push({ href: `#${anchor}`, label: loc(it.menuLabel, locale) ?? "", slide: i }));
    } else if (s.menuLabel) {
      g.links.push({ href: `#${anchor}`, label: loc(s.menuLabel, locale) ?? "" });
    }
    if (s._type === "contactSection") {
      g.links.push({ href: `mailto:${settings.email}`, label: settings.email, inline: true });
      if (settings.linkedin) g.links.push({ href: settings.linkedin, label: "LinkedIn", inline: true, external: true });
    }
  }
  return groups;
}
