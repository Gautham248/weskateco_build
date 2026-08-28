"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminCollection } from "lib/admin/shopify-admin";

export function CollectionsBrowserClient({
  initialCollections,
}: {
  initialCollections: AdminCollection[];
}) {
  const [search, setSearch] = useState("");
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  function copyToClipboard(handle: string) {
    navigator.clipboard.writeText(handle);
    setCopiedHandle(handle);
    setTimeout(() => setCopiedHandle(null), 2000);
  }

  const filtered = initialCollections.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.handle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 20, maxWidth: 360 }}>
        <input
          type="text"
          className="admin-form-input"
          placeholder="Filter collections by title or handle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {copiedHandle && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "var(--admin-accent)",
            color: "#0f172a",
            padding: "10px 18px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
            zIndex: 999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          Copied collection handle: <code>{copiedHandle}</code>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
          <h3>No collections found</h3>
          <p>No Shopify collections match search string &quot;{search}&quot;</p>
        </div>
      ) : (
        <div className="admin-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {filtered.map((c) => (
            <div key={c.id} className="admin-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                {c.image && (
                  <div style={{ width: "100%", height: 120, borderRadius: "var(--admin-radius-sm)", overflow: "hidden", marginBottom: 12 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image.url} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ fontWeight: 600, fontSize: 15, color: "var(--admin-text)" }}>{c.title}</div>
                <div style={{ fontSize: 12, color: "var(--admin-text-subtle)", fontFamily: "monospace", marginTop: 4 }}>
                  {c.handle}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--admin-border-subtle)" }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => copyToClipboard(c.handle)}
                  style={{ flex: 1 }}
                >
                  Copy Handle
                </button>
                <Link
                  href={`/en/store/${c.handle}`}
                  target="_blank"
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  title="View on storefront"
                >
                  View ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
