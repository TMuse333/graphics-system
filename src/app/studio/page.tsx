"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Send,
  Loader2,
  Link as LinkIcon,
  ImageIcon,
  Download,
  Layers,
  Globe,
  Check,
  AlertCircle,
  Trash2,
  ExternalLink,
  FlaskConical,
} from "lucide-react";
import { CAPABILITIES } from "@/lib/agent/capabilities";
import { GRAPHIC_TYPES } from "@/lib/content/graphicTypes";
import { useStudio } from "./layout";

type Step =
  | { type: "idle" }
  | { type: "detecting" }
  | { type: "choose-capability"; url: string }
  | { type: "choose-graphic-type"; url: string; ingestResult: IngestResult }
  | { type: "collect-inputs"; capability: string; graphicType?: string; ingestResult: IngestResult }
  | { type: "preview"; data: unknown }
  | { type: "error"; message: string };

interface IngestResult {
  id: string;
  source: string;
  sourceUrl: string;
  files: { cdnUrl: string; filename: string; size: number }[];
  metadata: Record<string, unknown>;
}

const capabilityIcons: Record<string, React.ReactNode> = {
  "ingest-content": <Download style={{ width: 20, height: 20 }} />,
  "create-listing-graphic": <ImageIcon style={{ width: 20, height: 20 }} />,
  "create-content-graphic": <Layers style={{ width: 20, height: 20 }} />,
  "update-website": <Globe style={{ width: 20, height: 20 }} />,
};

