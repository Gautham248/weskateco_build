import { requireAuth } from "lib/admin/actions/auth";
import { createClient } from "next-sanity";
import { AcademyEditorForm } from "./academy-form";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "f25zmr6t",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export interface ProgrammeData {
  _id: string;
  name: string;
  city?: string;
  bookingEnabled?: boolean;
  skillLevels?: string[];
  description_en?: string;
}

async function getProgrammes(): Promise<ProgrammeData[]> {
  try {
    return await client.fetch(
      `*[_type == "academyProgramme"] | order(name asc) {
        _id, name, city, bookingEnabled, skillLevels, description_en
      }`
    );
  } catch {
    return [];
  }
}

export default async function AcademyPage() {
  await requireAuth();
  const programmes = await getProgrammes();

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Academy Programmes</span>
        <div className="admin-topbar-right">
          <span className="admin-badge admin-badge-success">Sanity Connected</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Academy Programmes</h1>
          <p>Add and manage skating lessons, city locations, skill levels, and booking availability.</p>
        </div>

        <AcademyEditorForm initialProgrammes={programmes} />
      </div>
    </>
  );
}
