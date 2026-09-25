import { Fragment, type ReactNode } from "react";

/**
 * Splits a string on `**bold**` and `*italic*` markers and renders the
 * corresponding spans (safe — no HTML injection). Used for the verbatim
 * copy ported from the guide sources.
 */
export function renderRich(text: string): ReactNode[] {
  return text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    if (part.startsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-black">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return (
      <em key={i} className="italic">
        {part.slice(1, -1)}
      </em>
    );
  });
}

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
