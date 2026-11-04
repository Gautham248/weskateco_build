import { HIDDEN_PRODUCT_TAG, TAGS } from "lib/constants";
import { afterEach, describe, expect, it, vi } from "vitest";

// "use cache" functions call cacheTag/cacheLife, which only work inside a
// Next.js app with cacheComponents; record the calls instead
const cache = vi.hoisted(() => ({ tag: vi.fn(), life: vi.fn() }));
vi.mock("next/cache", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/cache")>()),
  unstable_cacheTag: cache.tag,
  unstable_cacheLife: cache.life,
}));

// lib/shopify reads its store settings when it loads, so import it fresh
// after setting them
async function loadShopify() {
  vi.resetModules();
  vi.stubEnv("SHOPIFY_STORE_DOMAIN", "https://weskate-test.myshopify.com");
  vi.stubEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN", "token");
  return import("lib/shopify");
}

type Node = { handle: string; updatedAt: string; tags: string[] };

/** Fakes Shopify's paged products query, one array of nodes per page. */
function fakeShopify(pages: Node[][]) {
  const requests: { after: string | null }[] = [];
  const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
    const { variables } = JSON.parse(String(init.body));
    const after: string | null = variables?.after ?? null;
    requests.push({ after });
    const index = after ? Number(after.replace("cursor-", "")) : 0;
    const hasNextPage = index < pages.length - 1;
    return new Response(
      JSON.stringify({
        data: {
          products: {
            pageInfo: {
              hasNextPage,
              endCursor: hasNextPage ? `cursor-${index + 1}` : null,
            },
            edges: pages[index]!.map((node) => ({ node })),
          },
        },
      }),
    );
  });
  vi.stubGlobal("fetch", fetchMock);
  return { requests, fetchMock };
}

const node = (handle: string, tags: string[] = []): Node => ({
  handle,
  updatedAt: "2026-10-01T00:00:00Z",
  tags,
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("getProductSitemapEntries", () => {
  it("follows Shopify's pages until the catalog is complete", async () => {
    const { requests } = fakeShopify([
      [node("deck-1"), node("deck-2")],
      [node("truck-1")],
      [node("wheel-1")],
    ]);
    const { getProductSitemapEntries } = await loadShopify();

    const entries = await getProductSitemapEntries();

    expect(entries.map((e) => e.handle)).toEqual([
      "deck-1",
      "deck-2",
      "truck-1",
      "wheel-1",
    ]);
    expect(requests.map((r) => r.after)).toEqual([
      null,
      "cursor-1",
      "cursor-2",
    ]);
  });

  it("returns only the handle and last update", async () => {
    fakeShopify([[node("deck-1", ["skateboard"])]]);
    const { getProductSitemapEntries } = await loadShopify();
    expect(await getProductSitemapEntries()).toEqual([
      { handle: "deck-1", updatedAt: "2026-10-01T00:00:00Z" },
    ]);
  });

  it("leaves out products hidden from the storefront", async () => {
    fakeShopify([[node("visible"), node("hidden", [HIDDEN_PRODUCT_TAG])]]);
    const { getProductSitemapEntries } = await loadShopify();
    expect((await getProductSitemapEntries()).map((e) => e.handle)).toEqual([
      "visible",
    ]);
  });

  it("is cached with the products, so product webhooks refresh it", async () => {
    fakeShopify([[node("deck-1")]]);
    const { getProductSitemapEntries } = await loadShopify();
    await getProductSitemapEntries();
    expect(cache.tag).toHaveBeenCalledWith(TAGS.products);
    expect(cache.life).toHaveBeenCalledWith("days");
  });

  it("returns an empty list for an empty catalog", async () => {
    fakeShopify([[]]);
    const { getProductSitemapEntries } = await loadShopify();
    expect(await getProductSitemapEntries()).toEqual([]);
  });
});
