"use client";

import { GreenArrowIcon } from "components/guides/icons";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";

const STYLES = [
  {
    tag: "8.25″+",
    title: "Cruising & chilling",
    description:
      "Go wider for stability, or take a surfskate for smooth turns and flow through traffic. The surfskate is also the soft-wheel option — 82A against a skateboard's 100A — so it rolls over broken tar instead of stopping dead on it.",
    linkLabel: "Shop surfskates →",
    href: "/store/surfskates",
  },
  {
    tag: "8″",
    title: "Street & flatground",
    description:
      "8″ is the common street width in India and the one most riders here settle on — light enough to flip, wide enough to land clean. 7.75″ suits lighter riders and smaller feet; 8.125″ and 8.25″ if 8″ feels a fraction short. This is where most riders start and most stay.",
    linkLabel: "Shop completes →",
    href: "/store/skateboard-completes",
  },
  {
    tag: "8.0″ and up",
    title: "Ramps, bowls & transition",
    description:
      "Transition just means curved riding surfaces — ramps, bowls, quarter pipes. You want more foot space and more stability at speed, because you're pumping for speed up a curved wall rather than flicking the board. Pads are not optional here.",
    linkLabel: "Shop decks →",
    href: "/store/decks",
  },
];
import { Container, Section, H2_CLASS } from "components/guides/ui";

export default function StyleCardsSection() {
  const { locale } = useTranslation();

  return (
    <Section bg="muted" scroll={false}>
      <Container>
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4 max-w-2xl">
          <h2
            className={H2_CLASS}
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            What&apos;s your style <br /> or goal?
          </h2>
          <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
            Deck width follows what you actually want to do on the board. Three
            directions.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
          {STYLES.map((style) => (
            <div
              key={style.title}
              className="bg-white rounded-[20px] p-6 md:p-8 flex flex-col justify-between gap-6 border border-neutral-100/80 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-4">
                <span
                  className="text-sm font-medium tracking-[-1%] text-[#00000080] uppercase"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {style.tag}
                </span>
                <h3
                  className="text-lg md:text-[24px] font-semibold tracking-[-1%] text-black uppercase leading-[110%] md:leading-[100%]"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {style.title}
                </h3>
                <p className="text-base text-black leading-[140%] font-normal my-2">
                  {style.description}
                </p>
              </div>

              <Link
                href={getLocalizedPath(style.href, locale)}
                className="flex items-center gap-3 group cursor-pointer text-left w-fit"
              >
                <span className="w-7 h-7 rounded-full bg-brand flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <GreenArrowIcon />
                </span>
                <span
                  className="text-xl md:text-[24px] font-bold uppercase text-black"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {style.linkLabel}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
