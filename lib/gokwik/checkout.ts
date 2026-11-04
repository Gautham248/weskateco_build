import { rememberCheckoutCart } from "./checkout-cart";

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
