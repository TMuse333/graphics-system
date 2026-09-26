"use client";

import { CAPABILITIES } from "@/lib/agent/capabilities";
import { TEMPLATES } from "@/lib/content/graphicTypes";

export default function SettingsPage() {
  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="title">Settings</h1>
        <p className="subtitle">Configure agent capabilities and templates</p>
      </div>

      <div className="grid-2">
        {/* Capabilities */}
        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Capabilities</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 12,
                  background: "var(--bg)",
                  borderRadius: "var(--radius)",
                }}
              >
                <div>
                  <p style={{ fontWeight: 500 }}>{cap.name}</p>
                  <p className="text-sm text-muted">{cap.description}</p>
                </div>
                <span
                  style={{
                    padding: "4px 8px",
                    background: "rgba(56, 161, 105, 0.2)",
                    color: "var(--success)",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Templates</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.values(TEMPLATES).map((tpl) => (
              <div
                key={tpl.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 12,
                  background: "var(--bg)",
                  borderRadius: "var(--radius)",
                }}
              >
                <div>
                  <p style={{ fontWeight: 500 }}>{tpl.id}</p>
                  <p className="text-sm text-muted">
                    {tpl.size[0]}×{tpl.size[1]} • {tpl.kind}
                  </p>
                </div>
                <span
                  style={{
                    padding: "4px 8px",
                    background: tpl.ported ? "rgba(56, 161, 105, 0.2)" : "rgba(212, 175, 55, 0.2)",
                    color: tpl.ported ? "var(--success)" : "var(--accent)",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  {tpl.ported ? "Ready" : "Not ported"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
