import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "f25zmr6t";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

export async function patchDoc(
  docId: string,
  fields: Record<string, unknown>
) {
  return sanityWriteClient.patch(docId).set(fields).commit();
}

export async function createDoc(
  type: string,
  fields: Record<string, unknown>
) {
  return sanityWriteClient.create({ _type: type, ...fields });
}

export async function deleteDoc(docId: string) {
  return sanityWriteClient.delete(docId);
}

export async function setField(
  docId: string,
  fieldPath: string,
  value: unknown
) {
  return sanityWriteClient.patch(docId).set({ [fieldPath]: value }).commit();
}
