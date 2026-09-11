'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getGraphics, getListing, getAgent } from '@/lib/store';
import { TEMPLATE_REGISTRY, TEMPLATE_CATEGORIES } from '@/lib/templates';
import { GraphicCarousel } from '@/components/GraphicCarousel';
import type { Graphic, Listing, Agent } from '@/lib/types';

type GraphicWithContext = Graphic & {
  listing: Listing;
  agent: Agent;
};

type Category = {
  category: string;
  label: string;
  items: GraphicWithContext[];
  variants: string[];
};

// Content types we can create - showcasing expandability
const CONTENT_TYPES = [
  {
    id: 'listing',
    name: 'Listing Graphics',
    description: 'Just Listed, Price Drop, Open House, Sold',
    active: true,
    count: 18,
  },
  {
    id: 'tips',
    name: 'Homebuyer Tips',
    description: 'First-time buyer advice, market insights',
    active: false,
    count: 0,
  },
  {
    id: 'market',
    name: 'Market Updates',
    description: 'Monthly stats, neighborhood trends',
    active: false,
    count: 0,
  },
  {
    id: 'agent',
    name: 'Agent Branding',
    description: 'Bio cards, testimonials, milestones',
    active: false,
    count: 0,
  },
  {
    id: 'seasonal',
    name: 'Seasonal Content',
    description: 'Holiday greetings, seasonal tips',
    active: false,
    count: 0,
  },
  {
    id: 'video',
    name: 'Video Thumbnails',
    description: 'YouTube, Reels, property tours',
    active: false,
    count: 0,
  },
];

function CategoryCard({
  category,
  items,
  onGraphicClick
}: {
  category: Category;
  items: GraphicWithContext[];
  onGraphicClick: (graphic: Graphic, index: number, allGraphics: Graphic[]) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        border: '1px solid var(--accent)',
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          padding: '16px 20px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px', transition: 'transform 0.2s', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              ▶
            </span>
            <span style={{ fontSize: '18px', fontWeight: 600 }}>
              {category.label}
            </span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                background: 'var(--accent)',
                color: 'var(--bg)',
              }}
            >
              {items.length}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {category.variants.slice(0, 4).map((v) => (
              <span
                key={v}
                className="text-muted text-sm"
                style={{ textTransform: 'capitalize' }}
              >
                {v.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>
      </button>

      {expanded && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: '8px',
              paddingTop: '16px',
            }}
          >
            {items.map((graphic, index) => (
              <button
                key={graphic._id}
                onClick={() => onGraphicClick(graphic, index, items)}
                style={{
                  aspectRatio: '1',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  background: '#000',
                }}
              >
                {graphic.historyUrl ? (
                  <img
                    src={graphic.historyUrl}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'var(--surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {graphic.variant}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GalleryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allGraphicsWithContext, setAllGraphicsWithContext] = useState<GraphicWithContext[]>([]);
  const [loading, setLoading] = useState(true);

  // Carousel state
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselGraphics, setCarouselGraphics] = useState<Graphic[]>([]);
  const [carouselListings, setCarouselListings] = useState<Listing[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const graphics = getGraphics();

    const validGraphics: GraphicWithContext[] = graphics
      .map((graphic) => {
        const listing = getListing(graphic.listingId);
        const agent = listing ? getAgent(listing.agentId) : null;
        if (!listing || !agent) return null;
        return { ...graphic, listing, agent };
      })
      .filter((g): g is GraphicWithContext => g !== null);

    setAllGraphicsWithContext(validGraphics);

    // Group by template category
    const grouped = Object.entries(TEMPLATE_CATEGORIES)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([category, meta]) => {
        const templates = Object.values(TEMPLATE_REGISTRY).filter(t => t.category === category);
        const templateIds = templates.map(t => t.type);
        const items = validGraphics.filter(g => templateIds.includes(g.templateId));

        return {
          category,
          label: meta.label,
          items,
          variants: [...new Set(items.map(g => g.variant))],
        };
      })
      .filter(c => c.items.length > 0);

    setCategories(grouped);
    setLoading(false);
  }, []);

  const handleGraphicClick = (graphic: Graphic, index: number, categoryGraphics: Graphic[]) => {
    const listings = categoryGraphics.map(g => {
      const gwc = allGraphicsWithContext.find(x => x._id === g._id);
      return gwc?.listing;
    }).filter((l): l is Listing => l !== undefined);

    setCarouselGraphics(categoryGraphics);
    setCarouselListings(listings);
    setCarouselIndex(index);
    setCarouselOpen(true);
  };

  if (loading) {
    return (
      <>
        <header className="header">
          <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
          <nav className="header-nav">
            <Link href="/">Clients</Link>
            <span style={{ color: 'var(--accent)' }}>Gallery</span>
            <Link href="/showcase">Showcase</Link>
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

  const totalGraphics = allGraphicsWithContext.length;

  return (
    <>
      <header className="header">
        <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
        <nav className="header-nav">
          <Link href="/">Clients</Link>
          <Link href="/gallery" style={{ color: 'var(--text)' }}>Gallery</Link>
        </nav>
      </header>

      <main className="page">
        <div className="container">
          <div className="flex-between mb-xl">
            <h1 className="title">Gallery</h1>
            <span className="text-muted">{totalGraphics} graphics across {categories.length} categories</span>
          </div>

          {/* Content Types Showcase */}
          <div className="card mb-xl" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-muted)' }}>
              CONTENT TYPES
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '12px',
              }}
            >
              {CONTENT_TYPES.map((type) => (
                <div
                  key={type.id}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: type.active ? 'var(--surface)' : 'transparent',
                    border: type.active ? '1px solid var(--accent)' : '1px dashed var(--border)',
                    opacity: type.active ? 1 : 0.6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{type.name}</span>
                    {type.active && (
                      <span
                        style={{
                          padding: '1px 6px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: 600,
                          background: 'var(--accent)',
                          color: 'var(--bg)',
                        }}
                      >
                        {type.count}
                      </span>
                    )}
                    {!type.active && (
                      <span
                        style={{
                          padding: '1px 6px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: 500,
                          background: 'var(--border)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="text-muted text-sm">{type.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Graphics by Category */}
          <h2 className="section-title">Listing Graphics</h2>

          {categories.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
              <p className="text-muted">No graphics yet. Create one from a listing.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categories.map((category) => (
                <CategoryCard
                  key={category.category}
                  category={category}
                  items={category.items}
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
          listings={carouselListings}
          currentIndex={carouselIndex}
          onIndexChange={setCarouselIndex}
          onClose={() => setCarouselOpen(false)}
        />
      )}
    </>
  );
}
