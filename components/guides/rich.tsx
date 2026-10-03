import { Fragment, type ReactNode } from "react";

/**
 * Splits a string on `**bold**`, `*italic*` and `[label](href)` markers and
 * renders the corresponding spans/links (safe — no HTML injection). Used for
 * the verbatim copy ported from the guide sources.
 *
 * Links: in-page (`#…`) and internal (`/…`) hrefs render as plain anchors; any
 * other href opens in a new tab with `rel="noopener noreferrer"`. Existing
 * strings without link markers are unaffected.
 */
export function renderRich(text: string): ReactNode[] {
  return text
    .split(/(\*\*.*?\*\*|\*.*?\*|\[[^\]]+\]\([^)]+\))/g)
    .map((part, i) => {
      if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
      if (part.startsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-black">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("[")) {
        const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (match?.[1] && match[2]) {
          const href = match[2];
          const external = !href.startsWith("#") && !href.startsWith("/");
          return (
            <a
              key={i}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="underline underline-offset-3 hover:no-underline"
            >
              {match[1]}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
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
