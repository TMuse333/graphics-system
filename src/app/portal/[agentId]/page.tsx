'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAgent, getListings, getGraphics, getActivePackage, getPackageUsage } from '@/lib/store';
import { PACKAGE_LIMITS } from '@/lib/types';
import { money } from '@/lib/types';
import type { Agent, Listing, Graphic, Package } from '@/lib/types';
import { GraphicPreview } from '@/components/GraphicPreview';

type ListingWithGraphics = Listing & { graphics: Graphic[] };

export default function ClientPortal() {
  const params = useParams();
  const agentId = params.agentId as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [listings, setListings] = useState<ListingWithGraphics[]>([]);
  const [activePackage, setActivePackage] = useState<Package | null>(null);
  const [packageUsage, setPackageUsage] = useState<{ used: number; limit: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundAgent = getAgent(agentId);
    if (!foundAgent) {
      setLoading(false);
      return;
    }
    setAgent(foundAgent);

    const agentListings = getListings(agentId);
    const withGraphics = agentListings.map(listing => ({
      ...listing,
      graphics: getGraphics(listing._id!),
    }));
    setListings(withGraphics);

    const pkg = getActivePackage(agentId);
    setActivePackage(pkg);
    if (pkg) {
      setPackageUsage(getPackageUsage(pkg._id));
    }

    setLoading(false);
  }, [agentId]);

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

  if (!agent) {
    notFound();
  }

  const pendingListings = listings.filter(l => l.status === 'pending' || l.status === 'in-progress');
  const deliveredListings = listings.filter(l => l.status === 'delivered');

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
          <div className="flex-between mb-lg">
            <h1 className="title">Your Dashboard</h1>
            <Link href={`/portal/${agentId}/submit`} className="btn btn-primary">
              + Submit New Listing
            </Link>
          </div>

          {/* Package Status */}
          {activePackage && packageUsage && (
            <div className="card mb-xl">
              <div className="flex-between mb-md">
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
                    {activePackage.type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </h2>
                  <p className="text-muted text-sm">
                    Purchased {new Date(activePackage.purchasedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="text-accent" style={{ fontSize: '24px', fontWeight: 700 }}>
                    {packageUsage.limit - packageUsage.used}
                  </span>
                  <p className="text-muted text-sm">graphics remaining</p>
                </div>
              </div>
              <div style={{ background: 'var(--surface)', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                <div
                  style={{
                    background: 'var(--accent)',
                    height: '100%',
                    width: `${(packageUsage.used / packageUsage.limit) * 100}%`,
                    transition: 'width 0.3s',
                  }}
                />
              </div>
              <p className="text-muted text-sm" style={{ marginTop: '8px' }}>
                {packageUsage.used} of {packageUsage.limit} graphics used
              </p>
            </div>
          )}

          {/* Pending Listings */}
          {pendingListings.length > 0 && (
            <>
              <h2 className="section-title">Pending</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {pendingListings.map((listing) => (
                  <div key={listing._id} className="card">
                    <div className="flex-between">
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                          {listing.address}
                        </h3>
                        <p className="text-muted text-sm">
                          {listing.city}, {listing.province} · {money(listing.price)}
                        </p>
                        {listing.submittedAt && (
                          <p className="text-muted text-sm" style={{ marginTop: '4px' }}>
                            Submitted {new Date(listing.submittedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          className="btn btn-secondary btn-sm"
                          style={{
                            pointerEvents: 'none',
                            background: listing.status === 'in-progress' ? 'var(--accent)' : undefined,
                            color: listing.status === 'in-progress' ? 'var(--bg)' : undefined,
                          }}
                        >
                          {listing.status === 'pending' ? 'Awaiting graphics' : 'In progress'}
                        </span>
                        <Link href={`/portal/${agentId}/listings/${listing._id}`} className="btn btn-secondary btn-sm">
                          View
                        </Link>
                      </div>
                    </div>
                    {listing.requestedVariants && listing.requestedVariants.length > 0 && (
                      <div className="flex gap-sm" style={{ marginTop: '12px' }}>
                        {listing.requestedVariants.map((v) => (
                          <span key={v} className="text-muted text-sm" style={{ textTransform: 'capitalize' }}>
                            {v.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Delivered Listings */}
          <h2 className="section-title">Completed</h2>
          {deliveredListings.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p className="text-muted">No completed graphics yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {deliveredListings.map((listing) => (
                <div key={listing._id} className="card">
                  <div className="flex-between mb-md">
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                        {listing.address}
                      </h3>
                      <p className="text-muted text-sm">
                        {listing.city}, {listing.province} · {money(listing.price)}
                      </p>
                      {listing.deliveredAt && (
                        <p className="text-muted text-sm" style={{ marginTop: '4px' }}>
                          Delivered {new Date(listing.deliveredAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="text-accent" style={{ fontWeight: 600 }}>
                        {listing.graphics.length} graphics
                      </span>
                    </div>
                  </div>

                  {listing.graphics.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                      {listing.graphics.map((graphic) => (
                        <Link
                          key={graphic._id}
                          href={`/render/${graphic._id}`}
                          target="_blank"
                          style={{
                            display: 'block',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          }}
                        >
                          <GraphicPreview
                            graphic={graphic}
                            listing={listing}
                            agent={agent}
                            size={120}
                          />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
