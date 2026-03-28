import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { TAGS } from "lib/constants";

// Shopify sends webhooks as POST requests with an HMAC signature
export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const topic = headersList.get("x-shopify-topic") || "";
  const hmac = headersList.get("x-shopify-hmac-sha256") || "";

  // Verify the webhook signature
  const secret = process.env.SHOPIFY_REVALIDATION_SECRET;

  if (!secret) {
    console.error("SHOPIFY_REVALIDATION_SECRET is not set");
    return NextResponse.json({ message: "Not configured" }, { status: 500 });
  }

  // HMAC verification using Web Crypto API (Edge-compatible)
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const computedHmac = Buffer.from(signature).toString("base64");

  if (computedHmac !== hmac) {
    console.error("Invalid webhook signature");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Revalidate based on the webhook topic
  switch (topic) {
    case "products/create":
    case "products/update":
    case "products/delete":
      revalidateTag(TAGS.products, "seconds");
      revalidateTag(TAGS.collections, "seconds"); // Product changes can affect collections
      break;
    case "collections/create":
    case "collections/update":
    case "collections/delete":
      revalidateTag(TAGS.collections, "seconds");
      break;
    default:
      console.log(`Unhandled webhook topic: ${topic}`);
      return NextResponse.json({ message: "Unhandled topic" }, { status: 200 });
  }

  return NextResponse.json({
    message: "Revalidated",
    topic,
    now: Date.now(),
  });
}
