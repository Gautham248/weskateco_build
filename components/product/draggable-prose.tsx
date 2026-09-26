"use client";

import { useDelegatedDragScroll } from "lib/hooks/use-drag-scroll";
import Prose from "components/prose";

/**
 * Shopify tables arrive as an injected HTML string, so there is no React
 * element to attach drag-to-scroll to. This binds to the scroll regions that
 * `prepareProductDescriptionHtml` wraps around them.
 *
 * Kept separate from `Prose` so the policy and CMS pages — which never emit
 * those wrappers — stay server components.
 */
const DRAGGABLE_TABLE_SELECTOR = ".product-description-table-scroll";

export function DraggableProse({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const ref = useDelegatedDragScroll<HTMLDivElement>(DRAGGABLE_TABLE_SELECTOR);

  return (
    <div ref={ref}>
      <Prose html={html} className={className} />
    </div>
  );
}
