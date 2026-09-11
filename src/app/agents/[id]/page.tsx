'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAgent, getListings, getGraphics } from '@/lib/store';
import { money } from '@/lib/types';
import type { Agent, Listing, Graphic } from '@/lib/types';
import { GraphicPreview } from '@/components/GraphicPreview';

type ListingWithGraphics = Listing & { graphics: Graphic[] };

export default function AgentDashboard() {
  const params = useParams();
  const id = params.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [listings, setListings] = useState<ListingWithGraphics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundAgent = getAgent(id);
    if (!foundAgent) {
      setLoading(false);
      return;
    }
    setAgent(foundAgent);

    const agentListings = getListings(id);
    const withGraphics = agentListings.map(listing => ({
      ...listing,
      graphics: getGraphics(listing._id!),
    }));
    setListings(withGraphics);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <>
        <header className="header">
          <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
          <nav className="header-nav">
            <Link href="/gallery">Gallery</Link>
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

  if (!agent) {
    notFound();
  }

  return (
    <>
      <header className="header">
        <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
        <nav className="header-nav">
          <Link href="/gallery">Gallery</Link>
        </nav>
      </header>

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
              {listings.map((listing) => (
                <div key={listing._id} className="card">
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
                          key={graphic._id}
                          href={`/graphics/${graphic._id}`}
                          style={{
                            display: 'block',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                          }}
                        >
                          <GraphicPreview
                            graphic={graphic}
                            listing={listing}
                            agent={agent}
                            size={150}
                          />
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
