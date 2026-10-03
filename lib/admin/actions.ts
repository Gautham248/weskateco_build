"use server";

import {
  clearSessionCookie,
  createSessionToken,
  hashPassword,
  MAX_PASSWORD_LENGTH,
  requireAdmin,
  setSessionCookie,
  verifyPassword,
  type AdminSession,
} from "lib/admin/auth";
import { probeMediaUrl } from "lib/admin/media-probe";
import {
  createAdminUser,
  deleteProductOverride,
  getAdminUserByUsername,
  listHeroItems,
  listSocialPosts,
  saveHeroConfig,
  saveNewlyReleasedItems,
  saveProductOverride,
  saveShopNowItems,
  saveSocialPosts,
  updateAdminUserPassword,
} from "lib/admin/queries";
import {
  HERO_MAX_SECONDS,
  HERO_MIN_SECONDS,
  isAllowedHeroUrl,
} from "lib/catalog/hero";
import {
  isAllowedPermalink,
  isAllowedPostImageUrl,
  MAX_SOCIAL_POSTS,
  normalizePlatform,
  SOCIAL_PLATFORMS,
} from "lib/catalog/social-posts";
import { TAGS } from "lib/constants";
import { getProduct } from "lib/shopify";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type ActionState = { error?: string; success?: string } | null;

/**
 * The social-post save reports warnings alongside the outcome, for the same
 * reason saveHeroAction does: a permalink that could not be verified is worth
 * surfacing without refusing the save.
 */
export type SocialPostsActionState = {
  error?: string;
  success?: string;
  warnings?: string[];
} | null;

/**
 * The hero save reports probe warnings alongside the outcome, so unlike
 * ActionState it carries a list of things that were allowed but worth knowing.
 */
export type HeroActionState = {
  error?: string;
  success?: string;
  warnings?: string[];
} | null;

export type ProductPhotoOption = {
  url: string;
  altText: string;
};

