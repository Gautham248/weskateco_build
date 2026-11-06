/**
 * The local docker-compose databases (docker-compose.yml). Dependency-free so
 * playwright.config.ts can import it without loading the database driver.
 *
 * Both live in the same Postgres container. `dev` is yours to seed and edit;
 * `test` belongs to the end-to-end suite, which empties and migrates it before
 * every run so local runs see what CI sees.
 */

/**
 * Host of the local databases. localtest.me is a public DNS name that resolves
 * to 127.0.0.1, so no real database host can ever match it; lib/db/index.ts
 * routes it to the local Neon proxy.
 */
export const LOCAL_DB_HOST = "db.localtest.me";

export const LOCAL_DEV_DATABASE_URL = `postgres://postgres:postgres@${LOCAL_DB_HOST}:5432/dev`;

export const LOCAL_TEST_DATABASE_URL = `postgres://postgres:postgres@${LOCAL_DB_HOST}:5432/test`;
