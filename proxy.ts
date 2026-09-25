import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "./lib/constants";

const locales = ["en", "hi"];
const defaultLocale = "en";

const ADMIN_LOGIN_PATH = "/admin/login";
const ADMIN_API_PREFIX = "/admin/api/";

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
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/studio") // Sanity Studio (future)
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    // Extract locale and set header for downstream use
    const locale = pathname.split("/")[1];
    const response = NextResponse.next();
    response.headers.set("x-locale", locale!);
    return response;
  }

  // No locale in path — rewrite (not redirect) to default locale
  // This keeps clean URLs: /products/deck stays as /products/deck in the browser
  // but internally routes to /en/products/deck
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  const response = NextResponse.rewrite(url);
  response.headers.set("x-locale", defaultLocale);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|fonts|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
