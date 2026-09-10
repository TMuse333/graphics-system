import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAgent, getListings, getGraphics, isDbConnected } from '@/lib/db';
import { money } from '@/lib/types';
import { mockAgents, mockListings, mockGraphics } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AgentDashboard({ params }: Props) {
  const { id } = await params;
  const connected = await isDbConnected();

  // Use mock data if not connected
  const agent = connected
    ? await getAgent(id)
    : mockAgents.find(a => a._id === id) || null;

  if (!agent) notFound();

  const listings = connected
    ? await getListings(id)
    : mockListings.filter(l => l.agentId === id);

  // Get graphics for each listing
  const listingsWithGraphics = await Promise.all(
    listings.map(async (listing) => {
      const graphics = connected
        ? await getGraphics(listing._id!.toString())
        : mockGraphics.filter(g => g.listingId.toString() === listing._id!.toString());
      return { ...listing, graphics };
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
          Demo Mode — MongoDB not connected
        </div>
      )}

      <main className="page">
        <div className="container">
          <Link href="/" className="back-link">← All Clients</Link>

          {/* Agent header */}
          <div className="card mb-xl">
            <div className="card-row">
              <div className="avatar" style={{ width: '100px', height: '100px' }}>
                {agent.headshotUrl && (
                  <img src={agent.headshotUrl} alt={agent.name} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
                  {agent.name}
                </h1>
                <p className="text-muted">{agent.title}</p>
                <p className="text-muted text-sm" style={{ marginTop: '8px' }}>
                  {agent.phone} · {agent.website}
                </p>
              </div>
              <div>
                <div className="theme-swatches mb-sm">
                  <div className="theme-swatch" style={{ background: agent.theme.primary }} title="Primary" />
                  <div className="theme-swatch" style={{ background: agent.theme.primaryAlt }} title="Primary Alt" />
                  <div className="theme-swatch" style={{ background: agent.theme.accent }} title="Accent" />
                  <div className="theme-swatch" style={{ background: agent.theme.accentLight }} title="Accent Light" />
                </div>
                <Link href={`/agents/${id}/brand`} className="btn btn-secondary btn-sm">
                  Edit Brand
                </Link>
              </div>
            </div>
          </div>

          {/* Listings section */}
          <div className="flex-between mb-lg">
            <h2 className="section-title" style={{ marginBottom: 0 }}>Listings</h2>
            <Link href={`/agents/${id}/listings/new`} className="btn btn-primary">
              + New Listing
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p className="text-muted mb-md">No listings yet</p>
              <Link href={`/agents/${id}/listings/new`} className="btn btn-primary">
                Add First Listing
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {listingsWithGraphics.map((listing) => (
                <div key={listing._id!.toString()} className="card">
                  <div className="flex-between mb-md">
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
                        {listing.address}
                      </h3>
                      <p className="text-muted text-sm">
                        {listing.city}, {listing.province} · MLS {listing.mls}
                      </p>
                      <p className="text-accent" style={{ marginTop: '4px', fontWeight: 600 }}>
                        {money(listing.price)}
                        {listing.beds && ` · ${listing.beds} bed`}
                        {listing.baths && ` · ${listing.baths} bath`}
                        {listing.acres && ` · ${listing.acres} acres`}
                      </p>
                    </div>
                    <div className="flex gap-sm">
                      <Link
                        href={`/agents/${id}/listings/${listing._id}/edit`}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>

                  {/* Graphics for this listing */}
                  <div>
                    <p className="text-muted text-sm mb-sm">Graphics</p>
                    <div className="grid-4">
                      {listing.graphics.map((graphic) => (
                        <Link
                          key={graphic._id!.toString()}
                          href={`/graphics/${graphic._id}`}
                          className="graphic-thumb"
                        >
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            padding: '12px',
                          }}>
                            <span className="text-accent text-sm" style={{ fontWeight: 600 }}>
                              {graphic.variant.replace('-', ' ').toUpperCase()}
                            </span>
                            <span className="text-muted text-sm">
                              {graphic.templateId}
                            </span>
                          </div>
                        </Link>
                      ))}
                      <Link
                        href={`/graphics/new?listingId=${listing._id}`}
                        className="graphic-thumb graphic-thumb-add"
                      >
                        <span style={{ fontSize: '24px' }}>+</span>
                        <span>New</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
