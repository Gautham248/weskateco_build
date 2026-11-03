import { renderRich } from "components/guides/rich";
import type { ReactNode } from "react";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

/**
 * Injects one of the source guide's static, first-party SVG drawings.
 *
 * The diagrams are large (up to ~34 KB of path data) and unchanged from the
 * source apart from colour: `lib/surfskate-guide/figures.ts` has already had
 * every source CSS variable swapped for a project token, so the markup is
 * safe to inject as-is. The `.surfskate-figs` scope in app/globals.css maps
 * the drawing classes onto the project palette. The wrapper scrolls
 * sideways on phones, matching the other guide figures.
 */
export function SurfFigure({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={`surfskate-figs -mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0 ${className}`}
      // Static, first-party drawing; see the comment above.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** The guides' "What we stock" note — body text, bold/links supported. */
export function Stocked({ text }: { text: ReactNode }) {
  return (
    <div className="max-w-4xl border-l-4 border-black bg-[#F7F7F9] px-4 py-3.5 md:px-6 md:py-4">
      <span
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-black"
        style={CLASH}
      >
        What we stock
      </span>
      <p className="text-sm md:text-base text-black font-[400] leading-[160%]">
        {typeof text === "string" ? renderRich(text) : text}
      </p>
    </div>
  );
}

/**
 * The guides' "say this out loud" caution. There is no danger/warning token in
 * the project, so this uses the strongest existing emphasis — solid black —
 * to keep the caution visually distinct from the neutral Stocked note.
 */
export function Watch({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-4xl bg-black px-4 py-3.5 text-white md:px-6 md:py-4">
      <p
        className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-white"
        style={CLASH}
      >
        {title}
      </p>
      <p className="text-sm md:text-base font-[400] leading-[160%] text-white">
        {renderRich(body)}
      </p>
    </div>
  );
}
