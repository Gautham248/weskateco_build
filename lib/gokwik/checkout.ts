import { createSingleItemCartAction } from "components/cart/actions";
import { toast } from "sonner";
import { CHECKOUT_START_ERROR, rememberCheckoutCart } from "./checkout-cart";

/**
 * Opens checkout for a cart made for one purchase (Buy Now, Buy on EMI):
 * GoKwik's popup when its SDK is on the page, otherwise Shopify's own
 * checkout, so the shopper always has a way to pay.
 */
export function checkoutCart(cart: { id: string; checkoutUrl: string }) {
  if (
    window.merchantInfo &&
    typeof window.triggerGokwikCustomCheckout === "function"
  ) {
    window.merchantInfo.cart = { id: cart.id };
    rememberCheckoutCart(cart.id);
    try {
      window.triggerGokwikCustomCheckout();
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
  checkoutCart(cart);
}
