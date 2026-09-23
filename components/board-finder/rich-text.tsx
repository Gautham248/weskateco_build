import { Fragment } from "react";

/** Splits a string on `**bold**` markers and renders bold spans. */
export function renderBold(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-black">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** Splits a string on `<b>…</b>` markers and renders bold spans (safe — no HTML injection). */
export function renderTagged(text: string) {
  return text.split(/<b>(.*?)<\/b>/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-black">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** Renders a `\n\n`-separated string as paragraphs with `**bold**` support. */
export function renderParagraphs(text: string) {
  return text.split("\n\n").map((para, i) => (
    <p
      key={i}
      className="text-sm md:text-base text-black leading-[150%] font-[400]"
    >
      {renderBold(para)}
    </p>
  ));
}
