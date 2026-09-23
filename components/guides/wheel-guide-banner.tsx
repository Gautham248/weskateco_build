"use client";

import { HERO_LEDE } from "lib/wheel-guide/data";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import wheelsGuideBanner from "components/icons/skateboard_guide/wheel_guide.png";
import wheelsGuideBannerMobile from "components/icons/skateboard_guide/wheel_guide_mobile.png";
import Image from "next/image";
import Link from "next/link";

export default function WheelGuideHeroBanner() {
  const { locale } = useTranslation();

  return (
    <section className="relative h-screen w-full overflow-hidden -mt-[72px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Desktop Background */}
        <Image
          src={wheelsGuideBanner}
          alt="Wheel Guide background"
          fill
          className="hidden md:block object-cover object-center"
          priority
        />
        {/* Mobile Background */}
        <Image
          src={wheelsGuideBannerMobile}
          alt="Wheel Guide mobile background"
          fill
          className="block md:hidden object-cover object-center"
          priority
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(310.04deg, rgba(0, 0, 0, 0.45) 15%, rgba(0, 0, 0, 0) 55%)",
        }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 mx-auto h-full max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col justify-end pb-12 md:pb-20 lg:pb-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 lg:gap-16 w-full">
          {/* Left: Eyebrow + Heading */}
          <div className="flex flex-col gap-3 md:gap-4">
            <span
              className="text-xs md:text-base font-medium tracking-[-1%] text-white/80 uppercase"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Sphere Skateboards · WeSkate Co. · Guide 04
            </span>
            <h1
              className="text-[clamp(32px,6.5vw,100px)] leading-[clamp(32px,6.5vw,100px)] font-bold text-white tracking-[-1%] uppercase select-none"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              The Wheels
            </h1>
          </div>

          {/* Right: Lede + CTAs */}
          <div className="max-w-2xl flex flex-col items-start gap-4 md:gap-6">
            <p
              className="text-sm md:text-lg text-white/90 leading-[150%] font-normal"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {HERO_LEDE}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 w-full">
              <a
                href="#durometer"
                className="inline-flex items-center justify-center bg-[#CCFF02] text-black px-6 py-3.5 md:px-8 md:py-4 rounded-[4px] text-sm md:text-base font-semibold uppercase tracking-wider hover:bg-black hover:text-[#CCFF02] transition-colors"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Start with durometer
              </a>
              <Link
                href={getLocalizedPath(
                  "/guides/skateboard-buying-guide",
                  locale,
                )}
                className="inline-flex items-center justify-center border border-white/50 text-white px-6 py-3.5 md:px-8 md:py-4 rounded-[4px] text-sm md:text-base font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                The buying guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
