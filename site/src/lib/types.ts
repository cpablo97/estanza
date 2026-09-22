export type Locale = "es" | "en";
export type L<T = string> = { es: T; en?: T };

export type Img = {
  asset?: { url: string; metadata?: { dimensions?: { width: number; height: number } } };
  hotspot?: unknown;
  crop?: unknown;
  local?: { webp: string[]; fallback: string; width: number; height: number };
  alt?: L;
};

type Shared = {
  _type: string;
  _key: string;
  anchor: string | { current: string };
  menuGroup: L;
  menuLabel?: L | null;
  roomLabel: L;
  background: string;
  customBackground?: string;
};

export type HeroSection = Shared & { _type: "heroSection"; title: string; ctaLabel: L; ctaTarget: string; photos: Img[] };
export type TextImageSection = Shared & { _type: "textImageSection" | "genericSection"; eyebrow?: L; title: L; body?: L<unknown[]>; image?: Img; imageSide?: "left" | "right" };
export type ServicesSection = Shared & { _type: "servicesSection"; eyebrow?: L; title: L; items: { _key: string; menuLabel: L; title: L; body: L; stripe: Img }[] };
export type StepsSection = Shared & { _type: "stepsSection"; eyebrow?: L; title: L; steps: { _key: string; title: L; text: L }[] };
export type ContactSection = Shared & { _type: "contactSection"; eyebrow?: L; title: L; lede?: L; disclaimer: L };
export type ClosingSection = Shared & { _type: "closingSection"; eyebrow?: L; title: L; line?: L; showLinkedin?: boolean };
export type Section = HeroSection | TextImageSection | ServicesSection | StepsSection | ContactSection | ClosingSection;

export type Settings = {
  siteTitle: string;
  metaDescription?: L;
  siteUrl?: string;
  ogImage?: Img;
  copyrightName?: string;
  email: string;
  linkedin?: string;
  phonePrefixDefault?: string;
  formEndpoint?: string;
  labels: Record<string, L>;
};

export type Content = { settings: Settings; landing: { sections: Section[] } };
