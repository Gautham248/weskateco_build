"use client";

import {
  DIAMETERS,
  DIAMETER_BLURBS,
  DIAMETER_CAPTION,
  DIAMETER_DEFAULT,
  DIAMETER_INTRO,
} from "lib/wheel-guide/data";
import { SectionHeader, Container, Section, GRID_CLASS } from "components/guides/ui";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";
import { useState } from "react";

export default function DiameterSection() {
  const { locale } = useTranslation();
  const [activeId, setActiveId] = useState(DIAMETER_DEFAULT);
  const active = DIAMETERS.find((d) => d.id === activeId) ?? DIAMETERS[2]!;

  return (
    <Section id="diameter" bg="muted">
      <Container>
        {/* Header */}
        <SectionHeader
          kicker="02 — Diameter"
          title="Diameter"
          intro={DIAMETER_INTRO}
        />

        {/* To-scale diagram */}
        <div className="w-full bg-white rounded-[16px] p-5 md:p-10 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-end justify-center gap-4 md:gap-8">
            {DIAMETERS.map((d) => {
              const size = parseInt(d.id, 10);
              const px = size * 1.6;
              const isActive = d.id === activeId;
              return (
                <div
                  key={d.id}
                  className="flex flex-col items-center gap-2"
                  aria-hidden={!isActive}
                >
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-neutral-500">
                    {d.category === "Surfskate wheel" ? "Surfskate" : "Skate"}
                  </span>
                  <div
                    className={`rounded-full border-2 border-black flex items-center justify-center transition-colors ${
                      isActive ? "bg-brand" : "bg-white"
                    }`}
                    style={{ width: px, height: px }}
                  >
                    <span
                      className="text-[10px] md:text-xs font-bold"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {d.id}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Ground line */}
          <div className="w-full border-b-2 border-black" />
          <p className="text-xs md:text-sm text-neutral-600 leading-[150%] text-center max-w-4xl">
            {DIAMETER_CAPTION}
          </p>
        </div>

        <div className={GRID_CLASS}>
          {/* Chips + detail */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div
              role="group"
              aria-label="Choose a diameter"
              className="flex flex-wrap gap-3"
            >
              {DIAMETERS.map((d) => {
                const isActive = d.id === activeId;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setActiveId(d.id)}
                    aria-pressed={isActive}
                    className={`px-4 py-2.5 rounded-4 text-sm font-semibold uppercase tracking-wider cursor-pointer transition-colors border ${
                      isActive
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-neutral-200 hover:border-black"
                    }`}
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {d.size}
                  </button>
                );
              })}
            </div>

            <div className="bg-white rounded-[16px] p-5 md:p-8 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span
                  className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {active.category}
                </span>
                <h3
                  className="text-xl md:text-[32px] font-bold tracking-[-1%] uppercase leading-none"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {active.size}
                </h3>
              </div>
              <p className="text-sm md:text-lg text-black font-[400] leading-[150%]">
                {active.text}
              </p>
              <dl className="flex flex-col mt-1">
                {active.spec.map(([label, value], i) => (
                  <div
                    key={label}
                    className={`flex items-baseline justify-between gap-6 py-2 ${
                      i < active.spec.length - 1
                        ? "border-b border-neutral-100"
                        : ""
                    }`}
                  >
                    <dt className="text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500">
                      {label}
                    </dt>
                    <dd className="text-sm md:text-base text-black text-right font-[400]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Supporting blurbs */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {DIAMETER_BLURBS.map((blurb) => (
              <div
                key={blurb.title}
                className="border border-neutral-200 bg-white rounded-[16px] p-5 md:p-6 flex flex-col gap-3"
              >
                <h3
                  className="text-base md:text-xl font-bold tracking-[-1%] uppercase leading-none"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {blurb.title}
                </h3>
                <p className="text-sm md:text-base text-black font-[400] leading-[150%]">
                  {blurb.text}
                  {blurb.href && blurb.linkLabel && (
                    <>
                      {" "}
                      <Link
                        href={getLocalizedPath(blurb.href, locale)}
                        className="underline underline-offset-2 font-medium text-black hover:text-neutral-500 transition-colors"
                      >
                        {blurb.linkLabel}
                      </Link>
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
