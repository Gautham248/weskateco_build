import { Fragment, type ReactNode } from "react";

/**
 * Splits a string on `**bold**` and `*italic*` markers and renders the
 * corresponding spans (safe — no HTML injection). Used for the verbatim
 * copy ported from the deck guide source.
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
