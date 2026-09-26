"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  FolderOpen,
  Image,
  Settings,
  Sparkles,
  ChevronDown,
  Check,
  FlaskConical,
} from "lucide-react";
import { getAgents } from "@/lib/store";
import type { Agent } from "@/lib/types";

const navItems = [
  { href: "/studio", label: "Sandbox", icon: MessageSquare, exact: true },
  { href: "/studio/content", label: "Content", icon: FolderOpen },
  { href: "/studio/graphics", label: "Graphics", icon: Image },
  { href: "/studio/settings", label: "Settings", icon: Settings },
];

// Scratch mode pseudo-agent
const SCRATCH_AGENT: Agent = {
  _id: "__scratch__",
  name: "Scratch Mode",
  title: "Test & Preview",
  phone: "",
  email: "",
  website: "",
  headshotUrl: "",
  logoUrl: "",
  theme: {
    primary: "#444444",
    primaryAlt: "#333333",
    accent: "#666666",
    accentLight: "#888888",
    fontDisplay: "system-ui",
    fontNarrow: "system-ui",
    fontScript: "system-ui",
  },
};

// Context for sharing selected agent across Studio
interface StudioContextValue {
  agent: Agent | null;
  setAgent: (agent: Agent) => void;
  agents: Agent[];
  isScratchMode: boolean;
}

const StudioContext = createContext<StudioContextValue>({
  agent: null,
  setAgent: () => {},
  agents: [],
  isScratchMode: false,
});

export function useStudio() {
  return useContext(StudioContext);
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectorOpen, setSelectorOpen] = useState(false);

  // Load agents on mount
  useEffect(() => {
    const loadedAgents = getAgents();
    setAgents(loadedAgents);

    // Try to restore from localStorage, or default to scratch mode
    const savedAgentId = localStorage.getItem("studio-agent-id");
    if (savedAgentId === "__scratch__") {
      setSelectedAgent(SCRATCH_AGENT);
    } else {
      const savedAgent = loadedAgents.find((a) => a._id === savedAgentId);
      setSelectedAgent(savedAgent || SCRATCH_AGENT);
    }
  }, []);

  // Persist selection
  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    localStorage.setItem("studio-agent-id", agent._id);
    setSelectorOpen(false);
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const isScratchMode = selectedAgent?._id === "__scratch__";

  return (
    <StudioContext.Provider value={{ agent: selectedAgent, setAgent: handleSelectAgent, agents, isScratchMode }}>
      <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 260,
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            background: "var(--bg-elevated)",
          }}
        >
          {/* Logo */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <Link href="/studio" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, var(--accent), #b8963a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles style={{ width: 20, height: 20, color: "#000" }} />
              </div>
              <div>
                <h1 style={{ fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Studio</h1>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Agent Workspace</p>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderRadius: "var(--radius)",
                    transition: "all 0.15s",
                    background: active ? "var(--bg-hover)" : "transparent",
                    color: active ? "var(--accent)" : "var(--text-muted)",
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  <Icon style={{ width: 20, height: 20 }} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Agent selector */}
          <div style={{ padding: 16, borderTop: "1px solid var(--border)", position: "relative" }}>
            {/* Scratch mode indicator */}
            {isScratchMode && (
              <div
                style={{
                  marginBottom: 12,
                  padding: "8px 12px",
                  background: "rgba(102, 102, 102, 0.2)",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <FlaskConical style={{ width: 14, height: 14 }} />
                <span>Content saves to scratch/</span>
              </div>
            )}

            <button
              onClick={() => setSelectorOpen(!selectorOpen)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "var(--bg)",
                borderRadius: "var(--radius)",
                border: `1px solid ${isScratchMode ? "rgba(102, 102, 102, 0.5)" : "var(--border)"}`,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {selectedAgent ? (
                <>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: isScratchMode ? 8 : "50%",
                      background: isScratchMode
                        ? "linear-gradient(135deg, #555, #333)"
                        : (selectedAgent.theme?.accent || "var(--accent)"),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 14,
                      color: isScratchMode ? "#aaa" : "#000",
                      flexShrink: 0,
                    }}
                  >
                    {isScratchMode ? (
                      <FlaskConical style={{ width: 18, height: 18 }} />
                    ) : (
                      selectedAgent.name.charAt(0)
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 500, fontSize: 14, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {selectedAgent.name}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {selectedAgent.title}
                    </p>
                  </div>
                </>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>Select agent...</span>
              )}
              <ChevronDown
                style={{
                  width: 16,
                  height: 16,
                  color: "var(--text-muted)",
                  transform: selectorOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.15s",
                }}
              />
            </button>

            {/* Dropdown */}
            {selectorOpen && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: 16,
                  right: 16,
                  marginBottom: 8,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                  boxShadow: "0 -4px 20px rgba(0,0,0,0.3)",
                  maxHeight: 300,
                  overflowY: "auto",
                }}
              >
                {/* Scratch mode option */}
                <button
                  onClick={() => handleSelectAgent(SCRATCH_AGENT)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: isScratchMode ? "var(--bg-hover)" : "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: "linear-gradient(135deg, #555, #333)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FlaskConical style={{ width: 16, height: 16, color: "#aaa" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 500, fontSize: 14, color: "var(--text)" }}>Scratch Mode</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Test & preview without saving</p>
                  </div>
                  {isScratchMode && (
                    <Check style={{ width: 16, height: 16, color: "var(--text-muted)" }} />
                  )}
                </button>

                {/* Divider */}
                <div style={{ padding: "8px 16px", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, background: "var(--bg)" }}>
                  Agents
                </div>

                {/* Real agents */}
                {agents.map((agent) => (
                  <button
                    key={agent._id}
                    onClick={() => handleSelectAgent(agent)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      background: selectedAgent?._id === agent._id ? "var(--bg-hover)" : "transparent",
                      border: "none",
                      borderBottom: "1px solid var(--border)",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: agent.theme?.accent || "var(--accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 12,
                        color: "#000",
                        flexShrink: 0,
                      }}
                    >
                      {agent.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 500, fontSize: 14, color: "var(--text)" }}>{agent.name}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{agent.title}</p>
                    </div>
                    {selectedAgent?._id === agent._id && (
                      <Check style={{ width: 16, height: 16, color: "var(--accent)" }} />
                    )}
                  </button>
                ))}

                {agents.length === 0 && (
                  <div style={{ padding: "16px", color: "var(--text-muted)", fontSize: 14, textAlign: "center" }}>
                    No agents found
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
      </div>
    </StudioContext.Provider>
  );
}
