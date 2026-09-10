'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { TEMPLATE_REGISTRY, TEMPLATE_CATEGORIES } from '@/lib/templates';
import type { Listing, Variant } from '@/lib/types';

function NewGraphicContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listingId');

  const [listing, setListing] = useState<Listing | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (listingId) {
      fetch(`/api/listings/${listingId}`)
        .then((res) => res.json())
        .then(setListing)
        .catch(console.error);
    }
  }, [listingId]);

  const handleCreate = async () => {
    if (!selectedTemplate || !selectedVariant || !listingId) return;

    setCreating(true);
    try {
      const res = await fetch('/api/graphics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          templateId: selectedTemplate,
          variant: selectedVariant,
          overrides: {},
          photoAssignments: {},
        }),
      });

      const graphic = await res.json();
      router.push(`/graphics/${graphic._id}`);
    } catch (error) {
      console.error('Create error:', error);
    } finally {
      setCreating(false);
    }
  };

  const templatesByCategory = Object.entries(TEMPLATE_CATEGORIES)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([category, meta]) => ({
      category,
      label: meta.label,
      templates: Object.values(TEMPLATE_REGISTRY).filter(
        (t) => t.category === category
      ),
    }));

  const template = selectedTemplate ? TEMPLATE_REGISTRY[selectedTemplate] : null;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <Link
        href={listing ? `/agents/${listing.agentId}` : '/'}
        className="back-link"
      >
        ← Back
      </Link>

      <h1 className="title mb-sm">New Graphic</h1>
      {listing && (
        <p className="subtitle mb-xl">for {listing.address}</p>
      )}

      <div className="card mb-lg">
        <h3 className="section-title">Choose Template</h3>

        {templatesByCategory.map(({ category, label, templates }) => (
          <div key={category} style={{ marginBottom: '24px' }}>
            <h4 className="text-muted text-sm mb-sm" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
              {label}
            </h4>
            <div className="grid-2">
              {templates.map((t) => (
                <button
                  key={t.type}
                  type="button"
                  className={`card ${selectedTemplate === t.type ? 'active' : ''}`}
                  style={{
                    cursor: 'pointer',
                    textAlign: 'left',
                    border: selectedTemplate === t.type ? '2px solid var(--accent)' : undefined,
                  }}
                  onClick={() => {
                    setSelectedTemplate(t.type);
                    setSelectedVariant(null);
                  }}
                >
                  <div className="flex-between">
                    <div>
                      <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>{t.name}</h4>
                      <p className="text-muted text-sm">
                        {t.size[0]} × {t.size[1]}
                      </p>
                    </div>
                    <div
                      style={{
                        width: '40px',
                        height: t.size[1] > t.size[0] ? '60px' : '40px',
                        background: 'var(--bg)',
                        borderRadius: '4px',
                        border: '1px solid var(--border)',
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {template && (
        <div className="card mb-lg">
          <h3 className="section-title">Choose Variant</h3>
          <div className="variant-options">
            {template.variants.map((v) => (
              <label
                key={v}
                className={`variant-option ${selectedVariant === v ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="variant"
                  value={v}
                  checked={selectedVariant === v}
                  onChange={() => setSelectedVariant(v)}
                />
                <span style={{ textTransform: 'capitalize' }}>
                  {v.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleCreate}
        className="btn btn-primary"
        disabled={!selectedTemplate || !selectedVariant || creating}
        style={{ width: '100%' }}
      >
        {creating ? 'Creating...' : 'Create Graphic'}
      </button>
    </div>
  );
}

export default function NewGraphicPage() {
  return (
    <>
      <header className="header">
        <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
        <nav className="header-nav">
          <Link href="/gallery">Gallery</Link>
        </nav>
      </header>

      <main className="page">
        <Suspense fallback={<div className="container">Loading...</div>}>
          <NewGraphicContent />
        </Suspense>
      </main>
    </>
  );
}
