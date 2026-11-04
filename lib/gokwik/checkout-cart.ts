// Shared by the browser (which records the cart it hands to GoKwik) and the
// /cart/checkout route (which reads it), so this file has no "use client"
// imports.

/**
 * The cart most recently handed to GoKwik: the shopper's cart, or the
 * one-item cart Buy Now makes. GoKwik's script sends shoppers to
 * /cart/checkout when it can't run, and that route only sees cookies.
 */
export const CHECKOUT_CART_COOKIE = "checkoutCartId";

/** Records the cart being checked out, in the browser. */
export function rememberCheckoutCart(cartId: string) {
  document.cookie = `${CHECKOUT_CART_COOKIE}=${encodeURIComponent(cartId)}; path=/; max-age=3600; samesite=lax`;
}

/** Shown when checkout can't start at all (no cart, or Shopify unreachable). */
export const CHECKOUT_START_ERROR =
  "We couldn't start checkout. Please try again.";
