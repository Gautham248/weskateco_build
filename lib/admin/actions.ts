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
import {
  createAdminUser,
  deleteProductOverride,
  getAdminUserByUsername,
  saveProductOverride,
  updateAdminUserPassword,
} from "lib/admin/queries";
import { TAGS } from "lib/constants";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type ActionState = { error?: string; success?: string } | null;

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
      session = { userId: user.id, username: user.username };
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

  await updateAdminUserPassword(user.id, await hashPassword(nextPassword.data));

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
