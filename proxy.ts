import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, LOCALE_COOKIE } from "./lib/constants";
import { baseUrl } from "./lib/utils";

const locales = ["en", "hi"];
const defaultLocale = "en";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Public URL of `path` in `locale`: English is unprefixed, others under /<locale>. */
function localizedUrl(path: string, locale: string) {
  if (locale === defaultLocale) {
    return `${baseUrl}${path}`;
  }
  return `${baseUrl}/${locale}${path === "/" ? "" : path}`;
}

/**
 * Stamps a storefront page response with its language:
 *
 * - A `Link` header carrying the canonical URL and the hreflang alternates
 *   (Google reads both from HTTP headers), so every page under app/[locale]
 *   gets them without each one declaring its own metadata. The query string is
 *   left out, so filtered and sorted store URLs canonicalise to the plain page.
 * - The locale cookie, so server actions such as cart creation know which
 *   language the shopper is browsing in.
 */
function withLocaleHeaders(
  request: NextRequest,
  response: NextResponse,
  path: string,
  locale: string,
) {
  const links = [
    `<${localizedUrl(path, locale)}>; rel="canonical"`,
    ...locales.map(
      (alternate) =>
        `<${localizedUrl(path, alternate)}>; rel="alternate"; hreflang="${alternate}"`,
    ),
    `<${localizedUrl(path, defaultLocale)}>; rel="alternate"; hreflang="x-default"`,
  ];

  response.headers.set("Link", links.join(", "));
  response.headers.set("x-locale", locale);
  if (request.cookies.get(LOCALE_COOKIE)?.value !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }
  return response;
}

const ADMIN_LOGIN_PATH = "/admin/login";
const ADMIN_API_PREFIX = "/admin/api/";

// Directories served from public/ — requests must bypass the locale rewrite.
const PUBLIC_ASSET_PREFIXES = ["/fonts", "/hero", "/icons"];

const SHOPIFY_STORE_HOST = process.env.SHOPIFY_STORE_DOMAIN?.replace(
  /^https?:\/\//,
  "",
);

// Shopify's new Customer Accounts are hosted on the store's primary domain
// (this app). These paths belong to Shopify, not the storefront, so they are
// reverse-proxied through to the Shopify store.
const SHOPIFY_ACCOUNT_PREFIXES = [
  "/account",
  "/services/login_with_shop",
  "/services/logout",
];

function isShopifyAccountPath(pathname: string) {
  return SHOPIFY_ACCOUNT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Cheap cookie-presence gate only. Signature verification happens in the admin
 * layouts, server actions, and route handlers (Node runtime) — this exists so an
 * unauthenticated request never even reaches a protected page, and the proxy
 * bundle stays free of the bcrypt/jose dependency chain.
 *
 * Deliberately does NOT redirect away from /admin/login when a cookie is
 * present: an invalid or expired token would then bounce between /admin/login
 * and /admin/products forever.
 */
function handleAdminRequest(request: NextRequest, pathname: string) {
  // API routes are exempt so their own auth check can answer with a 401 JSON
  // response. Redirecting here would hand fetch() an HTML login page and a 200.
  if (pathname.startsWith(ADMIN_API_PREFIX)) {
    return NextResponse.next();
  }

  const hasSessionCookie = Boolean(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  );

  if (!hasSessionCookie && pathname !== ADMIN_LOGIN_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_LOGIN_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Must run before the locale rewrite below, otherwise /account becomes
  // /en/account and is swallowed by the [locale]/[page] catch-all (soft 404).
  if (SHOPIFY_STORE_HOST && isShopifyAccountPath(pathname)) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = SHOPIFY_STORE_HOST;
    url.port = "";
    return NextResponse.rewrite(url);
  }

  // The admin panel lives outside the locale tree. It must be handled before
  // the locale rewrite below, otherwise /admin becomes /en/admin and is
  // swallowed by the [locale]/[page] catch-all.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return handleAdminRequest(request, pathname);
  }

  // Skip static assets, API routes, and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/studio") || // Sanity Studio (future)
    // Public asset directories and any file with an extension (e.g.
    // /icons/logo.png, /hero/banner.jpg) must never be locale-rewritten,
    // otherwise they 404 against the [locale] catch-all.
    PUBLIC_ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    const locale = pathname.split("/")[1]!;
    const path = pathname.slice(locale.length + 1) || "/";

    // English lives at the unprefixed URL. /en/... would otherwise serve the
    // same page at a second address, so send it home permanently.
    if (locale === defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = path;
      return NextResponse.redirect(url, 308);
    }

    return withLocaleHeaders(request, NextResponse.next(), path, locale);
  }

  // No locale in path — rewrite (not redirect) to default locale
  // This keeps clean URLs: /products/deck stays as /products/deck in the browser
  // but internally routes to /en/products/deck
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return withLocaleHeaders(
    request,
    NextResponse.rewrite(url),
    pathname,
    defaultLocale,
  );
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|fonts|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
