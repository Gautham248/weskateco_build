"use client";

import { DragScrollArea } from "components/guides/drag-scroll-area";

// Trucks sizing table: columns are deck-width bands, 2 rows.
const BAND_COLUMNS = [
  {
    range: "7″–7.5″",
    who: "Small feet, young riders",
    hanger: "4.0″ or 4.75″",
    make: "Toucan Kids",
  },
  {
    range: "7.5″–7.9″",
    who: "Lighter riders, smaller feet",
    hanger: "5.0″",
    make: "Double Hollow",
  },
  {
    range: "7.9″–8.25″",
    who: "Most street setups — 8″ sits here",
    hanger: "5.25″",
    make: "Double Hollow",
  },
  {
    range: "8.25″ and wider",
    who: "Transition and cruising",
    hanger: "5.5″",
    make: "Double Hollow",
  },
];
import { Container, Section, H2_CLASS } from "components/guides/ui";

export default function TrucksSection() {
  return (
    <Section bg="muted" scroll={false}>
      <Container>
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4 max-w-3xl">
          <h2
            className={H2_CLASS}
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Trucks
          </h2>
          <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
            Trucks are the two metal axles bolted under the deck. They carry the
            wheels and they are the only reason a skateboard turns: you lean,
            rubber rings called bushings squash on one side, and the axle tilts.
            Two things to get right: the size, and which tier of truck
            you&apos;re actually on.
          </p>
        </div>

        {/* Sizing table */}
        <DragScrollArea
          className="-mx-4 px-4 lg:mx-0 lg:px-0"
          ariaLabel="Truck size by deck width, scrollable"
        >
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-36" />
                {BAND_COLUMNS.map((band) => (
                  <th key={band.range} className="pb-4 pr-6 align-bottom">
                    <span
                      className="block text-base md:text-[20px] font-bold uppercase tracking-[-1%] text-black"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {band.range}
                    </span>
                    <span className="block text-xs md:text-sm text-neutral-500 mt-1">
                      {band.who}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-neutral-200">
                <th
                  scope="row"
                  className="py-4 pr-6 text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500 align-top"
                >
                  Hanger width
                </th>
                {BAND_COLUMNS.map((band) => (
                  <td
                    key={band.range}
                    className="py-4 pr-6 text-sm md:text-base font-semibold text-black align-top"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {band.hanger}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-neutral-200">
                <th
                  scope="row"
                  className="py-4 pr-6 text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500 align-top"
                >
                  What we make
                </th>
                {BAND_COLUMNS.map((band) => (
                  <td
                    key={band.range}
                    className="py-4 pr-6 text-sm md:text-base text-black align-top"
                  >
                    {band.make}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </DragScrollArea>

        {/* Footnote: two rulers */}
        <p className="text-sm md:text-base text-neutral-600 leading-[150%] max-w-3xl">
          <strong className="font-semibold text-black">
            Two rulers, one truck.
          </strong>{" "}
          Brands quote truck size in two different ways and neither is wrong.{" "}
          <strong className="font-semibold text-black">Hanger width</strong>{" "}
          measures just the metal arm — that&apos;s the 5.0″ / 5.25″ / 5.5″
          above.{" "}
          <strong className="font-semibold text-black">Axle width</strong>{" "}
          measures the whole thing, tip to tip, which lands close to the deck
          width it suits — our fitted beginner truck is quoted that way, as an
          8″. Same part, different tape measure. When you&apos;re comparing two
          trucks, check which number each one is quoting before you conclude one
          is bigger.
        </p>

        {/* Two cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          <div className="bg-white rounded-[20px] p-6 md:p-8 flex flex-col gap-4 border border-neutral-100/80 transition-shadow hover:shadow-md">
            <span
              className="text-xs md:text-sm font-medium tracking-[-1%] text-[#00000080] uppercase"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Fitted to beginner completes
            </span>
            <h3
              className="text-lg md:text-[24px] font-semibold tracking-[-1%] text-black uppercase leading-[110%]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              The beginner truck
            </h3>
            <p className="text-sm md:text-base text-black leading-[150%] font-[400]">
              A dedicated solid truck, one size — 8″ axle width — on 90A
              bushings, fitted across all three beginner widths. It is built to
              a price and it is honestly not in the same class as a pro truck:
              heavier, less refined, less adjustable feel.
            </p>
            <ul className="flex flex-col gap-2 mt-auto">
              {[
                "Does its job for a first few months of learning.",
                "Not sold on its own — it comes on the board.",
                "Usually the first part a rider upgrades.",
              ].map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <span className="w-2 h-2 rounded-full bg-black mt-2 shrink-0" />
                  <span className="text-sm text-black leading-[150%] font-[400]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-[20px] p-6 md:p-8 flex flex-col gap-4 border border-neutral-100/80 transition-shadow hover:shadow-md">
            <span
              className="text-xs md:text-sm font-medium tracking-[-1%] text-[#00000080] uppercase"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Sold on their own
            </span>
            <h3
              className="text-lg md:text-[24px] font-semibold tracking-[-1%] text-black uppercase leading-[110%]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Pro trucks
            </h3>
            <p className="text-sm md:text-base text-black leading-[150%] font-[400]">
              Better castings, better bushings and a proper range of widths, so
              the truck matches your deck instead of approximately fitting it.
              This is where a board stops feeling like a starter board — the
              turn becomes something you can actually tune.
            </p>
            <ul className="flex flex-col gap-2 mt-auto">
              <li className="flex gap-3 items-start">
                <span className="w-2 h-2 rounded-full bg-black mt-2 shrink-0" />
                <span className="text-sm text-black leading-[150%] font-[400]">
                  Double Hollow in 5.0″, 5.25″ and 5.5″.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-2 h-2 rounded-full bg-black mt-2 shrink-0" />
                <span className="text-sm text-black leading-[150%] font-[400] flex items-center gap-2 flex-wrap">
                  Solid Toucan pro trucks
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-500 border border-neutral-200"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    Coming soon
                  </span>
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-2 h-2 rounded-full bg-black mt-2 shrink-0" />
                <span className="text-sm text-black leading-[150%] font-[400] flex items-center gap-2 flex-wrap">
                  A range of ACE trucks
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-500 border border-neutral-200"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    Coming soon
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Closing footnote */}
        <p className="text-sm md:text-base text-neutral-600 leading-[150%] max-w-3xl">
          <strong className="font-semibold text-black">
            One adjustment, free.
          </strong>{" "}
          The nut on top of the kingpin sets how easily the board leans. Tighter
          is more stable and harder to turn; looser carves more and feels loose
          at speed. New riders usually start a little tight and loosen off over
          the first few weeks. A quarter turn is a real change — go in small
          steps, and use the same T-tool that fits everything else on the board.
          A fuller breakdown of geometry, bushings and brands is coming in the
          dedicated truck guide.
        </p>
      </Container>
    </Section>
  );
}
