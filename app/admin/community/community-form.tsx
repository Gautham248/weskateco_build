"use client";

import { useState, useTransition } from "react";
import { createCommunityStoryAction, deleteCommunityStoryAction } from "lib/admin/actions/content";
import { uploadMediaAction } from "lib/admin/actions/media";
import { StoryData } from "./page";

export function CommunityEditorForm({ initialStories }: { initialStories: StoryData[] }) {
  const [stories, setStories] = useState<StoryData[]>(initialStories);
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const [riderName, setRiderName] = useState("");
  const [backgroundText_en, setBackgroundText_en] = useState("");
  const [portraitUrl, setPortraitUrl] = useState("");

  async function handlePortraitUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "/weskateco/community");

    const res = await uploadMediaAction(formData);
    setUploading(false);

    if (res.success && res.url) {
      setPortraitUrl(res.url);
      setStatusMsg("✅ Portrait uploaded to ImageKit!");
    } else {
      setStatusMsg(`❌ Upload failed: ${res.error}`);
    }
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!riderName) {
      setStatusMsg("❌ Rider name is required.");
      return;
    }

    setStatusMsg("");
    startTransition(async () => {
      const res = await createCommunityStoryAction({
        riderName,
        backgroundText_en,
        portraitUrl,
      });

      if (res.success) {
        setStatusMsg("🎉 Community story created!");
        setRiderName("");
        setBackgroundText_en("");
        setPortraitUrl("");
      } else {
        setStatusMsg("❌ Error creating story.");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this story?")) return;
    startTransition(async () => {
      const res = await deleteCommunityStoryAction(id);
      if (res.success) {
        setStories(stories.filter((s) => s._id !== id));
        setStatusMsg("🗑️ Story deleted.");
      }
    });
  }

  return (
    <div style={{ maxWidth: 840 }}>
      {statusMsg && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "var(--admin-radius-sm)",
            marginBottom: 20,
            fontSize: 13,
            background: statusMsg.startsWith("❌") ? "var(--admin-error-dim)" : "var(--admin-accent-dim)",
            color: statusMsg.startsWith("❌") ? "var(--admin-error)" : "var(--admin-accent)",
            border: `1px solid ${statusMsg.startsWith("❌") ? "rgba(248,113,113,0.3)" : "rgba(45,212,191,0.3)"}`,
          }}
        >
          {statusMsg}
        </div>
      )}

      {/* Add Form */}
      <div className="admin-card" style={{ marginBottom: 28 }}>
        <div className="admin-card-title" style={{ marginBottom: 16 }}>+ Add New Community Story</div>
        <form onSubmit={handleCreate}>
          <div className="admin-form-group">
            <label className="admin-form-label">Rider Name *</label>
            <input
              type="text"
              className="admin-form-input"
              required
              placeholder="e.g. Aarav Patel"
              value={riderName}
              onChange={(e) => setRiderName(e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Story / Background Text (EN)</label>
            <textarea
              className="admin-textarea"
              placeholder="Tell the rider's story, how they got into skating, and their favorite spots..."
              value={backgroundText_en}
              onChange={(e) => setBackgroundText_en(e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Rider Portrait (ImageKit)</label>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
              <input type="file" accept="image/*" onChange={handlePortraitUpload} style={{ fontSize: 13 }} />
              {uploading && <div className="admin-spinner" />}
            </div>
            <input
              type="text"
              className="admin-form-input"
              placeholder="Or paste ImageKit Portrait URL"
              value={portraitUrl}
              onChange={(e) => setPortraitUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={isPending || uploading}
            style={{ marginTop: 8 }}
          >
            {isPending ? "Creating…" : "Create Community Story"}
          </button>
        </form>
      </div>

      {/* Existing List */}
      <div className="admin-card">
        <div className="admin-card-title" style={{ marginBottom: 16 }}>Existing Community Stories ({stories.length})</div>
        {stories.length === 0 ? (
          <div style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>No community stories in Sanity yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rider Name</th>
                  <th>Created</th>
                  <th>Preview</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((s) => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 500 }}>{s.riderName}</td>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>
                      {s._createdAt ? new Date(s._createdAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: 12, maxWidth: 300 }}>
                      {s.backgroundText_en?.slice(0, 80)}
                      {(s.backgroundText_en?.length ?? 0) > 80 ? "…" : ""}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => handleDelete(s._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
