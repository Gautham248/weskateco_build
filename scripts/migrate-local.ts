import { migrateLocal, requireLocalDevDatabase } from "./local-db";

/**
 * Applies the committed migrations in lib/db/migrations to the local dev
 * database, creating it first if needed.
 *
 * `pnpm db:migrate` (drizzle-kit) is still what migrates Neon. It can't reach
 * the local database: the only Postgres driver installed is Neon's, and
 * drizzle-kit drives it over WebSockets, which the local proxy setup doesn't
 * route. This goes over HTTP through the app's own client instead, and records
 * applied migrations in the same drizzle.__drizzle_migrations table.
 */
async function main() {
  await migrateLocal(requireLocalDevDatabase());

  console.log("Dev database is up to date with lib/db/migrations.");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
