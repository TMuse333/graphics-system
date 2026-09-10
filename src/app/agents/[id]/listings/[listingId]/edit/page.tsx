import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAgent, getListing, isDbConnected } from '@/lib/db';
import { ListingForm } from '@/components/ListingForm';
import { mockAgents, mockListings } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string; listingId: string }>;
};

export default async function EditListingPage({ params }: Props) {
  const { id, listingId } = await params;
  const connected = await isDbConnected();

  let agent, listing;
  if (connected) {
    [agent, listing] = await Promise.all([
      getAgent(id),
      getListing(listingId),
    ]);
  } else {
    agent = mockAgents.find(a => a._id === id) || null;
    listing = mockListings.find(l => l._id!.toString() === listingId) || null;
  }

  if (!agent || !listing) notFound();

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
        <div className="container" style={{ maxWidth: '800px' }}>
          <Link href={`/agents/${id}`} className="back-link">← Back to {agent.name}</Link>

          <h1 className="title mb-lg">Edit Listing</h1>

          <ListingForm agentId={id} listing={listing} />
        </div>
      </main>
    </>
  );
}
