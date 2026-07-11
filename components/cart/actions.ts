"use server";

import { TAGS } from "lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "lib/shopify";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  let cartId = (await cookies()).get("cartId")?.value;
  let cart;

  if (cartId) {
    cart = await getCart();
  }

  if (!cartId || !cart) {
    try {
      cart = await createCart();
      cartId = cart.id;
      (await cookies()).set("cartId", cartId!);
    } catch (e) {
      return "Error creating cart";
    }
  }

  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    updateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      updateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    }

    updateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  let cart = await getCart();
  redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}

export async function addConfiguratorBundle(
  prevState: any,
  items: {
    merchandiseId: string;
    quantity: number;
    attributes?: { key: string; value: string }[];
  }[]
) {
  if (!items || items.length === 0) {
    return "No items to add";
  }

  try {
    // Generate a unique bundle ID to group these items in the cart
    const bundleId = `bundle_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    // Add bundle attributes to each item
    const linesWithBundleAttributes = items.map((item) => ({
      ...item,
      attributes: [
        ...(item.attributes || []),
        { key: "_configurator_bundle", value: "true" },
        { key: "_bundle_id", value: bundleId },
      ],
    }));

    await addToCart(linesWithBundleAttributes);
    updateTag(TAGS.cart);
  } catch (e) {
    console.error("Error adding configurator bundle to cart:", e);
    return "Error adding configurator bundle to cart";
  }
}

export async function buyNowAction(selectedVariantId: string | undefined) {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }
  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    updateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }

  const cart = await getCart();
  if (cart?.checkoutUrl) {
    redirect(cart.checkoutUrl);
  }
}
