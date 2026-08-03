import academyBanner from "components/icons/academy/academy_banner.png";
import academyMobileBanner from "components/icons/academy/academy_mobile_hero.png";
import { getLocalizedPath } from "lib/i18n";
import Image from "next/image";
import Link from "next/link";

export default function AcademyHeroBanner({ locale }: { locale?: string }) {
  return (
    <section className="relative h-screen w-full overflow-hidden -mt-[72px]">
      {/* Mobile Image */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src={academyMobileBanner}
          alt="Academy Hero background"
          fill
          className="object-cover"
          priority
        />
      </div>
      {/* Desktop Image */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src={academyBanner}
          alt="Academy Hero background"
          fill
          className="object-cover"
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
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-16 w-full">
          {/* Left: Heading */}
          <div className="flex flex-col">
            <h1
              className="text-[32px] md:text-[100px] font-bold text-white tracking-[-1%] uppercase leading-[32px] md:leading-[100px] select-none"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              WESKATE
              <br />
              ACADEMY
            </h1>
          </div>

          {/* Right: Paragraph + Button */}
          <div className="max-w-xl flex flex-col items-start gap-6">
            <p
              className="text-sm md:text-xl text-white leading-[130%] font-[400]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Whether you&apos;re a first-timer or Olympic-bound, WeSkate Academy
              has a place for you—with group sessions at Cubbon Park, Indiranagar,
              and CV Raman Nagar, plus one-on-one coaching anywhere in Bangalore.
            </p>

            <Link
              href={locale ? getLocalizedPath("/contact", locale) : "/contact"}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 md:px-5 md:py-4 text-sm md:text-base font-[400] text-black transition-all duration-300 hover:bg-neutral-200 hover:scale-105 active:scale-95"
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              <span>Register Now</span>
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
