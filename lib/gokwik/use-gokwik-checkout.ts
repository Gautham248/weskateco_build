"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { CHECKOUT_START_ERROR, rememberCheckoutCart } from "./checkout-cart";
import { isGoKwikCountry } from "./country";

/** Dispatched on window by GoKwikScript once GoKwik's SDK script has loaded */
export const GOKWIK_LOADED_EVENT = "gokwik:loaded";

interface UseGoKwikCheckoutOptions {
  /** Cart ID from Shopify in format gid://shopify/Cart/<ID> */
  cartId: string | undefined;
  /** The cart's Shopify checkout, used when GoKwik can't take the checkout */
  checkoutUrl?: string;
  /** Timeout in ms before marking SDK as failed. Default: 15000 */
  timeout?: number;
}

interface UseGoKwikCheckoutReturn {
  /** Whether the GoKwik SDK is loaded and ready */
  isReady: boolean;
  /** Whether GoKwik can't be used: its SDK failed to load, or it isn't offered in the shopper's country */
  isError: boolean;
  /** Whether checkout is currently in progress */
  isCheckingOut: boolean;
  /** Trigger the GoKwik checkout popup */
  triggerCheckout: () => void;
  /** Fallback: get the Shopify native checkout URL */
  useFallback: boolean;
}

export function useGoKwikCheckout({
  cartId,
  checkoutUrl,
  timeout = 15000,
}: UseGoKwikCheckoutOptions): UseGoKwikCheckoutReturn {
  const [isReady, setIsReady] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  useEffect(() => {
    // Outside India GoKwik isn't offered and its SDK isn't loaded: go straight
    // to the fallback (Shopify's checkout) instead of waiting for it
    if (!isGoKwikCountry(document.cookie)) {
      setIsError(true);
      return;
    }

    let settled = false;

    // Marks checkout ready as soon as the SDK is on window. Runs on mount, when
    // GoKwikScript reports the script loaded, and on a poll as a backup.
    const checkReady = () => {
      if (settled || !window.gokwikSdk) return;
      settled = true;
      stopWaiting();
      setIsReady(true);

      // Listen for GoKwik popup close to reset checkout state
      if (typeof window.gokwikSdk.on === "function") {
        window.gokwikSdk.on("modal_closed", () => {
          setIsCheckingOut(false);
          console.log("[GoKwik] Checkout modal closed");
        });
      }
    };

    window.addEventListener(GOKWIK_LOADED_EVENT, checkReady);
    const pollInterval = setInterval(checkReady, 500);

    // Timeout — mark as error if SDK doesn't load
    const timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      stopWaiting();
      setIsError(true);
      console.warn(
        "[GoKwik] SDK did not load within timeout. Fallback available.",
      );
    }, timeout);

    function stopWaiting() {
      window.removeEventListener(GOKWIK_LOADED_EVENT, checkReady);
      clearInterval(pollInterval);
      clearTimeout(timeoutId);
    }

    checkReady();
    return stopWaiting;
  }, [timeout]);

  const triggerCheckout = useCallback(() => {
    // Whatever stops GoKwik here, the shopper still gets a way to pay:
    // Shopify's checkout when we have it, otherwise a message to try again
    const fallBack = (reason: string, error?: unknown) => {
      console.error(`[GoKwik] ${reason}`, error ?? "");
      setIsCheckingOut(false);
      if (checkoutUrl) {
        // On Shopify's primary domain: see the note in ./checkout.ts
        window.location.assign(checkoutUrl);
      } else {
        toast.error(CHECKOUT_START_ERROR);
      }
    };

    if (!cartId) {
      return fallBack("No cart ID available");
    }

    if (!window.merchantInfo) {
      return fallBack("merchantInfo not configured");
    }

    if (typeof window.triggerGokwikCustomCheckout !== "function") {
      return fallBack("triggerGokwikCustomCheckout not available");
    }

    // Set the cart ID on merchantInfo
    window.merchantInfo.cart = { id: cartId };
    rememberCheckoutCart(cartId);

    console.log("[GoKwik] Triggering checkout with cart:", cartId);
    setIsCheckingOut(true);

    try {
      window.triggerGokwikCustomCheckout();
    } catch (error) {
      fallBack("Error triggering checkout:", error);
    }
  }, [cartId, checkoutUrl]);

  return {
    isReady,
    isError,
    isCheckingOut,
    triggerCheckout,
    useFallback: isError,
  };
}
