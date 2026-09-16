import { eq, inArray, notInArray } from "drizzle-orm";
import { getDb, schema } from "lib/db";

const {
  adminUsers,
  newlyReleasedItems,
  productOverrideImages,
  productOverrides,
  shopNowItems,
} = schema;

export type AdminUserRecord = schema.AdminUser;
export type ProductOverrideRecord = schema.ProductOverride;
export type ProductOverrideImageRecord = schema.ProductOverrideImage;

export type OverrideImageInput = {
  url: string;
  altText?: string | null;
  imagekitFileId?: string | null;
  width?: number | null;
  height?: number | null;
};

export type ProductOverrideInput = {
  productHandle: string;
  shopifyProductId?: string | null;
  title?: string | null;
  descriptionHtml?: string | null;
  galleryMode?: string;
  coverImageUrl?: string | null;
  removedImageUrls?: string[];
  images: OverrideImageInput[];
  updatedBy?: string | null;
};

export type ProductOverrideWithImages = ProductOverrideRecord & {
  images: ProductOverrideImageRecord[];
};

/**
 * Deliberately not the raw Drizzle row — the storefront caches this shape, and
 * keeping it free of Date objects keeps the cache payload simple.
 */
export type NewlyReleasedItemRow = {
  productHandle: string;
  shopifyProductId: string | null;
  cardImageUrl: string | null;
  heroImageUrl: string | null;
  subtitle: string | null;
};

/**
 * Same reasoning as NewlyReleasedItemRow: no Date objects, so the storefront can
 * cache this shape directly.
 */
export type ShopNowItemRow = {
  productHandle: string;
  shopifyProductId: string | null;
  imageUrl1: string | null;
  imageUrl2: string | null;
  imageUrl3: string | null;
};

export async function getAdminUserByUsername(
  username: string,
): Promise<AdminUserRecord | undefined> {
  const db = getDb();

  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);

  return user;
}

export async function getAdminUserById(
  id: string,
): Promise<AdminUserRecord | undefined> {
  const db = getDb();

  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, id))
    .limit(1);

  return user;
}

export async function listAdminUsers(): Promise<AdminUserRecord[]> {
  const db = getDb();

  return db.select().from(adminUsers).orderBy(adminUsers.createdAt);
}

export async function createAdminUser(
  username: string,
  passwordHash: string,
): Promise<AdminUserRecord> {
  const db = getDb();

  const [user] = await db
    .insert(adminUsers)
    .values({ username, passwordHash })
    .returning();

  if (!user) {
    throw new Error("Failed to create an admin user.");
  }

  return user;
}

export async function updateAdminUserPassword(
  id: string,
  passwordHash: string,
): Promise<void> {
  const db = getDb();

  await db
    .update(adminUsers)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(adminUsers.id, id));
}

export async function getOverrideByHandle(
  productHandle: string,
): Promise<ProductOverrideWithImages | undefined> {
  const db = getDb();

  const [override] = await db
    .select()
    .from(productOverrides)
    .where(eq(productOverrides.productHandle, productHandle))
    .limit(1);

  if (!override) {
    return undefined;
  }

  const images = await db
    .select()
    .from(productOverrideImages)
    .where(eq(productOverrideImages.overrideId, override.id))
    .orderBy(productOverrideImages.position);

  return { ...override, images };
}

export async function listOverridesForHandles(
  handles: string[],
): Promise<ProductOverrideWithImages[]> {
  if (handles.length === 0) {
    return [];
  }

  const db = getDb();

  const overrides = await db
    .select()
    .from(productOverrides)
    .where(inArray(productOverrides.productHandle, handles));

  if (overrides.length === 0) {
    return [];
  }

  const images = await db
    .select()
    .from(productOverrideImages)
    .where(
      inArray(
        productOverrideImages.overrideId,
        overrides.map((override) => override.id),
      ),
    )
    .orderBy(productOverrideImages.position);

  const imagesByOverride = new Map<string, ProductOverrideImageRecord[]>();

  for (const image of images) {
    const existing = imagesByOverride.get(image.overrideId);

    if (existing) {
      existing.push(image);
    } else {
      imagesByOverride.set(image.overrideId, [image]);
    }
  }

  return overrides.map((override) => ({
    ...override,
    images: imagesByOverride.get(override.id) ?? [],
  }));
}

/**
 * The neon-http driver does not support interactive transactions, so these three
 * statements run sequentially. If the image insert fails after the delete, the
 * override keeps its title/description with no images — re-saving from the admin
 * panel restores a consistent state. Acceptable for a single-editor tool; revisit
 * if concurrent editing is ever introduced.
 */
