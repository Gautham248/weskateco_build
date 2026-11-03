import { isGoKwikCountry } from "./country";
import { GOKWIK_LOADED_EVENT } from "./use-gokwik-checkout";

/** How long a checkout click waits for GoKwik's SDK if it's still loading */
export const GOKWIK_WAIT_MS = 5000;

function goKwikLoaded() {
  return typeof window.triggerGokwikCustomCheckout === "function";
}

/**
 * Whether GoKwik can take this checkout: offered in the shopper's country and
 * its SDK loaded. Waits up to `waitMs` for an SDK that is still loading.
 */
export function waitForGoKwik(waitMs = GOKWIK_WAIT_MS): Promise<boolean> {
  if (!isGoKwikCountry(document.cookie)) return Promise.resolve(false);
  if (goKwikLoaded()) return Promise.resolve(true);

  return new Promise((resolve) => {
    const done = () => {
      window.removeEventListener(GOKWIK_LOADED_EVENT, done);
      clearTimeout(timer);
      resolve(goKwikLoaded());
    };
    const timer = setTimeout(done, waitMs);
    window.addEventListener(GOKWIK_LOADED_EVENT, done);
  });
}

/**
 * Opens checkout for a cart made for one purchase (Buy Now, Buy on EMI):
 * GoKwik's popup where it's available, otherwise Shopify's own checkout.
 */
export async function checkoutCart(cart: {
  id: string;
  checkoutUrl: string;
}): Promise<void> {
  if (await waitForGoKwik()) {
    if (window.merchantInfo) {
      window.merchantInfo.cart = { id: cart.id };
    }
    window.triggerGokwikCustomCheckout!();
    return;
  }
  window.location.assign(cart.checkoutUrl);
}
