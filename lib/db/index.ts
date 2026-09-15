import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type Database = NeonHttpDatabase<typeof schema>;

let cached: Database | undefined;

/**
 * Lazily builds the Drizzle client so that importing this module never requires
 * DATABASE_URL to be present. The storefront imports the override layer during
 * prerender, and a missing env var there must surface as a catchable error
 * rather than a module-load crash.
 */
export function getDb(): Database {
  if (!cached) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. The admin override layer cannot reach the database.",
      );
    }
    cached = drizzle(neon(url), { schema });
  }
  return cached;
}

export { schema };
