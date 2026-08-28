import { requireAuth } from "lib/admin/actions/auth";
import { createClient } from "next-sanity";
import { ArtistsEditorForm } from "./artists-form";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "f25zmr6t",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export interface ArtistCollabData {
  _id: string;
  artistName: string;
  dropDate?: string;
  isLive?: boolean;
  shopifyProductHandles?: string[];
  bio_en?: string;
}

async function getArtists(): Promise<ArtistCollabData[]> {
  try {
    return await client.fetch(
      `*[_type == "artistCollab"] | order(dropDate desc) {
        _id, artistName, dropDate, isLive, shopifyProductHandles, bio_en
      }`
    );
  } catch {
    return [];
  }
}

export default async function ArtistsPage() {
  await requireAuth();
  const artists = await getArtists();

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Artist Collaborations</span>
        <div className="admin-topbar-right">
          <span className="admin-badge admin-badge-success">Sanity Connected</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Artist Collaborations</h1>
          <p>Add and manage limited edition artist drops, countdown dates, and live release status.</p>
        </div>

        <ArtistsEditorForm initialArtists={artists} />
      </div>
    </>
  );
}
