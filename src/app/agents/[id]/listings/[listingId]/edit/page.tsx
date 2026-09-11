'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAgent, getListing } from '@/lib/store';
import { ListingForm } from '@/components/ListingForm';
import type { Agent, Listing } from '@/lib/types';

export default function EditListingPage() {
  const params = useParams();
  const id = params.id as string;
  const listingId = params.listingId as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundAgent = getAgent(id);
    const foundListing = getListing(listingId);
    setAgent(foundAgent);
    setListing(foundListing);
    setLoading(false);
  }, [id, listingId]);

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

  if (!agent || !listing) {
    notFound();
  }

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

          <h1 className="title mb-lg">Edit Listing</h1>

          <ListingForm agentId={id} listing={listing} />
        </div>
      </main>
    </>
  );
}
