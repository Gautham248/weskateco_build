"use client";

import { SYMPTOMS, WEAR_CLOSING, WEAR_INTRO } from "lib/wheel-guide/data";
import { SectionHeader, Container, Section } from "components/guides/ui";
import { useState } from "react";

export default function WearSection() {
  const [activeId, setActiveId] = useState(SYMPTOMS[0]!.id);
  const active = SYMPTOMS.find((s) => s.id === activeId) ?? SYMPTOMS[0]!;

  return (
    <Section id="wear" bg="muted">
      <Container>
        {/* Header */}
        <SectionHeader kicker="06 — Wear" title="Wear" intro={WEAR_INTRO} />

        {/* Symptom chips */}
        <div
          role="group"
          aria-label="Choose a wear symptom"
          className="flex flex-wrap gap-3"
        >
          {SYMPTOMS.map((s) => {
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                aria-pressed={isActive}
                className={`px-4 py-2.5 rounded-4 text-sm font-semibold uppercase tracking-wider cursor-pointer transition-colors border ${
                  isActive
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-neutral-200 hover:border-black"
                }`}
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="bg-white rounded-[16px] p-5 md:p-8 flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-4 text-xs font-bold uppercase tracking-wider ${
                active.fatal ? "bg-black text-white" : "bg-brand text-black"
              }`}
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {active.verdict}
            </span>
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500">
              {active.label}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-start">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  What
                </span>
                <p className="text-sm md:text-base text-black font-[400] leading-[150%]">
                  {active.what}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Cause
                </span>
                <p className="text-sm md:text-base text-black font-[400] leading-[150%]">
                  {active.cause}
                </p>
              </div>
            </div>

            <dl className="lg:col-span-5 flex flex-col">
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

        {/* Closing */}
        <p className="text-sm md:text-base text-neutral-600 leading-[150%] max-w-3xl">
          {WEAR_CLOSING}
        </p>
      </Container>
    </Section>
  );
}
