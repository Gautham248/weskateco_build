"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { CHECKOUT_START_ERROR, rememberCheckoutCart } from "./checkout-cart";

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
  /** Whether the SDK failed to load */
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
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if SDK is already loaded
    if (typeof window !== "undefined" && window.gokwikSdk) {
      setIsReady(true);

      // Listen for GoKwik popup close to reset checkout state
      if (typeof window.gokwikSdk.on === "function") {
        window.gokwikSdk.on("modal_closed", () => {
          setIsCheckingOut(false);
          console.log("[GoKwik] Checkout modal closed");
        });
      }

      return;
    }

    // Poll for SDK readiness
    checkIntervalRef.current = setInterval(() => {
      if (typeof window !== "undefined" && window.gokwikSdk) {
        setIsReady(true);

        // Listen for GoKwik popup close to reset checkout state
        if (typeof window.gokwikSdk.on === "function") {
          window.gokwikSdk.on("modal_closed", () => {
            setIsCheckingOut(false);
            console.log("[GoKwik] Checkout modal closed");
          });
        }

        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
    }, 500);

    // Timeout — mark as error if SDK doesn't load
    timeoutRef.current = setTimeout(() => {
      if (!isReady) {
        setIsError(true);
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
        console.warn(
          "[GoKwik] SDK did not load within timeout. Fallback available.",
        );
      }
    }, timeout);

    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [timeout, isReady]);

  const triggerCheckout = useCallback(() => {
    // Whatever stops GoKwik here, the shopper still gets a way to pay:
    // Shopify's checkout when we have it, otherwise a message to try again
    const fallBack = (reason: string, error?: unknown) => {
      console.error(`[GoKwik] ${reason}`, error ?? "");
      setIsCheckingOut(false);
      if (checkoutUrl) {
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
