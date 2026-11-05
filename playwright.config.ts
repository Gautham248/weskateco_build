import { defineConfig, devices } from "@playwright/test";

// Load the same env files Next.js reads so tests know whether Shopify is
// configured. Only a missing file is ignored: swallowing everything would hide
// process.loadEnvFile being absent (added in Node 20.12), and the suite would
// then skip every Shopify test instead of saying why.
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code !== "ENOENT") throw error;
  }
}

const PORT = 3100;

// Point at a deployed site (e.g. a Vercel preview) to skip the local server
const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

// Locally the suite runs against a production build by default. The dev
// server compiles pages on demand and, under parallel load, can corrupt its
// own build manifests, failing every later page. E2E_DEV=1 uses it anyway
// (no build step, but expect timeouts).
const useDevServer = process.env.E2E_DEV === "1";

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: true,
  // A local dev server compiles pages on demand; more parallel tests than
  // this overload it and pages time out
  workers: useDevServer && !externalBaseUrl ? 2 : undefined,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  // The dev server compiles routes on first hit, which can be slow
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: externalBaseUrl ?? `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
      // Layout-sensitive flows only; SEO, page and link checks don't depend
      // on viewport
      testIgnore: /(seo|pages)\.spec\.ts/,
    },
  ],
  webServer: externalBaseUrl
    ? undefined
    : {
        command: useDevServer
          ? `pnpm exec next dev --turbopack -p ${PORT}`
          : `pnpm build && pnpm exec next start -p ${PORT}`,
        url: `http://localhost:${PORT}/robots.txt`,
        // Off by default, so a run always tests a fresh build of the current
        // code rather than a server left over from an earlier run. Set
        // E2E_REUSE_SERVER=1 to rerun against a server you started yourself.
        reuseExistingServer: process.env.E2E_REUSE_SERVER === "1",
        timeout: useDevServer ? 120_000 : 600_000,
      },
});
