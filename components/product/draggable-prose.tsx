"use client";

import { useDelegatedDragScroll } from "lib/hooks/use-drag-scroll";
import Prose from "components/prose";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

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
  const router = useRouter();

  /**
   * Shopify descriptions link between products and guides with plain `<a>`,
   * which is a full document load — the cart, scroll position and any open
   * sidebar are all thrown away. Routing those through the App Router keeps the
   * navigation client-side.
   *
   * Deliberately conservative: modified clicks (new tab/window, download) and
   * non-HTTP schemes are left to the browser, because taking those over would
   * be a behaviour regression rather than a fix.
   */
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = event.target as HTMLElement | null;
    const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!anchor) return;

    // Let the browser handle anything that asks to open elsewhere.
    if (anchor.target && anchor.target !== "_self") return;
    if (anchor.hasAttribute("download")) return;

    const href = anchor.getAttribute("href");
    if (!href) return;
    // Fragment-only links are same-page anchors; Next's router would treat
    // them as a navigation and can warn about them.
    if (href.startsWith("#")) return;

    let url: URL;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }

    // Same-origin HTTP(S) only — everything else stays a normal browser nav.
    if (url.origin !== window.location.origin) return;
    if (url.protocol !== "http:" && url.protocol !== "https:") return;

    event.preventDefault();
    router.push(`${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <div ref={ref} onClick={handleClick}>
      <Prose html={html} className={className} />
    </div>
  );
}
