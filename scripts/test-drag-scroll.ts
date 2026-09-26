// Requires React's development build: `act` throws "act(...) is not supported in
// production builds of React", and React picks its build from NODE_ENV at require
// time. The `test:drag-scroll` script pins NODE_ENV=development so this passes
// regardless of the ambient environment.
import { JSDOM } from "jsdom";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";

let passed = 0;
const failures: string[] = [];

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    passed += 1;
    console.log(`  ok  ${name}`);
    return;
  }

  failures.push(detail ? `${name} — ${detail}` : name);
  console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

function installDom() {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    pretendToBeVisual: true,
  });

  function define(name: string, value: unknown) {
    Object.defineProperty(globalThis, name, {
      value,
      configurable: true,
      writable: true,
    });
  }

  define("window", dom.window);
  define("document", dom.window.document);
  define("navigator", dom.window.navigator);
  define("Element", dom.window.Element);
  define("HTMLElement", dom.window.HTMLElement);
  define("Node", dom.window.Node);
  define("Event", dom.window.Event);
  define("MouseEvent", dom.window.MouseEvent);
  define("getComputedStyle", dom.window.getComputedStyle);
  define(
    "requestAnimationFrame",
    dom.window.requestAnimationFrame.bind(dom.window),
  );
  define(
    "cancelAnimationFrame",
    dom.window.cancelAnimationFrame.bind(dom.window),
  );
  // React 19 reads this to decide whether to use createRoot.
  define("IS_REACT_ACT_ENVIRONMENT", true);

  return dom;
}

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
function pointer(
  type: string,
  init: { clientX: number; pointerType?: string; button?: number },
) {
  const MouseEventCtor = (
    globalThis as unknown as { MouseEvent: typeof MouseEvent }
  ).MouseEvent;

  const event = new MouseEventCtor(type, {
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

async function run() {
  console.log("\ndrag-to-scroll tables");

  const dom = installDom();
  const { useDragScroll } = await import("lib/hooks/use-drag-scroll");

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

  const container = dom.window.document.createElement("div");
  dom.window.document.body.appendChild(container);
  const root = createRoot(container);

  let region!: HTMLElement;
  await act(async () => {
    root.render(
      createElement(Probe, {
        overflowing: true,
        onReady: (el) => {
          region = el;
        },
      }),
    );
  });

  // The hook listens for pointerdown/pointerover on the region itself, and
  // pointermove/pointerup on the window (so a drag survives leaving the region).
  const fireOn = (
    el: HTMLElement,
    type: string,
    init: { clientX: number; pointerType?: string; button?: number },
  ) => {
    act(() => {
      el.dispatchEvent(pointer(type, init));
    });
  };

  const fire = (
    type: string,
    init: { clientX: number; pointerType?: string; button?: number },
  ) => {
    fireOn(region, type, init);
  };

  const fireWindow = (
    type: string,
    init: { clientX: number; pointerType?: string; button?: number },
  ) => {
    act(() => {
      window.dispatchEvent(pointer(type, init));
    });
  };

  // --- baseline ---------------------------------------------------------
  region.scrollLeft = 0;
  check(
    "starts with no grab cursor",
    !region.classList.contains("cursor-grab"),
  );

  act(() => {
    region.dispatchEvent(pointer("pointerover", { clientX: 100 }));
  });
  check(
    "shows grab cursor when hovering an overflowing region",
    region.classList.contains("cursor-grab"),
  );

  // --- threshold --------------------------------------------------------
  fireOn(region, "pointerdown", { clientX: 400 });
  fireWindow("pointermove", { clientX: 397 });
  check(
    "does not scroll below the movement threshold",
    region.scrollLeft === 0,
    `scrollLeft=${region.scrollLeft}`,
  );
  check(
    "does not enter grabbing below the threshold",
    !region.classList.contains("cursor-grabbing"),
  );

  // --- drag -------------------------------------------------------------
  fireWindow("pointermove", { clientX: 300 });
  check(
    "scrolls once the threshold is passed",
    region.scrollLeft === 100,
    `expected 100, got ${region.scrollLeft}`,
  );
  check(
    "enters grabbing while dragging",
    region.classList.contains("cursor-grabbing"),
  );
  check(
    "disables text selection while dragging",
    region.style.userSelect === "none",
    `userSelect=${region.style.userSelect}`,
  );

  fireWindow("pointermove", { clientX: 250 });
  check(
    "tracks the pointer as the drag continues",
    region.scrollLeft === 150,
    `expected 150, got ${region.scrollLeft}`,
  );

  fireWindow("pointerup", { clientX: 250 });
  check(
    "leaves grabbing on release",
    !region.classList.contains("cursor-grabbing"),
  );
  check(
    "restores text selection on release",
    region.style.userSelect === "",
    `userSelect=${region.style.userSelect}`,
  );

  // --- links ------------------------------------------------------------
  const link = dom.window.document.createElement("a");
  link.href = "/products/test";
  link.textContent = "test";
  region.appendChild(link);
  let navigated = false;
  link.addEventListener("click", (event) => {
    event.preventDefault();
    navigated = true;
  });

  // A completed drag must not fire the link underneath it.
  fireOn(region, "pointerdown", { clientX: 400 });
  fireWindow("pointermove", { clientX: 300 });
  fireWindow("pointerup", { clientX: 300 });
  act(() => {
    link.dispatchEvent(
      new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }),
    );
  });
  check("a drag does not trigger a link click", !navigated);

  // A plain click, below the threshold, must still work.
  navigated = false;
  fireOn(region, "pointerdown", { clientX: 400 });
  fireWindow("pointermove", { clientX: 398 });
  fireWindow("pointerup", { clientX: 398 });
  act(() => {
    link.dispatchEvent(
      new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }),
    );
  });
  check("a plain click still triggers the link", navigated);

  // --- non-mouse input --------------------------------------------------
  region.scrollLeft = 0;
  fireOn(region, "pointerdown", { clientX: 400, pointerType: "touch" });
  fireWindow("pointermove", { clientX: 250, pointerType: "touch" });
  check(
    "ignores touch so native panning still works",
    region.scrollLeft === 0,
    `scrollLeft=${region.scrollLeft}`,
  );

  region.scrollLeft = 0;
  fireOn(region, "pointerdown", {
    clientX: 400,
    pointerType: "mouse",
    button: 2,
  });
  fireWindow("pointermove", { clientX: 250, pointerType: "mouse" });
  check(
    "ignores non-primary mouse buttons",
    region.scrollLeft === 0,
    `scrollLeft=${region.scrollLeft}`,
  );

  // --- non-overflowing region -------------------------------------------
  // A fresh root: React reuses the DOM node on re-render, which would leave
  // the previous grab cursor in place and test the wrong thing.
  const narrowHost = dom.window.document.createElement("div");
  dom.window.document.body.appendChild(narrowHost);
  const narrowRoot = createRoot(narrowHost);

  let narrow!: HTMLElement;
  await act(async () => {
    narrowRoot.render(
      createElement(Probe, {
        overflowing: false,
        onReady: (el) => {
          narrow = el;
        },
      }),
    );
  });

  narrow.scrollLeft = 0;
  act(() => {
    narrow.dispatchEvent(pointer("pointerover", { clientX: 100 }));
  });
  check(
    "a table that fits does not show the grab cursor",
    !narrow.classList.contains("cursor-grab"),
  );

  act(() => {
    narrow.dispatchEvent(pointer("pointerdown", { clientX: 400 }));
  });
  act(() => {
    window.dispatchEvent(pointer("pointermove", { clientX: 250 }));
  });
  check(
    "a table that fits does not drag",
    narrow.scrollLeft === 0,
    `scrollLeft=${narrow.scrollLeft}`,
  );

  // --- cancel -----------------------------------------------------------
  let wide!: HTMLElement;
  await act(async () => {
    root.render(
      createElement(Probe, {
        overflowing: true,
        onReady: (el) => {
          wide = el;
        },
      }),
    );
  });

  fireOn(wide, "pointerdown", { clientX: 400 });
  fireWindow("pointermove", { clientX: 250 });
  check(
    "drag engaged before cancel",
    wide.classList.contains("cursor-grabbing"),
  );

  fireWindow("pointercancel", { clientX: 250 });
  check(
    "pointercancel leaves the grabbing state",
    !wide.classList.contains("cursor-grabbing"),
  );
  check("pointercancel restores text selection", wide.style.userSelect === "");

  // --- resize clears a stale grab cursor --------------------------------
  act(() => {
    wide.dispatchEvent(pointer("pointerover", { clientX: 100 }));
  });
  check(
    "hovering an overflowing region shows the grab cursor",
    wide.classList.contains("cursor-grab"),
  );

  act(() => {
    window.dispatchEvent(new dom.window.Event("resize"));
  });
  check(
    "a resize drops the grab cursor so it cannot go stale",
    !wide.classList.contains("cursor-grab"),
  );

  act(() => {
    root.unmount();
    narrowRoot.unmount();
  });

  console.log(
    failures.length === 0
      ? `\n${passed} passing\n`
      : `\n${passed} passing, ${failures.length} failing\n`,
  );

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

void run();
