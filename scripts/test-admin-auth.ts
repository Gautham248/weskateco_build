import {
  hashPassword,
  MAX_PASSWORD_LENGTH,
  verifyPassword,
} from "lib/admin/password";
import {
  createSessionToken,
  getSecretKey,
  verifySessionToken,
} from "lib/admin/session";
import { SignJWT } from "jose";

const SECRET = "a".repeat(48);
const OTHER_SECRET = "b".repeat(48);
const PASSWORD = "correct horse battery staple";

let passed = 0;
const failures: string[] = [];

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    passed += 1;
    console.log(`  ok  ${name}`);
    return;
  }

  failures.push(detail ? `${name} — ${detail}` : name);
  console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

function equal(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  check(name, a === e, `expected ${e}, got ${a}`);
}

async function main() {
  console.log("\npassword hashing");

  const hashed = await hashPassword(PASSWORD);

  check("the hash is not the plaintext", hashed !== PASSWORD);
  check("the hash is a bcrypt digest", /^\$2[aby]\$/.test(hashed));
  equal(
    "MAX_PASSWORD_LENGTH matches bcrypt's 72-byte limit",
    MAX_PASSWORD_LENGTH,
    72,
  );
  check(
    "verifyPassword accepts the correct password",
    await verifyPassword(PASSWORD, hashed),
  );
  check(
    "verifyPassword rejects a wrong password",
    !(await verifyPassword("wrong password", hashed)),
  );

  const hashedAgain = await hashPassword(PASSWORD);

  check(
    "salting makes two hashes of the same password differ",
    hashed !== hashedAgain,
  );
  check(
    "both salted hashes still verify",
    (await verifyPassword(PASSWORD, hashed)) &&
      (await verifyPassword(PASSWORD, hashedAgain)),
  );

  console.log("\nsession tokens");

  const session = { userId: "user-1", username: "gautham", sessionVersion: 3 };
  const token = await createSessionToken(session, { secret: SECRET });

  equal(
    "a token round-trips back to its session, session version included",
    await verifySessionToken(token, { secret: SECRET }),
    session,
  );

  const legacySecretKey = new TextEncoder().encode(SECRET);
  const issuedAt = Math.floor(Date.now() / 1000);
  const legacyToken = await new SignJWT({ username: "gautham" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("user-1")
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + 60)
    .sign(legacySecretKey);

  check(
    "a token with no session version is refused, so pre-version sessions cannot outlive a password change",
    (await verifySessionToken(legacyToken, { secret: SECRET })) === null,
  );
  check(
    "a token signed with a different secret is rejected",
    (await verifySessionToken(token, { secret: OTHER_SECRET })) === null,
  );
  check(
    "a non-JWT string is rejected",
    (await verifySessionToken("definitely-not-a-jwt", { secret: SECRET })) ===
      null,
  );
  check(
    "an empty string is rejected",
    (await verifySessionToken("", { secret: SECRET })) === null,
  );

  const expired = await createSessionToken(session, {
    secret: SECRET,
    expiresInSeconds: -10,
  });

  check(
    "an expired token is rejected",
    (await verifySessionToken(expired, { secret: SECRET })) === null,
  );

  const segments = token.split(".");
  const tampered = `${segments[0]}.${segments[1]!.slice(0, -2)}XX.${segments[2]}`;

  check(
    "a tampered payload is rejected",
    (await verifySessionToken(tampered, { secret: SECRET })) === null,
  );

  const originalSecret = process.env.AUTH_SECRET;
  delete process.env.AUTH_SECRET;

  check(
    "a missing AUTH_SECRET fails closed instead of trusting the token",
    (await verifySessionToken(token)) === null,
  );

  if (originalSecret !== undefined) {
    process.env.AUTH_SECRET = originalSecret;
  }

  console.log("\nsecret validation");

  let getSecretKeyThrew = false;
  try {
    getSecretKey("too-short");
  } catch {
    getSecretKeyThrew = true;
  }
  check("getSecretKey rejects a secret under 32 characters", getSecretKeyThrew);

  let signThrew = false;
  try {
    await createSessionToken(session, { secret: "short" });
  } catch {
    signThrew = true;
  }
  check("signing with a short secret is refused", signThrew);

  console.log("");

  if (failures.length > 0) {
    console.error(`${failures.length} failed, ${passed} passed`);
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }

  console.log(`${passed} assertions passed`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
