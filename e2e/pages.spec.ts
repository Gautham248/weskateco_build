import {
  expect,
  test,
  type APIRequestContext,
  type APIResponse,
  type Page,
} from "@playwright/test";
import {
  canonicalPath,
  COLLECTION,
  hasShopify,
  openFirstProduct,
  SHOPIFY_SKIP_REASON,
} from "./helpers";

// Every page a shopper can reach, in English and Hindi, should load cleanly
// and link only to pages that exist. Keep this list in step with the built-in
// pages in app/sitemap.ts; the last test fails if the two drift apart.
const PAGES = [
  "/",
  "/store",
  `/store/${COLLECTION}`,
  "/products",
  "/configurator",
  "/cart",
  "/about-us",
  "/academy",
  "/school",
  "/skateparks",
  "/contact",
  "/guides/skateboard-buying-guide",
  "/guides/deck-guide",
  "/guides/truck-guide",
  "/guides/wheels-guide",
  "/guides/bearing-guide",
  "/guides/griptape-guide",
  "/guides/surfskate-guide",
  "/privacy-policy",
  "/refund-policy",
  "/shipping-policy",
  "/terms-of-service",
];

// Pages in PAGES that the sitemap leaves out on purpose
const NOT_IN_SITEMAP = ["/cart", `/store/${COLLECTION}`];

// Kept out of search results, so it declares no canonical URL
const NO_CANONICAL = ["/cart"];

// Links that leave the storefront or start an action rather than show a page.
// /account and /services/* are reverse-proxied to the Shopify store
// (SHOPIFY_ACCOUNT_PREFIXES in proxy.ts), so whether they answer depends on
// reaching Shopify rather than on anything this repository serves: checking
// them makes the suite fail whenever that hop is unavailable, as it is from
// CI.
const SKIPPED_LINK =
  /^\/(admin|studio|api|account|services)(\/|$)|^\/cart\/checkout/;

const localized = (path: string, locale: "en" | "hi") =>
  locale === "en" ? path : path === "/" ? "/hi" : `/hi${path}`;

// Each worker checks a link once, however many pages carry it (the header and
// footer are on every page)
const linkProblems = new Map<string, Promise<string | null>>();

// A streamed (partially prerendered) page has sent its 200 status before it
// finds out the page doesn't exist, so a missing page is a 200 that Next marks
// with exactly this tag. Real pages that stay out of search, like the cart,
// say "noindex, follow" instead.
const NOT_FOUND_TAG = /<meta name="robots" content="noindex"\s*\/?>/;

async function pageProblem(res: APIResponse): Promise<string | null> {
  if (res.status() >= 400) return String(res.status());
  if (NOT_FOUND_TAG.test(await res.text())) return "not found";
  return null;
}

/**
 * What's wrong with the page a shopper ends up on after following the link,
 * or null if it's fine. A redirect to another site, such as /account handing
 * off to Shopify's customer accounts, counts as working: what happens there
 * is that site's business.
 */
async function followLink(
  request: APIRequestContext,
  path: string,
): Promise<string | null> {
  const res = await request.get(path, { maxRedirects: 0 });
  const location = res.headers()["location"];
  if (res.status() < 300 || res.status() >= 400 || !location) {
    return pageProblem(res);
  }
  const appUrl = test.info().project.use.baseURL!;
  const target = new URL(location, appUrl);
  if (target.host !== new URL(appUrl).host) return null;
  return pageProblem(await request.get(target.pathname + target.search));
}

function checkLink(request: APIRequestContext, path: string) {
  let problem = linkProblems.get(path);
  if (!problem) {
    problem = followLink(request, path);
    linkProblems.set(path, problem);
  }
  return problem;
}

/** Internal link paths on the page, once the page has rendered. */
async function internalLinks(page: Page): Promise<string[]> {
  // The site's own absolute links carry the deployed host, not the test
  // server's; og:url has it on every page, including ones with no canonical
  const siteUrl = await page
    .locator('meta[property="og:url"]')
    .first()
    .getAttribute("content");
  const siteHost = siteUrl ? new URL(siteUrl).host : null;
  const hrefs = await page
    .locator("a[href]")
    .evaluateAll((els) => els.map((el) => el.getAttribute("href")!));

  const paths = new Set<string>();
  for (const href of hrefs) {
    if (!href.startsWith("/") && !/^https?:/.test(href)) continue;
    const url = new URL(href, page.url());
    if (url.host !== new URL(page.url()).host && url.host !== siteHost) {
      continue;
    }
    const path = url.pathname + url.search;
    if (!SKIPPED_LINK.test(url.pathname)) paths.add(path);
  }
  return [...paths];
}

/** Every internal link on the page resolves to a page that exists. */
async function expectLinksWork(page: Page, request: APIRequestContext) {
  const links = await internalLinks(page);
  const broken: string[] = [];
  await Promise.all(
    links.map(async (path) => {
      const problem = await checkLink(request, path);
      if (problem) broken.push(`${path} (${problem})`);
    }),
  );
  expect(broken.sort(), `broken links on ${page.url()}`).toEqual([]);
}

/** Loads a page and checks it rendered properly, without script errors. */
async function openPage(page: Page, path: string) {
  const errors: string[] = [];
  page.on("pageerror", (error) => {
    // Known issue, not yet fixed: about one page load in 140, on any page,
    // React reports a hydration mismatch (#418) and re-renders on the client.
    // Third-party scripts loaded beforeInteractive (GoKwik, Google Analytics,
    // Meta Pixel) changing the page before React hydrates are the likely cause.
    if (error.message.includes("Minified React error #418")) return;
    errors.push(error.message);
  });

  const res = await page.goto(path);
  expect(res?.status(), `${path} status`).toBe(200);
  await page.waitForLoadState("networkidle").catch(() => {});

  await expect(page).toHaveTitle(/\S/);
  // The error boundary in app/[locale]/error.tsx
  await expect(page.getByText("Oh no!")).toHaveCount(0);
  expect(errors, `script errors on ${path}`).toEqual([]);
}

test.describe("every page loads and links only to pages that exist", () => {
  test.skip(!hasShopify, SHOPIFY_SKIP_REASON);
  // Following every link on a page can take a while on a cold server
  test.slow();

  for (const locale of ["en", "hi"] as const) {
    for (const route of PAGES) {
      const path = localized(route, locale);

      test(path, async ({ page, request }) => {
        await openPage(page, path);
        if (!NO_CANONICAL.includes(route)) {
          expect(await canonicalPath(page), `${path} canonical`).toBe(path);
        }
        await expectLinksWork(page, request);
      });
    }
  }

  test("a product page", async ({ page, request }) => {
    const handle = await openFirstProduct(page);
    await openPage(page, `/products/${handle}`);
    await expectLinksWork(page, request);
  });

  test("Shopify-managed pages in the sitemap", async ({ page, request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => new URL(m[1]!).pathname)
      .filter((p) => !p.startsWith("/hi"));

    // Built-in pages and the sitemap must list the same pages
    const builtIn = PAGES.filter((p) => !NOT_IN_SITEMAP.includes(p));
    for (const path of builtIn) {
      expect(paths, `sitemap should list ${path}`).toContain(path);
    }

    const shopifyPages = paths.filter(
      (p) =>
        !PAGES.includes(p) &&
        !p.startsWith("/products/") &&
        !p.startsWith("/store/"),
    );
    for (const path of shopifyPages) {
      await openPage(page, path);
      await expectLinksWork(page, request);
    }
  });
});
