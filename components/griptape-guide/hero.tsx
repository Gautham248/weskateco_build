"use client";

import { GRIP_HERO } from "lib/griptape-guide/data";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";

export default function GripGuideHero() {
  const { locale } = useTranslation();

  return (
    <section className="relative w-full bg-black text-white overflow-hidden -mt-[72px] pt-[72px] py-16 md:py-28">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <span
          className="text-sm md:text-base font-medium tracking-[0.2em] text-[#CCFF02] uppercase"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          {GRIP_HERO.eyebrow}
        </span>

        <h1
          className="text-[clamp(32px,6.5vw,100px)] leading-[clamp(32px,6.5vw,100px)] font-bold tracking-[-1%] uppercase select-none"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          {GRIP_HERO.titleLead}
          <br />
          <span className="text-[#CCFF02]">{GRIP_HERO.titleAccent}</span>
        </h1>

        <p className="text-sm md:text-[22px] text-white/90 leading-[140%] font-[400] max-w-3xl">
          {GRIP_HERO.lede}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <a
            href={GRIP_HERO.ctaPrimary.href}
            className="bg-[#CCFF02] text-black px-6 py-3.5 rounded-[4px] text-base font-semibold uppercase tracking-wider hover:bg-[#b8e602] transition-colors text-center"
          >
            {GRIP_HERO.ctaPrimary.label}
          </a>
          <Link
            href={getLocalizedPath(GRIP_HERO.ctaSecondary.href, locale)}
            className="border border-white/40 text-white px-6 py-3.5 rounded-[4px] text-base font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-colors text-center"
          >
            {GRIP_HERO.ctaSecondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
