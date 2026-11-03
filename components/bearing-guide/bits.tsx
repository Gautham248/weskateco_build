"use client";

import type { FooterColumn } from "content/guides/bearings";
import { renderRich } from "components/guides/rich";
import { useTranslation } from "lib/i18n/TranslationProvider";
import { getLocalizedPath } from "lib/i18n";
import Link from "next/link";
import type { ReactNode } from "react";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

/**
 * Consistent "What we stock" / "Also in the range" product callout across the guide.
 */
export function StockedCallout({
  label = "What we stock",
  text,
}: {
  label?: string;
  text: string;
}) {
  return (
    <div className="w-full max-w-4xl border-l-4 border-black bg-[#F7F7F9] px-5 py-4 md:px-6 md:py-5 rounded-r-[8px]">
      <span
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-black"
        style={CLASH}
      >
        {label}
      </span>
      <p className="text-sm md:text-base text-black font-[400] leading-[160%]">
        {renderRich(text)}
      </p>
    </div>
  );
}

/**
 * Consistent "Watch out" caution callout used in the cleaning stepper.
 */
export function WatchOutCallout({
  label = "Watch out",
  text,
}: {
  label?: string;
  text: string;
}) {
  return (
    <div className="w-full border-l-4 border-neutral-900 bg-neutral-900 text-white p-4 md:p-5 rounded-r-[8px]">
      <span
        className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white"
        style={CLASH}
      >
        {label}
      </span>
      <p className="text-sm md:text-base text-neutral-100 font-[400] leading-[150%]">
        {renderRich(text)}
      </p>
    </div>
  );
}

/**
 * Consistent emphasised note card — border, rounded-[16px], muted body text.
 */
export function NoteCard({ text }: { text: string }) {
  return (
    <div className="w-full max-w-4xl border border-neutral-200 rounded-[16px] p-5 md:p-6 bg-white">
      <p className="text-sm md:text-base text-neutral-600 leading-[160%]">
        {renderRich(text)}
      </p>
    </div>
  );
}

/**
 * Four cleaning tool cards in a responsive grid.
 */
export function ToolsGrid({
  items,
}: {
  items: Array<{ title: string; body: string }>;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {items.map((tool) => (
        <div
          key={tool.title}
          className="rounded-[16px] p-5 md:p-6 bg-[#F7F7F9] border border-neutral-200/60 flex flex-col gap-2"
        >
          <h3
            className="text-base md:text-lg font-bold tracking-[-1%] text-black uppercase leading-tight"
            style={CLASH}
          >
            {tool.title}
          </h3>
          <p className="text-sm text-neutral-700 leading-[150%] font-[400]">
            {renderRich(tool.body)}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Bottom related guides / shop columns + closing sourcing/disclaimer note.
 */
export function RelatedColumnsAndNote({
  columns,
  note,
}: {
  columns: FooterColumn[];
  note: string;
}) {
  const { locale } = useTranslation();

  return (
    <section className="w-full bg-[#F7F7F9] border-t border-neutral-200 py-12 md:py-16 text-black">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-10 md:gap-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <h3
                className="text-sm md:text-base font-bold uppercase tracking-wider text-black"
                style={CLASH}
              >
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => {
                  const isInternal = link.href.startsWith("/");
                  // Don't render dead link for /guides/wheel-guide (repo route is wheels-guide)
                  // If link is /guides/wheel-guide, we omit or point to /guides/wheels-guide
                  // Per instructions: "If a route does not exist, do not create it and do not render a dead link: omit that link and list it in your report"
                  if (link.href === "/guides/wheel-guide") {
                    return null;
                  }

                  const targetHref = isInternal
                    ? getLocalizedPath(link.href, locale)
                    : link.href;

                  return (
                    <li key={link.label}>
                      {isInternal ? (
                        <Link
                          href={targetHref}
                          className="text-sm text-neutral-600 hover:text-black transition-colors"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={targetHref}
                          className="text-sm text-neutral-600 hover:text-black transition-colors"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {note && (
          <div className="pt-8 border-t border-neutral-200/80">
            <p className="text-xs md:text-sm text-neutral-500 leading-[160%] max-w-4xl">
              {renderRich(note)}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
