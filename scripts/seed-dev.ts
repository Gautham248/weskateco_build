import { hashPassword } from "lib/admin/password";
import { createDb } from "lib/db";
import {
  adminUsers,
  HERO_SETTINGS_ID,
  heroItems,
  heroSettings,
  newlyReleasedItems,
  productOverrides,
  shopNowItems,
  socialPosts,
} from "lib/db/schema";
import { requireLocalDevDatabase, truncateAll } from "./local-db";

/**
 * Fills the local development database with a known starting state, so the
 * storefront renders every admin-managed section instead of its fallbacks.
 *
 * Offline and deterministic: nothing is fetched, and every run first empties
 * the tables, so `pnpm db:seed` always lands on exactly this data. Product
 * handles come from scripts/product-catalog-dump.json; the storefront reads
 * those products live from Shopify, and rows whose image URLs are null use
 * the product's own Shopify photos.
 *
 * Refuses to run unless DATABASE_URL is the local dev database. The test
 * database is never seeded: the e2e suite runs against it empty.
 */

/** Test login for the local admin panel at /admin. Local database only. */
export const DEV_ADMIN = {
  username: "dev-admin",
  password: "dev-admin-password",
} as const;

const NEWLY_RELEASED_HANDLES = [
  "wasted-angels-x-sphere-pro-deck",
  "sphere-lovers-deck",
];

const SHOP_NOW_HANDLES = [
  "bubblegum-sphere-skateboard-complete-left",
  "fish-tale-surfskate-blue",
  "toucan-tropical-wheels",
  "double-hollow-skateboard-trucks",
  "ceramic-ball-skate-bearings-toucan",
  "skateboard-griptape-sphere",
  "twisted-human-deck",
  "beginner-skateboard-canadian-maple-wood-complete",
];

/** Product whose description is overridden, to show the override layer. */
const OVERRIDDEN_HANDLE = "sphere-red-white-grafitti-mode";

async function main() {
  const url = requireLocalDevDatabase();
  const db = createDb(url);

  await truncateAll(url);

  const [admin] = await db
    .insert(adminUsers)
    .values({
      username: DEV_ADMIN.username,
      passwordHash: await hashPassword(DEV_ADMIN.password),
    })
    .returning({ id: adminUsers.id });
  const updatedBy = admin!.id;

  await db
    .insert(heroSettings)
    .values({ id: HERO_SETTINGS_ID, defaultSeconds: 6, updatedBy });

  await db.insert(heroItems).values([
    {
      id: "hero_dev_1",
      position: 0,
      kind: "image",
      url: "/hero/cover_vid.gif",
      altText: "Skaters riding WeSkateCo boards",
      updatedBy,
    },
    {
      id: "hero_dev_2",
      position: 1,
      kind: "image",
      url: "/hero/hero_skate.gif",
      altText: "A skater carving on a WeSkateCo complete",
      seconds: 4,
      updatedBy,
    },
  ]);

  await db.insert(newlyReleasedItems).values(
    NEWLY_RELEASED_HANDLES.map((productHandle, position) => ({
      position,
      productHandle,
      subtitle: position === 0 ? "Dev seed: limited collab" : null,
      updatedBy,
    })),
  );

  await db.insert(shopNowItems).values(
    SHOP_NOW_HANDLES.map((productHandle, position) => ({
      position,
      productHandle,
      updatedBy,
    })),
  );

  await db.insert(socialPosts).values(
    (
      [
        ["instagram", false],
        ["instagram", true],
        ["youtube", false],
        ["tiktok", true],
      ] as const
    ).map(([platform, isReel], position) => ({
      id: `sop_dev_${position + 1}`,
      position,
      imageUrl:
        position % 2 === 0 ? "/hero/hero_skate.gif" : "/icons/weskate-logo.png",
      altText: `Dev seed ${platform} post ${position + 1}`,
      permalink: "https://instagram.com/weskateco",
      platform,
      isReel,
      updatedBy,
    })),
  );

  await db.insert(productOverrides).values({
    productHandle: OVERRIDDEN_HANDLE,
    descriptionHtml:
      "<p><strong>Dev seed override.</strong> This description comes from the " +
      "local database, not Shopify.</p>",
    updatedBy,
  });

  console.log("Seeded the local database:");
  console.log(
    `  admin user        ${DEV_ADMIN.username} (password in scripts/seed-dev.ts)`,
  );
  console.log("  hero              2 slides");
  console.log(`  newly released    ${NEWLY_RELEASED_HANDLES.length} products`);
  console.log(`  shop now          ${SHOP_NOW_HANDLES.length} products`);
  console.log("  social posts      4");
  console.log(`  product override  ${OVERRIDDEN_HANDLE}`);
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
