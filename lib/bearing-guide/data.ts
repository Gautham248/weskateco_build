import { BEARING_GUIDE_CONTENT } from "content/guides/bearings";

export * from "content/guides/bearings";

export const BEARING_META = BEARING_GUIDE_CONTENT.meta;
export const BEARING_TOPBAR = BEARING_GUIDE_CONTENT.topbar;

export const BEARING_HERO = {
  eyebrow: BEARING_GUIDE_CONTENT.hero.eyebrow,
  titleLead: BEARING_GUIDE_CONTENT.hero.titleLines[0] ?? "The",
  titleAccent: BEARING_GUIDE_CONTENT.hero.titleLines[1] ?? "Bearings",
  lede: BEARING_GUIDE_CONTENT.hero.lede,
  ctaPrimary: {
    label:
      BEARING_GUIDE_CONTENT.hero.ctas[0]?.label ?? "Go straight to cleaning",
    href: BEARING_GUIDE_CONTENT.hero.ctas[0]?.href ?? "#clean",
  },
  ctaSecondary: {
    label: BEARING_GUIDE_CONTENT.hero.ctas[1]?.label ?? "Buying guide",
    href:
      BEARING_GUIDE_CONTENT.hero.ctas[1]?.href ??
      "/guides/skateboard-buying-guide",
  },
};

export const ANCHOR_NAV = BEARING_GUIDE_CONTENT.topbar.jumpLinks.map((j) => ({
  label: j.label,
  href: `#${j.anchor}`,
}));

export const BEARING_SECTIONS = BEARING_GUIDE_CONTENT.sections;
export const BEARING_FOOTER = BEARING_GUIDE_CONTENT.footer;
