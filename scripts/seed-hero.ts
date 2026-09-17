import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { toFile } from "@imagekit/nodejs";
import { getImageKitClient } from "lib/admin/imagekit";
import {
  getHeroSettings,
  listHeroItems,
  saveHeroConfig,
  type HeroItemRow,
} from "lib/admin/queries";
import { newHeroItemId, resolveSeconds } from "lib/catalog/hero";

config({ path: ".env" });

/**
 * One-off rollout seed: puts the GIF the hero used to hardcode in as the first
 * managed slide, so shipping the admin tab changes nothing visually.
 *
 * The asset is uploaded to ImageKit when the credentials are configured, so the
 * homepage serves it from that CDN rather than 5MB from this origin. Without
 * credentials it falls back to the copy in public/, which is also exactly what the
 * storefront falls back to when the config cannot be read at all.
 */

const GIF_PATH = path.join("public", "hero", "cover_vid.gif");
const FALLBACK_URL = "/hero/cover_vid.gif";
const UPLOAD_FOLDER = "/weskateco/hero";

async function uploadToImageKit(): Promise<string | null> {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    console.log("IMAGEKIT_PRIVATE_KEY is not set; using the local asset path.");
    return null;
  }

  if (!fs.existsSync(GIF_PATH)) {
    console.error(
      `${GIF_PATH} is missing; using the local asset path instead.`,
    );
    return null;
  }

  try {
    const uploaded = await getImageKitClient().files.upload({
      file: await toFile(fs.readFileSync(GIF_PATH), "cover_vid.gif", {
        type: "image/gif",
      }),
      fileName: "cover_vid.gif",
      folder: UPLOAD_FOLDER,
      useUniqueFileName: true,
    });

    if (!uploaded.url) {
      throw new Error("ImageKit returned no url.");
    }

    return uploaded.url;
  } catch (error) {
    console.error("ImageKit upload failed; using the local asset path:", error);
    return null;
  }
}

async function main() {
  const existing = await listHeroItems();

  // saveHeroConfig replaces the whole list, so re-running this after the hero has
  // been curated in the admin panel would throw that work away.
  if (existing.length > 0 && !process.argv.includes("--force")) {
    console.error(
      `The hero already has ${existing.length} slide(s). Nothing was changed.`,
    );
    console.error(
      "Re-run with --force if you really want to replace them with the seeded GIF.",
    );
    process.exit(1);
  }

  const url = (await uploadToImageKit()) ?? FALLBACK_URL;
  const existingDefault = await getHeroSettings();
  const defaultSeconds = resolveSeconds(null, existingDefault);

  const items: HeroItemRow[] = [
    {
      id: newHeroItemId(),
      kind: "image",
      url,
      altText: "WeSkate Co",
      posterUrl: null,
      seconds: null,
    },
  ];

  await saveHeroConfig(items, defaultSeconds);

  console.log("Seeded 1 hero slide:");
  console.log(`  1. image  ${url}`);
  console.log(`     default duration: ${defaultSeconds}s`);

  if (url === FALLBACK_URL) {
    console.log(
      "\nNote: that is the local public/ asset, about 5MB. Upload it from the Hero",
    );
    console.log(
      "tab (or replace it with a real video) to get it off the homepage's critical path.",
    );
  }
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
