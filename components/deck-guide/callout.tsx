"use client";

import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";

/**
 * Cyan crosslink callout. Internal paths (`/…`) are localized; in-page
 * anchors (`#…`) and external URLs are used as-is.
 */
export default function DeckCrosslink({
  text,
  cta,
  href,
}: {
  text: string;
  cta: string;
  href: string;
}) {
  const { locale } = useTranslation();
  const internal = href.startsWith("/");
  const dest = internal ? getLocalizedPath(href, locale) : href;
  const className =
    "w-full lg:w-auto shrink-0 inline-flex items-center justify-center text-center bg-black text-white px-6 py-3.5 md:px-10 md:py-6 rounded-[4px] text-base font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors";
  const style = { fontFamily: "'Clash Display', sans-serif" };

  return (
    <div className="w-full bg-[#EAFBFF] border border-[#80E5FF] rounded-[8px] p-5 md:py-6 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-5 md:gap-6">
      <p className="text-base md:text-lg font-normal text-black max-w-2xl">
        {text}
      </p>
      {internal ? (
        <Link href={dest} className={className} style={style}>
          {cta}
        </Link>
      ) : (
        <a href={dest} className={className} style={style}>
          {cta}
        </a>
      )}
    </div>
  );
}
