'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAgents, getAgentStats } from '@/lib/store';
import type { Agent } from '@/lib/types';

type AgentWithStats = Agent & { listings: number; graphics: number };

export default function HomePage() {
  const [agents, setAgents] = useState<AgentWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allAgents = getAgents();
    const withStats = allAgents.map(agent => ({
      ...agent,
      ...getAgentStats(agent._id),
    }));
    setAgents(withStats);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <>
        <header className="header">
          <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
          <nav className="header-nav">
            <Link href="/gallery">Gallery</Link>
            <Link href="/generate">Generate</Link>
          </nav>
        </header>
        <main className="page">
          <div className="container">
            <p className="text-muted">Loading...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <header className="header">
        <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
        <nav className="header-nav">
          <Link href="/gallery">Gallery</Link>
          <Link href="/showcase">Showcase</Link>
          <Link href="/generate">Generate</Link>
        </nav>
      </header>

      <main className="page">
        <div className="container">
          <div className="flex-between mb-xl">
            <div>
              <h1 className="title">Your Clients</h1>
              <p className="subtitle">Select a client to manage their listings and graphics</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/generate" className="btn btn-secondary">Bulk Generate</Link>
              <Link href="/agents/new" className="btn btn-primary">+ New Agent</Link>
            </div>
          </div>

          {agents.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
              <p className="text-muted mb-md">No agents yet</p>
              <Link href="/agents/new" className="btn btn-primary">Add Your First Client</Link>
            </div>
          ) : (
            <div className="grid-2">
              {agents.map((agent) => (
                <Link key={agent._id} href={`/agents/${agent._id}`} className="card">
                  <div className="card-row">
                    <div className="avatar">
                      {agent.headshotUrl && (
                        <img src={agent.headshotUrl} alt={agent.name} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
                        {agent.name}
                      </h3>
                      <p className="text-muted text-sm">{agent.title}</p>
                      <p className="text-muted text-sm" style={{ marginTop: '8px' }}>
                        {agent.listings} listings · {agent.graphics} graphics
                      </p>
                    </div>
                    <div className="theme-swatches">
                      <div className="theme-swatch" style={{ background: agent.theme.primary }} />
                      <div className="theme-swatch" style={{ background: agent.theme.accent }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
