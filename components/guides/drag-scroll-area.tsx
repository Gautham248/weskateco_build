"use client";

import clsx from "clsx";
import { useDragScroll } from "lib/hooks/use-drag-scroll";
import type { ReactNode } from "react";

/**
 * A horizontally scrolling region that can also be dragged with the mouse.
 *
 * Kept focusable so keyboard users can pan it with the arrow keys, matching
 * the product-description tables on the storefront.
 */
export function DragScrollArea({
  className,
  ariaLabel,
  children,
}: {
  className?: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  const ref = useDragScroll<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={clsx("drag-scroll-region overflow-x-auto", className)}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
