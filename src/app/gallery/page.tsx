'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getGraphics, getListing, getAgent } from '@/lib/store';
import { TEMPLATE_REGISTRY, TEMPLATE_CATEGORIES } from '@/lib/templates';
import { GraphicPreview } from '@/components/GraphicPreview';
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

export default function GalleryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
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
          <Link href="/">Clients</Link>
          <Link href="/gallery" style={{ color: 'var(--text)' }}>Gallery</Link>
        </nav>
      </header>

      <main className="page">
        <div className="container">
          <h1 className="title mb-xl">Gallery</h1>

          {categories.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
              <p className="text-muted">No graphics yet. Create one from a listing.</p>
            </div>
          ) : (
            categories.map(({ category, label, items, variants }) => (
              <div key={category} className="card mb-lg">
                <div className="flex-between mb-md">
                  <h2 style={{ fontSize: '18px', fontWeight: 600 }}>{label}</h2>
                  <span className="text-muted text-sm">{items.length} items</span>
                </div>

                <div className="flex gap-sm mb-md">
                  {variants.map((v) => (
                    <span
                      key={v}
                      className="btn btn-secondary btn-sm"
                      style={{ pointerEvents: 'none' }}
                    >
                      {v.replace('-', ' ')}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                  {items.map((graphic) => (
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
                        listing={graphic.listing}
                        agent={graphic.agent}
                        size={200}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
