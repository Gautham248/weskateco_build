import { isGoKwikCountry } from "./country";

// Whether GoKwik's checkout can be opened right now, and waiting for it. Kept
// free of React so both the checkout hook and plain helpers can use it.

/** Dispatched on window by GoKwikScript once GoKwik's SDK script has loaded */
export const GOKWIK_LOADED_EVENT = "gokwik:loaded";

/** How long a checkout click waits for GoKwik if it's still loading */
export const GOKWIK_WAIT_MS = 5000;

/** How often to look again while waiting, in case the event came too early */
const POLL_MS = 250;

/**
 * Whether GoKwik's checkout can be opened now. Its SDK defines
 * triggerGokwikCustomCheckout during its own setup, which can finish after
 * the script's load event, so this is the one thing to check.
 */
export function goKwikReady(): boolean {
  return (
    Boolean(window.merchantInfo) &&
    typeof window.triggerGokwikCustomCheckout === "function"
  );
}

/**
 * Resolves true once GoKwik's checkout can be opened, or false after `waitMs`
 * (or when `signal` aborts). Checks on GoKwikScript's loaded event and on a
 * short poll, since the SDK can finish setting up after that event.
 */
export function waitForGoKwikSdk(
  waitMs: number,
  signal?: AbortSignal,
): Promise<boolean> {
  if (goKwikReady()) return Promise.resolve(true);
  if (signal?.aborted) return Promise.resolve(false);

  return new Promise((resolve) => {
    const check = () => {
      if (goKwikReady()) finish(true);
    };
    const finish = (ready: boolean) => {
      window.removeEventListener(GOKWIK_LOADED_EVENT, check);
      signal?.removeEventListener("abort", abort);
      clearInterval(poll);
      clearTimeout(timer);
      resolve(ready);
    };
    const abort = () => finish(false);
    const poll = setInterval(check, POLL_MS);
    const timer = setTimeout(() => finish(goKwikReady()), waitMs);
    window.addEventListener(GOKWIK_LOADED_EVENT, check);
    signal?.addEventListener("abort", abort);
  });
}

/**
 * Whether GoKwik can take this checkout: offered in the shopper's country and
 * ready, waiting up to `waitMs` for an SDK that is still loading.
 */
export function waitForGoKwik(waitMs = GOKWIK_WAIT_MS): Promise<boolean> {
  if (!isGoKwikCountry(document.cookie)) return Promise.resolve(false);
  return waitForGoKwikSdk(waitMs);
}
