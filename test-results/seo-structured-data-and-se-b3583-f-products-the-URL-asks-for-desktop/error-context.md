# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: seo.spec.ts >> structured data and server rendering >> the server sends the page of products the URL asks for
- Location: e2e/seo.spec.ts:198:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Test source

```ts
  118 |   ]) {
  119 |     test(`${path} is canonical to itself`, async ({ page }) => {
  120 |       await page.goto(path);
  121 |       expect(await canonicalPath(page)).toBe(path);
  122 |     });
  123 |   }
  124 | 
  125 |   test("configurator has a canonical", async ({ page }) => {
  126 |     await page.goto("/configurator");
  127 |     expect(await canonicalPath(page)).toBe("/configurator");
  128 |   });
  129 | });
  130 | 
  131 | test.describe("social and search metadata", () => {
  132 |   test("pages carry Open Graph and Twitter card tags", async ({ page }) => {
  133 |     await page.goto("/store?sort=price-asc");
  134 |     const meta = (property: string) =>
  135 |       page
  136 |         .locator(`meta[property="${property}"], meta[name="${property}"]`)
  137 |         .first()
  138 |         .getAttribute("content");
  139 | 
  140 |     expect(await meta("og:site_name")).toBeTruthy();
  141 |     expect(new URL((await meta("og:url"))!).pathname).toBe("/store");
  142 |     expect(await meta("og:locale")).toBe("en_IN");
  143 |     expect(await meta("og:title")).toContain("Store");
  144 |     expect(await meta("og:description")).not.toBe(
  145 |       "Browse products in the store.",
  146 |     );
  147 |     expect(await meta("twitter:card")).toBe("summary_large_image");
  148 |   });
  149 | 
  150 |   test("Hindi pages use the Hindi locale and URL", async ({ page }) => {
  151 |     await page.goto("/hi/store");
  152 |     const ogUrl = await page
  153 |       .locator('meta[property="og:url"]')
  154 |       .getAttribute("content");
  155 |     expect(new URL(ogUrl!).pathname).toBe("/hi/store");
  156 |     await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
  157 |       "content",
  158 |       "hi_IN",
  159 |     );
  160 |   });
  161 | 
  162 |   test("the cart is crawlable but kept out of search results", async ({
  163 |     page,
  164 |   }) => {
  165 |     await page.goto("/cart");
  166 |     await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
  167 |       "content",
  168 |       /noindex/,
  169 |     );
  170 |   });
  171 | });
  172 | 
  173 | test.describe("structured data and server rendering", () => {
  174 |   test.skip(!hasShopify, SHOPIFY_SKIP_REASON);
  175 | 
  176 |   test("homepage describes the organisation and website", async ({ page }) => {
  177 |     await page.goto("/");
  178 |     const types = (await jsonLdItems(page)).map((item) => item["@type"]);
  179 |     expect(types).toEqual(expect.arrayContaining(["Organization", "WebSite"]));
  180 |   });
  181 | 
  182 |   test("product pages have brand, URL and a breadcrumb trail", async ({
  183 |     page,
  184 |   }) => {
  185 |     const handle = await openFirstProduct(page);
  186 |     const product = await jsonLdOfType(page, "Product");
  187 |     expect(product.brand?.name).toBeTruthy();
  188 |     expect(new URL(product.url).pathname).toBe(`/products/${handle}`);
  189 |     expect(product.offers.offerCount).toBeGreaterThan(0);
  190 | 
  191 |     const breadcrumbs = await jsonLdOfType(page, "BreadcrumbList");
  192 |     const trail = breadcrumbs.itemListElement;
  193 |     expect(trail[0].position).toBe(1);
  194 |     expect(new URL(trail[0].item).pathname).toBe("/");
  195 |     expect(new URL(trail.at(-1).item).pathname).toBe(`/products/${handle}`);
  196 |   });
  197 | 
  198 |   test("the server sends the page of products the URL asks for", async ({
  199 |     request,
  200 |   }) => {
  201 |     // Known bug: the store grid reads the URL's query on the client, so Next
  202 |     // renders it only in the browser and the server HTML has no products.
  203 |     // Crawlers that don't run JavaScript see an empty listing. Remove this
  204 |     // line once the grid is server-rendered.
  205 |     test.fail();
  206 | 
  207 |     // Raw HTML, before any JavaScript runs: what a crawler first sees
  208 |     const productLinks = async (query: string) => {
  209 |       const html = await (await request.get(`/store${query}`)).text();
  210 |       return new Set(
  211 |         [...html.matchAll(/<a [^>]*href="(\/products\/[^"?]+)/g)].map(
  212 |           (m) => m[1],
  213 |         ),
  214 |       );
  215 |     };
  216 |     const first = await productLinks("");
  217 |     const second = await productLinks("?page=2");
> 218 |     expect(first.size).toBeGreaterThan(0);
      |                        ^ Error: expect(received).toBeGreaterThan(expected)
  219 |     expect([...second].some((link) => !first.has(link))).toBe(true);
  220 |   });
  221 | });
  222 | 
  223 | test.describe("sitemap", () => {
  224 |   test.skip(!hasShopify, SHOPIFY_SKIP_REASON);
  225 | 
  226 |   test("sitemap.xml lists clean, reachable URLs", async ({ request }) => {
  227 |     const res = await request.get("/sitemap.xml");
  228 |     expect(res.status()).toBe(200);
  229 | 
  230 |     const xml = await res.text();
  231 |     const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  232 |       (m) => new URL(m[1]!).pathname,
  233 |     );
  234 | 
  235 |     expect(paths).toContain("/");
  236 |     // Built-in pages, not just Shopify content
  237 |     for (const path of [
  238 |       "/store",
  239 |       "/products",
  240 |       "/about-us",
  241 |       "/guides/deck-guide",
  242 |       "/privacy-policy",
  243 |     ]) {
  244 |       expect(paths).toContain(path);
  245 |     }
  246 |     expect(paths.some((p) => p.startsWith("/products/"))).toBe(true);
  247 |     expect(paths.some((p) => p.startsWith("/store/"))).toBe(true);
  248 |     // Hindi pages too, each entry linking its other-language version
  249 |     expect(paths).toContain("/hi");
  250 |     expect(paths).toContain("/hi/about-us");
  251 |     expect(xml).toMatch(
  252 |       /<xhtml:link rel="alternate" hreflang="hi" href="[^"]*\/hi\/about-us"/,
  253 |     );
  254 |     // Built-in pages carry no made-up lastmod
  255 |     const contact = xml.match(
  256 |       /<url>\s*<loc>[^<]*\/contact<\/loc>[\s\S]*?<\/url>/,
  257 |     );
  258 |     expect(contact?.[0]).toBeTruthy();
  259 |     expect(contact![0]).not.toContain("<lastmod>");
  260 |     // No broken, duplicate or redirecting URLs
  261 |     expect(
  262 |       paths.filter(
  263 |         (p) => p === "/search" || p === "/guides" || p.startsWith("/en/"),
  264 |       ),
  265 |     ).toEqual([]);
  266 |     expect(new Set(paths).size).toBe(paths.length);
  267 | 
  268 |     // Spot-check one collection and one product resolve on this deployment
  269 |     for (const prefix of ["/store/", "/products/"]) {
  270 |       const path = paths.find((p) => p.startsWith(prefix))!;
  271 |       const pageRes = await request.get(path);
  272 |       expect(pageRes.status(), path).toBe(200);
  273 |     }
  274 |   });
  275 | });
  276 | 
```