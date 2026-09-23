"use client";

import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";

export default function BoardFinderHero() {
  const { locale } = useTranslation();

  return (
    <section className="relative w-full bg-black text-white overflow-hidden -mt-[72px] pt-[72px] py-16 md:py-28">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <span
          className="text-sm md:text-base font-medium tracking-[0.2em] text-[#CCFF02] uppercase"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          Sphere Skateboards · WeSkate Co. · Built for Indian streets
        </span>

        <h1
          className="text-[clamp(32px,6.5vw,100px)] leading-[clamp(32px,6.5vw,100px)] font-bold tracking-[-1%] uppercase select-none"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          Skateboard
          <br />
          <span className="text-[#CCFF02]">Buying Guide</span>
        </h1>

        <p className="text-sm md:text-[22px] text-white/90 leading-[140%] font-[400] max-w-3xl">
          New to skateboarding, upgrading a setup, or buying for someone else?
          Answer four questions and walk away with the four numbers that decide
          how a board rides: deck width (how wide the board is), concave (how
          curved it is), truck width and wheel diameter.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <a
            href="#find-your-board"
            className="bg-[#CCFF02] text-black px-6 py-3.5 rounded-[4px] text-base font-semibold uppercase tracking-wider hover:bg-[#b8e602] transition-colors text-center"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Find my board →
          </a>
          <Link
            href={getLocalizedPath("/store/skateboard-completes", locale)}
            className="border border-white/40 text-white px-6 py-3.5 rounded-[4px] text-base font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-colors text-center"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Shop completes
          </Link>
        </div>
      </div>
    </section>
  );
}
