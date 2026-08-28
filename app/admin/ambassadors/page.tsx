import { requireAuth } from "lib/admin/actions/auth";
import { createClient } from "next-sanity";
import { AmbassadorsEditorForm } from "./ambassadors-form";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "f25zmr6t",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export interface AmbassadorData {
  _id: string;
  name: string;
  location?: string;
  ridingStyle?: string;
  tier?: string;
  instagramHandle?: string;
  photoUrl?: string;
}

async function getAmbassadors(): Promise<AmbassadorData[]> {
  try {
    return await client.fetch(
      `*[_type == "ambassador"] | order(name asc) {
        _id, name, location, ridingStyle, tier, instagramHandle, photoUrl
      }`
    );
  } catch {
    return [];
  }
}

export default async function AmbassadorsPage() {
  await requireAuth();
  const ambassadors = await getAmbassadors();

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Ambassadors & Team Riders</span>
        <div className="admin-topbar-right">
          <span className="admin-badge admin-badge-success">Sanity Connected</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Ambassadors & Team Riders</h1>
          <p>Add and manage team riders, riding styles, team tiers, and social handles.</p>
        </div>

        <AmbassadorsEditorForm initialAmbassadors={ambassadors} />
      </div>
    </>
  );
}