export default function StudioSandbox() {
  const { agent, isScratchMode } = useStudio();
  const [input, setInput] = useState("");
  const [step, setStep] = useState<Step>({ type: "idle" });
  const [ingestResult, setIngestResult] = useState<IngestResult | null>(null);
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);
  const [selectedGraphicType, setSelectedGraphicType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Folder path based on mode
  const getFolder = () => {
    if (isScratchMode) return `scratch/${Date.now()}`;
    return `agents/${agent?._id}/${Date.now()}`;
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const urlMatch = input.match(/https?:\/\/[^\s]+/);

    if (urlMatch) {
      setStep({ type: "detecting" });
      setLoading(true);

      try {
        const detectRes = await fetch(`/api/content/ingest?url=${encodeURIComponent(urlMatch[0])}`);
        const detectData = await detectRes.json();

        if (detectData.success) {
          setStep({ type: "choose-capability", url: urlMatch[0] });
        } else {
          setStep({ type: "error", message: "Could not detect URL type" });
        }
      } catch {
        setStep({ type: "error", message: "Failed to process URL" });
      } finally {
        setLoading(false);
      }
    } else {
      setStep({ type: "choose-capability", url: "" });
    }
  };

  const handleCapabilitySelect = async (capabilityId: string) => {
    setSelectedCapability(capabilityId);

    if (capabilityId === "ingest-content" || capabilityId === "create-listing-graphic") {
      const urlMatch = input.match(/https?:\/\/[^\s]+/);
      if (!urlMatch) {
        setStep({ type: "error", message: "No URL found in input" });
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/content/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: urlMatch[0],
            folder: getFolder(),
            maxFiles: 10,
          }),
        });

        const data = await res.json();

        if (data.success) {
          setIngestResult(data.data);

          if (capabilityId === "ingest-content") {
            setStep({ type: "preview", data: data.data });
          } else {
            setStep({ type: "choose-graphic-type", url: urlMatch[0], ingestResult: data.data });
          }
        } else {
          setStep({ type: "error", message: data.error || "Failed to ingest content" });
        }
      } catch {
        setStep({ type: "error", message: "Failed to ingest content" });
      } finally {
        setLoading(false);
      }
    } else if (capabilityId === "create-content-graphic") {
      setStep({ type: "collect-inputs", capability: capabilityId, ingestResult: {} as IngestResult });
    }
  };

  const handleGraphicTypeSelect = (typeId: string) => {
    setSelectedGraphicType(typeId);
    if (ingestResult) {
      setStep({ type: "collect-inputs", capability: "create-listing-graphic", graphicType: typeId, ingestResult });
    }
  };

  const handleReset = () => {
    setInput("");
    setStep({ type: "idle" });
    setIngestResult(null);
    setSelectedCapability(null);
    setSelectedGraphicType(null);
    inputRef.current?.focus();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getApplicableGraphicTypes = () => {
    if (!ingestResult) return GRAPHIC_TYPES;

    const meta = ingestResult.metadata;
    const address = (meta.address as string) || "";

    let propertyType: "residential" | "land" | "commercial" = "residential";
    if (/^lot\b/i.test(address) || (!meta.beds && !meta.baths && meta.lotSize)) {
      propertyType = "land";
    }

    return GRAPHIC_TYPES.filter((g) => g.appliesTo.includes(propertyType));
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: 32 }}>
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
              Testing without saving to any agent. Content goes to scratch/ folder.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="title">Sandbox</h1>
        <p className="subtitle">
          {isScratchMode
            ? "Test the pipeline - paste a link to see what data we can extract"
            : `Working as ${agent?.name} - paste a link, drop an image, or describe what you need`}
        </p>
      </div>

      {/* Input */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <LinkIcon
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                width: 20,
                height: 20,
                color: "var(--text-muted)",
              }}
            />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Paste Paragon link, or describe what you need..."
              className="form-input"
              style={{ paddingLeft: 48 }}
              disabled={loading}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || loading}
            className="btn btn-primary"
            style={{ padding: "12px 24px" }}
          >
            {loading ? (
              <Loader2 style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }} />
            ) : (
              <Send style={{ width: 20, height: 20 }} />
            )}
          </button>
        </div>
      </div>

      {/* Agent Response Area */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {step.type === "idle" && (
          <div style={{ textAlign: "center", padding: "64px 0", color: "var(--text-muted)" }}>
            <p style={{ marginBottom: 16 }}>Examples:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
              <p>&quot;Just listed graphic for [paragon link]&quot;</p>
              <p>&quot;Open house Saturday 2-4 [paragon link]&quot;</p>
              <p>&quot;Fetch images from [dropbox link]&quot;</p>
            </div>
          </div>
        )}

        {step.type === "detecting" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 0" }}>
            <Loader2 style={{ width: 32, height: 32, animation: "spin 1s linear infinite", color: "var(--accent)" }} />
            <span style={{ marginLeft: 12, color: "var(--text-muted)" }}>Analyzing link...</span>
          </div>
        )}

        {step.type === "error" && (
          <div
            className="card"
            style={{ background: "rgba(229, 62, 62, 0.1)", borderColor: "var(--danger)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--danger)", marginBottom: 16 }}>
              <AlertCircle style={{ width: 20, height: 20 }} />
              <span style={{ fontWeight: 500 }}>Error</span>
            </div>
            <p style={{ color: "var(--danger)", marginBottom: 16 }}>{step.message}</p>
            <button onClick={handleReset} className="btn btn-secondary">
              Try again
            </button>
          </div>
        )}

        {step.type === "choose-capability" && (
          <div className="card">
            <p style={{ fontSize: 18, marginBottom: 24 }}>What would you like to do?</p>

            <div className="grid-2">
              {CAPABILITIES.filter((cap) =>
                step.url ? cap.id !== "create-content-graphic" : true
              ).map((cap) => (
                <button
                  key={cap.id}
                  onClick={() => handleCapabilitySelect(cap.id)}
                  disabled={loading}
                  className="card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    textAlign: "left",
                    cursor: "pointer",
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "var(--radius)",
                      background: "var(--bg-hover)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent)",
                    }}
                  >
                    {capabilityIcons[cap.id]}
                  </div>
                  <div>
                    <p style={{ fontWeight: 500 }}>{cap.name}</p>
                    <p className="text-sm text-muted">{cap.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step.type === "choose-graphic-type" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Show scraped listing preview */}
            <div className="card">
              <p className="text-sm text-muted" style={{ marginBottom: 16 }}>Found listing:</p>

              <div style={{ display: "flex", gap: 16 }}>
                {step.ingestResult.files[0] && (
                  <div
                    style={{
                      width: 128,
                      height: 96,
                      borderRadius: "var(--radius)",
                      overflow: "hidden",
                      background: "var(--bg-hover)",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={step.ingestResult.files[0].cdnUrl}
                      alt="Listing"
                      fill
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  <p style={{ fontWeight: 500, fontSize: 18 }}>
                    {(step.ingestResult.metadata.address as string) || "Address unavailable"}
                  </p>
                  <p className="text-muted">
                    {(step.ingestResult.metadata.city as string) || ""}{" "}
                    {(step.ingestResult.metadata.province as string) || ""}
                  </p>
                  {typeof step.ingestResult.metadata.price === "number" && (
                    <p className="text-accent" style={{ fontWeight: 500, marginTop: 4 }}>
                      ${step.ingestResult.metadata.price.toLocaleString()}
                    </p>
                  )}
                  <p className="text-sm text-muted" style={{ marginTop: 4 }}>
                    MLS# {(step.ingestResult.metadata.mlsNumber as string) || "N/A"} •{" "}
                    {step.ingestResult.files.length} images
                  </p>
                </div>
              </div>
            </div>

            {/* Graphic type selection */}
            <div className="card">
              <p style={{ fontSize: 18, marginBottom: 24 }}>What type of graphic?</p>

              <div className="grid-3">
                {getApplicableGraphicTypes().map((gType) => (
                  <button
                    key={gType.id}
                    onClick={() => handleGraphicTypeSelect(gType.id)}
                    className="card"
                    style={{ textAlign: "center", cursor: "pointer" }}
                  >
                    <p style={{ fontWeight: 500 }}>{gType.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step.type === "collect-inputs" && (
          <div className="card">
            <p style={{ fontSize: 18, marginBottom: 8 }}>
              {selectedGraphicType
                ? GRAPHIC_TYPES.find((g) => g.id === selectedGraphicType)?.name
                : "Content Graphic"}
            </p>
            <p className="text-muted" style={{ marginBottom: 24 }}>
              Additional inputs needed - coming soon
            </p>

            {/* Show what we have */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {typeof step.ingestResult.metadata?.address === "string" && step.ingestResult.metadata.address && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                  <Check style={{ width: 16, height: 16, color: "var(--success)" }} />
                  <span>Address: {step.ingestResult.metadata.address}</span>
                </div>
              )}
              {typeof step.ingestResult.metadata?.price === "number" && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                  <Check style={{ width: 16, height: 16, color: "var(--success)" }} />
                  <span>Price: ${step.ingestResult.metadata.price.toLocaleString()}</span>
                </div>
              )}
              {step.ingestResult.files?.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                  <Check style={{ width: 16, height: 16, color: "var(--success)" }} />
                  <span>Images: {step.ingestResult.files.length} available</span>
                </div>
              )}
            </div>

            <p className="text-sm" style={{ color: "#d69e2e", marginBottom: 16 }}>
              Template rendering not yet implemented. View ingested content below.
            </p>

            <button onClick={handleReset} className="btn btn-secondary">
              Start over
            </button>
          </div>
        )}

        {step.type === "preview" && ingestResult && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Metadata */}
            <div className="card">
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 600 }}>Retrieved Content</h2>
                <span
                  style={{
                    padding: "4px 12px",
                    background: "rgba(56, 161, 105, 0.2)",
                    color: "var(--success)",
                    borderRadius: 20,
                    fontSize: 12,
                  }}
                >
                  Uploaded to CDN
                </span>
              </div>

              <div className="grid-4" style={{ fontSize: 14, marginBottom: 16 }}>
                <div>
                  <p className="text-muted">Source</p>
                  <p style={{ fontFamily: "monospace" }}>{ingestResult.source}</p>
                </div>
                <div>
                  <p className="text-muted">ID</p>
                  <p style={{ fontFamily: "monospace" }}>{ingestResult.id}</p>
                </div>
                <div>
                  <p className="text-muted">Files</p>
                  <p>{ingestResult.files.length}</p>
                </div>
                <div>
                  <p className="text-muted">Size</p>
                  <p>{formatSize(ingestResult.files.reduce((s, f) => s + f.size, 0))}</p>
                </div>
              </div>

              {Object.keys(ingestResult.metadata).length > 0 && (
                <div style={{ paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                  <p className="text-muted text-sm" style={{ marginBottom: 8 }}>Metadata</p>
                  <pre
                    style={{
                      fontSize: 14,
                      background: "var(--bg)",
                      padding: 16,
                      borderRadius: "var(--radius)",
                      overflow: "auto",
                    }}
                  >
                    {JSON.stringify(ingestResult.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Images */}
            <div className="card">
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
                Images ({ingestResult.files.length})
              </h2>

              <div className="grid-4">
                {ingestResult.files.map((file, idx) => (
                  <div
                    key={idx}
                    className="photo-thumb"
                    style={{ aspectRatio: "auto", background: "var(--bg-hover)" }}
                  >
                    <div style={{ position: "relative", aspectRatio: "1" }}>
                      <Image
                        src={file.cdnUrl}
                        alt={file.filename}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    </div>
                    <div style={{ padding: 8 }}>
                      <p className="text-sm" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {file.filename}
                      </p>
                      <p className="text-sm text-muted">{formatSize(file.size)}</p>
                      <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                        <a
                          href={file.cdnUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: 4 }}
                        >
                          <ExternalLink style={{ width: 12, height: 12 }} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleReset} className="btn btn-secondary">
                <Trash2 style={{ width: 16, height: 16 }} />
                Clear & Start Over
              </button>
              <button
                onClick={() => {
                  setStep({
                    type: "choose-graphic-type",
                    url: ingestResult.sourceUrl,
                    ingestResult,
                  });
                }}
                className="btn btn-primary"
              >
                <ImageIcon style={{ width: 16, height: 16 }} />
                Create Graphic from This
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
