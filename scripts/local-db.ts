import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { createDb, type Database } from "lib/db";
import {
  LOCAL_DB_HOST,
  LOCAL_DEV_DATABASE_URL,
  LOCAL_TEST_DATABASE_URL,
} from "lib/db/local";

/**
 * Shared setup for the scripts that write to the local docker-compose
 * databases (lib/db/local.ts). Everything here refuses to touch any host other
 * than the local one, so a production connection string left in .env can never
 * be migrated or wiped by accident.
 */

/** Every table, in an order TRUNCATE ... CASCADE accepts in one statement. */
const ALL_TABLES = [
  "product_override_images",
  "product_overrides",
  "newly_released_items",
  "shop_now_items",
  "hero_items",
  "hero_settings",
  "social_posts",
  "contact_enquiries",
  "rate_limit_counters",
  "admin_users",
];

/**
 * The dev database from DATABASE_URL, loading env files the way Next.js does
 * (.env.local over .env). Exits unless it is the local dev database: never a
 * remote host, and never the test database, which the e2e suite owns.
 */
export function requireLocalDevDatabase(): string {
  config({ path: [".env.local", ".env"], quiet: true });

  const raw = process.env.DATABASE_URL;

  if (!raw) {
    fail(
      `DATABASE_URL is not set. For the local dev database, put this in .env.local:\n` +
        `  DATABASE_URL=${LOCAL_DEV_DATABASE_URL}`,
    );
  }

  let url: URL;

  try {
    url = new URL(raw);
  } catch {
    fail("DATABASE_URL is not a valid connection string.");
  }

  if (url.hostname !== LOCAL_DB_HOST) {
    fail(
      `DATABASE_URL points at ${url.hostname}, not the local database (${LOCAL_DB_HOST}). ` +
        `This script only runs against the docker-compose database.`,
    );
  }

  if (raw === LOCAL_TEST_DATABASE_URL) {
    fail(
      `DATABASE_URL points at the test database, which the e2e suite empties on every run. ` +
        `Use the dev database instead:\n  DATABASE_URL=${LOCAL_DEV_DATABASE_URL}`,
    );
  }

  return raw;
}

/**
 * Refuses any host but the local one. Called by everything below that writes,
 * so the guarantee holds wherever they are called from rather than only at
 * today's call sites.
 */
export function assertLocalDatabase(url: string): URL {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    fail("Not a valid database connection string.");
  }

  if (parsed.hostname !== LOCAL_DB_HOST) {
    fail(
      `Refusing to touch ${parsed.hostname}: this only runs against the local ` +
        `database (${LOCAL_DB_HOST}).`,
    );
  }

  return parsed;
}

/**
 * Creates the database named in `url` if it doesn't exist yet, so a volume
 * made before that database was added still works.
 */
export async function ensureDatabase(url: string): Promise<void> {
  const target = assertLocalDatabase(url);
  const name = decodeURIComponent(target.pathname.slice(1));

  if (!/^[a-z_][a-z0-9_]*$/.test(name)) {
    fail(`Refusing to create a database named "${name}".`);
  }

  const maintenance = new URL(url);
  maintenance.pathname = "/postgres";
  const db = createDb(maintenance.toString());

  const { rows } = await db.execute(
    sql`SELECT 1 FROM pg_database WHERE datname = ${name}`,
  );

  if (rows.length === 0) {
    await db.execute(sql.raw(`CREATE DATABASE "${name}"`));
    console.log(`Created database ${name}.`);
  }
}

/** Creates the database if needed and applies lib/db/migrations to it. */
export async function migrateLocal(url: string): Promise<Database> {
  await ensureDatabase(url);

  const db = createDb(url);
  await migrate(db, { migrationsFolder: "lib/db/migrations" });

  return db;
}

/**
 * Empties every table, keeping the schema and migration history. Takes the
 * connection string rather than a client so it can check the host itself:
 * handed a Database there is nothing left to check, and this is the one
 * statement here that destroys data.
 */
export async function truncateAll(url: string): Promise<void> {
  assertLocalDatabase(url);

  const db = createDb(url);
  await db.execute(sql.raw(`TRUNCATE ${ALL_TABLES.join(", ")} CASCADE`));
}

export function fail(message: string): never {
  console.error(message);
  process.exit(1);
}
