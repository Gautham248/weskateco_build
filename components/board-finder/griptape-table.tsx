"use client";

import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";

// 3-column griptape comparison. `warn` flags a caution cell.
type Cell =
  | string
  | { text: string; warn?: boolean; link?: { label: string; href: string } };

const GRADES = [
  { name: "80AB", subtitle: "Fitted grade" },
  { name: "OS780", subtitle: "Sphere Original · Standard" },
  { name: "HS780", subtitle: "Sphere Heavy · Extra" },
];

const ROWS: { label: string; cells: [Cell, Cell, Cell]; warnRow?: boolean }[] =
  [
    {
      label: "Grain",
      cells: ["Fine", "780 grade, standard grain", "780 grade, coarse grain"],
    },
    {
      label: "Made of",
      cells: [
        "Silicon carbide + aluminium oxide",
        "Silicon carbide + PVC",
        "Silicon carbide + PVC",
      ],
    },
    {
      label: "Sheet",
      cells: ["Pre-cut and applied", "9″ × 33″", "9″ × 33″"],
    },
    {
      label: "Fits",
      cells: [
        "The complete it ships on",
        "Any deck up to 9″",
        "Any deck up to 9″",
      ],
    },
    {
      label: "Underfoot",
      cells: [
        "Enough grip to learn to stand, push and turn on.",
        "Grippy enough that you're not sliding off, loose enough that you can still shuffle your feet mid-line.",
        "Digs in harder than standard and keeps digging in longer. You stop thinking about your feet.",
      ],
    },
    {
      label: "Wear",
      cells: [
        "Dulls first of the three.",
        "Even wear — no thin patches near the edges, which is where cheap tape gives up.",
        "Lays down flat, comes up in one piece when you're done with it.",
      ],
    },
    {
      label: "Best for",
      cells: [
        "Your first month on a board.",
        "Most riders, most of the time.",
        "Skating in heat, and anyone who wants their back foot to stay put.",
      ],
    },
    {
      label: "Trade-off",
      warnRow: true,
      cells: [
        "You don't choose it — it's what the complete ships with.",
        "None worth naming.",
        { text: "Will chew through your shoes noticeably faster.", warn: true },
      ],
    },
    {
      label: "How you get it",
      cells: [
        {
          text: "Fitted to beginner completes. Not sold on its own.",
          warn: true,
        },
        "Sold as a sheet, on its own. The one grade you can just buy and re-grip with.",
        {
          text: "Only by building a setup in the configurator — there is no HS780 sheet on the shelf.",
          warn: true,
          link: {
            label: "building a setup in the configurator",
            href: "/configurator",
          },
        },
      ],
    },
  ];

function renderCell(cell: Cell, locale: string) {
  if (typeof cell === "string") {
    return <span>{cell}</span>;
  }
  // Cell with an embedded link: split the label out of the text.
  if (cell.link) {
    const parts = cell.text.split(cell.link.label);
    return (
      <span className={cell.warn ? "text-amber-800" : undefined}>
        {parts[0]}
        <Link
          href={getLocalizedPath(cell.link.href, locale)}
          className="underline underline-offset-2 font-medium hover:text-black transition-colors"
        >
          {cell.link.label}
        </Link>
        {parts[1]}
      </span>
    );
  }
  return (
    <span className={cell.warn ? "text-amber-800" : undefined}>
      {cell.warn && (
        <span
          aria-hidden
          className="mr-1.5 inline-block w-1.5 h-1.5 rounded-full bg-amber-400 align-middle"
        />
      )}
      {cell.text}
    </span>
  );
}
import { Container, Section, H2_CLASS } from "components/guides/ui";

export default function GriptapeSection() {
  const { locale } = useTranslation();

  return (
    <Section scroll={false}>
      <Container>
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4 max-w-2xl">
          <h2
            className={H2_CLASS}
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Griptape grades
          </h2>
          <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
            Three grades, side by side — the grain is the difference.
          </p>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-40" />
                {GRADES.map((grade) => (
                  <th key={grade.name} className="pb-4 pr-6 align-bottom">
                    <span
                      className="block text-lg md:text-[24px] font-bold uppercase tracking-[-1%] text-black"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {grade.name}
                    </span>
                    <span className="block text-xs md:text-sm text-neutral-500 mt-1">
                      {grade.subtitle}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr
                  key={row.label}
                  className={`border-t border-neutral-100 ${row.warnRow ? "bg-amber-50/60" : ""}`}
                >
                  <th
                    scope="row"
                    className="py-4 pr-6 text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500 align-top"
                  >
                    {row.label}
                  </th>
                  {row.cells.map((cell, i) => (
                    <td
                      key={i}
                      className="py-4 pr-6 text-sm md:text-base leading-[150%] font-[400] text-black align-top"
                    >
                      {renderCell(cell, locale)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footnote */}
        <p className="text-sm md:text-base text-neutral-600 leading-[150%] max-w-3xl">
          Re-gripping is the cheapest change you can make to how a board feels,
          and the easiest to do badly. Lay the sheet from the nose, press it
          down flat before you trim, score the edge with a file until you see a
          white line, then cut along it and punch the bolt holes through from
          underneath. One thing to plan around:{" "}
          <strong className="font-semibold text-black">
            HS780 is a build-only grade.
          </strong>{" "}
          If you want the coarse tape, choose it while you&apos;re putting the
          setup together — you can&apos;t add it as a sheet afterwards.{" "}
          <Link
            href={getLocalizedPath("/store/skateboards", locale)}
            className="underline underline-offset-2 font-medium text-black hover:text-neutral-500 transition-colors"
          >
            OS780 sheets are in the store
          </Link>
          .
        </p>
      </Container>
    </Section>
  );
}