const absoluteUrl = z.string().refine(
  (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Must be an absolute URL." },
);

/** The admin form sends "" for "no choice"; store that as null. */
const optionalAbsoluteUrl = z.preprocess(
  (value) => (value === "" ? null : value),
  absoluteUrl.nullish(),
);

const loginSchema = z.object({
  username: z.string().trim().min(1, "Enter a username."),
  password: z.string().min(1, "Enter a password."),
});

const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(MAX_PASSWORD_LENGTH, `Use at most ${MAX_PASSWORD_LENGTH} characters.`);

const overrideSchema = z.object({
  productHandle: z.string().trim().min(1),
  shopifyProductId: z.string().nullish(),
  title: z.string().nullish(),
  descriptionHtml: z.string().nullish(),
  galleryMode: z.enum(["append", "replace"]).default("append"),
  coverImageUrl: absoluteUrl.nullish(),
  removedImageUrls: z.array(absoluteUrl).default([]),
  images: z
    .array(
      z.object({
        url: absoluteUrl,
        altText: z.string().nullish(),
        imagekitFileId: z.string().nullish(),
        width: z.number().int().positive().nullish(),
        height: z.number().int().positive().nullish(),
      }),
    )
    .default([]),
});

const newlyReleasedSchema = z.object({
  items: z
    .array(
      z.object({
        productHandle: z.string().trim().min(1),
        shopifyProductId: z.string().nullish(),
        cardImageUrl: optionalAbsoluteUrl,
        heroImageUrl: optionalAbsoluteUrl,
        subtitle: z.string().nullish(),
      }),
    )
    .max(200, "That is more products than one carousel can hold."),
});

/**
 * No upper bound on purpose: this row is a scroll track rather than a fixed-size
 * carousel, so there is no number of products that genuinely "cannot fit".
 */
const shopNowSchema = z.object({
  items: z.array(
    z.object({
      productHandle: z.string().trim().min(1),
      shopifyProductId: z.string().nullish(),
      imageUrl1: optionalAbsoluteUrl,
      imageUrl2: optionalAbsoluteUrl,
      imageUrl3: optionalAbsoluteUrl,
    }),
  ),
});

/**
 * The permalink is deliberately not `absoluteUrl`: it is validated further down
 * (https-only, any host), which gives a more useful message than "must be an
 * absolute URL" would.
 */
const socialPostsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().trim().min(1),
        imageUrl: z.string().trim().min(1, "Upload an image or enter a URL."),
        altText: z.string().nullish(),
        permalink: z.string().nullish(),
        // Narrowed against the known set rather than passed through: the column
        // is free text so platforms can be added without a migration, which
        // means the write path is the only place a typo can be caught.
        platform: z
          .string()
          .trim()
          .transform(normalizePlatform)
          .catch("instagram"),
        isReel: z.boolean().default(false),
      }),
    )
    .max(
      MAX_SOCIAL_POSTS,
      `The strip holds at most ${MAX_SOCIAL_POSTS} posts.`,
    ),
});

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Enter both a username and a password." };
  }

  let session: AdminSession | null = null;

  try {
    const user = await getAdminUserByUsername(parsed.data.username);

    if (
      user &&
      (await verifyPassword(parsed.data.password, user.passwordHash))
    ) {
      session = {
        userId: user.id,
        username: user.username,
        sessionVersion: user.sessionVersion,
      };
    }
  } catch (error) {
    console.error("Admin login could not reach the database:", error);
    return { error: "Could not reach the database. Try again in a moment." };
  }

  if (!session) {
    return { error: "Invalid username or password." };
  }

  await setSessionCookie(await createSessionToken(session));
  redirect("/admin/products");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function changePasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdmin();

  const currentPassword = z
    .string()
    .min(1)
    .safeParse(formData.get("currentPassword"));
  const nextPassword = passwordSchema.safeParse(formData.get("newPassword"));

  if (!currentPassword.success || !nextPassword.success) {
    return {
      error:
        nextPassword.error?.issues[0]?.message ??
        "Enter your current and new password.",
    };
  }

  const user = await getAdminUserByUsername(session.username);

  if (
    !user ||
    !(await verifyPassword(currentPassword.data, user.passwordHash))
  ) {
    return { error: "Your current password is incorrect." };
  }

  const sessionVersion = await updateAdminUserPassword(
    user.id,
    await hashPassword(nextPassword.data),
  );

  // `undefined` means the update matched no row — the account was deleted between the
  // read above and here. Reporting success would tell the admin their password changed
  // when nothing did, and the stale session would outlive the account.
  if (sessionVersion === undefined) {
    return {
      error: "That account no longer exists, so the password was not changed.",
    };
  }

  // Rotate this device's session to the new version. The bump is what signs out every
  // other device; without re-issuing here it would sign out this one too, and the admin
  // would be bounced to the login screen straight after being told the change succeeded.
  await setSessionCookie(
    await createSessionToken({
      userId: user.id,
      username: user.username,
      sessionVersion,
    }),
  );

  return { success: "Password updated." };
}

export async function createAdminUserAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = z
    .object({
      username: z.string().trim().min(3, "Use at least 3 characters."),
      password: passwordSchema,
    })
    .safeParse({
      username: formData.get("username"),
      password: formData.get("password"),
    });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    };
  }

  try {
    await createAdminUser(
      parsed.data.username,
      await hashPassword(parsed.data.password),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message.includes("admin_users_username_unique")) {
      return { error: "That username is already taken." };
    }

    console.error("Failed to create admin user:", error);
    return { error: "Could not create the account." };
  }

  return { success: `Created ${parsed.data.username}.` };
}

export async function saveProductOverrideAction(
  input: unknown,
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = overrideSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    };
  }

  const { productHandle, ...rest } = parsed.data;

  try {
    await saveProductOverride({
      productHandle,
      ...rest,
      images: rest.images.map((image) => ({
        url: image.url,
        altText: image.altText ?? null,
        imagekitFileId: image.imagekitFileId ?? null,
        width: image.width ?? null,
        height: image.height ?? null,
      })),
      updatedBy: session.userId,
    });
  } catch (error) {
    console.error(`Failed to save override for "${productHandle}":`, error);
    return { error: "Could not save the override." };
  }

  revalidateTag(TAGS.products, "seconds");
  revalidateTag(TAGS.collections, "seconds");

  return { success: "Product override saved." };
}

