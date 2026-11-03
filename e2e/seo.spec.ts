import { expect, test } from "@playwright/test";
import {
  canonicalPath,
  hasShopify,
  jsonLdItems,
  jsonLdOfType,
  openFirstProduct,
  SHOPIFY_SKIP_REASON,
} from "./helpers";

test.describe("robots and favicon", () => {
  test("robots.txt is served as plain text with crawl rules", async ({
    request,
  }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("text/plain");

    const body = await res.text();
    expect(body).toContain("User-Agent: *");
    expect(body).not.toContain("Disallow: /cart");
    expect(body).toContain("Disallow: /studio");
    expect(body).toContain("Disallow: /admin");
    expect(body).toContain("Disallow: /api/");
    expect(body).toMatch(/Sitemap: https?:\/\/[^\s]+\/sitemap\.xml/);
  });

  test("favicon is served from the root", async ({ request }) => {
    const res = await request.get("/favicon.ico");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).not.toContain("text/html");
  });
});

test.describe("default locale redirect", () => {
  for (const [from, to] of [
    ["/en", "/"],
    ["/en/store", "/store"],
    [
      "/en/store/skateboards?sort=price-asc",
      "/store/skateboards?sort=price-asc",
    ],
    ["/en/products/some-handle", "/products/some-handle"],
    // Older URL forms go straight to the final URL, not through /en/...
    ["/en/product/some-handle", "/products/some-handle"],
    ["/en/guides/wheel-guide", "/guides/wheels-guide"],
    ["/hi/", "/hi"],
  ]) {
    test(`${from} permanently redirects to ${to}`, async ({ request }) => {
      const res = await request.get(from!, { maxRedirects: 0 });
      expect(res.status()).toBe(308);
      const location = new URL(res.headers()["location"]!, "http://x");
      expect(location.pathname + location.search).toBe(to);
    });
  }

  test("/hi is not redirected", async ({ request }) => {
    const res = await request.get("/hi/store", { maxRedirects: 0 });
    expect(res.status()).toBe(200);
  });
});

test.describe("canonical URLs", () => {
  test("store canonical drops sort and filter params", async ({ page }) => {
    await page.goto("/store?sort=price-asc&color=black");
    expect(await canonicalPath(page)).toBe("/store");
  });

  test("each page of a listing is its own canonical", async ({ page }) => {
    // Pointing page 2 at page 1 would hide its products from search engines
    await page.goto("/store?sort=price-asc&page=2");
    expect(await canonicalPath(page)).toBe("/store?page=2");
  });

  test("the Hindi homepage is canonical to /hi, not the redirecting /hi/", async ({
    page,
  }) => {
    await page.goto("/hi");
    expect(await canonicalPath(page)).toBe("/hi");
  });

  test("English and Hindi versions link to each other", async ({ page }) => {
    for (const path of ["/about-us", "/hi/about-us"]) {
      await page.goto(path);
      const alternates = Object.fromEntries(
        await page
          .locator('link[rel="alternate"][hreflang]')
          .evaluateAll((links) =>
            links.map((link) => [
              link.getAttribute("hreflang"),
              new URL(link.getAttribute("href")!).pathname,
            ]),
          ),
      );
      expect(alternates).toEqual({
        en: "/about-us",
        hi: "/hi/about-us",
        "x-default": "/about-us",
      });
    }
  });

  test("Hindi store page is canonical to itself with lang=hi", async ({
    page,
  }) => {
    await page.goto("/hi/store");
    expect(await canonicalPath(page)).toBe("/hi/store");
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  });

  for (const path of [
    "/about-us",
    "/hi/about-us",
    "/products",
    "/contact",
    "/guides/deck-guide",
    "/privacy-policy",
  ]) {
    test(`${path} is canonical to itself`, async ({ page }) => {
      await page.goto(path);
      expect(await canonicalPath(page)).toBe(path);
    });
  }

  test("configurator has a canonical", async ({ page }) => {
    await page.goto("/configurator");
    expect(await canonicalPath(page)).toBe("/configurator");
  });
});

