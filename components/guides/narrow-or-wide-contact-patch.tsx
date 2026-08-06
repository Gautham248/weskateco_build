"use client";

import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";

const CONTACT_PATCH_DATA = [
  {
    id: "narrow-contact-patch",
    tag: "NARROW CONTACT PATCH",
    title: "STREET SKATING",
    points: ["Easier slides, faster response", "Less grip"],
    buttonText: "SHOP SKATEBOARD WHEELS",
    href: "/store/skateboard-wheels",
  },
  {
    id: "wide-contact-patch",
    tag: "WIDE CONTACT PATCH",
    title: "CRUISING, DOWNHILL",
    points: ["More stability and control", "Heavier, harder to slide"],
    buttonText: "SHOP SURFSKATE WHEELS",
    href: "/store/surfskate-wheels",
  },
];

export default function NarrowOrWideContactPatchSection() {
  const { locale } = useTranslation();

  return (
    <section className="w-full bg-white md:bg-[#F7F7F9] text-black py-10 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-8 md:gap-12">
        {/* Top Header Block */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <h2
            className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none md:leading-[80%]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            NARROW OR WIDE <br /> CONTACT PATCH?
          </h2>
          <p className="text-sm md:text-lg text-black font-normal leading-[140%]">
            The contact patch is the part of your wheel that touches the ground
            — and it changes everything.
          </p>
        </div>

        {/* 2 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {CONTACT_PATCH_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-[#F7F7F9] md:bg-white rounded-[16px] p-6 md:p-8 flex flex-col justify-between border border-neutral-100/80 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-5 text-center md:text-start">
                <span className="text-sm md:text-base font-medium tracking-[-1%] text-[#00000080] uppercase">
                  {item.tag}
                </span>
                <h3
                  className="text-[24px] md:text-[30px] font-semibold tracking-[-1%] text-black uppercase leading-[100%] pb-2"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {item.title}
                </h3>

                {/* Points List with dividers */}
                <div className="flex flex-col text-base md:text-xl text-black font-normal leading-[140%] pt-2">
                  {item.points.map((point, idx) => (
                    <div
                      key={idx}
                      className="py-4 border-b border-[#0000001A] first:pt-0"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={getLocalizedPath(item.href, locale)}
                className="w-full md:w-fit bg-black text-white px-6 py-3.5 rounded-[4px] text-base font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0 mt-10 text-center"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {item.buttonText}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Banner Card */}
        <div className="w-full bg-[#EAFBFF] border border-[#80E5FF] rounded-[8px] px-4 py-4 md:py-5 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-base md:text-lg font-normal text-black leading-[140%]">
            <span className="font-semibold">Pro tip:</span> Combine the right shape
            and contact patch to match your terrain and style. The wrong combo
            can make your board feel sluggish or too twitchy.
          </p>
        </div>
      </div>
    </section>
  );
}
