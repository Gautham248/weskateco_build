// @vitest-environment jsdom
import { useDragScroll } from "lib/hooks/use-drag-scroll";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// Requires React's development build: `act` throws "act(...) is not supported in
// production builds of React", and React picks its build from NODE_ENV at require
// time. Vitest defaults NODE_ENV to "test" (which already selects the development
// build), but keeps an ambient NODE_ENV=production, so pin it here. vi.hoisted runs
// before the imports above are evaluated, so React has not been required yet.
vi.hoisted(() => {
  vi.stubEnv("NODE_ENV", "development");
});

// Tells React that updates are wrapped in act(), so it flushes them synchronously
// and does not warn that the test environment isn't configured for act.
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type PointerInit = { clientX: number; pointerType?: string; button?: number };

/** jsdom never lays out, so overflow has to be stubbed per element. */
function setOverflow(element: HTMLElement, overflowing: boolean) {
  Object.defineProperty(element, "clientWidth", {
    value: overflowing ? 300 : 900,
    configurable: true,
  });
  Object.defineProperty(element, "scrollWidth", {
    value: overflowing ? 900 : 900,
    configurable: true,
  });
}

/** jsdom 26 ships no PointerEvent, so build one from MouseEvent. */
function pointer(type: string, init: PointerInit) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: init.clientX,
    button: init.button ?? 0,
  });

  Object.defineProperty(event, "pointerType", {
    value: init.pointerType ?? "mouse",
  });

  return event;
}

function Probe({
  overflowing,
  onReady,
}: {
  overflowing: boolean;
  onReady: (el: HTMLElement) => void;
}) {
  const ref = useDragScroll<HTMLDivElement>();
  return createElement("div", {
    ref: (node: HTMLDivElement | null) => {
      ref.current = node;
      if (!node) return;
      setOverflow(node, overflowing);
      node.dataset.role = "region";
      onReady(node);
    },
  });
}

async function renderProbe(root: Root, overflowing: boolean) {
  let element!: HTMLElement;
  await act(async () => {
    root.render(
      createElement(Probe, {
        overflowing,
        onReady: (el) => {
          element = el;
        },
      }),
    );
  });
  return element;
}

// The hook listens for pointerdown/pointerover on the region itself, and
// pointermove/pointerup on the window (so a drag survives leaving the region).
function fireOn(el: HTMLElement, type: string, init: PointerInit) {
  act(() => {
    el.dispatchEvent(pointer(type, init));
  });
}

function fireWindow(type: string, init: PointerInit) {
  act(() => {
    window.dispatchEvent(pointer(type, init));
  });
}

function clickLink(link: HTMLAnchorElement) {
  act(() => {
    link.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    );
  });
}

