"use server";

import { patchDoc } from "lib/admin/sanity-write";
import { getSessionToken, verifySessionToken } from "lib/admin/auth";
import { revalidateTag } from "next/cache";

async function checkAuth() {
  const token = await getSessionToken();
  const valid = await verifySessionToken(token);
  if (!valid) throw new Error("Unauthorized");
}

export interface NavItem {
  label_en?: string;
  label_hi?: string;
  href?: string;
  children?: Array<{ label_en?: string; label_hi?: string; href?: string }>;
}

export async function saveNavigationAction(items: NavItem[]) {
  await checkAuth();

  await patchDoc("navigation-header", { items });
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}
