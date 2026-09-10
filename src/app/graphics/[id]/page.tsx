import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFullGraphicData, isDbConnected } from '@/lib/db';
import { getTemplate } from '@/lib/templates';
import { GraphicEditor } from '@/components/GraphicEditor';
import { mockAgents, mockListings, mockGraphics } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditGraphicPage({ params }: Props) {
  const { id } = await params;
  const connected = await isDbConnected();

  let data;
  if (connected) {
    data = await getFullGraphicData(id);
  } else {
    // Use mock data
    const graphic = mockGraphics.find(g => g._id!.toString() === id);
    if (graphic) {
      const listing = mockListings.find(l => l._id!.toString() === graphic.listingId.toString());
      const agent = listing ? mockAgents.find(a => a._id === listing.agentId) : null;
      if (listing && agent) {
        data = { graphic, listing, agent };
      }
    }
  }

  if (!data) notFound();

  const { graphic, listing, agent } = data;
  const template = getTemplate(graphic.templateId);

  if (!template) notFound();

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
          Demo Mode — Changes won&apos;t be saved
        </div>
      )}

      <main className="page">
        <div className="container">
          <div className="flex-between mb-lg">
            <Link href={`/agents/${agent._id}`} className="back-link" style={{ marginBottom: 0 }}>
              ← Back to {listing.address}
            </Link>
            <a
              href={`/api/render?graphicId=${id}&scale=2`}
              className="btn btn-primary"
              download
            >
              Download PNG
            </a>
          </div>

          <GraphicEditor
            graphic={graphic}
            listing={listing}
            agent={agent}
            template={template}
          />
        </div>
      </main>
    </>
  );
}
