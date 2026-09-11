'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAgent } from '@/lib/store';
import { BrandForm } from '@/components/BrandForm';
import type { Agent } from '@/lib/types';

export default function BrandPage() {
  const params = useParams();
  const id = params.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundAgent = getAgent(id);
    setAgent(foundAgent);
    setLoading(false);
  }, [id]);

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

          <h1 className="title mb-lg">Edit Brand</h1>

          <BrandForm agent={agent} />
        </div>
      </main>
    </>
  );
}
