"use client";

import { useState, useTransition } from "react";
import { saveNavigationAction, NavItem } from "lib/admin/actions/navigation";

export function NavigationEditorForm({ initialItems }: { initialItems: NavItem[] }) {
  const [items, setItems] = useState<NavItem[]>(initialItems);
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState("");

  function addRootItem() {
    setItems([
      ...items,
      {
        label_en: "NEW LINK",
        label_hi: "नया लिंक",
        href: "/",
        children: [],
      },
    ]);
  }

  function removeRootItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateRootItem(index: number, field: keyof NavItem, value: string) {
    const next = [...items];
    if (!next[index]) return;
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  }

  function addChildItem(parentIdx: number) {
    const next = [...items];
    const target = next[parentIdx];
    if (!target) return;
    const children = target.children ?? [];
    next[parentIdx] = {
      ...target,
      children: [
        ...children,
        { label_en: "Sub Item", label_hi: "उप मद", href: "/" },
      ],
    };
    setItems(next);
  }

  function removeChildItem(parentIdx: number, childIdx: number) {
    const next = [...items];
    const target = next[parentIdx];
    if (!target) return;
    const children = (target.children ?? []).filter((_, i) => i !== childIdx);
    next[parentIdx] = { ...target, children };
    setItems(next);
  }

  function updateChildItem(parentIdx: number, childIdx: number, field: string, value: string) {
    const next = [...items];
    const target = next[parentIdx];
    if (!target) return;
    const children = [...(target.children ?? [])];
    if (children[childIdx]) {
      children[childIdx] = { ...children[childIdx], [field]: value };
    }
    next[parentIdx] = { ...target, children };
    setItems(next);
  }

  function handleSave() {
    setStatusMsg("");
    startTransition(async () => {
      const res = await saveNavigationAction(items);
      if (res.success) {
        setStatusMsg("🎉 Navigation saved to Sanity successfully!");
      } else {
        setStatusMsg("❌ Error saving navigation.");
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

      {items.map((item, pIdx) => (
        <div key={pIdx} className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <div className="admin-card-title">Nav Item #{pIdx + 1}: {item.label_en}</div>
            <button
              type="button"
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={() => removeRootItem(pIdx)}
            >
              Remove
            </button>
          </div>

          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Label (EN)</label>
              <input
                type="text"
                className="admin-form-input"
                value={item.label_en}
                onChange={(e) => updateRootItem(pIdx, "label_en", e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Label (HI)</label>
              <input
                type="text"
                className="admin-form-input"
                value={item.label_hi}
                onChange={(e) => updateRootItem(pIdx, "label_hi", e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Href</label>
              <input
                type="text"
                className="admin-form-input"
                value={item.href}
                onChange={(e) => updateRootItem(pIdx, "href", e.target.value)}
              />
            </div>
          </div>

          {/* Sub Items */}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--admin-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-text-muted)", textTransform: "uppercase" }}>
                Dropdown Sub-Items ({item.children?.length ?? 0})
              </span>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => addChildItem(pIdx)}
              >
                + Add Sub-Item
              </button>
            </div>

            {(item.children ?? []).map((child, cIdx) => (
              <div key={cIdx} className="admin-form-row" style={{ alignItems: "center", marginBottom: 10 }}>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="Sub Label (EN)"
                  value={child.label_en}
                  onChange={(e) => updateChildItem(pIdx, cIdx, "label_en", e.target.value)}
                />
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="Sub Label (HI)"
                  value={child.label_hi}
                  onChange={(e) => updateChildItem(pIdx, cIdx, "label_hi", e.target.value)}
                />
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="Sub Href"
                  value={child.href}
                  onChange={(e) => updateChildItem(pIdx, cIdx, "href", e.target.value)}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={() => removeChildItem(pIdx, cIdx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button type="button" className="admin-btn admin-btn-ghost" onClick={addRootItem}>
          + Add Top-Level Link
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSave}
          disabled={isPending}
          style={{ padding: "10px 24px" }}
        >
          {isPending ? "Saving to Sanity…" : "Save Navigation"}
        </button>
      </div>
    </div>
  );
}
