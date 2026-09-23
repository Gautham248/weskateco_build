"use client";

import { FAQ_SECTION, GRIP_FAQ } from "lib/griptape-guide/data";
import { useState } from "react";
import { renderRich } from "./rich";
import { SectionHeader } from "./ui";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

/** FAQ accordion — first item open by default, no history API. */
export default function GripFaqSection() {
  const [open, setOpen] = useState<string | null>("grip-faq-0");

  return (
    <section
      id="faq"
      className="w-full bg-white text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <SectionHeader
          kicker={FAQ_SECTION.kicker}
          title={FAQ_SECTION.title}
          intro={FAQ_SECTION.intro}
        />

        <div className="border-y border-neutral-200">
          {GRIP_FAQ.map((item, i) => {
            const id = `grip-faq-${i}`;
            const isOpen = open === id;
            return (
              <div
                key={id}
                className="border-b border-neutral-200 last:border-b-0"
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${id}-panel`}
                    onClick={() => setOpen(isOpen ? null : id)}
                    className="w-full flex items-center justify-between gap-6 py-5 md:py-6 text-left cursor-pointer group"
                  >
                    <span
                      className="text-lg md:text-[32px] font-bold tracking-[-1%] uppercase leading-none group-hover:text-neutral-500 transition-colors"
                      style={CLASH}
                    >
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className="shrink-0 text-2xl md:text-3xl leading-none w-8 text-center"
                      style={CLASH}
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
                  <p className="text-xs md:text-sm text-neutral-500 leading-[160%] bg-[#F7F7F9] border border-neutral-200 rounded-[8px] px-4 py-3">
                    {renderRich(item.stock)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
