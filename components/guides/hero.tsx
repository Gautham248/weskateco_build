"use client";

import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

export interface GuideHeroData {
  eyebrow: string;
  titleLead: string;
  titleAccent?: string;
  lede: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

export interface GuideHeroBackground {
  src: StaticImageData;
  mobileSrc?: StaticImageData;
  alt: string;
  mobileAlt?: string;
  objectPosition?: string;
  mobileObjectPosition?: string;
}

/**
 * Full-screen guide hero. A background image is optional: guides waiting for
 * final photography render the same layout over black until one is supplied.
 */
export default function GuideHero({
  hero,
  background,
}: {
  hero: GuideHeroData;
  background?: GuideHeroBackground;
}) {
  const { locale } = useTranslation();
  const clash = { fontFamily: "'Clash Display', sans-serif" };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white -mt-[72px]">
      {background && (
        <div className="absolute inset-0">
          <Image
            src={background.src}
            alt={background.alt}
            fill
            className="hidden object-cover md:block"
            style={{
              objectPosition: background.objectPosition ?? "center",
            }}
            priority
          />
          <Image
            src={background.mobileSrc ?? background.src}
            alt={background.mobileAlt ?? background.alt}
            fill
            className="object-cover md:hidden"
            style={{
              objectPosition:
                background.mobileObjectPosition ??
                background.objectPosition ??
                "center",
            }}
            priority
          />
        </div>
      )}

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(310.04deg, rgba(0, 0, 0, 0.45) 15%, rgba(0, 0, 0, 0) 55%)",
        }}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-(--breakpoint-2xl) flex-col justify-end px-4 pb-12 md:pb-20 lg:px-15 lg:pb-24">
        <div className="flex w-full flex-col justify-between gap-5 lg:flex-row lg:items-end lg:gap-16">
          <div className="flex flex-col gap-3 md:gap-4">
            <span
              className="text-xs font-medium uppercase tracking-[-1%] text-white/80 md:text-base"
              style={clash}
            >
              {hero.eyebrow}
            </span>
            <h1
              className="text-[clamp(32px,6.5vw,100px)] leading-[clamp(32px,6.5vw,100px)] font-bold tracking-[-1%] text-white uppercase select-none"
              style={clash}
            >
              {hero.titleLead}
              {hero.titleAccent && (
                <>
                  <br />
                  <span className="text-brand">{hero.titleAccent}</span>
                </>
              )}
            </h1>
          </div>

          <div className="flex max-w-2xl flex-col items-start gap-4 md:gap-6">
            <p
              className="text-sm font-normal leading-[150%] text-white/90 md:text-lg"
              style={clash}
            >
              {hero.lede}
            </p>
            <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center md:gap-4">
              <a
                href={hero.ctaPrimary.href}
                className="inline-flex items-center justify-center bg-brand px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-black hover:text-brand md:px-8 md:py-4 md:text-base rounded-4"
                style={clash}
              >
                {hero.ctaPrimary.label}
              </a>
              <Link
                href={getLocalizedPath(hero.ctaSecondary.href, locale)}
                className="inline-flex items-center justify-center border border-white/50 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black md:px-8 md:py-4 md:text-base rounded-4"
                style={clash}
              >
                {hero.ctaSecondary.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
