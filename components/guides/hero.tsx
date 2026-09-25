"use client";

import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Container } from "./ui";

export interface GuideHeroData {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  lede: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

/**
 * Black guide hero. `ctaPrimary` is an in-page anchor; `ctaSecondary` is
 * localized via getLocalizedPath. `ctaStyle` is only needed where the CTA
 * buttons must set an explicit font (the board finder).
 */
export default function GuideHero({
  hero,
  ctaStyle,
}: {
  hero: GuideHeroData;
  ctaStyle?: CSSProperties;
}) {
  const { locale } = useTranslation();

  return (
    <section className="relative w-full bg-black text-white overflow-hidden -mt-[72px] pt-[72px] py-16 md:py-28">
      <Container>
        <span
          className="text-sm md:text-base font-medium tracking-[0.2em] text-brand uppercase"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          {hero.eyebrow}
        </span>

        <h1
          className="text-[clamp(32px,6.5vw,100px)] leading-[clamp(32px,6.5vw,100px)] font-bold tracking-[-1%] uppercase select-none"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          {hero.titleLead}
          <br />
          <span className="text-brand">{hero.titleAccent}</span>
        </h1>

        <p className="text-sm md:text-[22px] text-white/90 leading-[140%] font-[400] max-w-3xl">
          {hero.lede}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <a
            href={hero.ctaPrimary.href}
            className="bg-brand text-black px-6 py-3.5 rounded-4 text-base font-semibold uppercase tracking-wider hover:bg-brand-dark transition-colors text-center"
            style={ctaStyle}
          >
            {hero.ctaPrimary.label}
          </a>
          <Link
            href={getLocalizedPath(hero.ctaSecondary.href, locale)}
            className="border border-white/40 text-white px-6 py-3.5 rounded-4 text-base font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-colors text-center"
            style={ctaStyle}
          >
            {hero.ctaSecondary.label}
          </Link>
        </div>
      </Container>
    </section>
  );
}
