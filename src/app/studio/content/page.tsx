"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, ExternalLink, Search, FlaskConical } from "lucide-react";
import { useStudio } from "../layout";

interface CDNFile {
  id: string;
  cdnUrl: string;
  originalUrl?: string;
  filename: string;
  mimeType: string;
  size: number;
}

interface IngestResult {
  id: string;
  source: string;
  sourceUrl: string;
  files: CDNFile[];
  metadata: Record<string, unknown>;
  ingestedAt: string;
  preview?: boolean;
}

export default function ContentPage() {
  const { agent, isScratchMode } = useStudio();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IngestResult | null>(null);
  const [sourceType, setSourceType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [maxFiles, setMaxFiles] = useState(10);
  const [previewMode, setPreviewMode] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<Set<string>>(new Set());

  // Folder path based on mode
  const getFolder = () => {
    if (isScratchMode) return `scratch/${Date.now()}`;
    return `agents/${agent?._id}/${Date.now()}`;
  };

  const detectSource = async () => {
    if (!url) return;
    try {
      const res = await fetch(`/api/content/ingest?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.success) setSourceType(data.data.type);
    } catch {
      // Ignore
    }
  };

  const handleIngest = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setDeletedFiles(new Set());

    try {
      const res = await fetch("/api/content/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, folder: getFolder(), maxFiles, preview: previewMode }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Failed to ingest");
      }
    } catch {
      setError("Failed to ingest content");
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const visibleFiles = result?.files.filter((f) => !deletedFiles.has(f.cdnUrl)) || [];

  return (
    <div style={{ padding: 32 }}>
      {/* Scratch mode banner */}
      {isScratchMode && (
        <div
          style={{
            marginBottom: 16,
            padding: "12px 16px",
            background: "rgba(102, 102, 102, 0.15)",
            borderRadius: "var(--radius)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(102, 102, 102, 0.3)",
          }}
        >
          <FlaskConical style={{ width: 18, height: 18, color: "var(--text-muted)" }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>Scratch Mode</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Content saves to scratch/ folder and won&apos;t appear in any agent&apos;s library.
            </p>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 32 }}>
        <h1 className="title">Content Library</h1>
        <p className="subtitle">
          {isScratchMode
            ? "Test content ingestion - files save to scratch/"
            : `Ingest content for ${agent?.name || "selected agent"}`}
        </p>
      </div>

      {/* Input */}
      <div className="card" style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setSourceType(null); }}
            onBlur={detectSource}
            placeholder="Paste URL (Paragon, Dropbox, Google Drive...)"
            className="form-input"
          />
        </div>

        {sourceType && (
          <p className="text-accent text-sm" style={{ marginBottom: 16 }}>
            Detected: <span style={{ fontFamily: "monospace" }}>{sourceType}</span>
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label className="text-sm text-muted">Max files:</label>
            <input
              type="number"
              value={maxFiles}
              onChange={(e) => setMaxFiles(Number(e.target.value))}
              min={1}
              max={50}
              className="form-input"
              style={{ width: 80 }}
            />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={previewMode}
              onChange={(e) => setPreviewMode(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: "var(--accent)" }}
            />
            <span className="text-sm text-muted">Preview only</span>
          </label>
        </div>

        <button
          onClick={handleIngest}
          disabled={!url || loading}
          className="btn btn-primary"
        >
          {loading ? (
            <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
          ) : (
            <Search style={{ width: 16, height: 16 }} />
          )}
          Fetch Content
        </button>
      </div>

      {error && (
        <div
          className="card"
          style={{ background: "rgba(229, 62, 62, 0.1)", borderColor: "var(--danger)", marginBottom: 32 }}
        >
          <p style={{ color: "var(--danger)" }}>{error}</p>
        </div>
      )}

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Metadata */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600 }}>Metadata</h2>
              {result.preview && (
                <span
                  style={{
                    padding: "4px 12px",
                    background: "rgba(212, 175, 55, 0.2)",
                    color: "var(--accent)",
                    borderRadius: 20,
                    fontSize: 12,
                  }}
                >
                  Preview
                </span>
              )}
            </div>
            <div className="grid-4" style={{ fontSize: 14 }}>
              <div>
                <p className="text-muted">Source</p>
                <p style={{ fontFamily: "monospace" }}>{result.source}</p>
              </div>
              <div>
                <p className="text-muted">ID</p>
                <p style={{ fontFamily: "monospace" }}>{result.id}</p>
              </div>
              <div>
                <p className="text-muted">Files</p>
                <p>{result.files.length}</p>
              </div>
              <div>
                <p className="text-muted">Size</p>
                <p>{formatSize(result.files.reduce((s, f) => s + f.size, 0))}</p>
              </div>
            </div>
            {Object.keys(result.metadata).length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                <pre
                  style={{
                    fontSize: 14,
                    background: "var(--bg)",
                    padding: 16,
                    borderRadius: "var(--radius)",
                    overflow: "auto",
                  }}
                >
                  {JSON.stringify(result.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Files */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600 }}>Files ({visibleFiles.length})</h2>
              {visibleFiles.length > 0 && !result.preview && (
                <button
                  onClick={() => result.files.forEach((f) => setDeletedFiles((p) => new Set([...p, f.cdnUrl])))}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 style={{ width: 16, height: 16 }} />
                  Delete All
                </button>
              )}
            </div>

            <div className="grid-4">
              {visibleFiles.map((file) => (
                <div key={file.id} className="photo-thumb" style={{ aspectRatio: "auto" }}>
                  {file.mimeType.startsWith("image/") ? (
                    <div style={{ position: "relative", aspectRatio: "1" }}>
                      <Image
                        src={result.preview ? "/placeholder.jpg" : file.cdnUrl}
                        alt={file.filename}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                      {result.preview && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(10, 10, 15, 0.8)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <p className="text-muted text-sm">Preview</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        aspectRatio: "1",
                        background: "var(--bg-hover)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <p className="text-muted text-sm">{file.mimeType}</p>
                    </div>
                  )}
                  <div style={{ padding: 12 }}>
                    <p className="text-sm" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {file.filename}
                    </p>
                    <p className="text-sm text-muted">{formatSize(file.size)}</p>
                    {!result.preview && (
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <a
                          href={file.cdnUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: 6 }}
                        >
                          <ExternalLink style={{ width: 12, height: 12 }} />
                        </a>
                        <button
                          onClick={() => setDeletedFiles((p) => new Set([...p, file.cdnUrl]))}
                          className="btn btn-danger btn-sm"
                          style={{ padding: 6 }}
                        >
                          <Trash2 style={{ width: 12, height: 12 }} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
