import schoolBanner from "components/icons/school/school_banner.png";
import schoolBannerMobile from "components/icons/school/school_banner_mobile.png";
import { getLocalizedPath } from "lib/i18n";
import Image from "next/image";
import Link from "next/link";

export default function SchoolHeroBanner({ locale }: { locale?: string }) {
  return (
    <section className="relative h-screen w-full overflow-hidden -mt-[72px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <picture>
          <source srcSet={schoolBanner.src} media="(min-width: 768px)" />
          <Image
            src={schoolBannerMobile}
            alt="School Hero background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </picture>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.1),rgba(0,0,0,0.1)),linear-gradient(310.04deg,rgba(0,0,0,0.45)_15%,rgba(0,0,0,0)_55%)]" />
      {/* Content Overlay */}
      <div className="relative z-10 mx-auto h-full max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col justify-end pb-12 md:pb-20 lg:pb-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-[64px] w-full">
          {/* Left: Heading */}
          <div className="flex flex-col flex-1 min-w-0">
            <h1
              className="text-[clamp(32px,5.2vw,90px)] font-bold text-white tracking-[-1%] uppercase leading-[0.95] select-none whitespace-nowrap"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              FROM FIRST
              <br />
              PUSH-OFF TO
              <br />
              OLYMPIC-LEVEL
            </h1>
          </div>

          {/* Right: Paragraph + Button */}
          <div className="max-w-[546px] flex flex-col items-start gap-6 shrink-0">
            <p
              className="text-sm md:text-xl text-white leading-[130%] font-[400]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              India's first structured skateboarding curriculum for
              schools—introducing students to skateboarding through a safe,
              progressive program that can evolve from PE classes to competitive
              pathways.
            </p>

            <Link
              href={locale ? getLocalizedPath("/contact", locale) : "/contact"}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 md:px-5 md:py-4 text-sm md:text-base font-[400] text-black transition-all duration-300 hover:bg-neutral-200 hover:scale-105 active:scale-95"
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              <span>Partner With Us</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-nudge-x shrink-0"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
