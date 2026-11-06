import { afterEach, describe, expect, it, vi } from "vitest";

// lib/shopify reads its store settings when it loads, so import it fresh
// after setting them
async function loadShopify() {
  vi.resetModules();
  vi.stubEnv("SHOPIFY_STORE_DOMAIN", "https://weskate-test.myshopify.com");
  vi.stubEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN", "token");
  return import("lib/shopify");
}

/** What fetch throws when the connection fails: a TypeError with the socket error as its cause. */
function fetchFailed(code: string) {
  return new TypeError("fetch failed", {
    cause: Object.assign(new Error(code), { code }),
  });
}

const answer = () =>
  new Response(JSON.stringify({ data: { ok: true } }), {
    headers: { "Content-Type": "application/json" },
  });

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("isTransientConnectError", () => {
  it.each([
    "ECONNREFUSED",
    "ENOTFOUND",
    // Node's codes for a TLS alert 40 under OpenSSL 3.0 and later 3.x
    "ERR_SSL_SSLV3_ALERT_HANDSHAKE_FAILURE",
    "ERR_SSL_SSL/TLS_ALERT_HANDSHAKE_FAILURE",
  ])("retries %s, which never reached Shopify", async (code) => {
    const { isTransientConnectError } = await loadShopify();
    expect(isTransientConnectError(fetchFailed(code))).toBe(true);
  });

  it.each(["ECONNRESET", "UND_ERR_SOCKET", "ERR_SSL_DECRYPTION_FAILED"])(
    "doesn't retry %s, where the request may have been sent",
    async (code) => {
      const { isTransientConnectError } = await loadShopify();
      expect(isTransientConnectError(fetchFailed(code))).toBe(false);
    },
  );
});

describe("shopifyFetch", () => {
  it("retries a failed TLS handshake and returns the answer", async () => {
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(
        fetchFailed("ERR_SSL_SSL/TLS_ALERT_HANDSHAKE_FAILURE"),
      )
      .mockResolvedValueOnce(answer());
    vi.stubGlobal("fetch", fetch);
    const { shopifyFetch } = await loadShopify();

    const res = await shopifyFetch<{ data: { ok: boolean } }>({
      query: "query { ok }",
    });

    expect(res.body.data.ok).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
