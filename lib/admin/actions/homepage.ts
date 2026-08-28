"use server";

import { patchDoc, setField } from "lib/admin/sanity-write";
import { getSessionToken, verifySessionToken } from "lib/admin/auth";
import { revalidateTag } from "next/cache";

async function checkAuth() {
  const token = await getSessionToken();
  const valid = await verifySessionToken(token);
  if (!valid) throw new Error("Unauthorized");
}

export async function saveHeroSettingsAction(data: {
  mediaUrl: string;
  mediaType: "image" | "video" | "gif";
  overlayEnabled: boolean;
  ctaButtons: Array<{ label_en?: string; label_hi?: string; href?: string }>;
}) {
  await checkAuth();

  await setField("siteSettings", "heroSettings", data);
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}

export async function saveHomeNewlyReleasedAction(slides: Array<{
  title?: string;
  subtitle?: string;
  shopifyProductHandle?: string;
  fullImageUrl?: string;
  wheelsImageUrl?: string;
  price?: string;
  oldPrice?: string;
}>) {
  await checkAuth();

  await patchDoc("homeNewlyReleased", { slides });
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}

export async function saveHomeShopNowAction(products: Array<{
  shopifyProductHandle?: string;
  discountBadge?: string;
  emiBadge?: string;
  imageUrls?: string[];
}>) {
  await checkAuth();

  await patchDoc("homeShopNow", { products });
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}

export async function saveCategoryGridAction(categoryGrid: Array<{
  title_en?: string;
  title_hi?: string;
  href?: string;
  imageUrl?: string;
}>) {
  await checkAuth();

  await setField("siteSettings", "categoryGrid", categoryGrid);
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}
