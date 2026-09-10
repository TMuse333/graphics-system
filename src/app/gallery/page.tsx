import Link from 'next/link';
import { getDb, isDbConnected } from '@/lib/db';
import { TEMPLATE_REGISTRY, TEMPLATE_CATEGORIES } from '@/lib/templates';
import { mockAgents, mockListings, mockGraphics } from '@/lib/mockData';
import type { Graphic, Listing, Agent } from '@/lib/types';

export const dynamic = 'force-dynamic';

type GraphicWithContext = Graphic & {
  listing: Listing;
  agent: Agent;
};

export default async function GalleryPage() {
  const connected = await isDbConnected();

  let validGraphics: GraphicWithContext[] = [];

  if (connected) {
    const db = await getDb();

    // Get all graphics with their listings and agents
    const graphics = await db.collection<Graphic>('graphics')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    // Fetch listings and agents for each graphic
    const graphicsWithContext: GraphicWithContext[] = await Promise.all(
      graphics.map(async (graphic) => {
        const listing = await db.collection<Listing>('listings')
          .findOne({ _id: graphic.listingId });
        // Agent uses string _id, not ObjectId
        const agent = listing
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? await db.collection('agents').findOne({ _id: listing.agentId } as any) as Agent | null
          : null;

        return {
          ...graphic,
          listing: listing!,
          agent: agent!,
        };
      })
    );

    // Filter out any with missing data
    validGraphics = graphicsWithContext.filter(g => g.listing && g.agent);
  } else {
    // Use mock data
    validGraphics = mockGraphics.map((graphic) => {
      const listing = mockListings.find(l => l._id!.toString() === graphic.listingId.toString());
      const agent = listing ? mockAgents.find(a => a._id === listing.agentId) : null;
      return {
        ...graphic,
        listing: listing!,
        agent: agent!,
      };
    }).filter(g => g.listing && g.agent);
  }

  // Group by template category
  const categories = Object.entries(TEMPLATE_CATEGORIES)
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

  return (
    <>
      <header className="header">
        <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
        <nav className="header-nav">
          <Link href="/">Clients</Link>
          <Link href="/gallery" style={{ color: 'var(--text)' }}>Gallery</Link>
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

                <div className="grid-4">
                  {items.map((graphic) => (
                    <Link
                      key={graphic._id!.toString()}
                      href={`/graphics/${graphic._id}`}
                      className="graphic-thumb"
                    >
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px',
                        background: graphic.agent.theme.primary,
                      }}>
                        <span style={{ color: graphic.agent.theme.accent, fontWeight: 600, fontSize: '12px' }}>
                          {graphic.variant.replace('-', ' ').toUpperCase()}
                        </span>
                        <span style={{ color: '#fff', fontSize: '11px', marginTop: '4px', textAlign: 'center' }}>
                          {graphic.listing.address}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', marginTop: '4px' }}>
                          {graphic.agent.name}
                        </span>
                      </div>
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