// These checks run in order against shared DOM state, as the drag sequence builds
// on itself (e.g. the link is added to the region after the first drags).
describe("drag-to-scroll tables", () => {
  let root: Root;
  let narrowRoot: Root | undefined;
  let region: HTMLElement;

  beforeAll(async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    region = await renderProbe(root, true);
  });

  afterAll(() => {
    act(() => {
      root.unmount();
      narrowRoot?.unmount();
    });
  });

  describe("baseline", () => {
    it("starts with no grab cursor", () => {
      region.scrollLeft = 0;
      expect(region.classList.contains("cursor-grab")).toBe(false);
    });

    it("shows grab cursor when hovering an overflowing region", () => {
      fireOn(region, "pointerover", { clientX: 100 });
      expect(region.classList.contains("cursor-grab")).toBe(true);
    });
  });

  describe("threshold", () => {
    beforeAll(() => {
      fireOn(region, "pointerdown", { clientX: 400 });
      fireWindow("pointermove", { clientX: 397 });
    });

    it("does not scroll below the movement threshold", () => {
      expect(region.scrollLeft).toBe(0);
    });

    it("does not enter grabbing below the threshold", () => {
      expect(region.classList.contains("cursor-grabbing")).toBe(false);
    });
  });

  describe("drag", () => {
    beforeAll(() => {
      fireWindow("pointermove", { clientX: 300 });
    });

    it("scrolls once the threshold is passed", () => {
      expect(region.scrollLeft).toBe(100);
    });

    it("enters grabbing while dragging", () => {
      expect(region.classList.contains("cursor-grabbing")).toBe(true);
    });

    it("disables text selection while dragging", () => {
      expect(region.style.userSelect).toBe("none");
    });

    it("tracks the pointer as the drag continues", () => {
      fireWindow("pointermove", { clientX: 250 });
      expect(region.scrollLeft).toBe(150);
    });

    describe("on release", () => {
      beforeAll(() => {
        fireWindow("pointerup", { clientX: 250 });
      });

      it("leaves grabbing on release", () => {
        expect(region.classList.contains("cursor-grabbing")).toBe(false);
      });

      it("restores text selection on release", () => {
        expect(region.style.userSelect).toBe("");
      });
    });
  });

  describe("links", () => {
    let link: HTMLAnchorElement;
    let navigated = false;

    beforeAll(() => {
      link = document.createElement("a");
      link.href = "/products/test";
      link.textContent = "test";
      region.appendChild(link);
      link.addEventListener("click", (event) => {
        event.preventDefault();
        navigated = true;
      });
    });

    // A completed drag must not fire the link underneath it.
    it("a drag does not trigger a link click", () => {
      fireOn(region, "pointerdown", { clientX: 400 });
      fireWindow("pointermove", { clientX: 300 });
      fireWindow("pointerup", { clientX: 300 });
      clickLink(link);
      expect(navigated).toBe(false);
    });

    // A plain click, below the threshold, must still work.
    it("a plain click still triggers the link", () => {
      navigated = false;
      fireOn(region, "pointerdown", { clientX: 400 });
      fireWindow("pointermove", { clientX: 398 });
      fireWindow("pointerup", { clientX: 398 });
      clickLink(link);
      expect(navigated).toBe(true);
    });
  });

  describe("non-mouse input", () => {
    it("ignores touch so native panning still works", () => {
      region.scrollLeft = 0;
      fireOn(region, "pointerdown", { clientX: 400, pointerType: "touch" });
      fireWindow("pointermove", { clientX: 250, pointerType: "touch" });
      expect(region.scrollLeft).toBe(0);
    });

    it("ignores non-primary mouse buttons", () => {
      region.scrollLeft = 0;
      fireOn(region, "pointerdown", {
        clientX: 400,
        pointerType: "mouse",
        button: 2,
      });
      fireWindow("pointermove", { clientX: 250, pointerType: "mouse" });
      expect(region.scrollLeft).toBe(0);
    });
  });

  describe("non-overflowing region", () => {
    let narrow: HTMLElement;

    // A fresh root: React reuses the DOM node on re-render, which would leave
    // the previous grab cursor in place and test the wrong thing.
    beforeAll(async () => {
      const narrowHost = document.createElement("div");
      document.body.appendChild(narrowHost);
      narrowRoot = createRoot(narrowHost);
      narrow = await renderProbe(narrowRoot, false);
    });

    it("a table that fits does not show the grab cursor", () => {
      narrow.scrollLeft = 0;
      fireOn(narrow, "pointerover", { clientX: 100 });
      expect(narrow.classList.contains("cursor-grab")).toBe(false);
    });

    it("a table that fits does not drag", () => {
      fireOn(narrow, "pointerdown", { clientX: 400 });
      fireWindow("pointermove", { clientX: 250 });
      expect(narrow.scrollLeft).toBe(0);
    });
  });

  describe("cancel", () => {
    let wide: HTMLElement;

    beforeAll(async () => {
      wide = await renderProbe(root, true);
    });

    it("drag engaged before cancel", () => {
      fireOn(wide, "pointerdown", { clientX: 400 });
      fireWindow("pointermove", { clientX: 250 });
      expect(wide.classList.contains("cursor-grabbing")).toBe(true);
    });

    describe("after pointercancel", () => {
      beforeAll(() => {
        fireWindow("pointercancel", { clientX: 250 });
      });

      it("pointercancel leaves the grabbing state", () => {
        expect(wide.classList.contains("cursor-grabbing")).toBe(false);
      });

      it("pointercancel restores text selection", () => {
        expect(wide.style.userSelect).toBe("");
      });
    });

    describe("resize clears a stale grab cursor", () => {
      it("hovering an overflowing region shows the grab cursor", () => {
        fireOn(wide, "pointerover", { clientX: 100 });
        expect(wide.classList.contains("cursor-grab")).toBe(true);
      });

      it("a resize drops the grab cursor so it cannot go stale", () => {
        act(() => {
          window.dispatchEvent(new Event("resize"));
        });
        expect(wide.classList.contains("cursor-grab")).toBe(false);
      });
    });
  });
});
