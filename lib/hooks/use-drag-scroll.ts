"use client";

import { useCallback, useEffect, useRef } from "react";

/** Pointer travel (px) before a press turns into a drag. Keeps an ordinary
 * click on a link inside a table cell working. */
const DRAG_THRESHOLD_PX = 5;

type DragState = {
  container: HTMLElement;
  startX: number;
  startScrollLeft: number;
  /** Set once the pointer travels far enough to count as a drag. */
  engaged: boolean;
};

function isOverflowing(container: HTMLElement) {
  return container.scrollWidth - container.clientWidth > 1;
}

/**
 * Wires drag-to-scroll against a root element.
 *
 * `resolve` maps a pointer event target to the element that should scroll, so
 * the same core serves both a single known container and HTML that was
 * injected as a string and therefore has no React element to attach to.
 */
function useDragScrollCore<T extends HTMLElement>(
  resolve: (target: EventTarget | null, root: T) => HTMLElement | null,
  deps: unknown[],
) {
  const rootRef = useRef<T | null>(null);
  const dragRef = useRef<DragState | null>(null);
  /** Survives past pointerup so the trailing `click` can be swallowed. */
  const suppressClickRef = useRef(false);
  const grabTargetRef = useRef<HTMLElement | null>(null);

  const clearGrab = useCallback(() => {
    grabTargetRef.current?.classList.remove("cursor-grab");
    grabTargetRef.current = null;
  }, []);

  const endDrag = useCallback(() => {
    const drag = dragRef.current;

    if (drag) {
      drag.container.classList.remove("cursor-grabbing");
      drag.container.style.removeProperty("user-select");
    }

    dragRef.current = null;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onPointerDown = (event: PointerEvent) => {
      // Mouse only: touch and pen keep their native panning.
      if (event.pointerType !== "mouse" || event.button !== 0) return;

      const container = resolve(event.target, root);
      if (!container || !isOverflowing(container)) return;

      suppressClickRef.current = false;
      dragRef.current = {
        container,
        startX: event.clientX,
        startScrollLeft: container.scrollLeft,
        engaged: false,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const distance = event.clientX - drag.startX;

      if (!drag.engaged) {
        if (Math.abs(distance) < DRAG_THRESHOLD_PX) return;

        drag.engaged = true;
        drag.container.classList.add("cursor-grabbing");
        drag.container.style.setProperty("user-select", "none");
      }

      // Stop the browser also panning the page or selecting text.
      event.preventDefault();
      drag.container.scrollLeft = drag.startScrollLeft - distance;
    };

    const onPointerUp = () => {
      // Only a drag that actually moved should swallow the trailing click;
      // a plain click on a link inside a cell has to survive.
      if (dragRef.current?.engaged) {
        suppressClickRef.current = true;
      }

      endDrag();
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClickRef.current) return;

      suppressClickRef.current = false;
      event.preventDefault();
      event.stopPropagation();
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      const container = resolve(event.target, root);

      // pointerover bubbles once per element entered, so moving across one
      // table fires many times. Re-reading scrollWidth for each of those
      // would force needless layout, so only re-evaluate on a real change.
      if (container === grabTargetRef.current) return;

      clearGrab();

      if (container && isOverflowing(container)) {
        container.classList.add("cursor-grab");
        grabTargetRef.current = container;
      }
    };

    const onPointerLeave = () => clearGrab();

    const onPointerCancel = () => endDrag();

    // A resize can turn an overflowing table into a fitting one while the
    // pointer is still resting on it, so drop the stale grab cursor.
    const onResize = () => clearGrab();

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointerover", onPointerOver);
    root.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);
    root.addEventListener("click", onClickCapture, true);

    return () => {
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerover", onPointerOver);
      root.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      root.removeEventListener("click", onClickCapture, true);
      clearGrab();
      endDrag();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearGrab, endDrag, ...deps]);

  return rootRef;
}

/** Drag-to-scroll for a single, known horizontal scroll container. */
export function useDragScroll<T extends HTMLElement>() {
  return useDragScrollCore<T>((_target, root) => root, []);
}

/**
 * Drag-to-scroll for scroll containers that exist only in injected HTML.
 *
 * `selector` is matched against `event.target` and its ancestors, so it must
 * be specific enough that only real scroll regions resolve.
 */
export function useDelegatedDragScroll<T extends HTMLElement>(
  selector: string,
) {
  const resolve = useCallback(
    (target: EventTarget | null) => {
      if (!(target instanceof Element)) return null;
      return target.closest<HTMLElement>(selector);
    },
    [selector],
  );

  return useDragScrollCore<T>(resolve, [selector]);
}
