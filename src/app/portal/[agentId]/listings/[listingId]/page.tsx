'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAgent, getListing, getGraphics } from '@/lib/store';
import { money } from '@/lib/types';
import type { Agent, Listing, Graphic } from '@/lib/types';
import { GraphicPreview } from '@/components/GraphicPreview';

export default function ClientListingPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const listingId = params.listingId as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [graphics, setGraphics] = useState<Graphic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundAgent = getAgent(agentId);
    const foundListing = getListing(listingId);

    if (!foundAgent || !foundListing || foundListing.agentId !== agentId) {
      setLoading(false);
      return;
    }

    setAgent(foundAgent);
    setListing(foundListing);
    setGraphics(getGraphics(listingId));
    setLoading(false);
  }, [agentId, listingId]);

  if (loading) {
    return (
      <>
        <header className="header">
          <span className="header-logo">LISTING GRAPHICS</span>
        </header>
        <main className="page">
          <div className="container">
            <p className="text-muted">Loading...</p>
          </div>
        </main>
      </>
    );
  }

  if (!agent || !listing) {
    notFound();
  }

  const statusLabel = {
    'pending': 'Awaiting Graphics',
    'in-progress': 'In Progress',
    'delivered': 'Delivered',
  }[listing.status];

  const statusColor = {
    'pending': 'var(--text-muted)',
    'in-progress': 'var(--accent)',
    'delivered': '#22c55e',
  }[listing.status];

  return (
    <>
      <header className="header">
        <span className="header-logo">LISTING GRAPHICS</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="text-muted">{agent.name}</span>
          <div className="avatar" style={{ width: '36px', height: '36px' }}>
            {agent.headshotUrl && <img src={agent.headshotUrl} alt={agent.name} />}
          </div>
        </div>
      </header>

      <main className="page">
        <div className="container">
          <Link href={`/portal/${agentId}`} className="back-link">
            ← Back to Dashboard
          </Link>

          {/* Listing Header */}
          <div className="card mb-lg">
            <div className="flex-between mb-md">
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
                  {listing.address}
                </h1>
                <p className="text-muted">
                  {listing.city}, {listing.province} {listing.postal}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: statusColor,
                    color: listing.status === 'delivered' || listing.status === 'in-progress' ? '#000' : '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  {statusLabel}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div>
                <p className="text-muted text-sm">Price</p>
                <p style={{ fontWeight: 600 }}>{money(listing.price)}</p>
              </div>
              <div>
                <p className="text-muted text-sm">MLS #</p>
                <p style={{ fontWeight: 600 }}>{listing.mls}</p>
              </div>
              {listing.beds && (
                <div>
                  <p className="text-muted text-sm">Beds</p>
                  <p style={{ fontWeight: 600 }}>{listing.beds}</p>
                </div>
              )}
              {listing.baths && (
                <div>
                  <p className="text-muted text-sm">Baths</p>
                  <p style={{ fontWeight: 600 }}>{listing.baths}</p>
                </div>
              )}
              {listing.acres && (
                <div>
                  <p className="text-muted text-sm">Acres</p>
                  <p style={{ fontWeight: 600 }}>{listing.acres}</p>
                </div>
              )}
            </div>

            {listing.submittedAt && (
              <p className="text-muted text-sm" style={{ marginTop: '16px' }}>
                Submitted {new Date(listing.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {listing.deliveredAt && (
                  <> · Delivered {new Date(listing.deliveredAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</>
                )}
              </p>
            )}
          </div>

          {/* Requested Variants */}
          {listing.requestedVariants && listing.requestedVariants.length > 0 && (
            <div className="card mb-lg">
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Requested Graphics</h2>
              <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                {listing.requestedVariants.map((v) => {
                  const hasGraphic = graphics.some(g => g.variant === v);
                  return (
                    <span
                      key={v}
                      className="btn btn-secondary btn-sm"
                      style={{
                        pointerEvents: 'none',
                        background: hasGraphic ? '#22c55e' : undefined,
                        color: hasGraphic ? '#000' : undefined,
                      }}
                    >
                      {hasGraphic && '✓ '}
                      {v.replace('-', ' ')}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          {listing.notes && (
            <div className="card mb-lg">
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Notes</h2>
              <p className="text-muted">{listing.notes}</p>
            </div>
          )}

          {/* Photos */}
          {listing.photos.length > 0 && (
            <div className="card mb-lg">
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Photos</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                {listing.photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: index === 0 ? '2px solid var(--accent)' : '1px solid var(--border)',
                    }}
                  >
                    <img
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Graphics */}
          <div className="card">
            <div className="flex-between mb-md">
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Your Graphics</h2>
              {graphics.length > 0 && (
                <span className="text-accent" style={{ fontWeight: 600 }}>
                  {graphics.length} graphics
                </span>
              )}
            </div>

            {graphics.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p className="text-muted">Graphics are being created...</p>
                <p className="text-muted text-sm" style={{ marginTop: '8px' }}>
                  You'll see them here once they're ready.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {graphics.map((graphic) => (
                  <div key={graphic._id}>
                    <Link
                      href={`/render/${graphic._id}`}
                      target="_blank"
                      style={{
                        display: 'block',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        marginBottom: '8px',
                      }}
                    >
                      <GraphicPreview
                        graphic={graphic}
                        listing={listing}
                        agent={agent}
                        size={200}
                      />
                    </Link>
                    <p className="text-sm text-center" style={{ textTransform: 'capitalize' }}>
                      {graphic.variant.replace('-', ' ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
