"use client";

import type {
  Cart,
  CartItem,
  Product,
  ProductVariant,
} from "lib/shopify/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
} from "react";

type UpdateType = "plus" | "minus" | "delete";

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { merchandiseId: string; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: { variant: ProductVariant; product: Product };
    }
  | {
      type: "UPDATE_LINE_VARIANT";
      payload: { lineId: string; newVariant: ProductVariant };
    };

type CartContextType = {
  cart: Cart | undefined;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  addCartItem: (variant: ProductVariant, product: Product) => void;
  updateLineVariant: (lineId: string, newVariant: ProductVariant) => void;
};

const CartContext = createContext<CartContextType>({
  cart: undefined,
  updateCartItem: () => {},
  addCartItem: () => {},
  updateLineVariant: () => {},
});

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function updateCartItem(
  item: CartItem,
  updateType: UpdateType,
): CartItem | null {
  if (updateType === "delete") return null;

  const newQuantity =
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemAmount.toString(),
  );

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product,
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
        vendor: product.vendor,
      },
    },
  };
}

function updateCartTotals(
  lines: CartItem[],
): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0,
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
      totalTaxAmount: { amount: "0", currencyCode: "USD" },
    },
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = currentCart.lines
        .map((item) =>
          item.merchandise.id === merchandiseId
            ? updateCartItem(item, updateType)
            : item,
        )
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0) {
        return {
          ...currentCart,
          lines: [],
          totalQuantity: 0,
          cost: {
            ...currentCart.cost,
            totalAmount: { ...currentCart.cost.totalAmount, amount: "0" },
          },
        };
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case "ADD_ITEM": {
      const { variant, product } = action.payload;
      const existingItem = currentCart.lines.find(
        (item) => item.merchandise.id === variant.id,
      );
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product,
      );

      const updatedLines = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id ? updatedItem : item,
          )
        : [...currentCart.lines, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case "UPDATE_LINE_VARIANT": {
      const { lineId, newVariant } = action.payload;
      const updatedLines = currentCart.lines.map((item) => {
        if (item.id === lineId) {
          return {
            ...item,
            merchandise: {
              ...item.merchandise,
              id: newVariant.id,
              title: newVariant.title,
              selectedOptions: newVariant.selectedOptions,
            },
          };
        }
        return item;
      });

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    default:
      return currentCart;
  }
}
const CART_STORAGE_KEY = "weskateco_cart_v1";

/**
 * Best-effort localStorage mirror of the cart. It paints the cart instantly on
 * refresh and keeps it visible across browser restarts or a failed server
 * fetch — the server cart stays authoritative whenever it resolves.
 */
function readStoredCart(): Cart | undefined {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Cart;
    return Array.isArray(parsed?.lines) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function writeStoredCart(cart: Cart | undefined) {
  try {
    if (!cart || cart.lines.length === 0) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } else {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  } catch {
    // Storage unavailable (private mode / quota) — persistence is best-effort.
  }
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  const [resolvedCart, setResolvedCart] = useState<Cart | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);

  // 1) Restore the local mirror immediately so a refresh or browser restart
  //    never shows an empty cart while the server round-trip is in flight.
  useEffect(() => {
    setResolvedCart(readStoredCart());
    setHydrated(true);
  }, []);

  // 2) The server cart wins whenever it resolves with one. `undefined` (no
  //    cookie / stale fetch) or a failure keeps the local copy instead of
  //    blanking the cart.
  useEffect(() => {
    let active = true;
    Promise.resolve(cartPromise)
      .then((cart) => {
        if (active && cart) setResolvedCart(cart);
      })
      .catch(() => {
        // Keep the local mirror; the server actions still mutate the real cart
        // and revalidate it on the next successful request.
      });
    return () => {
      active = false;
    };
  }, [cartPromise]);

  // 3) Persist every change back to localStorage.
  useEffect(() => {
    if (hydrated) writeStoredCart(resolvedCart);
  }, [resolvedCart, hydrated]);

  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    resolvedCart,
    cartReducer,
  );

  const updateCartItem = (merchandiseId: string, updateType: UpdateType) => {
    updateOptimisticCart({
      type: "UPDATE_ITEM",
      payload: { merchandiseId, updateType },
    });
  };

  const addCartItem = (variant: ProductVariant, product: Product) => {
    updateOptimisticCart({ type: "ADD_ITEM", payload: { variant, product } });
  };

  const updateLineVariant = (lineId: string, newVariant: ProductVariant) => {
    updateOptimisticCart({
      type: "UPDATE_LINE_VARIANT",
      payload: { lineId, newVariant },
    });
  };

  const value = useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
      updateLineVariant,
    }),
    [optimisticCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
