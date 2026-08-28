import { requireAuth } from "lib/admin/actions/auth";
import { createClient } from "next-sanity";
import { SkateparksEditorForm } from "./skateparks-form";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "f25zmr6t",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export interface SkateparkData {
  _id: string;
  name: string;
  city?: string;
  constructionStatus?: "planned" | "in_progress" | "completed";
  completionPercentage?: number;
  description_en?: string;
}

async function getSkateparks(): Promise<SkateparkData[]> {
  try {
    return await client.fetch(
      `*[_type == "skatepark"] | order(name asc) {
        _id, name, city, constructionStatus, completionPercentage, description_en
      }`
    );
  } catch {
    return [];
  }
}

export default async function SkateparksPage() {
  await requireAuth();
  const parks = await getSkateparks();

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Skatepark Projects</span>
        <div className="admin-topbar-right">
          <span className="admin-badge admin-badge-success">Sanity Connected</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Skatepark Projects</h1>
          <p>Track skatepark construction status, city locations, and completion percentages.</p>
        </div>

        <SkateparksEditorForm initialParks={parks} />
      </div>
    </>
  );
}
