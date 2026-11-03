"use client";

import clsx from "clsx";
import { useDragScroll } from "lib/hooks/use-drag-scroll";
import { useEffect, useState, type ReactNode } from "react";

const HINT = "Scroll sideways for the rest →";

/**
 * A horizontally scrolling region that can also be dragged with the mouse.
 *
 * Kept focusable so keyboard users can pan it with the arrow keys, matching
 * the product-description tables on the storefront.
 *
 * With `cue`, the region gains the guides' overflow affordance: a fade on
 * whichever edge still has content behind it, plus a one-line hint above the
 * table. Both are driven by scrollWidth/clientWidth at runtime, so a table
 * that fits gets no fade and no hint at any width. `fade` must name the
 * background the table sits on so the fade resolves to that colour rather
 * than reading as a pale slab.
 */
export function DragScrollArea({
  className,
  ariaLabel,
  cue = false,
  fade = "white",
  children,
}: {
  className?: string;
  ariaLabel: string;
  cue?: boolean;
  fade?: "white" | "muted";
  children: ReactNode;
}) {
  const ref = useDragScroll<HTMLDivElement>();
  const [overflowing, setOverflowing] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [hintRetired, setHintRetired] = useState(false);

  useEffect(() => {
    if (!cue) return;
    const el = ref.current;
    if (!el) return;

    const sync = () => {
      const max = el.scrollWidth - el.clientWidth;
      const over = max > 2;
      setOverflowing(over);
      setAtStart(el.scrollLeft <= 2);
      setAtEnd(el.scrollLeft >= max - 2);
    };

    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(sync) : null;
    observer?.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      observer?.disconnect();
    };
  }, [cue, ref]);

  const scroller = (
    <div
      ref={ref}
      className={clsx("drag-scroll-region overflow-x-auto", className)}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      onScroll={
        cue
          ? (event) => {
              if (event.currentTarget.scrollLeft > 8) setHintRetired(true);
            }
          : undefined
      }
    >
      {children}
    </div>
  );

  if (!cue) return scroller;

  const fadeFrom = fade === "muted" ? "from-[#F7F7F9]" : "from-white";

  return (
    <div className="flex min-w-0 flex-col">
      {overflowing && (
        <p
          aria-hidden
          className={clsx(
            "mb-2 text-xs font-medium text-neutral-500 transition-opacity duration-300 md:text-sm motion-reduce:transition-none",
            hintRetired && "opacity-0",
          )}
        >
          {HINT}
        </p>
      )}
      <div className="relative min-w-0">
        {scroller}
        {overflowing && (
          <div
            aria-hidden
            className={clsx(
              "pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r to-transparent transition-opacity duration-200 motion-reduce:transition-none",
              fadeFrom,
              atStart ? "opacity-0" : "opacity-100",
            )}
          />
        )}
        {overflowing && (
          <div
            aria-hidden
            className={clsx(
              "pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l to-transparent transition-opacity duration-200 motion-reduce:transition-none",
              fadeFrom,
              atEnd ? "opacity-0" : "opacity-100",
            )}
          />
        )}
      </div>
    </div>
  );
}
