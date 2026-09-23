"use client";

import { ChevronDownIcon } from "components/guides/icons";
import { useState } from "react";
import { renderParagraphs, renderRich } from "./rich";
import { Container, Kicker, Section, H2_CLASS } from "./ui";
import type { GuideFaqItem } from "lib/guides/types";

/**
 * Shared FAQ accordion. First item open by default, matching the repo's
 * accordion convention (first item active).
 *
 * Two visual variants exist across the guides and are preserved exactly:
 *  - "chevron": circle chevron button, 20px questions, labelled stock chip
 *    (deck, truck, wheel, board finder)
 *  - "plus":    plain +/- glyph, 32px questions, unlabelled stock chip
 *    (griptape)
 *
 * `idBase` namespaces the button/panel ids per guide ("deck-faq", "faq",
 * …). `scroll` adds the sticky-nav scroll margin (the board finder has no
 * anchor nav).
 */
export default function GuideFaq({
  items,
  idBase,
  variant,
  kicker,
  title,
  intro,
  headerWidth = "3xl",
  bg = "muted",
  scroll = true,
  stockLabel = "What we stock",
}: {
  items: GuideFaqItem[];
  idBase: string;
  variant: "chevron" | "plus";
  kicker?: string;
  title: string;
  intro?: string;
  headerWidth?: "2xl" | "3xl";
  bg?: "muted" | "white";
  scroll?: boolean;
  stockLabel?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" bg={bg} scroll={scroll ? 136 : false}>
      <Container>
        {/* Header */}
        <div
          className={`flex flex-col gap-3 md:gap-4 ${headerWidth === "2xl" ? "max-w-2xl" : "max-w-3xl"}`}
        >
          {kicker && <Kicker>{kicker}</Kicker>}
          <h2
            className={H2_CLASS}
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            {title}
          </h2>
          {intro && (
            <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
              {intro}
            </p>
          )}
        </div>

        {variant === "chevron" ? (
          /* Accordion — chevron variant */
          <div className="flex flex-col divide-y divide-neutral-200 border-y border-neutral-200 max-w-4xl">
            {items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={item.q} className="py-2">
                  <h3>
                    <button
                      type="button"
                      id={`${idBase}-btn-${index}`}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`${idBase}-panel-${index}`}
                      className="flex items-center justify-between gap-4 w-full text-left py-4 transition-colors cursor-pointer group"
                    >
                      <span
                        className="text-base md:text-[20px] font-semibold tracking-[-1%] text-black uppercase leading-[120%]"
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                      >
                        {item.q}
                      </span>
                      <span
                        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen
                            ? "bg-brand rotate-180"
                            : "bg-white group-hover:bg-neutral-100"
                        }`}
                      >
                        <ChevronDownIcon />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`${idBase}-panel-${index}`}
                    role="region"
                    aria-labelledby={`${idBase}-btn-${index}`}
                    hidden={!isOpen}
                    className="flex flex-col gap-4 pb-5 pr-10"
                  >
                    <div className="flex flex-col gap-3">
                      {renderParagraphs(item.a)}
                    </div>
                    {item.stock && (
                      <p className="text-sm md:text-base leading-[150%] bg-white rounded-[12px] border border-neutral-100/80 px-4 py-3">
                        <span
                          className="font-semibold uppercase tracking-wider text-xs mr-2 text-neutral-500"
                          style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                          {stockLabel}
                        </span>
                        <span className="text-black font-[400]">
                          {item.stock}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Accordion — plus variant */
          <div className="border-y border-neutral-200">
            {items.map((item, index) => {
              const id = `${idBase}-${index}`;
              const isOpen = openIndex === index;
              return (
                <div
                  key={id}
                  className="border-b border-neutral-200 last:border-b-0"
                >
                  <h3>
                    <button
                      type="button"
                      id={id}
                      aria-expanded={isOpen}
                      aria-controls={`${id}-panel`}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between gap-6 py-5 md:py-6 text-left cursor-pointer group"
                    >
                      <span
                        className="text-lg md:text-[32px] font-bold tracking-[-1%] uppercase leading-none group-hover:text-neutral-500 transition-colors"
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                      >
                        {item.q}
                      </span>
                      <span
                        aria-hidden
                        className="shrink-0 text-2xl md:text-3xl leading-none w-8 text-center"
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`${id}-panel`}
                    role="region"
                    aria-labelledby={id}
                    hidden={!isOpen}
                    className="pb-6 flex flex-col gap-4 max-w-4xl"
                  >
                    {item.a.split("\n\n").map((paragraph, pi) => (
                      <p
                        key={pi}
                        className="text-sm md:text-base text-black font-[400] leading-[160%]"
                      >
                        {renderRich(paragraph)}
                      </p>
                    ))}
                    {item.stock && (
                      <p className="text-xs md:text-sm text-neutral-500 leading-[160%] bg-[#F7F7F9] border border-neutral-200 rounded-[8px] px-4 py-3">
                        {renderRich(item.stock)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
}
