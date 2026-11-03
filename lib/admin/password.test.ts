import { beforeAll, describe, expect, it } from "vitest";
import {
  hashPassword,
  MAX_PASSWORD_LENGTH,
  verifyPassword,
} from "lib/admin/password";

const PASSWORD = "correct horse battery staple";

describe("password hashing", () => {
  let hashed: string;
  let hashedAgain: string;

  // bcrypt at 12 rounds is deliberately slow, so hash once and share it.
  beforeAll(async () => {
    hashed = await hashPassword(PASSWORD);
    hashedAgain = await hashPassword(PASSWORD);
  });

  it("the hash is not the plaintext", () => {
    expect(hashed).not.toBe(PASSWORD);
  });

  it("the hash is a bcrypt digest", () => {
    expect(hashed).toMatch(/^\$2[aby]\$/);
  });

  it("MAX_PASSWORD_LENGTH matches bcrypt's 72-byte limit", () => {
    expect(MAX_PASSWORD_LENGTH).toBe(72);
  });

  it("verifyPassword accepts the correct password", async () => {
    await expect(verifyPassword(PASSWORD, hashed)).resolves.toBe(true);
  });

  it("verifyPassword rejects a wrong password", async () => {
    await expect(verifyPassword("wrong password", hashed)).resolves.toBe(false);
  });

  it("salting makes two hashes of the same password differ", () => {
    expect(hashedAgain).not.toBe(hashed);
  });

  it("both salted hashes still verify", async () => {
    await expect(verifyPassword(PASSWORD, hashed)).resolves.toBe(true);
    await expect(verifyPassword(PASSWORD, hashedAgain)).resolves.toBe(true);
  });
});
