"use client";

import { useCart } from "components/cart/cart-context";
import { useEffect } from "react";
import { CHECKOUT_CART_COOKIE } from "./checkout-cart";
import { isGoKwikOrderSuccess, orderedShoppersCart } from "./order-success";

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

    const onMessage = (event: MessageEvent) => {
      if (isGoKwikOrderSuccess(event)) finishOrder();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [clearCart]);

  return null;
}
