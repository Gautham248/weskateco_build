"use client";

import { ROADS_CALLOUT, ROADS_INTRO, ROAD_TERMS } from "lib/wheel-guide/data";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";

export default function IndianRoadsSection() {
  const { locale } = useTranslation();

  return (
    <section
      id="indian-roads"
      className="w-full bg-white text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4 max-w-3xl">
          <span className="text-xs md:text-base font-medium tracking-[-1%] text-[#00000080] uppercase">
            05 — Indian roads
          </span>
          <h2
            className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none md:leading-[80%]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Indian roads
          </h2>
          <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
            {ROADS_INTRO}
          </p>
        </div>

        {/* Definition list */}
        <dl className="flex flex-col border-t border-neutral-100">
          {ROAD_TERMS.map((item) => (
            <div
              key={item.term}
              className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-10 py-5 md:py-7 border-b border-neutral-100"
            >
              <dt className="lg:col-span-4 flex flex-col gap-1.5">
                <span
                  className="text-lg md:text-[24px] font-bold tracking-[-1%] uppercase leading-[110%]"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {item.term}
                </span>
                <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500">
                  {item.note}
                </span>
              </dt>
              <dd className="lg:col-span-8 text-sm md:text-base text-black font-[400] leading-[160%]">
                {item.definition}
              </dd>
            </div>
          ))}
        </dl>

        {/* Callout */}
        <div className="w-full bg-[#EAFBFF] border border-[#80E5FF] rounded-[8px] p-5 md:py-6 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-5 md:gap-6">
          <p className="text-base md:text-lg font-normal text-black max-w-2xl">
            {ROADS_CALLOUT}
          </p>
          <Link
            href={getLocalizedPath("/guides/truck-guide", locale)}
            className="hidden md:inline-flex w-full lg:w-auto bg-black text-white px-6 py-3.5 md:px-10 md:py-6 rounded-[4px] text-base font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0 items-center justify-center"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            THE TRUCK GUIDE
          </Link>
        </div>
        <Link
          href={getLocalizedPath("/guides/truck-guide", locale)}
          className="flex md:hidden w-full bg-black text-white px-6 py-3.5 rounded-[4px] text-base justify-center font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          THE TRUCK GUIDE
        </Link>
      </div>
    </section>
  );
}
