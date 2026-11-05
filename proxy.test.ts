import { ADMIN_SESSION_COOKIE } from "lib/constants";
import { COUNTRY_COOKIE } from "lib/gokwik/country";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

// proxy.ts reads SHOPIFY_STORE_DOMAIN when it loads, so each test imports a
// fresh copy after setting the environment it needs
async function loadProxy(storeDomain = "") {
  vi.resetModules();
  vi.stubEnv("SHOPIFY_STORE_DOMAIN", storeDomain);
  return (await import("./proxy")).proxy;
}

function request(
  path: string,
  { cookie, country }: { cookie?: string; country?: string } = {},
) {
  const headers = new Headers();
  if (cookie) headers.set("cookie", cookie);
  if (country) headers.set("x-vercel-ip-country", country);
  return new NextRequest(new URL(path, "https://weskate.co"), { headers });
}

const rewriteOf = (res: Response) => res.headers.get("x-middleware-rewrite");

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("locale routing", () => {
  it("rewrites unprefixed paths to the default locale", async () => {
    const proxy = await loadProxy();
    const res = proxy(request("/store/skateboards?sort=price-asc"));
    expect(rewriteOf(res)).toBe(
      "https://weskate.co/en/store/skateboards?sort=price-asc",
    );
    expect(res.headers.get("x-locale")).toBe("en");
  });

  it("serves Hindi paths as they are", async () => {
    const proxy = await loadProxy();
    const res = proxy(request("/hi/about-us"));
    expect(rewriteOf(res)).toBeNull();
    expect(res.status).toBe(200);
    expect(res.headers.get("x-locale")).toBe("hi");
  });

  it.each([
    ["/en", "https://weskate.co/"],
    ["/en/about-us", "https://weskate.co/about-us"],
    ["/en/store?sort=price-asc", "https://weskate.co/store?sort=price-asc"],
  ])("permanently redirects %s to the clean URL", async (path, location) => {
    const proxy = await loadProxy();
    const res = proxy(request(path));
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe(location);
  });

  it.each([
    "/en/opengraph-image",
    "/en/store/skateboards/opengraph-image",
    "/en/twitter-image",
    "/en/opengraph-image-1a2b",
  ])(
    "serves the social image %s without redirecting (Next.js links it there)",
    async (path) => {
      const proxy = await loadProxy();
      const res = proxy(request(path));
      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    },
  );

  it("still redirects pages whose names merely contain opengraph-image", async () => {
    const proxy = await loadProxy();
    const res = proxy(request("/en/opengraph-image/extra"));
    expect(res.status).toBe(308);
  });

  it.each(["/api/contact/submit", "/studio", "/robots.txt", "/sitemap.xml"])(
    "passes %s through untouched",
    async (path) => {
      const proxy = await loadProxy();
      const res = proxy(request(path));
      expect(rewriteOf(res)).toBeNull();
      expect(res.headers.get("location")).toBeNull();
    },
  );

  it.each([
    "/icons/logo.png",
    "/hero/banner.jpg",
    "/fonts/x.woff2",
    "/a/b.pdf",
  ])("never locale-rewrites the static file %s", async (path) => {
    const proxy = await loadProxy();
    expect(rewriteOf(proxy(request(path)))).toBeNull();
  });
});

describe("admin panel", () => {
  it("sends visitors without a session to the login page", async () => {
    const proxy = await loadProxy();
    const res = proxy(request("/admin/products?page=2"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://weskate.co/admin/login");
  });

  it("lets the login page itself load without a session", async () => {
    const proxy = await loadProxy();
    const res = proxy(request("/admin/login"));
    expect(res.headers.get("location")).toBeNull();
    expect(rewriteOf(res)).toBeNull();
  });

  it("lets admin API routes answer for themselves (no login redirect)", async () => {
    const proxy = await loadProxy();
    const res = proxy(request("/admin/api/upload"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("lets a request with a session cookie through, without a locale rewrite", async () => {
    const proxy = await loadProxy();
    const res = proxy(
      request("/admin/products", { cookie: `${ADMIN_SESSION_COOKIE}=token` }),
    );
    expect(res.headers.get("location")).toBeNull();
    expect(rewriteOf(res)).toBeNull();
  });
});

describe("Shopify customer accounts", () => {
  it.each(["/account", "/account/orders", "/services/login_with_shop"])(
    "forwards %s to the Shopify store",
    async (path) => {
      const proxy = await loadProxy("https://weskate-test.myshopify.com");
      expect(rewriteOf(proxy(request(path)))).toBe(
        `https://weskate-test.myshopify.com${path}`,
      );
    },
  );

  it("treats account paths as storefront pages when no store is configured", async () => {
    const proxy = await loadProxy("");
    expect(rewriteOf(proxy(request("/account")))).toBe(
      "https://weskate.co/en/account",
    );
  });

  it("doesn't mistake similar paths for account pages", async () => {
    const proxy = await loadProxy("https://weskate-test.myshopify.com");
    expect(rewriteOf(proxy(request("/accounts-help")))).toBe(
      "https://weskate.co/en/accounts-help",
    );
  });
});

describe("shopper country cookie", () => {
  const countryCookie = (res: Response) =>
    res.headers
      .getSetCookie()
      .find((cookie) => cookie.startsWith(`${COUNTRY_COOKIE}=`));

  it("stores Vercel's country so the browser can choose a checkout", async () => {
    const proxy = await loadProxy();
    const cookie = countryCookie(proxy(request("/cart", { country: "us" })));
    expect(cookie).toMatch(/^country=US;/);
    expect(cookie).toMatch(/Path=\//i);
    expect(cookie).toMatch(/Max-Age=86400/i);
    expect(cookie).toMatch(/SameSite=lax/i);
    // The browser reads it, so it can't be httpOnly
    expect(cookie).not.toMatch(/HttpOnly/i);
  });

  it("doesn't rewrite the cookie when the country hasn't changed", async () => {
    const proxy = await loadProxy();
    const res = proxy(
      request("/cart", { country: "IN", cookie: `${COUNTRY_COOKIE}=IN` }),
    );
    expect(countryCookie(res)).toBeUndefined();
  });

  it("updates the cookie when the shopper's country changes", async () => {
    const proxy = await loadProxy();
    const res = proxy(
      request("/cart", { country: "IN", cookie: `${COUNTRY_COOKIE}=US` }),
    );
    expect(countryCookie(res)).toMatch(/^country=IN;/);
  });

  it("leaves the cookie alone without geolocation (local development)", async () => {
    const proxy = await loadProxy();
    expect(countryCookie(proxy(request("/cart")))).toBeUndefined();
  });

  it("keeps routing as before while setting the cookie", async () => {
    const proxy = await loadProxy();
    const rewritten = proxy(request("/store", { country: "US" }));
    expect(rewriteOf(rewritten)).toBe("https://weskate.co/en/store");
    expect(countryCookie(rewritten)).toBeDefined();

    const redirected = proxy(request("/en/store", { country: "US" }));
    expect(redirected.status).toBe(308);
    expect(redirected.headers.get("location")).toBe("https://weskate.co/store");
  });
});
