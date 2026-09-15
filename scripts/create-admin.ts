import { config } from "dotenv";
import { hashPassword, MAX_PASSWORD_LENGTH } from "lib/admin/password";
import { createAdminUser, getAdminUserByUsername } from "lib/admin/queries";

config({ path: ".env" });

const MIN_PASSWORD_LENGTH = 8;

async function main() {
  const [username, password] = process.argv.slice(2);

  if (!username || !password) {
    console.error(
      "Usage: npx tsx scripts/create-admin.ts <username> <password>",
    );
    process.exit(1);
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    console.error(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    );
    process.exit(1);
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    console.error(
      `Password must be at most ${MAX_PASSWORD_LENGTH} characters (bcrypt truncates beyond that).`,
    );
    process.exit(1);
  }

  const existing = await getAdminUserByUsername(username);

  if (existing) {
    console.error(`An admin named "${username}" already exists.`);
    process.exit(1);
  }

  const user = await createAdminUser(username, await hashPassword(password));

  console.log(`Created admin "${user.username}" (${user.id}).`);
}

main().catch((error) => {
  console.error("Could not create the admin user:", error);
  process.exit(1);
});
