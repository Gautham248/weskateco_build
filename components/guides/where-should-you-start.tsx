"use client";

import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";

export default function WhereShouldYouStartSection() {
  const { locale } = useTranslation();

  return (
    <section className="w-full bg-white text-black py-10 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col items-center justify-center text-center gap-4 md:gap-6">
        <h2
          className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none w-[200px] md:w-full"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          WHERE SHOULD YOU START?
        </h2>

        {/* Subtitle / Guidance */}
        <p className="hidden md:flex text-sm md:text-xl text-black font-normal leading-[140%] max-w-xl ">
          Try starting out with something in the 51mm–55mm range. <br />
          This is a very common size range and will be good <br />
          for learning the basics.
        </p>
        <p className="flex md:hidden text-base text-black font-normal leading-[140%] w-[335px]">
          Try starting out with something in the 51mm–55mm range.
          This is a very common size range and will be good
          for learning the basics.
        </p>

        <Link
          href={getLocalizedPath("/store/skateboard-wheels", locale)}
          className="bg-black text-white px-6 py-3.5 rounded-[4px] text-base font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0 w-full md:w-fit"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          SHOP SKATEBOARD WHEELS
        </Link>
      </div>
    </section>
  );
}