export async function deleteProductOverrideAction(
  productHandle: string,
): Promise<ActionState> {
  await requireAdmin();

  if (typeof productHandle !== "string" || productHandle.length === 0) {
    return { error: "Missing product handle." };
  }

  try {
    await deleteProductOverride(productHandle);
  } catch (error) {
    console.error(`Failed to delete override for "${productHandle}":`, error);
    return { error: "Could not delete the override." };
  }

  revalidateTag(TAGS.products, "seconds");
  revalidateTag(TAGS.collections, "seconds");

  return { success: "Override removed. Shopify data is showing again." };
}

/**
 * Photos the customer would actually see for this product, so image overrides
 * made on the Products tab are respected when choosing carousel photos.
 */
export async function getProductPhotoOptionsAction(
  handle: string,
): Promise<ProductPhotoOption[]> {
  await requireAdmin();

  if (typeof handle !== "string" || handle.length === 0) {
    return [];
  }

  try {
    const product = await getProduct(handle);

    if (!product) {
      return [];
    }

    return product.images.map((image) => ({
      url: image.url,
      altText: image.altText || product.title,
    }));
  } catch (error) {
    console.error(`Could not load photos for "${handle}":`, error);
    return [];
  }
}

export async function saveNewlyReleasedAction(
  items: unknown,
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = newlyReleasedSchema.safeParse({ items });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    };
  }

  const handles = parsed.data.items.map((item) => item.productHandle);

  if (new Set(handles).size !== handles.length) {
    return { error: "Each product can only appear once in the carousel." };
  }

  try {
    await saveNewlyReleasedItems(
      parsed.data.items.map((item) => ({
        productHandle: item.productHandle,
        shopifyProductId: item.shopifyProductId ?? null,
        cardImageUrl: item.cardImageUrl ?? null,
        heroImageUrl: item.heroImageUrl ?? null,
        subtitle: item.subtitle ?? null,
      })),
      session.userId,
    );
  } catch (error) {
    console.error("Failed to save the newly released carousel:", error);
    return { error: "Could not save the carousel." };
  }

  revalidateTag(TAGS.newlyReleased, "seconds");

  return { success: "Newly released carousel saved." };
}

export async function saveShopNowAction(items: unknown): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = shopNowSchema.safeParse({ items });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    };
  }

  const handles = parsed.data.items.map((item) => item.productHandle);

  if (new Set(handles).size !== handles.length) {
    return { error: "Each product can only appear once in Shop Now." };
  }

  try {
    await saveShopNowItems(
      parsed.data.items.map((item) => ({
        productHandle: item.productHandle,
        shopifyProductId: item.shopifyProductId ?? null,
        imageUrl1: item.imageUrl1 ?? null,
        imageUrl2: item.imageUrl2 ?? null,
        imageUrl3: item.imageUrl3 ?? null,
      })),
      session.userId,
    );
  } catch (error) {
    console.error("Failed to save the Shop Now section:", error);
    return { error: "Could not save the Shop Now section." };
  }

  revalidateTag(TAGS.shopNow, "seconds");

  return { success: "Shop Now section saved." };
}

const heroItemSchema = z.object({
  id: z.string().trim().min(1).max(64),
  kind: z.enum(["video", "image"]),
  url: z.string().trim().min(1, "Enter a media URL."),
  altText: z.string().nullish(),
  posterUrl: z.string().nullish(),
  seconds: z.number().int().nullish(),
});

const heroSchema = z.object({
  items: z
    .array(heroItemSchema)
    .max(20, "That is more slides than a hero should rotate through."),
  defaultSeconds: z
    .number()
    .int()
    .min(HERO_MIN_SECONDS, `Use at least ${HERO_MIN_SECONDS} seconds.`)
    .max(HERO_MAX_SECONDS, `Use at most ${HERO_MAX_SECONDS} seconds.`),
});

