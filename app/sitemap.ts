import {
  getCollections,
  getPages,
  getProductSitemapEntries,
} from "lib/shopify";
import { baseUrl, validateEnvironmentVariables } from "lib/utils";
import { MetadataRoute } from "next";

type Route = {
  url: string;
  lastModified: string;
};

export const dynamic = "force-dynamic";

// Pages built into the app (not managed in Shopify)
const STATIC_ROUTES = [
  "",
  "/products",
  "/store",
  "/about-us",
  "/academy",
  "/school",
  "/skateparks",
  "/contact",
  "/configurator",
  // /guides itself redirects to a guide, so only the guides are listed
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const staticRoutes = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const collectionsPromise = getCollections().then((collections) =>
    collections
      // The synthetic "All" collection has no page of its own; /store covers it
      .filter((collection) => collection.handle !== "")
      .map((collection) => ({
        url: `${baseUrl}${collection.path}`,
        lastModified: collection.updatedAt,
      })),
  );

  const productsPromise = getProductSitemapEntries().then((products) =>
    products.map((product) => ({
      url: `${baseUrl}/products/${product.handle}`,
      lastModified: product.updatedAt,
    })),
  );

  const pagesPromise = getPages().then((pages) =>
    pages.map((page) => ({
      url: `${baseUrl}/${page.handle}`,
      lastModified: page.updatedAt,
    })),
  );

  // Rethrow as-is: JSON.stringify(error) turns an Error into "{}"
  const fetchedRoutes: Route[] = (
    await Promise.all([collectionsPromise, productsPromise, pagesPromise])
  ).flat();

  // A Shopify page can share a URL with a built-in page (e.g. about-us)
  const byUrl = new Map<string, Route>();
  for (const route of [...staticRoutes, ...fetchedRoutes]) {
    if (!byUrl.has(route.url)) byUrl.set(route.url, route);
  }
  return [...byUrl.values()];
}
