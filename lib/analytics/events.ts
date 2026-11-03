import type { ConfiguratorItem } from "lib/configurator/types";
import type {
  Cart,
  CartItem,
  Product,
  ProductVariant,
} from "lib/shopify/types";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
/** Google tag (GT-…) that routes to the store's Merchant Center accounts. */
export const GOOGLE_TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Google Ads conversion labels carried over from the old Shopify store's
 * Google & YouTube app (AW-17352598190). They only work with that Ads account.
 * add_payment_info and purchase happen inside GoKwik / Shopify checkout, not here.
 */
const GOOGLE_ADS_CONVERSION_LABELS: Record<string, string> = {
  page_view: "n9uwCKyK5_gaEK7FrtJA",
  view_item: "IsTfCK-K5_gaEK7FrtJA",
  add_to_cart: "Jdf_CKmK5_gaEK7FrtJA",
  begin_checkout: "FahRCKaK5_gaEK7FrtJA",
  search: "xV-uCLKK5_gaEK7FrtJA",
};

/** GA4 ecommerce item — https://developers.google.com/analytics/devguides/collection/ga4/reference/events */
type GaItem = {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
  google_business_vertical: "retail";
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function sendGtag(
  name: string,
  params: Record<string, unknown>,
  { ga = true }: { ga?: boolean } = {},
) {
  if (typeof window === "undefined" || !window.gtag) return;
  const label = GOOGLE_ADS_CONVERSION_LABELS[name];
  const sendTo = [
    ga ? GA_MEASUREMENT_ID : undefined,
    ga ? GOOGLE_TAG_ID : undefined,
    GOOGLE_ADS_ID && label ? `${GOOGLE_ADS_ID}/${label}` : undefined,
  ].filter(Boolean);
  if (sendTo.length === 0) return;
  window.gtag("event", name, { ...params, send_to: sendTo });
}

function sendFbq(name: string, params: Record<string, unknown>) {
  if (!META_PIXEL_ID || typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", name, params);
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  sendGtag(name, params);
}

// "gid://shopify/ProductVariant/123" -> "123"
function shopifyId(gid: string): string {
  return gid.split("/").pop() || gid;
}

// Same item ID format the Shopify Google channel used (target country "ZZ"),
// so Merchant Center / dynamic remarketing keep matching products.
function googleItemId(productGid: string, variantGid: string): string {
  return `shopify_ZZ_${shopifyId(productGid)}_${shopifyId(variantGid)}`;
}

function itemFromVariant(
  product: Pick<Product, "id" | "title" | "vendor">,
  variant: ProductVariant,
  quantity = 1,
): GaItem {
  return {
    item_id: googleItemId(product.id, variant.id),
    item_name: product.title,
    item_brand: product.vendor,
    item_variant: variant.title,
    price: Number(variant.price.amount),
    quantity,
    google_business_vertical: "retail",
  };
}

function itemFromCartLine(line: CartItem): GaItem {
  return {
    item_id: googleItemId(line.merchandise.product.id, line.merchandise.id),
    item_name: line.merchandise.product.title,
    item_brand: line.merchandise.product.vendor,
    item_variant: line.merchandise.title,
    price: Number(line.cost.totalAmount.amount) / line.quantity,
    quantity: line.quantity,
    google_business_vertical: "retail",
  };
}

/**
 * GA4 page views come from Enhanced Measurement (history changes), so this
 * only reports the Google Ads "page view" conversion. Meta's pixel tracks
 * history changes on its own.
 */
export function trackPageView() {
  sendGtag("page_view", {}, { ga: false });
}

export function trackViewItem(
  product: Product,
  variant: ProductVariant | undefined = product.variants[0],
) {
  if (!variant) return;
  const value = Number(variant.price.amount);
  const currency = variant.price.currencyCode;
  sendGtag("view_item", {
    currency,
    value,
    items: [itemFromVariant(product, variant)],
  });
  sendFbq("ViewContent", {
    content_ids: [shopifyId(variant.id)],
    content_type: "product",
    content_name: product.title,
    currency,
    value,
  });
}

export function trackAddToCart(product: Product, variant: ProductVariant) {
  const value = Number(variant.price.amount);
  const currency = variant.price.currencyCode;
  sendGtag("add_to_cart", {
    currency,
    value,
    items: [itemFromVariant(product, variant)],
  });
  sendFbq("AddToCart", {
    content_ids: [shopifyId(variant.id)],
    content_type: "product",
    content_name: product.title,
    currency,
    value,
  });
}

export function trackRemoveFromCart(line: CartItem, quantity: number) {
  const item = { ...itemFromCartLine(line), quantity };
  sendGtag("remove_from_cart", {
    currency: line.cost.totalAmount.currencyCode,
    value: (item.price ?? 0) * quantity,
    items: [item],
  });
}

/** The configurator adds a whole build in one server action, outside useCart. */
export function trackConfiguratorAddToCart(items: ConfiguratorItem[]) {
  if (items.length === 0) return;
  const currency = items[0]!.price.currencyCode;
  const value = items.reduce((sum, item) => sum + Number(item.price.amount), 0);
  sendGtag("add_to_cart", {
    currency,
    value,
    items: items.map((item) => ({
      item_id: googleItemId(item.productId, item.variantId),
      item_name: item.productTitle,
      item_brand: item.brand,
      item_variant: item.variantTitle,
      price: Number(item.price.amount),
      quantity: 1,
      google_business_vertical: "retail",
    })),
  });
  sendFbq("AddToCart", {
    content_ids: items.map((item) => shopifyId(item.variantId)),
    content_type: "product",
    currency,
    value,
  });
}

export function trackViewCart(cart: Cart | undefined) {
  if (!cart || cart.lines.length === 0) return;
  sendGtag("view_cart", {
    currency: cart.cost.totalAmount.currencyCode,
    value: Number(cart.cost.totalAmount.amount),
    items: cart.lines.map(itemFromCartLine),
  });
}

export function trackBeginCheckout(cart: Cart | undefined) {
  if (!cart || cart.lines.length === 0) return;
  const value = Number(cart.cost.totalAmount.amount);
  const currency = cart.cost.totalAmount.currencyCode;
  sendGtag("begin_checkout", {
    currency,
    value,
    items: cart.lines.map(itemFromCartLine),
  });
  sendFbq("InitiateCheckout", {
    content_ids: cart.lines.map((line) => shopifyId(line.merchandise.id)),
    content_type: "product",
    num_items: cart.totalQuantity,
    currency,
    value,
  });
}

/** Buy Now skips the cart, so report the single item being bought. */
export function trackBuyNow(product: Product, variant: ProductVariant) {
  const value = Number(variant.price.amount);
  const currency = variant.price.currencyCode;
  sendGtag("begin_checkout", {
    currency,
    value,
    items: [itemFromVariant(product, variant)],
  });
  sendFbq("InitiateCheckout", {
    content_ids: [shopifyId(variant.id)],
    content_type: "product",
    num_items: 1,
    currency,
    value,
  });
}

export function trackSearch(searchTerm: string) {
  if (!searchTerm.trim()) return;
  sendGtag("search", { search_term: searchTerm });
  sendFbq("Search", { search_string: searchTerm });
}
