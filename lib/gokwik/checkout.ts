import { createSingleItemCartAction } from "components/cart/actions";
import { toast } from "sonner";
import { CHECKOUT_START_ERROR, rememberCheckoutCart } from "./checkout-cart";
import { waitForGoKwik } from "./sdk";

/**
 * Opens checkout for a cart made for one purchase (Buy Now, Buy on EMI):
 * GoKwik's popup where it's offered and ready, otherwise Shopify's own
 * checkout, so the shopper always has a way to pay. `onOpening` runs just
 * before either opens, after any wait for GoKwik.
 */
export async function checkoutCart(
  cart: { id: string; checkoutUrl: string },
  onOpening?: () => void,
): Promise<void> {
  const useGoKwik = await waitForGoKwik();
  onOpening?.();
  if (useGoKwik) {
    window.merchantInfo!.cart = { id: cart.id };
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
 * `onCheckoutOpening` runs once the cart exists and checkout is about to
 * open (tracking, closing a panel), so a panel stays open while GoKwik loads.
 */
export async function checkoutOneItem(
  variantId: string,
  onCheckoutOpening?: () => void,
): Promise<void> {
  // A network failure rejects; a Shopify failure returns null
  const cart = await createSingleItemCartAction(variantId).catch(() => null);
  if (!cart) {
    toast.error(CHECKOUT_START_ERROR);
    return;
  }
  await checkoutCart(cart, onCheckoutOpening);
}
