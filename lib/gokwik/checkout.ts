import { createSingleItemCartAction } from "components/cart/actions";
import { toast } from "sonner";
import { CHECKOUT_START_ERROR, rememberCheckoutCart } from "./checkout-cart";
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
 * GoKwik's popup where it's offered and loaded, otherwise Shopify's own
 * checkout, so the shopper always has a way to pay.
 */
export async function checkoutCart(cart: {
  id: string;
  checkoutUrl: string;
}): Promise<void> {
  if ((await waitForGoKwik()) && window.merchantInfo) {
    window.merchantInfo.cart = { id: cart.id };
    rememberCheckoutCart(cart.id);
    try {
      window.triggerGokwikCustomCheckout!();
      return;
    } catch (error) {
      console.error("[GoKwik] Error triggering checkout:", error);
    }
  }
  // checkoutUrl is on Shopify's primary domain (shop.weskateco.com). If that
  // is ever set back to weskateco.com (this site), this fallback 404s with no
  // code change; see "Domains and checkout" in the README.
  window.location.assign(cart.checkoutUrl);
}

/**
 * Buy Now and Buy on EMI: makes a one-item cart for the variant and opens
 * checkout for it, or tells the shopper when the cart can't be made.
 * `onCartCreated` runs once the cart exists (tracking, closing a panel).
 */
export async function checkoutOneItem(
  variantId: string,
  onCartCreated?: () => void,
): Promise<void> {
  // A network failure rejects; a Shopify failure returns null
  const cart = await createSingleItemCartAction(variantId).catch(() => null);
  if (!cart) {
    toast.error(CHECKOUT_START_ERROR);
    return;
  }
  onCartCreated?.();
  await checkoutCart(cart);
}
