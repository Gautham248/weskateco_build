import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const locales = ["en", "hi"];
const defaultLocale = "en";

async function isAdminAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("admin_session")?.value;
  if (!token) return false;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  // Admin route protection — guard all /admin/* except /admin/login
  if (pathname.startsWith("/admin")) {
    if (pathname !== "/admin/login") {
      const authenticated = await isAdminAuthenticated(request);
      if (!authenticated) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
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
