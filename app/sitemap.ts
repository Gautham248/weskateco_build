import {
  getCollections,
  getPages,
  getProductSitemapEntries,
} from "lib/shopify";
import { defaultLocale, getLocalizedPath, locales } from "lib/i18n";
import { baseUrl, validateEnvironmentVariables } from "lib/utils";
import { MetadataRoute } from "next";

type Route = {
  path: string;
  lastModified?: string;
};

export const dynamic = "force-dynamic";

// Pages built into the app (not managed in Shopify)
const STATIC_ROUTES = [
  "/",
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

const absoluteUrl = (path: string, locale: string) => {
  const localized = getLocalizedPath(path, locale);
  return `${baseUrl}${localized === "/" ? "" : localized}`;
};

/** One entry per locale, each listing the others as hreflang alternates. */
function localizedEntries(route: Route): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const locale of locales)
    languages[locale] = absoluteUrl(route.path, locale);
  languages["x-default"] = absoluteUrl(route.path, defaultLocale);

  return locales.map((locale) => ({
    url: absoluteUrl(route.path, locale),
    // Built-in pages have no reliable edit date; a made-up "now" on every
    // request would teach search engines to ignore lastmod altogether
    ...(route.lastModified ? { lastModified: route.lastModified } : {}),
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const sources: Promise<Route[]>[] = [
    getCollections().then((collections) =>
      collections
        // The synthetic "All" collection has no page of its own; /store covers it
        .filter((collection) => collection.handle !== "")
        .map((collection) => ({
          path: collection.path,
          lastModified: collection.updatedAt,
        })),
    ),
    getProductSitemapEntries().then((products) =>
      products.map((product) => ({
        path: `/products/${product.handle}`,
        lastModified: product.updatedAt,
      })),
    ),
    getPages().then((pages) =>
      pages.map((page) => ({
        path: `/${page.handle}`,
        lastModified: page.updatedAt,
      })),
    ),
  ];

  // A failing Shopify query leaves its part out rather than failing the
  // whole sitemap, which would also drop the built-in pages
  const fetchedRoutes: Route[] = [];
  for (const result of await Promise.allSettled(sources)) {
    if (result.status === "fulfilled") fetchedRoutes.push(...result.value);
    else console.error("Sitemap: a Shopify source failed", result.reason);
  }

  // A Shopify page can share a URL with a built-in page (e.g. about-us)
  const byPath = new Map<string, Route>();
  for (const route of [
    ...STATIC_ROUTES.map((path) => ({ path })),
    ...fetchedRoutes,
  ]) {
    if (!byPath.has(route.path)) byPath.set(route.path, route);
  }
  return [...byPath.values()].flatMap(localizedEntries);
}
