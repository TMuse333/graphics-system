import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAgent } from '@/lib/db';
import { ListingForm } from '@/components/ListingForm';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NewListingPage({ params }: Props) {
  const { id } = await params;
  const agent = await getAgent(id);

  if (!agent) notFound();

  return (
    <>
      <header className="header">
        <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
        <nav className="header-nav">
          <Link href="/gallery">Gallery</Link>
        </nav>
      </header>

      <main className="page">
        <div className="container" style={{ maxWidth: '800px' }}>
          <Link href={`/agents/${id}`} className="back-link">← Back to {agent.name}</Link>

          <h1 className="title mb-lg">New Listing</h1>

          <ListingForm agentId={id} />
        </div>
      </main>
    </>
  );
}