export async function saveHeroAction(input: unknown): Promise<HeroActionState> {
  const session = await requireAdmin();

  const parsed = heroSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the hero and try again.",
    };
  }

  const { items, defaultSeconds } = parsed.data;

  for (const item of items) {
    if (!isAllowedHeroUrl(item.url)) {
      return {
        error:
          "Media URLs must be https:// or a path on this site, such as /hero/cover_vid.gif.",
      };
    }

    if (item.posterUrl && !isAllowedHeroUrl(item.posterUrl)) {
      return {
        error: "The poster URL must be https:// or a path on this site.",
      };
    }
  }

  /**
   * Only probe URLs that are new or changed. Probing every item on every autosave
   * would mean N HEAD requests per pause in typing, so instead this compares
   * against what is already stored - one small read - and only verifies the
   * difference. A definitively wrong URL therefore still cannot be stored.
   */
  const warnings: string[] = [];

  try {
    const existing = new Map(
      (await listHeroItems()).map((row) => [row.id, row.url]),
    );

    for (const item of items) {
      if (existing.get(item.id) === item.url) {
        continue;
      }

      const probe = await probeMediaUrl(item.url, item.kind);

      if (probe.status === "wrong-type") {
        return {
          error: `That URL returns ${probe.contentType} rather than ${item.kind} media. Check the link.`,
        };
      }

      if (probe.status === "unreachable") {
        warnings.push(
          `Could not verify one of the ${item.kind} URLs (${probe.reason}). It was saved anyway.`,
        );
      } else if (probe.warning) {
        warnings.push(probe.warning);
      }
    }
  } catch (error) {
    console.error("Could not check the hero media URLs:", error);
  }

  try {
    await saveHeroConfig(
      items.map((item) => ({
        id: item.id,
        kind: item.kind,
        url: item.url,
        altText: item.altText ?? null,
        posterUrl: item.posterUrl ?? null,
        seconds: item.seconds ?? null,
      })),
      defaultSeconds,
      session.userId,
    );
  } catch (error) {
    console.error("Failed to save the hero:", error);
    return { error: "Could not save the hero." };
  }

  revalidateTag(TAGS.hero, "seconds");

  return { success: "Hero saved.", warnings: [...new Set(warnings)] };
}

/**
 * Saves the curated social posts behind the storefront's community strip.
 *
 * The image check is a shape check only (https or site-relative), matching
 * isAllowedHeroUrl. The permalink must be an absolute https URL — it is rendered
 * as an outbound anchor, so https-only is what keeps it a normal secure link.
 * Any host is accepted: a hard allowlist only breaks the next platform the brand
 * adds (see isAllowedPermalink). A post with no permalink at all is allowed, so
 * an image can be staged before its link is known; that card then renders inert
 * instead of linking nowhere.
 */
export async function saveSocialPostsAction(
  input: unknown,
): Promise<SocialPostsActionState> {
  const session = await requireAdmin();

  const parsed = socialPostsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "Check the posts and try again.",
    };
  }

  const { items } = parsed.data;

  const warnings: string[] = [];

  for (const [index, item] of items.entries()) {
    if (!isAllowedPostImageUrl(item.imageUrl)) {
      return {
        error: `Post ${index + 1}: the image must be an https:// URL or a path on this site.`,
      };
    }

    if (item.permalink && !isAllowedPermalink(item.permalink)) {
      return {
        error: `Post ${index + 1}: the link must be an https:// URL, or left blank.`,
      };
    }
  }

  /**
   * Warn rather than reject when a post has no link. This is a legitimate
   * staging state, but a strip full of them means "View Post" buttons that go
   * nowhere, so it is worth saying out loud.
   */
  const missingLinks = items.filter((item) => !item.permalink?.trim()).length;

  if (missingLinks > 0) {
    warnings.push(
      `${missingLinks} of ${items.length} post${items.length === 1 ? " has" : "s have"} no link, so ${missingLinks === 1 ? "its" : "their"} button will not go anywhere.`,
    );
  }

  try {
    await saveSocialPosts(
      items.map((item) => ({
        id: item.id,
        imageUrl: item.imageUrl,
        altText: item.altText ?? null,
        permalink: item.permalink?.trim() ? item.permalink.trim() : null,
        platform: item.platform,
        isReel: item.isReel,
      })),
      session.userId,
    );
  } catch (error) {
    console.error("Failed to save the social posts:", error);
    return { error: "Could not save the social posts." };
  }

  revalidateTag(TAGS.socialPosts, "seconds");

  return { success: "Social posts saved.", warnings };
}