export async function saveProductOverride(
  input: ProductOverrideInput,
): Promise<ProductOverrideRecord> {
  const db = getDb();

  const [override] = await db
    .insert(productOverrides)
    .values({
      productHandle: input.productHandle,
      shopifyProductId: input.shopifyProductId ?? null,
      title: input.title ?? null,
      descriptionHtml: input.descriptionHtml ?? null,
      galleryMode: input.galleryMode ?? "append",
      coverImageUrl: input.coverImageUrl ?? null,
      removedImageUrls: input.removedImageUrls ?? [],
      updatedBy: input.updatedBy ?? null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: productOverrides.productHandle,
      set: {
        shopifyProductId: input.shopifyProductId ?? null,
        title: input.title ?? null,
        descriptionHtml: input.descriptionHtml ?? null,
        galleryMode: input.galleryMode ?? "append",
        coverImageUrl: input.coverImageUrl ?? null,
        removedImageUrls: input.removedImageUrls ?? [],
        updatedBy: input.updatedBy ?? null,
        updatedAt: new Date(),
      },
    })
    .returning();

  if (!override) {
    throw new Error("Failed to save the product override.");
  }

  await db
    .delete(productOverrideImages)
    .where(eq(productOverrideImages.overrideId, override.id));

  if (input.images.length > 0) {
    await db.insert(productOverrideImages).values(
      input.images.map((image, index) => ({
        overrideId: override.id,
        url: image.url,
        altText: image.altText ?? null,
        imagekitFileId: image.imagekitFileId ?? null,
        width: image.width ?? null,
        height: image.height ?? null,
        position: index,
      })),
    );
  }

  return override;
}

export async function deleteProductOverride(
  productHandle: string,
): Promise<boolean> {
  const db = getDb();

  const deleted = await db
    .delete(productOverrides)
    .where(eq(productOverrides.productHandle, productHandle))
    .returning({ id: productOverrides.id });

  return deleted.length > 0;
}

export async function listNewlyReleasedItems(): Promise<
  NewlyReleasedItemRow[]
> {
  const db = getDb();

  return db
    .select({
      productHandle: newlyReleasedItems.productHandle,
      shopifyProductId: newlyReleasedItems.shopifyProductId,
      cardImageUrl: newlyReleasedItems.cardImageUrl,
      heroImageUrl: newlyReleasedItems.heroImageUrl,
      subtitle: newlyReleasedItems.subtitle,
    })
    .from(newlyReleasedItems)
    .orderBy(newlyReleasedItems.position);
}

/**
 * Replaces the whole curated list.
 *
 * Upsert-then-prune rather than delete-then-insert: neon-http has no
 * transactions, and this way a failure part-way through leaves a superset of
 * correct rows (at worst one stale entry) instead of an empty carousel.
 */
export async function saveNewlyReleasedItems(
  items: NewlyReleasedItemRow[],
  updatedBy?: string | null,
): Promise<void> {
  const db = getDb();

  if (items.length === 0) {
    await db.delete(newlyReleasedItems);
    return;
  }

  for (const [index, item] of items.entries()) {
    await db
      .insert(newlyReleasedItems)
      .values({
        productHandle: item.productHandle,
        shopifyProductId: item.shopifyProductId ?? null,
        cardImageUrl: item.cardImageUrl ?? null,
        heroImageUrl: item.heroImageUrl ?? null,
        subtitle: item.subtitle ?? null,
        position: index,
        updatedBy: updatedBy ?? null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: newlyReleasedItems.productHandle,
        set: {
          shopifyProductId: item.shopifyProductId ?? null,
          cardImageUrl: item.cardImageUrl ?? null,
          heroImageUrl: item.heroImageUrl ?? null,
          subtitle: item.subtitle ?? null,
          position: index,
          updatedBy: updatedBy ?? null,
          updatedAt: new Date(),
        },
      });
  }

  await db.delete(newlyReleasedItems).where(
    notInArray(
      newlyReleasedItems.productHandle,
      items.map((item) => item.productHandle),
    ),
  );
}

export async function listShopNowItems(): Promise<ShopNowItemRow[]> {
  const db = getDb();

  return db
    .select({
      productHandle: shopNowItems.productHandle,
      shopifyProductId: shopNowItems.shopifyProductId,
      imageUrl1: shopNowItems.imageUrl1,
      imageUrl2: shopNowItems.imageUrl2,
      imageUrl3: shopNowItems.imageUrl3,
    })
    .from(shopNowItems)
    .orderBy(shopNowItems.position);
}

/**
 * Replaces the whole curated list. Upsert-then-prune for the same reason as the
 * newly released list: neon-http has no transactions, so a failure part-way
 * through leaves a superset of correct rows instead of an empty row.
 */
export async function saveShopNowItems(
  items: ShopNowItemRow[],
  updatedBy?: string | null,
): Promise<void> {
  const db = getDb();

  if (items.length === 0) {
    await db.delete(shopNowItems);
    return;
  }

  for (const [index, item] of items.entries()) {
    await db
      .insert(shopNowItems)
      .values({
        productHandle: item.productHandle,
        shopifyProductId: item.shopifyProductId ?? null,
        imageUrl1: item.imageUrl1 ?? null,
        imageUrl2: item.imageUrl2 ?? null,
        imageUrl3: item.imageUrl3 ?? null,
        position: index,
        updatedBy: updatedBy ?? null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: shopNowItems.productHandle,
        set: {
          shopifyProductId: item.shopifyProductId ?? null,
          imageUrl1: item.imageUrl1 ?? null,
          imageUrl2: item.imageUrl2 ?? null,
          imageUrl3: item.imageUrl3 ?? null,
          position: index,
          updatedBy: updatedBy ?? null,
          updatedAt: new Date(),
        },
      });
  }

  await db.delete(shopNowItems).where(
    notInArray(
      shopNowItems.productHandle,
      items.map((item) => item.productHandle),
    ),
  );
}
