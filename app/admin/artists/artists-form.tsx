"use client";

import { useState, useTransition } from "react";
import { createArtistCollabAction, deleteArtistCollabAction } from "lib/admin/actions/content";
import { ArtistCollabData } from "./page";

export function ArtistsEditorForm({ initialArtists }: { initialArtists: ArtistCollabData[] }) {
  const [artists, setArtists] = useState<ArtistCollabData[]>(initialArtists);
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState("");

  const [artistName, setArtistName] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [productHandlesStr, setProductHandlesStr] = useState("pigeon-og-pro");
  const [bio_en, setBio_en] = useState("");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!artistName) {
      setStatusMsg("❌ Artist name is required.");
      return;
    }

    const shopifyProductHandles = productHandlesStr.split(",").map((s) => s.trim()).filter(Boolean);

    setStatusMsg("");
    startTransition(async () => {
      const res = await createArtistCollabAction({
        artistName,
        dropDate: dropDate || undefined,
        isLive,
        shopifyProductHandles,
        bio_en,
      });

      if (res.success) {
        setStatusMsg("🎉 Artist collab created!");
        setArtistName("");
        setBio_en("");
      } else {
        setStatusMsg("❌ Error creating artist collab.");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this artist collab?")) return;
    startTransition(async () => {
      const res = await deleteArtistCollabAction(id);
      if (res.success) {
        setArtists(artists.filter((a) => a._id !== id));
        setStatusMsg("🗑️ Collab deleted.");
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
        <div className="admin-card-title" style={{ marginBottom: 16 }}>+ Add New Artist Collab</div>
        <form onSubmit={handleCreate}>
          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Artist Name *</label>
              <input
                type="text"
                className="admin-form-input"
                required
                placeholder="e.g. Sameer Kulavoor"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Drop Date</label>
              <input
                type="date"
                className="admin-form-input"
                value={dropDate}
                onChange={(e) => setDropDate(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Shopify Product Handles (comma separated)</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="pigeon-og-pro, bombay-surfer"
                value={productHandlesStr}
                onChange={(e) => setProductHandlesStr(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Release Status</label>
              <div style={{ marginTop: 6 }}>
                <label className="admin-toggle">
                  <input
                    type="checkbox"
                    checked={isLive}
                    onChange={(e) => setIsLive(e.target.checked)}
                  />
                  <div className="admin-toggle-track">
                    <div className="admin-toggle-thumb" />
                  </div>
                  <span style={{ fontSize: 13 }}>{isLive ? "Live Now" : "Upcoming Drop"}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Artist Bio (EN)</label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="Short bio & inspiration behind the deck artwork"
              value={bio_en}
              onChange={(e) => setBio_en(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={isPending}
            style={{ marginTop: 8 }}
          >
            {isPending ? "Creating…" : "Create Artist Collab"}
          </button>
        </form>
      </div>

      {/* Existing List */}
      <div className="admin-card">
        <div className="admin-card-title" style={{ marginBottom: 16 }}>Existing Artist Collabs ({artists.length})</div>
        {artists.length === 0 ? (
          <div style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>No artist collabs in Sanity yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Artist</th>
                  <th>Drop Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {artists.map((a) => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 500 }}>{a.artistName}</td>
                    <td style={{ color: "var(--admin-text-muted)" }}>
                      {a.dropDate ? new Date(a.dropDate).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td>
                      <span className={`admin-badge ${a.isLive ? "admin-badge-success" : "admin-badge-neutral"}`}>
                        {a.isLive ? "Live" : "Upcoming"}
                      </span>
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
