import { LOCAL_TEST_DATABASE_URL } from "lib/db/local";
import { migrateLocal, truncateAll } from "./local-db";

/**
 * Resets the local test database to the state the e2e suite expects: created
 * if missing, migrated, and every table empty. playwright.config.ts runs this
 * before it builds the app, so every run, locally or in CI, starts from the
 * same blank database, and nothing in your dev database reaches the tests.
 *
 * Always targets LOCAL_TEST_DATABASE_URL and ignores DATABASE_URL, so it can't
 * wipe anything else.
 */
async function main() {
  const db = await migrateLocal(LOCAL_TEST_DATABASE_URL);
  await truncateAll(db);

  console.log("Test database migrated and emptied.");
}

main().catch((error) => {
  const unreachable =
    error instanceof Error &&
    /fetch failed|ECONNREFUSED/.test(String(error.cause ?? error));

  if (unreachable) {
    console.error(
      "Can't reach the local test database. Start it with `pnpm db:up` (Docker must be running).",
    );
  } else {
    console.error("Preparing the test database failed:", error);
  }

  process.exit(1);
});
