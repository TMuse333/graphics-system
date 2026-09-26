"use client";

import { Image as ImageIcon } from "lucide-react";

export default function GraphicsPage() {
  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="title">Graphics</h1>
        <p className="subtitle">View and manage generated graphics</p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "96px 0",
          color: "var(--text-muted)",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--bg-hover)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <ImageIcon style={{ width: 32, height: 32 }} />
        </div>
        <p style={{ fontSize: 18, marginBottom: 8 }}>No graphics yet</p>
        <p className="text-sm">Graphics you create will appear here</p>
      </div>
    </div>
  );
}
