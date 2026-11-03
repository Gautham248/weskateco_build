import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Resolves the bare imports the app uses via tsconfig baseUrl (lib/..., config/...)
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["**/*.test.{ts,tsx}"],
    // Playwright specs live in e2e/ and run with `pnpm test:e2e`
    exclude: ["node_modules/**", "e2e/**", ".next/**"],
    coverage: {
      provider: "v8",
      include: [
        "lib/**/*.ts",
        "components/**/*.ts",
        "app/**/route.ts",
        "proxy.ts",
      ],
      exclude: ["**/*.d.ts", "**/*.test.{ts,tsx}", "lib/**/types.ts"],
      reporter: ["text", "html"],
    },
  },
});
