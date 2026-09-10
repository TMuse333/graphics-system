import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAgent, isDbConnected } from '@/lib/db';
import { BrandForm } from '@/components/BrandForm';
import { mockAgents } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BrandPage({ params }: Props) {
  const { id } = await params;
  const connected = await isDbConnected();

  const agent = connected
    ? await getAgent(id)
    : mockAgents.find(a => a._id === id) || null;

  if (!agent) notFound();

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

          <h1 className="title mb-lg">Edit Brand</h1>

          <BrandForm agent={agent} />
        </div>
      </main>
    </>
  );
}