test.describe("social and search metadata", () => {
  test("pages carry Open Graph and Twitter card tags", async ({ page }) => {
    await page.goto("/store?sort=price-asc");
    const meta = (property: string) =>
      page
        .locator(`meta[property="${property}"], meta[name="${property}"]`)
        .first()
        .getAttribute("content");

    expect(await meta("og:site_name")).toBeTruthy();
    expect(new URL((await meta("og:url"))!).pathname).toBe("/store");
    expect(await meta("og:locale")).toBe("en_IN");
    expect(await meta("og:title")).toContain("Store");
    expect(await meta("og:description")).not.toBe(
      "Browse products in the store.",
    );
    expect(await meta("twitter:card")).toBe("summary_large_image");
  });

  test("Hindi pages use the Hindi locale and URL", async ({ page }) => {
    await page.goto("/hi/store");
    const ogUrl = await page
      .locator('meta[property="og:url"]')
      .getAttribute("content");
    expect(new URL(ogUrl!).pathname).toBe("/hi/store");
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      "hi_IN",
    );
  });

  test("the cart is crawlable but kept out of search results", async ({
    page,
  }) => {
    await page.goto("/cart");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  });
});

test.describe("structured data and server rendering", () => {
  test.skip(!hasShopify, SHOPIFY_SKIP_REASON);

  test("homepage describes the organisation and website", async ({ page }) => {
    await page.goto("/");
    const types = (await jsonLdItems(page)).map((item) => item["@type"]);
    expect(types).toEqual(expect.arrayContaining(["Organization", "WebSite"]));
  });

  test("product pages have brand, URL and a breadcrumb trail", async ({
    page,
  }) => {
    const handle = await openFirstProduct(page);
    const product = await jsonLdOfType(page, "Product");
    expect(product.brand?.name).toBeTruthy();
    expect(new URL(product.url).pathname).toBe(`/products/${handle}`);
    expect(product.offers.offerCount).toBeGreaterThan(0);

    const breadcrumbs = await jsonLdOfType(page, "BreadcrumbList");
    const trail = breadcrumbs.itemListElement;
    expect(trail[0].position).toBe(1);
    expect(new URL(trail[0].item).pathname).toBe("/");
    expect(new URL(trail.at(-1).item).pathname).toBe(`/products/${handle}`);
  });

  test("the server sends the page of products the URL asks for", async ({
    request,
  }) => {
    // Known bug: the store grid reads the URL's query on the client, so Next
    // renders it only in the browser and the server HTML has no products.
    // Crawlers that don't run JavaScript see an empty listing. Remove this
    // line once the grid is server-rendered.
    test.fail();

    // Raw HTML, before any JavaScript runs: what a crawler first sees
    const productLinks = async (query: string) => {
      const html = await (await request.get(`/store${query}`)).text();
      return new Set(
        [...html.matchAll(/<a [^>]*href="(\/products\/[^"?]+)/g)].map(
          (m) => m[1],
        ),
      );
    };
    const first = await productLinks("");
    const second = await productLinks("?page=2");
    expect(first.size).toBeGreaterThan(0);
    expect([...second].some((link) => !first.has(link))).toBe(true);
  });
});

test.describe("sitemap", () => {
  test.skip(!hasShopify, SHOPIFY_SKIP_REASON);

  test("sitemap.xml lists clean, reachable URLs", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);

    const xml = await res.text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => new URL(m[1]!).pathname,
    );

    expect(paths).toContain("/");
    // Built-in pages, not just Shopify content
    for (const path of [
      "/store",
      "/products",
      "/about-us",
      "/guides/deck-guide",
      "/privacy-policy",
    ]) {
      expect(paths).toContain(path);
    }
    expect(paths.some((p) => p.startsWith("/products/"))).toBe(true);
    expect(paths.some((p) => p.startsWith("/store/"))).toBe(true);
    // Hindi pages too, each entry linking its other-language version
    expect(paths).toContain("/hi");
    expect(paths).toContain("/hi/about-us");
    expect(xml).toMatch(
      /<xhtml:link rel="alternate" hreflang="hi" href="[^"]*\/hi\/about-us"/,
    );
    // Built-in pages carry no made-up lastmod
    const contact = xml.match(
      /<url>\s*<loc>[^<]*\/contact<\/loc>[\s\S]*?<\/url>/,
    );
    expect(contact?.[0]).toBeTruthy();
    expect(contact![0]).not.toContain("<lastmod>");
    // No broken, duplicate or redirecting URLs
    expect(
      paths.filter(
        (p) => p === "/search" || p === "/guides" || p.startsWith("/en/"),
      ),
    ).toEqual([]);
    expect(new Set(paths).size).toBe(paths.length);

    // Spot-check one collection and one product resolve on this deployment
    for (const prefix of ["/store/", "/products/"]) {
      const path = paths.find((p) => p.startsWith(prefix))!;
      const pageRes = await request.get(path);
      expect(pageRes.status(), path).toBe(200);
    }
  });
});
