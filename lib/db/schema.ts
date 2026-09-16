import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const productOverrides = pgTable("product_overrides", {
  id: uuid("id").primaryKey().defaultRandom(),
  productHandle: text("product_handle").notNull().unique(),
  shopifyProductId: text("shopify_product_id"),
  title: text("title"),
  descriptionHtml: text("description_html"),
  galleryMode: text("gallery_mode").notNull().default("append"),
  coverImageUrl: text("cover_image_url"),
  removedImageUrls: jsonb("removed_image_urls")
    .$type<string[]>()
    .notNull()
    .default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedBy: uuid("updated_by").references(() => adminUsers.id, {
    onDelete: "set null",
  }),
});

export const productOverrideImages = pgTable(
  "product_override_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    overrideId: uuid("override_id")
      .notNull()
      .references(() => productOverrides.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    altText: text("alt_text"),
    imagekitFileId: text("imagekit_file_id"),
    width: integer("width"),
    height: integer("height"),
    position: integer("position").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("product_override_images_override_id_idx").on(table.overrideId),
  ],
);

/**
 * Curated, ordered list behind the homepage "NEWLY RELEASED" carousel. Each row
 * points at a Shopify product; the storefront reads the product live, so this
 * table only stores curation (order) and presentation (which two photos to use).
 */
export const newlyReleasedItems = pgTable(
  "newly_released_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    position: integer("position").notNull(),
    productHandle: text("product_handle").notNull().unique(),
    shopifyProductId: text("shopify_product_id"),
    cardImageUrl: text("card_image_url"),
    heroImageUrl: text("hero_image_url"),
    subtitle: text("subtitle"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedBy: uuid("updated_by").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
  },
  (table) => [index("newly_released_items_position_idx").on(table.position)],
);

/**
 * Curated, ordered list behind the homepage "SHOP NOW" row. Same contract as
 * the newly released carousel: the row stores curation (order) and which three
 * photos to slide through, and the storefront reads the live Shopify product.
 */
export const shopNowItems = pgTable(
  "shop_now_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    position: integer("position").notNull(),
    productHandle: text("product_handle").notNull().unique(),
    shopifyProductId: text("shopify_product_id"),
    imageUrl1: text("image_url_1"),
    imageUrl2: text("image_url_2"),
    imageUrl3: text("image_url_3"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedBy: uuid("updated_by").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
  },
  (table) => [index("shop_now_items_position_idx").on(table.position)],
);

export const productOverridesRelations = relations(
  productOverrides,
  ({ many, one }) => ({
    images: many(productOverrideImages),
    updatedByUser: one(adminUsers, {
      fields: [productOverrides.updatedBy],
      references: [adminUsers.id],
    }),
  }),
);

export const productOverrideImagesRelations = relations(
  productOverrideImages,
  ({ one }) => ({
    override: one(productOverrides, {
      fields: [productOverrideImages.overrideId],
      references: [productOverrides.id],
    }),
  }),
);

export const newlyReleasedItemsRelations = relations(
  newlyReleasedItems,
  ({ one }) => ({
    updatedByUser: one(adminUsers, {
      fields: [newlyReleasedItems.updatedBy],
      references: [adminUsers.id],
    }),
  }),
);

export const shopNowItemsRelations = relations(shopNowItems, ({ one }) => ({
  updatedByUser: one(adminUsers, {
    fields: [shopNowItems.updatedBy],
    references: [adminUsers.id],
  }),
}));

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
export type ProductOverride = typeof productOverrides.$inferSelect;
export type NewProductOverride = typeof productOverrides.$inferInsert;
export type ProductOverrideImage = typeof productOverrideImages.$inferSelect;
export type NewProductOverrideImage = typeof productOverrideImages.$inferInsert;
export type NewlyReleasedItem = typeof newlyReleasedItems.$inferSelect;
export type NewNewlyReleasedItem = typeof newlyReleasedItems.$inferInsert;
export type ShopNowItem = typeof shopNowItems.$inferSelect;
export type NewShopNowItem = typeof shopNowItems.$inferInsert;
