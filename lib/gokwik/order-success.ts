import { CHECKOUT_CART_COOKIE } from "./checkout-cart";

// GoKwik creates the order in Shopify itself, so the shopper's Shopify cart is
// never completed and still holds what they just bought. These helpers detect
// a finished GoKwik order so the site can empty its cart. GoKwik doesn't
// document the signal; it comes from its live checkout script, whose checkout
// frame posts { type: "orderSuccess" } to the page while it shows the
// "order placed" screen, before redirecting the shopper to the order page.
//
// GoKwik also stores an orderType marker, but its script writes it from two
// places and the timing of one is unknown. Clearing on it could empty a cart
// mid-payment, so it isn't used until GoKwik documents when it's written.

const SHOPPERS_CART_COOKIE = "cartId";

/** Whether a postMessage came from GoKwik's checkout (e.g. pdp.gokwik.co). */
export function isGoKwikOrigin(origin: string): boolean {
  try {
    const { hostname, protocol } = new URL(origin);
    return (
      protocol === "https:" &&
      (hostname === "gokwik.co" || hostname.endsWith(".gokwik.co"))
    );
  } catch {
    return false;
  }
}

/** Whether a postMessage is GoKwik reporting a placed order. */
export function isGoKwikOrderSuccess(event: {
  origin: string;
  data: unknown;
}): boolean {
  return (
    isGoKwikOrigin(event.origin) &&
    typeof event.data === "object" &&
    event.data !== null &&
    (event.data as { type?: unknown }).type === "orderSuccess"
  );
}

function readCookie(cookieString: string, name: string): string | undefined {
  const match = cookieString.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  if (!match?.[1]) return undefined;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

/**
 * Whether the cart GoKwik just took an order for is the shopper's own cart,
 * rather than a one-item Buy Now cart (which leaves their cart alone).
 */
export function orderedShoppersCart(cookieString: string): boolean {
  const ordered = readCookie(cookieString, CHECKOUT_CART_COOKIE);
  return Boolean(
    ordered && ordered === readCookie(cookieString, SHOPPERS_CART_COOKIE),
  );
}
