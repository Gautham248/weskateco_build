"use server";

import { patchDoc } from "lib/admin/sanity-write";
import { getSessionToken, verifySessionToken } from "lib/admin/auth";
import { revalidateTag } from "next/cache";

async function checkAuth() {
  const token = await getSessionToken();
  const valid = await verifySessionToken(token);
  if (!valid) throw new Error("Unauthorized");
}

export async function saveSiteSettingsAction(fields: {
  companyName?: string;
  siteName?: string;
  announcementBar_en?: string;
  announcementBar_hi?: string;
  announcementBarEnabled?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    twitter?: string;
  };
  footerText_en?: string;
  footerText_hi?: string;
}) {
  await checkAuth();

  await patchDoc("siteSettings", fields);
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}
