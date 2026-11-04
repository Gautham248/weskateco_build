import type { FullConfig } from "@playwright/test";
import { COLLECTION } from "./helpers";

// The dev server compiles each route on its first request, which can take
// longer than a test's timeout when many tests hit cold routes in parallel,
// and a production build fills its data cache on first request. Request each
// route once up front so the tests see warm routes.
export default async function globalSetup(config: FullConfig) {
  if (process.env.PLAYWRIGHT_BASE_URL) return;

  const baseURL = config.projects[0]!.use.baseURL!;
  const routes = [
    "/",
    "/store",
    `/store/${COLLECTION}`,
    "/hi/store",
    "/configurator",
    "/cart",
    "/products/e2e-warmup",
    "/sitemap.xml",
  ];

  for (const route of routes) {
    await fetch(new URL(route, baseURL)).catch(() => {});
  }
}
