"use client";

import {
  RANGE_BEARINGS,
  RANGE_CALLOUT,
  RANGE_COLUMNS,
  RANGE_INTRO,
  RANGE_NOTE,
  RANGE_ROWS,
} from "lib/wheel-guide/data";
import { SectionHeader, Container, Section } from "components/guides/ui";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";

export default function RangeSection() {
  const { locale } = useTranslation();

  return (
    <Section id="range">
      <Container>
        {/* Header */}
        <SectionHeader
          kicker="07 — Range"
          title="The range"
          intro={RANGE_INTRO}
        />

        {/* Comparison table */}
        <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-40" />
                {RANGE_COLUMNS.map((col) => (
                  <th key={col} className="pb-4 pr-6 align-bottom">
                    <span
                      className="block text-lg md:text-[24px] font-bold uppercase tracking-[-1%] text-black"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {col}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RANGE_ROWS.map((row) => (
                <tr key={row.label} className="border-t border-neutral-100">
                  <th
                    scope="row"
                    className="py-4 pr-6 text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500 align-top"
                  >
                    {row.label}
                  </th>
                  <td className="py-4 pr-6 text-sm md:text-base leading-[150%] font-[400] text-black align-top">
                    {row.cells[0]}
                  </td>
                  <td className="py-4 pr-6 text-sm md:text-base leading-[150%] font-[400] text-black align-top">
                    {row.cells[1]}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-neutral-100">
                <th
                  scope="row"
                  className="py-4 pr-6 text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500 align-top"
                >
                  Bearings
                </th>
                <td
                  colSpan={2}
                  className="py-4 pr-6 text-sm md:text-base leading-[150%] font-[400] text-black align-top"
                >
                  {RANGE_BEARINGS}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Note */}
        <p className="text-sm md:text-base text-neutral-600 leading-[150%] max-w-3xl">
          {RANGE_NOTE}
        </p>

        {/* Callout */}
        <div className="w-full bg-[#EAFBFF] border border-[#80E5FF] rounded-[8px] p-5 md:py-6 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-5 md:gap-6">
          <p className="text-base md:text-lg font-normal text-black max-w-2xl">
            {RANGE_CALLOUT}
          </p>
          <Link
            href={getLocalizedPath("/configurator", locale)}
            className="hidden md:inline-flex w-full lg:w-auto bg-black text-white px-6 py-3.5 md:px-10 md:py-6 rounded-4 text-base font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0 items-center justify-center"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            OPEN THE CONFIGURATOR
          </Link>
        </div>
        <Link
          href={getLocalizedPath("/configurator", locale)}
          className="flex md:hidden w-full bg-black text-white px-6 py-3.5 rounded-4 text-base justify-center font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          OPEN THE CONFIGURATOR
        </Link>
      </Container>
    </Section>
  );
}
