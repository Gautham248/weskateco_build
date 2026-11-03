import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "Set DATABASE_URL_UNPOOLED (preferred) or DATABASE_URL before running drizzle-kit.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
