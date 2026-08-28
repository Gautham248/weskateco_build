import { requireAuth } from "lib/admin/actions/auth";
import { createClient } from "next-sanity";
import { CommunityEditorForm } from "./community-form";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "f25zmr6t",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export interface StoryData {
  _id: string;
  riderName: string;
  _createdAt?: string;
  backgroundText_en?: string;
  portraitUrl?: string;
}

async function getStories(): Promise<StoryData[]> {
  try {
    return await client.fetch(
      `*[_type == "communityStory"] | order(_createdAt desc) {
        _id, riderName, _createdAt, backgroundText_en, portraitUrl
      }`
    );
  } catch {
    return [];
  }
}

export default async function CommunityPage() {
  await requireAuth();
  const stories = await getStories();

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Community Stories</span>
        <div className="admin-topbar-right">
          <span className="admin-badge admin-badge-success">Sanity Connected</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Community Stories</h1>
          <p>Add and manage rider features, community spotlights, and portraits.</p>
        </div>

        <CommunityEditorForm initialStories={stories} />
      </div>
    </>
  );
}
