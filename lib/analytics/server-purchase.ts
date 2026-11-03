import { createHash } from "node:crypto";
import { baseUrl } from "lib/utils";
import { attributionFromNoteAttributes, type Attribution } from "./attribution";
import { googleItemId } from "./events";

/**
 * Server-side purchase tracking, fed by Shopify's orders/create webhook.
 * Covers every checkout path (GoKwik, Shopify checkout, Buy Now) and isn't
 * affected by ad blockers. Each destination is off until its secret is set.
 *
 * Google Ads: import the GA4 purchase key event into Ads (Ads → Goals →
 * Conversions → Import → GA4) instead of uploading here.
 */

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GA4_API_SECRET = process.env.GA4_API_SECRET;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const META_CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const META_CAPI_TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE;
const META_GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || "v24.0";

const REQUEST_TIMEOUT_MS = 5000;

type Address = {
  first_name?: string | null;
  last_name?: string | null;
  city?: string | null;
  province_code?: string | null;
  zip?: string | null;
  country_code?: string | null;
  phone?: string | null;
};

/** The subset of Shopify's order webhook payload we use. */
export type ShopifyOrderWebhook = {
  id: number;
  name: string;
  created_at: string;
  currency: string;
  current_total_price: string;
  current_total_tax?: string;
  total_shipping_price_set?: { shop_money: { amount: string } };
  discount_codes?: { code: string }[];
  email?: string | null;
  phone?: string | null;
  test?: boolean;
  browser_ip?: string | null;
  client_details?: { user_agent?: string | null } | null;
  order_status_url?: string | null;
  note_attributes?: { name: string; value: string }[];
  customer?: { id: number; phone?: string | null } | null;
  billing_address?: Address | null;
  shipping_address?: Address | null;
  line_items: {
    product_id: number | null;
    variant_id: number | null;
    title: string;
    variant_title?: string | null;
    vendor?: string | null;
    price: string;
    quantity: number;
  }[];
};

export async function trackPurchase(order: ShopifyOrderWebhook) {
  if (order.test) return;

  const attribution = attributionFromNoteAttributes(order.note_attributes);
  const results = await Promise.allSettled([
    sendGa4Purchase(order, attribution),
    sendMetaPurchase(order, attribution),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error(
        `[analytics] purchase tracking failed for order ${order.name}:`,
        result.reason,
      );
    }
  }
}

// https://developers.google.com/analytics/devguides/collection/protocol/ga4
async function sendGa4Purchase(
  order: ShopifyOrderWebhook,
  attribution: Attribution,
) {
  if (!GA_MEASUREMENT_ID || !GA4_API_SECRET) return;

  const body = {
    // Without the browser's client_id GA still records the revenue,
    // just without the visitor's session and traffic source.
    client_id: attribution.gaClientId ?? `${order.id}.server`,
    timestamp_micros: Date.parse(order.created_at) * 1000,
    events: [
      {
        name: "purchase",
        params: {
          transaction_id: String(order.id),
          value: Number(order.current_total_price),
          currency: order.currency,
          tax: Number(order.current_total_tax ?? 0),
          shipping: Number(
            order.total_shipping_price_set?.shop_money.amount ?? 0,
          ),
          coupon:
            order.discount_codes?.map((d) => d.code).join(",") || undefined,
          session_id: attribution.gaSessionId,
          engagement_time_msec: 1,
          items: order.line_items.map((line) => ({
            item_id:
              line.product_id && line.variant_id
                ? googleItemId(line.product_id, line.variant_id)
                : line.title,
            item_name: line.title,
            item_variant: line.variant_title || undefined,
            item_brand: line.vendor || undefined,
            price: Number(line.price),
            quantity: line.quantity,
          })),
        },
      },
    ],
  };

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`GA4 responded ${res.status}`);
}

function sha256(value: string | null | undefined): string[] | undefined {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return undefined;
  return [createHash("sha256").update(normalized).digest("hex")];
}

// https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
function metaUserData(order: ShopifyOrderWebhook, attribution: Attribution) {
  const address = order.billing_address ?? order.shipping_address;
  const phone = (
    order.phone ??
    order.customer?.phone ??
    address?.phone
  )?.replace(/\D/g, "");

  return {
    em: sha256(order.email),
    ph: sha256(phone),
    fn: sha256(address?.first_name),
    ln: sha256(address?.last_name),
    ct: sha256(address?.city?.replace(/\s/g, "")),
    st: sha256(address?.province_code),
    zp: sha256(address?.zip?.replace(/\s/g, "")),
    country: sha256(address?.country_code),
    external_id: sha256(order.customer ? String(order.customer.id) : null),
    client_ip_address: order.browser_ip || undefined,
    client_user_agent: order.client_details?.user_agent || undefined,
    fbp: attribution.fbp,
    fbc: attribution.fbc,
  };
}

// https://developers.facebook.com/docs/marketing-api/conversions-api
async function sendMetaPurchase(
  order: ShopifyOrderWebhook,
  attribution: Attribution,
) {
  if (!META_PIXEL_ID || !META_CAPI_ACCESS_TOKEN) return;

  const lines = order.line_items.filter((line) => line.variant_id);
  const body = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.parse(order.created_at) / 1000),
        // Lets Meta dedupe Shopify webhook retries
        event_id: `purchase_${order.id}`,
        action_source: "website",
        event_source_url: order.order_status_url || baseUrl,
        user_data: metaUserData(order, attribution),
        custom_data: {
          currency: order.currency,
          value: Number(order.current_total_price),
          order_id: String(order.id),
          content_type: "product",
          content_ids: lines.map((line) => String(line.variant_id)),
          contents: lines.map((line) => ({
            id: String(line.variant_id),
            quantity: line.quantity,
            item_price: Number(line.price),
          })),
          num_items: order.line_items.reduce((n, line) => n + line.quantity, 0),
        },
      },
    ],
    test_event_code: META_CAPI_TEST_EVENT_CODE || undefined,
  };

  const url = `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${META_PIXEL_ID}/events?access_token=${META_CAPI_ACCESS_TOKEN}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Meta responded ${res.status}: ${await res.text()}`);
  }
}
