import { createHmac } from "node:crypto";
import { TAGS } from "lib/constants";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

// vi.mock calls are hoisted above the imports.
// The route reads headers through next/headers, which only works inside a
// Next.js request, so serve them from the test request instead
const requestHeaders = vi.hoisted(() => ({ current: new Headers() }));
vi.mock("next/headers", () => ({
  headers: async () => requestHeaders.current,
}));

const revalidateTag = vi.hoisted(() => vi.fn());
vi.mock("next/cache", () => ({ revalidateTag }));

const SECRET = "test-webhook-secret";

function sign(body: string, secret = SECRET) {
  return createHmac("sha256", secret).update(body).digest("base64");
}

async function sendWebhook({
  topic,
  body = JSON.stringify({ id: 1 }),
  hmac = sign(body),
}: {
  topic: string;
  body?: string;
  hmac?: string | null;
}) {
  const headers = new Headers({ "x-shopify-topic": topic });
  if (hmac !== null) headers.set("x-shopify-hmac-sha256", hmac);
  requestHeaders.current = headers;

  const res = await POST(
    new NextRequest("http://localhost/api/webhooks/shopify", {
      method: "POST",
      headers,
      body,
    }),
  );
  return { status: res.status, json: await res.json() };
}

beforeEach(() => {
  vi.stubEnv("SHOPIFY_REVALIDATION_SECRET", SECRET);
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "info").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  revalidateTag.mockReset();
});

describe("POST /api/webhooks/shopify", () => {
  describe("signature verification", () => {
    it("rejects a request signed with the wrong secret", async () => {
      const body = JSON.stringify({ id: 1 });
      const { status } = await sendWebhook({
        topic: "products/update",
        body,
        hmac: sign(body, "someone-elses-secret"),
      });
      expect(status).toBe(401);
      expect(revalidateTag).not.toHaveBeenCalled();
    });

    it("rejects a request with no signature", async () => {
      const { status } = await sendWebhook({
        topic: "products/update",
        hmac: null,
      });
      expect(status).toBe(401);
      expect(revalidateTag).not.toHaveBeenCalled();
    });

    it("rejects a body that was changed after signing", async () => {
      const { status } = await sendWebhook({
        topic: "products/update",
        body: JSON.stringify({ id: 2 }),
        hmac: sign(JSON.stringify({ id: 1 })),
      });
      expect(status).toBe(401);
      expect(revalidateTag).not.toHaveBeenCalled();
    });

    it("returns 500 without revalidating when the secret isn't configured", async () => {
      vi.stubEnv("SHOPIFY_REVALIDATION_SECRET", "");
      const { status } = await sendWebhook({ topic: "products/update" });
      expect(status).toBe(500);
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });

  describe("revalidation by topic", () => {
    it.each(["products/create", "products/update", "products/delete"])(
      "%s refreshes products and collections",
      async (topic) => {
        const { status, json } = await sendWebhook({ topic });
        expect(status).toBe(200);
        expect(json).toMatchObject({ message: "Revalidated", topic });
        expect(revalidateTag.mock.calls.map(([tag]) => tag).sort()).toEqual(
          [TAGS.collections, TAGS.products].sort(),
        );
      },
    );

    it.each(["collections/create", "collections/update", "collections/delete"])(
      "%s refreshes collections only",
      async (topic) => {
        const { status } = await sendWebhook({ topic });
        expect(status).toBe(200);
        expect(revalidateTag.mock.calls.map(([tag]) => tag)).toEqual([
          TAGS.collections,
        ]);
      },
    );

    it("acknowledges an unhandled topic with 200 without revalidating", async () => {
      // Shopify retries webhooks that don't get a 2xx
      const { status, json } = await sendWebhook({ topic: "orders/create" });
      expect(status).toBe(200);
      expect(json).toEqual({ message: "Unhandled topic" });
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });
});
