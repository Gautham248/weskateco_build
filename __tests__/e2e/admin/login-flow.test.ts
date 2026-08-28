import { describe, it, expect, beforeEach } from "vitest";
import { validateCredentials, createSessionToken, verifySessionToken } from "lib/admin/auth";

describe("Admin E2E Login & Session Security Flow", () => {
  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = "test-secret-key-that-is-at-least-32-characters-long-123456";
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD = "weskateco-admin-2024";
  });

  it("should fail authentication on invalid credentials", async () => {
    const valid = await validateCredentials("admin", "invalid-pass-123");
    expect(valid).toBe(false);
  });

  it("should pass authentication on valid credentials and return a signed JWT", async () => {
    const valid = await validateCredentials("admin", "weskateco-admin-2024");
    expect(valid).toBe(true);

    if (valid) {
      const token = await createSessionToken("admin");
      expect(token).toBeDefined();

      const verified = await verifySessionToken(token);
      expect(verified).toBe(true);
    }
  });
});
