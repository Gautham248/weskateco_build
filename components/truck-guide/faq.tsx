"use client";

import { renderParagraphs } from "components/board-finder/rich-text";
import { ChevronDownIcon } from "components/guides/icons";
import { FAQ_SECTION, TRUCK_FAQ } from "lib/truck-guide/data";
import { useState } from "react";
import { Kicker } from "./ui";

export default function TruckFaqSection() {
  // First item open by default, matching the repo's accordion convention.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="w-full bg-[#F7F7F9] text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4 max-w-3xl">
          <Kicker>{FAQ_SECTION.kicker}</Kicker>
          <h2
            className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none md:leading-[80%]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            {FAQ_SECTION.title}
          </h2>
          <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
            {FAQ_SECTION.intro}
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col divide-y divide-neutral-200 border-y border-neutral-200 max-w-4xl">
          {TRUCK_FAQ.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.q} className="py-2">
                <h3>
                  <button
                    type="button"
                    id={`truck-faq-btn-${index}`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`truck-faq-panel-${index}`}
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
                          ? "bg-[#CCFF02] rotate-180"
                          : "bg-white group-hover:bg-neutral-100"
                      }`}
                    >
                      <ChevronDownIcon />
                    </span>
                  </button>
                </h3>
                <div
                  id={`truck-faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`truck-faq-btn-${index}`}
                  hidden={!isOpen}
                  className="flex flex-col gap-4 pb-5 pr-10"
                >
                  <div className="flex flex-col gap-3">
                    {renderParagraphs(item.a)}
                  </div>
                  <p className="text-sm md:text-base leading-[150%] bg-white rounded-[12px] border border-neutral-100/80 px-4 py-3">
                    <span
                      className="font-semibold uppercase tracking-wider text-xs mr-2 text-neutral-500"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      What we stock
                    </span>
                    <span className="text-black font-[400]">{item.stock}</span>
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
