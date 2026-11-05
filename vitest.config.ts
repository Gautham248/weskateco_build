import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  // Resolves the bare imports the app uses via tsconfig baseUrl (lib/..., config/...)
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["**/*.test.{ts,tsx}"],
    exclude: [
      ...configDefaults.exclude,
      // Playwright specs live in e2e/ and run with `pnpm test:e2e`
      "e2e/**",
      ".next/**",
      // Claude Code worktrees: full checkouts of other branches
      ".claude/**",
    ],
    coverage: {
      provider: "v8",
      include: [
        "lib/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "app/**/route.ts",
        // Metadata routes such as sitemap.ts and robots.ts
        "app/*.ts",
        "proxy.ts",
      ],
      exclude: ["**/*.d.ts", "**/*.test.{ts,tsx}", "lib/**/types.ts"],
      reporter: ["text", "html"],
    },
  },
});
