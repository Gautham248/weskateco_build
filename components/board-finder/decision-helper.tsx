"use client";

import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";
import { useState } from "react";
import {
  DEFAULT_SELECTION,
  ROUTE_QUESTIONS,
  getVerdict,
  toPath,
} from "lib/board-finder/data";

type Selection = Record<"width" | "parts" | "first", number>;
import { Container, Section, GRID_CLASS, H2_CLASS } from "components/guides/ui";

export default function DecisionHelperSection() {
  const { locale } = useTranslation();
  const [selection, setSelection] = useState<Selection>({
    ...DEFAULT_SELECTION,
  });

  const score = ROUTE_QUESTIONS.reduce(
    (sum, q) => sum + (q.options[selection[q.key]]?.[1] ?? 0),
    0,
  );
  const { verdict, why, ctaLabel, ctaHref, altLabel, altHref } =
    getVerdict(score);

  return (
    <Section scroll={false}>
      <Container>
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4 max-w-3xl">
          <h2
            className={H2_CLASS}
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Buy a complete, or build it yourself?
          </h2>
          <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
            Two ways to end up with a board: buy one already assembled (a
            complete), or choose each part yourself. Answer three questions and
            we&apos;ll tell you which one is actually yours — then hand you over
            to the right place.
          </p>
        </div>

        {/* Questions + verdict */}
        <div className={GRID_CLASS}>
          <div className="lg:col-span-7 flex flex-col gap-6">
            {ROUTE_QUESTIONS.map((q) => (
              <div key={q.key} className="flex flex-col gap-3">
                <span
                  className="text-base md:text-lg font-semibold text-black uppercase tracking-[-1%]"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {q.question}
                </span>
                <div
                  className="inline-flex rounded-4 border border-neutral-200 p-1 gap-1 w-fit max-w-full"
                  role="group"
                  aria-label={q.question}
                >
                  {q.options.map(([label], index) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() =>
                        setSelection((prev) => ({ ...prev, [q.key]: index }))
                      }
                      aria-pressed={selection[q.key] === index}
                      className={`px-4 py-2 text-xs md:text-sm font-semibold uppercase tracking-wider rounded-4 transition-colors cursor-pointer whitespace-nowrap ${
                        selection[q.key] === index
                          ? "bg-black text-white"
                          : "text-black hover:bg-neutral-100"
                      }`}
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <p className="text-sm text-neutral-500 leading-[150%]">
              Either way you end up somewhere good: every part we sell is
              standard sized, so a complete is a starting point you can build
              from. Most riders buy a complete and end up with a completely
              different board a year later — one part at a time.
            </p>
          </div>

          {/* Verdict */}
          <div
            className="lg:col-span-5 bg-[#F7F7F9] rounded-[16px] border border-neutral-100/80 p-6 md:p-8 flex flex-col gap-4"
            aria-live="polite"
          >
            <span
              className="text-xs md:text-sm font-medium tracking-[-1%] text-[#00000080] uppercase"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Our call
            </span>
            <h3
              className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {verdict}
            </h3>
            <p className="text-sm md:text-base text-black leading-[150%] font-[400]">
              {why}
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <Link
                href={getLocalizedPath(toPath(ctaHref), locale)}
                className="w-full bg-black text-white px-6 py-3.5 rounded-4 text-base font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors text-center"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {ctaLabel}
              </Link>
              <Link
                href={getLocalizedPath(toPath(altHref), locale)}
                className="text-sm font-semibold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors text-center"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {altLabel}
              </Link>
            </div>
          </div>
        </div>

        {/* Two static route cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          <div className="bg-[#F7F7F9] md:bg-white rounded-[16px] p-6 md:p-8 flex flex-col gap-4 border border-neutral-100/80 transition-shadow hover:shadow-md">
            <h3
              className="text-lg md:text-[24px] font-semibold tracking-[-1%] text-black uppercase leading-[110%]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Route A — Buy a complete
            </h3>
            <p className="text-sm md:text-base text-black leading-[150%] font-[400]">
              Deck, trucks, wheels, bearings, grip and hardware, assembled and
              torqued. Beginner completes come in 7.75″, 8″ and 8.25″ with 80AB
              grip fitted. Pro completes run all nine widths, 7″ to 8.875″, in
              both Mellow and Medium concave, with a Mellow-Medium on the way.
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "You're new, or buying for someone who is.",
                "You don't want to research every part.",
                "Best value for money — a package price beats the sum of its parts.",
              ].map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <span className="w-2 h-2 rounded-full bg-black mt-2 shrink-0" />
                  <span className="text-sm text-black leading-[150%] font-[400]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={getLocalizedPath("/store/skateboard-completes", locale)}
              className="mt-auto pt-4 text-base font-bold uppercase tracking-wider text-black hover:text-neutral-500 transition-colors w-fit"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Shop completes →
            </Link>
          </div>

          <div className="bg-[#F7F7F9] md:bg-white rounded-[16px] p-6 md:p-8 flex flex-col gap-4 border border-neutral-100/80 transition-shadow hover:shadow-md">
            <h3
              className="text-lg md:text-[24px] font-semibold tracking-[-1%] text-black uppercase leading-[110%]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Route B — Build it in the configurator
            </h3>
            <p className="text-sm md:text-base text-black leading-[150%] font-[400]">
              Pick a riding style, then work down decks → trucks → wheels →
              bearings → griptape. It hides parts that don&apos;t fit together,
              flags what&apos;s out of stock, keeps a running total and drops
              the whole setup in your cart.
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "You know your width, truck height and wheel size.",
                "You want specific parts — Ace trucks, a wheel diameter, a bearing.",
                "You're replacing one worn part.",
              ].map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <span className="w-2 h-2 rounded-full bg-black mt-2 shrink-0" />
                  <span className="text-sm text-black leading-[150%] font-[400]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={getLocalizedPath("/configurator", locale)}
              className="mt-auto pt-4 text-base font-bold uppercase tracking-wider text-black hover:text-neutral-500 transition-colors w-fit"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Open the configurator →
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
