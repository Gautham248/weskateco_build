import { describe, it, expect, beforeEach } from "vitest";
import { createSessionToken, verifySessionToken, validateCredentials } from "lib/admin/auth";

describe("Admin Authentication Service (lib/admin/auth.ts)", () => {
  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = "test-secret-key-that-is-at-least-32-characters-long-123456";
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD = "weskateco-admin-2024";
  });

  it("should create a valid JWT session token", async () => {
    const token = await createSessionToken("admin");
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);
  });

  it("should verify a valid JWT session token", async () => {
    const token = await createSessionToken("admin");
    const valid = await verifySessionToken(token);
    expect(valid).toBe(true);
  });

  it("should reject an invalid or tampered JWT token", async () => {
    const invalid = await verifySessionToken("invalid-token-string");
    expect(invalid).toBe(false);
  });

  it("should validate credentials using plain-text ADMIN_PASSWORD fallback", async () => {
    const valid = await validateCredentials("admin", "weskateco-admin-2024");
    expect(valid).toBe(true);
  });

  it("should reject invalid username or password", async () => {
    const invalidUser = await validateCredentials("wronguser", "weskateco-admin-2024");
    expect(invalidUser).toBe(false);

    const invalidPass = await validateCredentials("admin", "wrongpassword");
    expect(invalidPass).toBe(false);
  });
});
