"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, ExternalLink, Search, Sparkles } from "lucide-react";

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

export default function ContentIngestPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [result, setResult] = useState<IngestResult | null>(null);
  const [sourceType, setSourceType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [maxFiles, setMaxFiles] = useState(10);
  const [previewMode, setPreviewMode] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<Set<string>>(new Set());

  const detectSource = async () => {
    if (!url) return;
    setDetecting(true);
    setSourceType(null);

    try {
      const res = await fetch(`/api/content/ingest?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.success) {
        setSourceType(data.data.type);
      }
    } catch {
      // Ignore detection errors
    } finally {
      setDetecting(false);
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
        body: JSON.stringify({
          url,
          folder: `test/${Date.now()}`,
          maxFiles,
          preview: previewMode,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Failed to ingest content");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cdnUrl: string) => {
    try {
      // For now, just mark as deleted in UI
      // TODO: Call delete API
      setDeletedFiles((prev) => new Set([...prev, cdnUrl]));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleDeleteAll = async () => {
    if (!result) return;
    result.files.forEach((f) => {
      setDeletedFiles((prev) => new Set([...prev, f.cdnUrl]));
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const visibleFiles = result?.files.filter((f) => !deletedFiles.has(f.cdnUrl)) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Content Ingest</h1>
          <p className="text-slate-400">
            Paste any link (Paragon MLS, Dropbox, Google Drive, direct URL) → fetch content → upload to your CDN
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-slate-900 rounded-xl p-6 mb-8 border border-slate-800">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setSourceType(null);
                }}
                onBlur={detectSource}
                placeholder="Paste URL here... (Paragon, Dropbox, Google Drive, or direct link)"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {detecting && (
                <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Detecting source...
                </p>
              )}
              {sourceType && !detecting && (
                <p className="text-sm text-emerald-400 mt-2">
                  Detected: <span className="font-mono">{sourceType}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-400">Max files:</label>
              <input
                type="number"
                value={maxFiles}
                onChange={(e) => setMaxFiles(Number(e.target.value))}
                min={1}
                max={50}
                className="w-20 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={previewMode}
                onChange={(e) => setPreviewMode(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600"
              />
              <span className="text-sm text-slate-400">Preview only (don&apos;t upload)</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleIngest}
              disabled={!url || loading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Fetch Content
                </>
              )}
            </button>

            <button
              disabled
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2 border border-slate-700"
              title="Coming soon: AI-powered content analysis"
            >
              <Sparkles className="w-4 h-4" />
              Analyze with AI
              <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">Soon</span>
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Metadata */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Metadata</h2>
                {result.preview && (
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                    Preview Mode
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Source</p>
                  <p className="font-mono">{result.source}</p>
                </div>
                <div>
                  <p className="text-slate-500">Ingest ID</p>
                  <p className="font-mono">{result.id}</p>
                </div>
                <div>
                  <p className="text-slate-500">Files</p>
                  <p>{result.files.length} files</p>
                </div>
                <div>
                  <p className="text-slate-500">Total Size</p>
                  <p>{formatSize(result.files.reduce((sum, f) => sum + f.size, 0))}</p>
                </div>
              </div>

              {Object.keys(result.metadata).length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-slate-500 text-sm mb-2">Extracted Data</p>
                  <pre className="text-sm bg-slate-800 p-4 rounded-lg overflow-x-auto">
                    {JSON.stringify(result.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Files Grid */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Files ({visibleFiles.length})
                </h2>
                {visibleFiles.length > 0 && !result.preview && (
                  <button
                    onClick={handleDeleteAll}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm flex items-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete All (Test)
                  </button>
                )}
              </div>

              {visibleFiles.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  {deletedFiles.size > 0 ? "All files deleted" : "No files found"}
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {visibleFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-slate-800 rounded-lg overflow-hidden group"
                    >
                      {file.mimeType.startsWith("image/") ? (
                        <div className="relative aspect-square">
                          <Image
                            src={result.preview ? "/placeholder.jpg" : file.cdnUrl}
                            alt={file.filename}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          {result.preview && (
                            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                              <p className="text-slate-400 text-sm">Preview</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-square bg-slate-700 flex items-center justify-center">
                          <p className="text-slate-400">{file.mimeType}</p>
                        </div>
                      )}

                      <div className="p-3">
                        <p className="text-sm font-medium truncate">{file.filename}</p>
                        <p className="text-xs text-slate-500">{formatSize(file.size)}</p>

                        <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!result.preview && (
                            <a
                              href={file.cdnUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {!result.preview && (
                            <button
                              onClick={() => handleDelete(file.cdnUrl)}
                              className="p-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
