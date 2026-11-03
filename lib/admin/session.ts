import { SignJWT, jwtVerify } from "jose";

export const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export type AdminSession = {
  userId: string;
  username: string;
  /**
   * The admin row's `session_version` at the moment this token was issued. The
   * caller compares it against the live row on every request, which is what lets
   * a password change invalidate tokens already handed out.
   */
  sessionVersion: number;
};

export type SessionTokenOptions = {
  expiresInSeconds?: number;
  secret?: string;
};

export function getSecretKey(secretOverride?: string): Uint8Array {
  const secret = secretOverride ?? process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must be set to at least 32 characters. Generate one with `openssl rand -base64 32`.",
    );
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  session: AdminSession,
  options: SessionTokenOptions = {},
): Promise<string> {
  const expiresInSeconds =
    options.expiresInSeconds ?? ADMIN_SESSION_DURATION_SECONDS;
  const issuedAt = Math.floor(Date.now() / 1000);

  return new SignJWT({
    username: session.username,
    sessionVersion: session.sessionVersion,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + expiresInSeconds)
    .sign(getSecretKey(options.secret));
}

/**
 * Returns null for any invalid token rather than throwing, so callers can treat
 * "not signed in" and "forged cookie" identically.
 *
 * A token issued before session versions existed carries no `sessionVersion` and
 * is refused — deliberate, because accepting it would mean an old token survived
 * a password change. Deploying this signs everyone out once.
 */
export async function verifySessionToken(
  token: string,
  options: SessionTokenOptions = {},
): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(options.secret), {
      algorithms: ["HS256"],
    });

    const userId = payload.sub;
    const username = payload.username;
    const sessionVersion = payload.sessionVersion;

    if (
      typeof userId !== "string" ||
      typeof username !== "string" ||
      typeof sessionVersion !== "number"
    ) {
      return null;
    }

    return { userId, username, sessionVersion };
  } catch {
    return null;
  }
}
