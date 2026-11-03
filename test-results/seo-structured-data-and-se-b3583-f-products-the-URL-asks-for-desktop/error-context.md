# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: seo.spec.ts >> structured data and server rendering >> the server sends the page of products the URL asks for
- Location: e2e/seo.spec.ts:261:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Test source

```ts
  181 |   }) => {
  182 |     await openFirstProduct(page);
  183 |     for (const name of [
  184 |       "description",
  185 |       "og:description",
  186 |       "twitter:description",
  187 |     ]) {
  188 |       const content = await page
  189 |         .locator(`meta[name="${name}"], meta[property="${name}"]`)
  190 |         .first()
  191 |         .getAttribute("content");
  192 |       expect(content?.length, name).toBeLessThanOrEqual(161);
  193 |     }
  194 |   });
  195 | 
  196 |   test("Hindi pages use the Hindi locale and URL", async ({ page }) => {
  197 |     await page.goto("/hi/store");
  198 |     const ogUrl = await page
  199 |       .locator('meta[property="og:url"]')
  200 |       .getAttribute("content");
  201 |     expect(new URL(ogUrl!).pathname).toBe("/hi/store");
  202 |     await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
  203 |       "content",
  204 |       "hi_IN",
  205 |     );
  206 |   });
  207 | 
  208 |   test("the cart is crawlable but kept out of search results", async ({
  209 |     page,
  210 |   }) => {
  211 |     await page.goto("/cart");
  212 |     await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
  213 |       "content",
  214 |       /noindex/,
  215 |     );
  216 |   });
  217 | 
  218 |   test("the Hindi cart has a Hindi title and locale", async ({ page }) => {
  219 |     await page.goto("/hi/cart");
  220 |     await expect(page).toHaveTitle(/^आपकी कार्ट \|/);
  221 |     await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
  222 |       "content",
  223 |       "hi_IN",
  224 |     );
  225 |   });
  226 | });
  227 | 
  228 | test.describe("structured data and server rendering", () => {
  229 |   test.skip(!hasShopify, SHOPIFY_SKIP_REASON);
  230 | 
  231 |   test("homepage describes the organisation and website", async ({
  232 |     page,
  233 |     request,
  234 |   }) => {
  235 |     await page.goto("/");
  236 |     const types = (await jsonLdItems(page)).map((item) => item["@type"]);
  237 |     expect(types).toEqual(expect.arrayContaining(["Organization", "WebSite"]));
  238 | 
  239 |     // The logo is what Google shows for the brand; it must load
  240 |     const organization = await jsonLdOfType(page, "Organization");
  241 |     const logo = await request.get(new URL(organization.logo).pathname);
  242 |     expect(logo.status()).toBe(200);
  243 |     expect(logo.headers()["content-type"]).toContain("image/");
  244 |   });
  245 | 
  246 |   test("product pages have brand and URL, and no hidden breadcrumb", async ({
  247 |     page,
  248 |   }) => {
  249 |     const handle = await openFirstProduct(page);
  250 |     const product = await jsonLdOfType(page, "Product");
  251 |     expect(product.brand?.name).toBeTruthy();
  252 |     expect(new URL(product.url).pathname).toBe(`/products/${handle}`);
  253 |     expect(product.offers.offerCount).toBeGreaterThan(0);
  254 | 
  255 |     // The visible breadcrumb is turned off, and structured data must match
  256 |     // what's on the page
  257 |     const types = (await jsonLdItems(page)).map((item) => item["@type"]);
  258 |     expect(types).not.toContain("BreadcrumbList");
  259 |   });
  260 | 
  261 |   test("the server sends the page of products the URL asks for", async ({
  262 |     request,
  263 |   }) => {
  264 |     // Known bug: the store grid reads the URL's query on the client, so Next
  265 |     // renders it only in the browser and the server HTML has no products.
  266 |     // Crawlers that don't run JavaScript see an empty listing. Remove this
  267 |     // line once the grid is server-rendered.
  268 |     test.fail();
  269 | 
  270 |     // Raw HTML, before any JavaScript runs: what a crawler first sees
  271 |     const productLinks = async (query: string) => {
  272 |       const html = await (await request.get(`/store${query}`)).text();
  273 |       return new Set(
  274 |         [...html.matchAll(/<a [^>]*href="(\/products\/[^"?]+)/g)].map(
  275 |           (m) => m[1],
  276 |         ),
  277 |       );
  278 |     };
  279 |     const first = await productLinks("");
  280 |     const second = await productLinks("?page=2");
> 281 |     expect(first.size).toBeGreaterThan(0);
      |                        ^ Error: expect(received).toBeGreaterThan(expected)
  282 |     expect([...second].some((link) => !first.has(link))).toBe(true);
  283 |   });
  284 | });
  285 | 
  286 | test.describe("sitemap", () => {
  287 |   test.skip(!hasShopify, SHOPIFY_SKIP_REASON);
  288 | 
  289 |   test("sitemap.xml lists clean, reachable URLs", async ({ request }) => {
  290 |     const res = await request.get("/sitemap.xml");
  291 |     expect(res.status()).toBe(200);
  292 | 
  293 |     const xml = await res.text();
  294 |     const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  295 |       (m) => new URL(m[1]!).pathname,
  296 |     );
  297 | 
  298 |     expect(paths).toContain("/");
  299 |     // Built-in pages, not just Shopify content
  300 |     for (const path of [
  301 |       "/store",
  302 |       "/products",
  303 |       "/about-us",
  304 |       "/guides/deck-guide",
  305 |       "/privacy-policy",
  306 |     ]) {
  307 |       expect(paths).toContain(path);
  308 |     }
  309 |     expect(paths.some((p) => p.startsWith("/products/"))).toBe(true);
  310 |     expect(paths.some((p) => p.startsWith("/store/"))).toBe(true);
  311 |     // Hindi pages too, each entry linking its other-language version
  312 |     expect(paths).toContain("/hi");
  313 |     expect(paths).toContain("/hi/about-us");
  314 |     expect(xml).toMatch(
  315 |       /<xhtml:link rel="alternate" hreflang="hi" href="[^"]*\/hi\/about-us"/,
  316 |     );
  317 |     // Built-in pages carry no made-up lastmod
  318 |     const contact = xml.match(
  319 |       /<url>\s*<loc>[^<]*\/contact<\/loc>[\s\S]*?<\/url>/,
  320 |     );
  321 |     expect(contact?.[0]).toBeTruthy();
  322 |     expect(contact![0]).not.toContain("<lastmod>");
  323 |     // No broken, duplicate or redirecting URLs
  324 |     expect(
  325 |       paths.filter(
  326 |         (p) => p === "/search" || p === "/guides" || p.startsWith("/en/"),
  327 |       ),
  328 |     ).toEqual([]);
  329 |     expect(new Set(paths).size).toBe(paths.length);
  330 | 
  331 |     // Spot-check one collection and one product resolve on this deployment
  332 |     for (const prefix of ["/store/", "/products/"]) {
  333 |       const path = paths.find((p) => p.startsWith(prefix))!;
  334 |       const pageRes = await request.get(path);
  335 |       expect(pageRes.status(), path).toBe(200);
  336 |     }
  337 |   });
  338 | });
  339 | 
```