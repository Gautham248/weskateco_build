"use client";

import { useState, useTransition } from "react";
import { createAcademyProgrammeAction, deleteAcademyProgrammeAction } from "lib/admin/actions/content";
import { ProgrammeData } from "./page";

export function AcademyEditorForm({ initialProgrammes }: { initialProgrammes: ProgrammeData[] }) {
  const [programmes, setProgrammes] = useState<ProgrammeData[]>(initialProgrammes);
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState("");

  const [name, setName] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [skillLevelsStr, setSkillLevelsStr] = useState("Beginner, Intermediate");
  const [description_en, setDescription_en] = useState("");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !city) {
      setStatusMsg("❌ Programme title and city are required.");
      return;
    }

    const skillLevels = skillLevelsStr.split(",").map((s) => s.trim()).filter(Boolean);

    setStatusMsg("");
    startTransition(async () => {
      const res = await createAcademyProgrammeAction({
        title_en: name,
        city,
        bookingEnabled,
        skillLevels,
        description_en,
      });

      if (res.success) {
        setStatusMsg("🎉 Programme created successfully!");
        setName("");
        setDescription_en("");
      } else {
        setStatusMsg("❌ Error creating programme.");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this programme?")) return;
    startTransition(async () => {
      const res = await deleteAcademyProgrammeAction(id);
      if (res.success) {
        setProgrammes(programmes.filter((p) => p._id !== id));
        setStatusMsg("🗑️ Programme deleted.");
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
        <div className="admin-card-title" style={{ marginBottom: 16 }}>+ Add New Academy Programme</div>
        <form onSubmit={handleCreate}>
          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Programme Title *</label>
              <input
                type="text"
                className="admin-form-input"
                required
                placeholder="e.g. Skateboarding 101 - Weekend Workshop"
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
                placeholder="e.g. Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Skill Levels (comma separated)</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="Beginner, Intermediate, Advanced"
                value={skillLevelsStr}
                onChange={(e) => setSkillLevelsStr(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Booking Status</label>
              <div style={{ marginTop: 6 }}>
                <label className="admin-toggle">
                  <input
                    type="checkbox"
                    checked={bookingEnabled}
                    onChange={(e) => setBookingEnabled(e.target.checked)}
                  />
                  <div className="admin-toggle-track">
                    <div className="admin-toggle-thumb" />
                  </div>
                  <span style={{ fontSize: 13 }}>{bookingEnabled ? "Booking Open" : "Booking Closed"}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Description (EN)</label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="Short overview of the lesson"
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
            {isPending ? "Creating…" : "Create Programme"}
          </button>
        </form>
      </div>

      {/* Existing List */}
      <div className="admin-card">
        <div className="admin-card-title" style={{ marginBottom: 16 }}>Existing Programmes ({programmes.length})</div>
        {programmes.length === 0 ? (
          <div style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>No programmes in Sanity yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Programme</th>
                  <th>City</th>
                  <th>Skill Levels</th>
                  <th>Booking</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {programmes.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td style={{ color: "var(--admin-text-muted)" }}>{p.city ?? "—"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {(p.skillLevels ?? []).map((lvl) => (
                          <span key={lvl} className="admin-badge admin-badge-neutral">{lvl}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`admin-badge ${p.bookingEnabled ? "admin-badge-success" : "admin-badge-error"}`}>
                        {p.bookingEnabled ? "Open" : "Closed"}
                      </span>
                    </td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
