"use client";

import { useState, useTransition } from "react";
import { createAmbassadorAction, deleteAmbassadorAction } from "lib/admin/actions/content";
import { uploadMediaAction } from "lib/admin/actions/media";
import { AmbassadorData } from "./page";

export function AmbassadorsEditorForm({ initialAmbassadors }: { initialAmbassadors: AmbassadorData[] }) {
  const [ambassadors, setAmbassadors] = useState<AmbassadorData[]>(initialAmbassadors);
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("Goa");
  const [ridingStyle, setRidingStyle] = useState("Bowl / Transition");
  const [tier, setTier] = useState("pro");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "/weskateco/ambassadors");

    const res = await uploadMediaAction(formData);
    setUploading(false);

    if (res.success && res.url) {
      setPhotoUrl(res.url);
      setStatusMsg("✅ Photo uploaded to ImageKit!");
    } else {
      setStatusMsg(`❌ Upload failed: ${res.error}`);
    }
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name) {
      setStatusMsg("❌ Name is required.");
      return;
    }

    setStatusMsg("");
    startTransition(async () => {
      const res = await createAmbassadorAction({
        name,
        location,
        ridingStyle,
        tier,
        instagramHandle: instagramHandle.replace(/^@/, ""),
        photoUrl,
      });

      if (res.success) {
        setStatusMsg("🎉 Ambassador created!");
        setName("");
        setInstagramHandle("");
        setPhotoUrl("");
      } else {
        setStatusMsg("❌ Error creating ambassador.");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this ambassador?")) return;
    startTransition(async () => {
      const res = await deleteAmbassadorAction(id);
      if (res.success) {
        setAmbassadors(ambassadors.filter((a) => a._id !== id));
        setStatusMsg("🗑️ Ambassador deleted.");
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
        <div className="admin-card-title" style={{ marginBottom: 16 }}>+ Add New Ambassador / Team Rider</div>
        <form onSubmit={handleCreate}>
          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Rider Name *</label>
              <input
                type="text"
                className="admin-form-input"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Location</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="e.g. Goa"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Riding Style</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="e.g. Street / Surfskate"
                value={ridingStyle}
                onChange={(e) => setRidingStyle(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Team Tier</label>
              <select
                className="admin-select"
                value={tier}
                onChange={(e) => setTier(e.target.value)}
              >
                <option value="pro">Pro Rider</option>
                <option value="team">Team</option>
                <option value="flow">Flow</option>
                <option value="ambassador">Ambassador</option>
              </select>
            </div>
            <div>
              <label className="admin-form-label">Instagram Handle</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="e.g. rahulskates"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Profile Photo (ImageKit)</label>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ fontSize: 13 }} />
              {uploading && <div className="admin-spinner" />}
            </div>
            <input
              type="text"
              className="admin-form-input"
              placeholder="Or paste ImageKit Photo URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={isPending || uploading}
            style={{ marginTop: 8 }}
          >
            {isPending ? "Creating…" : "Create Ambassador"}
          </button>
        </form>
      </div>

      {/* Existing List */}
      <div className="admin-card">
        <div className="admin-card-title" style={{ marginBottom: 16 }}>Existing Team Riders ({ambassadors.length})</div>
        {ambassadors.length === 0 ? (
          <div style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>No ambassadors in Sanity yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Style</th>
                  <th>Tier</th>
                  <th>Instagram</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ambassadors.map((a) => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 500 }}>{a.name}</td>
                    <td style={{ color: "var(--admin-text-muted)" }}>{a.location ?? "—"}</td>
                    <td style={{ color: "var(--admin-text-muted)" }}>{a.ridingStyle ?? "—"}</td>
                    <td>
                      <span className="admin-badge admin-badge-neutral">{a.tier ?? "ambassador"}</span>
                    </td>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>
                      {a.instagramHandle ? `@${a.instagramHandle}` : "—"}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => handleDelete(a._id)}
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
