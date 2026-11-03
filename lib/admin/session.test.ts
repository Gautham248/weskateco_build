import { SignJWT } from "jose";
import {
  createSessionToken,
  getSecretKey,
  verifySessionToken,
  type AdminSession,
} from "lib/admin/session";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

const SECRET = "a".repeat(48);
const OTHER_SECRET = "b".repeat(48);

const session: AdminSession = {
  userId: "user-1",
  username: "gautham",
  sessionVersion: 3,
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("session tokens", () => {
  let token: string;

  beforeAll(async () => {
    token = await createSessionToken(session, { secret: SECRET });
  });

  it("a token round-trips back to its session, session version included", async () => {
    await expect(
      verifySessionToken(token, { secret: SECRET }),
    ).resolves.toEqual(session);
  });

  it("a token with no session version is refused, so pre-version sessions cannot outlive a password change", async () => {
    const legacySecretKey = new TextEncoder().encode(SECRET);
    const issuedAt = Math.floor(Date.now() / 1000);
    const legacyToken = await new SignJWT({ username: "gautham" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject("user-1")
      .setIssuedAt(issuedAt)
      .setExpirationTime(issuedAt + 60)
      .sign(legacySecretKey);

    await expect(
      verifySessionToken(legacyToken, { secret: SECRET }),
    ).resolves.toBeNull();
  });

  it("a token signed with a different secret is rejected", async () => {
    await expect(
      verifySessionToken(token, { secret: OTHER_SECRET }),
    ).resolves.toBeNull();
  });

  it("a non-JWT string is rejected", async () => {
    await expect(
      verifySessionToken("definitely-not-a-jwt", { secret: SECRET }),
    ).resolves.toBeNull();
  });

  it("an empty string is rejected", async () => {
    await expect(
      verifySessionToken("", { secret: SECRET }),
    ).resolves.toBeNull();
  });

  it("an expired token is rejected", async () => {
    const expired = await createSessionToken(session, {
      secret: SECRET,
      expiresInSeconds: -10,
    });

    await expect(
      verifySessionToken(expired, { secret: SECRET }),
    ).resolves.toBeNull();
  });

  it("a tampered payload is rejected", async () => {
    const segments = token.split(".");
    const tampered = `${segments[0]}.${segments[1]!.slice(0, -2)}XX.${segments[2]}`;

    await expect(
      verifySessionToken(tampered, { secret: SECRET }),
    ).resolves.toBeNull();
  });

  it("a missing AUTH_SECRET fails closed instead of trusting the token", async () => {
    vi.stubEnv("AUTH_SECRET", undefined);

    await expect(verifySessionToken(token)).resolves.toBeNull();
  });
});

describe("secret validation", () => {
  it("getSecretKey rejects a secret under 32 characters", () => {
    expect(() => getSecretKey("too-short")).toThrow(/at least 32 characters/);
  });

  it("signing with a short secret is refused", async () => {
    await expect(
      createSessionToken(session, { secret: "short" }),
    ).rejects.toThrow(/at least 32 characters/);
  });
});
