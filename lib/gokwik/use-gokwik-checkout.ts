"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { CHECKOUT_START_ERROR, rememberCheckoutCart } from "./checkout-cart";
import { isGoKwikCountry } from "./country";
import { goKwikReady, GOKWIK_WAIT_MS, waitForGoKwikSdk } from "./sdk";

interface UseGoKwikCheckoutOptions {
  /** Cart ID from Shopify in format gid://shopify/Cart/<ID> */
  cartId: string | undefined;
  /** The cart's Shopify checkout, used when GoKwik can't take the checkout */
  checkoutUrl?: string;
  /** Timeout in ms before marking SDK as failed. Default: 15000 */
  timeout?: number;
}

interface UseGoKwikCheckoutReturn {
  /** Whether GoKwik's checkout can be opened now */
  isReady: boolean;
  /** Whether GoKwik can't be used: its SDK failed to load, or it isn't offered in the shopper's country */
  isError: boolean;
  /** Whether a checkout click is waiting (up to 5s) for GoKwik to load */
  isWaiting: boolean;
  /** Whether checkout is currently in progress */
  isCheckingOut: boolean;
  /**
   * Opens GoKwik's checkout popup. If GoKwik is still loading, waits for it
   * (up to 5s, like Buy Now); otherwise uses Shopify's checkout.
   */
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
  const [isWaiting, setIsWaiting] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  // Ignores further clicks while one is waiting for GoKwik
  const waitingRef = useRef(false);

  useEffect(() => {
    // Outside India GoKwik isn't offered and its SDK isn't loaded: go straight
    // to the fallback (Shopify's checkout) instead of waiting for it
    if (!isGoKwikCountry(document.cookie)) {
      setIsError(true);
      return;
    }

    const loading = new AbortController();
    waitForGoKwikSdk(timeout, loading.signal).then((ready) => {
      if (loading.signal.aborted) return;
      if (!ready) {
        setIsError(true);
        console.warn(
          "[GoKwik] SDK did not load within timeout. Fallback available.",
        );
        return;
      }
      setIsReady(true);

      // Listen for GoKwik popup close to reset checkout state
      if (typeof window.gokwikSdk?.on === "function") {
        window.gokwikSdk.on("modal_closed", () => {
          setIsCheckingOut(false);
          console.log("[GoKwik] Checkout modal closed");
        });
      }
    });
    return () => loading.abort();
  }, [timeout]);

  const triggerCheckout = useCallback(async () => {
    if (waitingRef.current) return;

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

    if (!goKwikReady()) {
      if (isError || !isGoKwikCountry(document.cookie)) {
        return fallBack("GoKwik isn't available");
      }
      // Still loading: wait for it as Buy Now does, rather than skipping
      // straight to Shopify's checkout
      waitingRef.current = true;
      setIsWaiting(true);
      const ready = await waitForGoKwikSdk(GOKWIK_WAIT_MS);
      waitingRef.current = false;
      setIsWaiting(false);
      if (!ready) return fallBack("GoKwik didn't load in time");
    }

    // Set the cart ID on merchantInfo
    window.merchantInfo!.cart = { id: cartId };
    rememberCheckoutCart(cartId);

    console.log("[GoKwik] Triggering checkout with cart:", cartId);
    setIsCheckingOut(true);

    try {
      window.triggerGokwikCustomCheckout!();
    } catch (error) {
      fallBack("Error triggering checkout:", error);
    }
  }, [cartId, checkoutUrl, isError]);

  return {
    isReady,
    isError,
    isWaiting,
    isCheckingOut,
    triggerCheckout,
    useFallback: isError,
  };
}
