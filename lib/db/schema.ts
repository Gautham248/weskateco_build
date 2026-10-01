import { relations } from "drizzle-orm";
import {
  boolean,
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
  /**
   * Bumped whenever the password changes, and carried inside the session token. A
   * token whose version is behind the row is refused, so changing a password signs
   * other devices out without needing a session table.
   */
  sessionVersion: integer("session_version").notNull().default(1),
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

/**
 * Ordered media behind the homepage hero, managed from the admin panel.
 *
 * Unlike the curated product rows this has no natural key, so the admin client
 * generates `id` and saves upsert on it. That keeps the same superset-on-failure
 * property the curated saves rely on. The column is `text` rather than `uuid`
 * because the id is produced by our own helper (lib/catalog/hero.ts) instead of
 * crypto.randomUUID(), which would require a secure context.
 *
 * `seconds` is null when the item should fall back to the hero default;
 * `poster_url` only applies to videos.
 */
export const heroItems = pgTable(
  "hero_items",
  {
    id: text("id").primaryKey(),
    position: integer("position").notNull(),
    kind: text("kind").notNull(),
    url: text("url").notNull(),
    altText: text("alt_text"),
    posterUrl: text("poster_url"),
    seconds: integer("seconds"),
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
  (table) => [index("hero_items_position_idx").on(table.position)],
);

/**
 * Single-row settings table for the hero. The fixed primary key is what makes it
 * a singleton, so no extra constraint is needed to enforce one row.
 */
export const heroSettings = pgTable("hero_settings", {
  id: text("id").primaryKey(),
  defaultSeconds: integer("default_seconds").notNull(),
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

/** The one and only row in `hero_settings`. */
export const HERO_SETTINGS_ID = "default";

/**
 * Ordered Instagram posts behind the storefront's community strip, managed from
 * the admin panel.
 *
 * The strip used to render five PNG screenshots committed to the repository, so
 * it could only ever show whatever was current at the last push. These rows hold
 * the curated image and its permalink; nothing is written back to Instagram.
 *
 * Like `hero_items` this has no natural key, so the admin client generates `id`
 * and saves with an upsert on it. The column is `text` rather than `uuid`
 * because the id comes from our own helper (lib/catalog/social-posts.ts) instead
 * of crypto.randomUUID(), which would require a secure context.
 */
export const socialPosts = pgTable(
  "social_posts",
  {
    id: text("id").primaryKey(),
    position: integer("position").notNull(),
    /** The uploaded or site-relative image shown on the card. */
    imageUrl: text("image_url").notNull(),
    altText: text("alt_text"),
    /** Where the card links to. Absolute https URL on the chosen platform. */
    permalink: text("permalink"),
    /**
     * Which network the post lives on. Free text rather than a Postgres enum so
     * adding a platform is a code change in lib/catalog/social-posts.ts, not a
     * migration. Unknown values fall back to Instagram at render time.
     */
    platform: text("platform").notNull().default("instagram"),
    /** Reels are a real format on Instagram and TikTok. Affects the button verb. */
    isReel: boolean("is_reel").notNull().default(false),
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
  (table) => [index("social_posts_position_idx").on(table.position)],
);

/**
 * Enquiries submitted through the public /contact form.
 *
 * Append-only: a row is written once and never edited, so there is no
 * `updatedAt` to keep honest. `answers` holds the reason-specific qualifying
 * questions, which differ per reason and so cannot be columns.
 *
 * `enquiryId` is the human-facing reference the customer is shown and may quote
 * back to us; `id` is the real primary key. It is not unique-constrained yet —
 * see docs/contact-enquiry-flow-decisions.md for the collision risk that leaves
 * open. `meta` records where the submission came from.
 */
export const contactEnquiries = pgTable(
  "contact_enquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Unique, not merely indexed: the customer is told this reference identifies
    // their enquiry, and support relies on that when they quote it back. Safe to
    // enforce because the generator draws from 31^6 values rather than 9,000.
    enquiryId: text("enquiry_id").notNull().unique(),
    reason: text("reason").notNull(),
    reasonLabel: text("reason_label").notNull(),
    routedTo: text("routed_to").notNull(),
    responseSla: text("response_sla").notNull(),
    answers: jsonb("answers").$type<Record<string, unknown>>().notNull(),
    consent: boolean("consent").notNull(),
    meta: jsonb("meta").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("contact_enquiries_created_at_idx").on(table.createdAt)],
);

/**
 * Fixed-window rate-limit buckets for the public endpoints.
 *
 * `key` is a hash of the caller identifier rather than the identifier itself, so
 * this table holds no raw IP addresses. Rows are disposable: `window_started_at`
 * is only ever compared against the current window, and stale rows are pruned
 * when a fresh window opens.
 */
export const rateLimitCounters = pgTable("rate_limit_counters", {
  key: text("key").primaryKey(),
  windowStartedAt: timestamp("window_started_at", {
    withTimezone: true,
  }).notNull(),
  hits: integer("hits").notNull(),
});

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

export const heroItemsRelations = relations(heroItems, ({ one }) => ({
  updatedByUser: one(adminUsers, {
    fields: [heroItems.updatedBy],
    references: [adminUsers.id],
  }),
}));

export const heroSettingsRelations = relations(heroSettings, ({ one }) => ({
  updatedByUser: one(adminUsers, {
    fields: [heroSettings.updatedBy],
    references: [adminUsers.id],
  }),
}));

export const socialPostsRelations = relations(socialPosts, ({ one }) => ({
  updatedByUser: one(adminUsers, {
    fields: [socialPosts.updatedBy],
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
export type HeroItem = typeof heroItems.$inferSelect;
export type NewHeroItem = typeof heroItems.$inferInsert;
export type HeroSettings = typeof heroSettings.$inferSelect;
export type NewHeroSettings = typeof heroSettings.$inferInsert;
export type SocialPost = typeof socialPosts.$inferSelect;
export type NewSocialPost = typeof socialPosts.$inferInsert;
export type ContactEnquiry = typeof contactEnquiries.$inferSelect;
export type NewContactEnquiry = typeof contactEnquiries.$inferInsert;
export type RateLimitCounter = typeof rateLimitCounters.$inferSelect;
