"use server";

import { createDoc, patchDoc, deleteDoc } from "lib/admin/sanity-write";
import { getSessionToken, verifySessionToken } from "lib/admin/auth";
import { revalidateTag } from "next/cache";

async function checkAuth() {
  const token = await getSessionToken();
  const valid = await verifySessionToken(token);
  if (!valid) throw new Error("Unauthorized");
}

// ── BRANDS ──
export async function createBrandAction(data: {
  name: string;
  handle: string;
  logoUrl?: string;
  description_en?: string;
  description_hi?: string;
  shopifyCollectionHandle?: string;
  sortOrder?: number;
}) {
  await checkAuth();
  await createDoc("authorisedBrand", data);
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}

export async function deleteBrandAction(id: string) {
  await checkAuth();
  await deleteDoc(id);
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}

// ── ACADEMY PROGRAMMES ──
export async function createAcademyProgrammeAction(data: {
  title_en: string;
  title_hi?: string;
  city: string;
  bookingEnabled: boolean;
  skillLevels?: string[];
  description_en?: string;
}) {
  await checkAuth();
  await createDoc("academyProgramme", data);
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}

export async function deleteAcademyProgrammeAction(id: string) {
  await checkAuth();
  await deleteDoc(id);
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}

// ── SKATEPARKS ──
export async function createSkateparkAction(data: {
  name: string;
  city: string;
  constructionStatus: "planned" | "in_progress" | "completed";
  completionPercentage: number;
  description_en?: string;
}) {
  await checkAuth();
  await createDoc("skatepark", data);
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}

export async function deleteSkateparkAction(id: string) {
  await checkAuth();
  await deleteDoc(id);
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}

// ── ARTIST COLLABS ──
export async function createArtistCollabAction(data: {
  artistName: string;
  dropDate?: string;
  isLive: boolean;
  shopifyProductHandles?: string[];
  bio_en?: string;
}) {
  await checkAuth();
  await createDoc("artistCollab", data);
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}

export async function deleteArtistCollabAction(id: string) {
  await checkAuth();
  await deleteDoc(id);
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}

// ── AMBASSADORS ──
export async function createAmbassadorAction(data: {
  name: string;
  location?: string;
  ridingStyle?: string;
  tier?: string;
  instagramHandle?: string;
  photoUrl?: string;
}) {
  await checkAuth();
  await createDoc("ambassador", data);
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}

export async function deleteAmbassadorAction(id: string) {
  await checkAuth();
  await deleteDoc(id);
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}

// ── COMMUNITY STORIES ──
export async function createCommunityStoryAction(data: {
  riderName: string;
  backgroundText_en?: string;
  portraitUrl?: string;
}) {
  await checkAuth();
  await createDoc("communityStory", data);
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}

export async function deleteCommunityStoryAction(id: string) {
  await checkAuth();
  await deleteDoc(id);
  revalidateTag("sanity-content", "seconds");
  return { success: true };
}
