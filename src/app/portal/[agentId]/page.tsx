'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAgent, getListings, getGraphics, getPackages } from '@/lib/store';
import { money } from '@/lib/types';
import type { Agent, Listing, Graphic, Package } from '@/lib/types';
import { PackageCard } from '@/components/PackageCard';
import { GraphicCarousel } from '@/components/GraphicCarousel';

type ListingWithGraphics = Listing & { graphics: Graphic[] };

export default function ClientPortal() {
  const params = useParams();
  const agentId = params.agentId as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [listings, setListings] = useState<ListingWithGraphics[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [allGraphics, setAllGraphics] = useState<Graphic[]>([]);
  const [loading, setLoading] = useState(true);

  // Carousel state
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselGraphics, setCarouselGraphics] = useState<Graphic[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

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

    // Get all graphics for this agent
    const graphics = withGraphics.flatMap(l => l.graphics);
    setAllGraphics(graphics);

    // Get all packages for this agent
    const agentPackages = getPackages(agentId);
    // Sort: active first, then by date descending
    agentPackages.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (b.status === 'active' && a.status !== 'active') return 1;
      return new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime();
    });
    setPackages(agentPackages);

    setLoading(false);
  }, [agentId]);

  const handleGraphicClick = (graphic: Graphic, index: number, packageGraphics: Graphic[]) => {
    setCarouselGraphics(packageGraphics);
    setCarouselIndex(index);
    setCarouselOpen(true);
  };

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

  // Group graphics by package
  const getPackageGraphics = (packageId: string) => {
    return allGraphics.filter(g => g.packageId === packageId);
  };

  const getPackageListings = (packageId: string) => {
    const packageGraphics = getPackageGraphics(packageId);
    const listingIds = new Set(packageGraphics.map(g => g.listingId));
    return listings.filter(l => listingIds.has(l._id!));
  };

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

          {/* Packages */}
          <h2 className="section-title">Your Packages</h2>
          {packages.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p className="text-muted">No packages yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg._id}
                  pkg={pkg}
                  graphics={getPackageGraphics(pkg._id)}
                  listings={getPackageListings(pkg._id)}
                  agent={agent}
                  onGraphicClick={handleGraphicClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Carousel Modal */}
      {carouselOpen && (
        <GraphicCarousel
          graphics={carouselGraphics}
          listings={listings}
          currentIndex={carouselIndex}
          onIndexChange={setCarouselIndex}
          onClose={() => setCarouselOpen(false)}
        />
      )}
    </>
  );
}
