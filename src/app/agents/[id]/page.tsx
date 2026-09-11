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

export default function AgentDashboard() {
  const params = useParams();
  const id = params.id as string;

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

    // Get all graphics
    const graphics = withGraphics.flatMap(l => l.graphics);
    setAllGraphics(graphics);

    // Get all packages
    const agentPackages = getPackages(id);
    agentPackages.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (b.status === 'active' && a.status !== 'active') return 1;
      return new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime();
    });
    setPackages(agentPackages);

    setLoading(false);
  }, [id]);

  const handleGraphicClick = (graphic: Graphic, index: number, packageGraphics: Graphic[]) => {
    setCarouselGraphics(packageGraphics);
    setCarouselIndex(index);
    setCarouselOpen(true);
  };

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

          {/* Packages section */}
          <div className="flex-between mb-lg">
            <h2 className="section-title" style={{ marginBottom: 0 }}>Packages</h2>
          </div>

          {packages.length === 0 ? (
            <div className="card mb-xl" style={{ textAlign: 'center', padding: '40px' }}>
              <p className="text-muted">No packages yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {listings.map((listing) => (
                <div key={listing._id} className="card" style={{ padding: '16px 20px' }}>
                  <div className="flex-between">
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '2px' }}>
                        {listing.address}
                      </h3>
                      <p className="text-muted text-sm">
                        {listing.city}, {listing.province} · {money(listing.price)}
                        {listing.beds && ` · ${listing.beds} bed`}
                        {listing.baths && ` · ${listing.baths} bath`}
                        {listing.acres && ` · ${listing.acres} acres`}
                      </p>
                    </div>
                    <div className="flex gap-sm" style={{ alignItems: 'center' }}>
                      <span className="text-muted text-sm">
                        {listing.graphics.length} graphics
                      </span>
                      <Link
                        href={`/agents/${id}/listings/${listing._id}/edit`}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/graphics/new?listingId=${listing._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        + Graphic
                      </Link>
                    </div>
                  </div>
                </div>
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
