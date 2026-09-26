"use client";

import { ROADS_CALLOUT, ROADS_INTRO, ROAD_TERMS } from "lib/wheel-guide/data";
import { SectionHeader, Container, Section } from "components/guides/ui";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";

export default function IndianRoadsSection() {
  const { locale } = useTranslation();

  return (
    <Section id="indian-roads">
      <Container>
        {/* Header */}
        <SectionHeader
          kicker="05 — Indian roads"
          title="Indian roads"
          intro={ROADS_INTRO}
        />

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
        <div className="w-full bg-[#F7F7F9] border border-neutral-300 rounded-[8px] p-5 md:py-6 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-5 md:gap-6">
          <p className="text-base md:text-lg font-normal text-black max-w-2xl">
            {ROADS_CALLOUT}
          </p>
          <Link
            href={getLocalizedPath("/guides/truck-guide", locale)}
            className="hidden md:inline-flex w-full lg:w-auto bg-black text-white px-6 py-3.5 md:px-10 md:py-6 rounded-4 text-base font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0 items-center justify-center"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            THE TRUCK GUIDE
          </Link>
        </div>
        <Link
          href={getLocalizedPath("/guides/truck-guide", locale)}
          className="flex md:hidden w-full bg-black text-white px-6 py-3.5 rounded-4 text-base justify-center font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          THE TRUCK GUIDE
        </Link>
      </Container>
    </Section>
  );
}
