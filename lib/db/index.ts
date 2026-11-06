import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { LOCAL_DB_HOST } from "./local";
import * as schema from "./schema";

export type Database = NeonHttpDatabase<typeof schema>;

/**
 * True only for connection-establishment failures — a connect timeout, DNS
 * failure, or refused connection — where the request never reached Neon.
 * Retrying those is safe; a response that may already have started is not.
 */
function isTransientConnectError(error: unknown): boolean {
  const cause = (error as { cause?: unknown } | null)?.cause;

  if (cause && typeof cause === "object") {
    const code = (cause as { code?: string }).code;
    if (
      code === "ECONNREFUSED" ||
      code === "ENETUNREACH" ||
      code === "EHOSTUNREACH" ||
      code === "ENOTFOUND" ||
      code === "EAI_AGAIN"
    ) {
      return true;
    }

    if ((cause as { name?: string }).name === "ConnectTimeoutError") {
      return true;
    }
  }

  return false;
}

/**
 * Retrying fetch for the Neon HTTP driver. Transient connection blips surface
 * as `NeonDbError: Error connecting to database ... fetch failed`, so this
 * retries the connection a couple of times before giving up.
 */
async function retryingFetch(
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
): Promise<Response> {
  const maxRetries = 2;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await fetch(input, init);
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries && isTransientConnectError(error)) {
        await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
        continue;
      }

      break;
    }
  }

  throw lastError;
}

neonConfig.fetchFunction = retryingFetch;

/**
 * Neon's driver sends queries to https://<host>/sql. For the local
 * docker-compose databases (lib/db/local.ts) they go instead to the local Neon
 * proxy over plain http on port 4444.
 */
const LOCAL_PROXY_PORT = 4444;

const neonDefaultEndpoint = neonConfig.fetchEndpoint;

neonConfig.fetchEndpoint = (host, port, options) => {
  if (host === LOCAL_DB_HOST) {
    return `http://${host}:${LOCAL_PROXY_PORT}/sql`;
  }

  return typeof neonDefaultEndpoint === "function"
    ? neonDefaultEndpoint(host, port, options)
    : neonDefaultEndpoint;
};

/** A client for one connection string, for scripts that pick their database. */
export function createDb(url: string): Database {
  return drizzle(neon(url), { schema });
}

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
    cached = createDb(url);
  }
  return cached;
}

export { schema };
