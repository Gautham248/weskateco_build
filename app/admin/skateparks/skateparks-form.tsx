"use client";

import { useState, useTransition } from "react";
import { createSkateparkAction, deleteSkateparkAction } from "lib/admin/actions/content";
import { SkateparkData } from "./page";

export function SkateparksEditorForm({ initialParks }: { initialParks: SkateparkData[] }) {
  const [parks, setParks] = useState<SkateparkData[]>(initialParks);
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState("");

  const [name, setName] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [constructionStatus, setConstructionStatus] = useState<"planned" | "in_progress" | "completed">("in_progress");
  const [completionPercentage, setCompletionPercentage] = useState(65);
  const [description_en, setDescription_en] = useState("");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !city) {
      setStatusMsg("❌ Project name and city are required.");
      return;
    }

    setStatusMsg("");
    startTransition(async () => {
      const res = await createSkateparkAction({
        name,
        city,
        constructionStatus,
        completionPercentage,
        description_en,
      });

      if (res.success) {
        setStatusMsg("🎉 Skatepark project created!");
        setName("");
        setDescription_en("");
      } else {
        setStatusMsg("❌ Error creating project.");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this skatepark project?")) return;
    startTransition(async () => {
      const res = await deleteSkateparkAction(id);
      if (res.success) {
        setParks(parks.filter((p) => p._id !== id));
        setStatusMsg("🗑️ Project deleted.");
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
        <div className="admin-card-title" style={{ marginBottom: 16 }}>+ Add New Skatepark Project</div>
        <form onSubmit={handleCreate}>
          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Project Name *</label>
              <input
                type="text"
                className="admin-form-input"
                required
                placeholder="e.g. Cubbon Park DIY Skatepark"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">City *</label>
              <input
                type="text"
                className="admin-form-input"
                required
                placeholder="e.g. Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Construction Status</label>
              <select
                className="admin-select"
                value={constructionStatus}
                onChange={(e) => setConstructionStatus(e.target.value as "planned" | "in_progress" | "completed")}
              >
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="admin-form-label">Completion % (0 - 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="admin-form-input"
                value={completionPercentage}
                onChange={(e) => setCompletionPercentage(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Description (EN)</label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="Overview of the skatepark scope & obstacles"
              value={description_en}
              onChange={(e) => setDescription_en(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={isPending}
            style={{ marginTop: 8 }}
          >
            {isPending ? "Creating…" : "Create Skatepark Project"}
          </button>
        </form>
      </div>

      {/* Existing List */}
      <div className="admin-card">
        <div className="admin-card-title" style={{ marginBottom: 16 }}>Existing Skatepark Projects ({parks.length})</div>
        {parks.length === 0 ? (
          <div style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>No skateparks in Sanity yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Completion</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {parks.map((p) => {
                  const status = p.constructionStatus ?? "planned";
                  const pct = p.completionPercentage ?? 0;
                  return (
                    <tr key={p._id}>
                      <td style={{ fontWeight: 500 }}>{p.name}</td>
                      <td style={{ color: "var(--admin-text-muted)" }}>{p.city ?? "—"}</td>
                      <td>
                        <span
                          className={`admin-badge ${
                            status === "completed"
                              ? "admin-badge-success"
                              : status === "in_progress"
                                ? "admin-badge-warning"
                                : "admin-badge-neutral"
                          }`}
                        >
                          {status.replace("_", " ")}
                        </span>
                      </td>
                      <td>{pct}%</td>
                      <td>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
