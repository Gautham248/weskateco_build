import { compare, hash } from "bcryptjs";

export const BCRYPT_ROUNDS = 12;

/**
 * bcrypt silently truncates input beyond 72 bytes, so anything longer adds no
 * security while making the stored hash look stronger than it is.
 */
export const MAX_PASSWORD_LENGTH = 72;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return compare(password, passwordHash);
}
