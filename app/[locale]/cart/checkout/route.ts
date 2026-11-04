import { getLocalizedPath } from "lib/i18n";
import { CHECKOUT_CART_COOKIE } from "lib/gokwik/checkout-cart";
import { getCart } from "lib/shopify";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// /cart/checkout is Shopify's theme URL for "go to checkout". GoKwik's script
// sends shoppers here when it decides it can't run, expecting a Shopify theme
// to answer. Send them to the Shopify checkout of the cart they were paying
// for, or back to the cart page when there isn't one.
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ locale: string }> },
) {
  const { locale } = await props.params;
  const jar = await cookies();
  const cartId =
    jar.get(CHECKOUT_CART_COOKIE)?.value || jar.get("cartId")?.value;

  try {
    const cart = cartId ? await getCart(cartId) : undefined;
    if (cart?.checkoutUrl && cart.totalQuantity > 0) {
      return NextResponse.redirect(cart.checkoutUrl, 303);
    }
  } catch (error) {
    console.error(
      "[checkout] Couldn't load the cart for /cart/checkout",
      error,
    );
  }

  return NextResponse.redirect(
    new URL(getLocalizedPath("/cart", locale), request.url),
    303,
  );
}
