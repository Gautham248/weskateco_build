"use client";

import { useCart } from "components/cart/cart-context";
import { useEffect } from "react";
import { CHECKOUT_CART_COOKIE } from "./checkout-cart";
import {
  GOKWIK_ORDER_MARKER,
  hasGoKwikOrderMarker,
  isGoKwikOrderSuccess,
  orderedShoppersCart,
} from "./order-success";

const expireCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};

/**
 * Empties the site's cart once GoKwik has taken an order for it, so shoppers
 * don't come back to the items they just bought. Renders nothing.
 */
export function GoKwikOrderWatcher() {
  const { clearCart } = useCart();

  useEffect(() => {
    const finishOrder = () => {
      if (orderedShoppersCart(document.cookie)) clearCart();
      expireCookie(CHECKOUT_CART_COOKIE);
    };

    // The shopper may have left for the order page before the message below
    // arrived; GoKwik's marker tells us on their next visit
    if (hasGoKwikOrderMarker(document.cookie, window.localStorage)) {
      finishOrder();
      try {
        window.localStorage.removeItem(GOKWIK_ORDER_MARKER);
      } catch {
        // Storage unavailable
      }
      expireCookie(GOKWIK_ORDER_MARKER);
    }

    const onMessage = (event: MessageEvent) => {
      if (isGoKwikOrderSuccess(event)) finishOrder();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [clearCart]);

  return null;
}
