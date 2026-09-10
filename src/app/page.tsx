import Link from 'next/link';
import { getAgents, getAgentStats, isDbConnected } from '@/lib/db';
import { SeedButton } from '@/components/SeedButton';
import { mockAgents, mockAgentStats } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const connected = await isDbConnected();

  // Use mock data if not connected
  const agents = connected ? await getAgents() : mockAgents;

  const agentsWithStats = await Promise.all(
    agents.map(async (agent) => {
      const stats = connected
        ? await getAgentStats(agent._id)
        : mockAgentStats[agent._id] || { listings: 0, graphics: 0 };
      return { ...agent, ...stats };
    })
  );

  return (
    <>
      <header className="header">
        <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
        <nav className="header-nav">
          <Link href="/gallery">Gallery</Link>
        </nav>
      </header>

      {!connected && (
        <div style={{
          background: 'var(--accent)',
          color: '#000',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 500,
        }}>
          Demo Mode — MongoDB not connected. Add MONGODB_URI to .env.local
        </div>
      )}

      <main className="page">
        <div className="container">
          <div className="flex-between mb-xl">
            <div>
              <h1 className="title">Your Clients</h1>
              <p className="subtitle">Select a client to manage their listings and graphics</p>
            </div>
            <Link href="/agents/new" className="btn btn-primary">+ New Agent</Link>
          </div>

          {agents.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
              <p className="text-muted mb-md">No agents yet</p>
              <Link href="/agents/new" className="btn btn-primary">Add Your First Client</Link>
              <div style={{ marginTop: '16px' }}>
                <SeedButton />
              </div>
            </div>
          ) : (
            <div className="grid-2">
              {agentsWithStats.map((agent) => (
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
