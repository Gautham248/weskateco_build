import { defaultLocale, getLocalizedPath, locales } from "lib/i18n";
import { getCollections, getPages, getProducts } from "lib/shopify";
import { baseUrl, validateEnvironmentVariables } from "lib/utils";
import { MetadataRoute } from "next";

type Route = {
  path: string;
  lastModified: string;
};

export const dynamic = "force-dynamic";

/**
 * One sitemap at /sitemap.xml (where robots.ts points) listing every page in
 * every locale, each entry carrying its hreflang alternates. It lives at the
 * app root rather than under [locale] because the proxy never locale-routes
 * /sitemap.xml.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const staticRoutes: Route[] = ["/", "/products"].map((path) => ({
    path,
    lastModified: new Date().toISOString(),
  }));

  const collectionsPromise = getCollections().then((collections) =>
    collections.map((collection) => ({
      path: collection.path,
      lastModified: collection.updatedAt,
    })),
  );

  const productsPromise = getProducts({}).then((products) =>
    products.map((product) => ({
      path: `/products/${product.handle}`,
      lastModified: product.updatedAt,
    })),
  );

  const pagesPromise = getPages().then((pages) =>
    pages.map((page) => ({
      path: `/${page.handle}`,
      lastModified: page.updatedAt,
    })),
  );

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (
      await Promise.all([collectionsPromise, productsPromise, pagesPromise])
    ).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  const url = (path: string, locale: string) => {
    const localized = getLocalizedPath(path, locale);
    // The Hindi home page is /hi, not /hi/.
    return `${baseUrl}${localized === `/${locale}/` ? `/${locale}` : localized}`;
  };

  return [...staticRoutes, ...fetchedRoutes].flatMap(
    ({ path, lastModified }) => {
      const languages = Object.fromEntries(
        locales.map((locale) => [locale, url(path, locale)]),
      );

      return locales.map((locale) => ({
        url: url(path, locale),
        lastModified,
        alternates: {
          languages: { ...languages, "x-default": url(path, defaultLocale) },
        },
      }));
    },
  );
}
