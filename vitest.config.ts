import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["__tests__/**/*.test.{ts,tsx}"],
    alias: {
      lib: path.resolve(__dirname, "./lib"),
      components: path.resolve(__dirname, "./components"),
      app: path.resolve(__dirname, "./app"),
      locales: path.resolve(__dirname, "./locales"),
    },
  },
});
