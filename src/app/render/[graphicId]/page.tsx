'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { getFullGraphicData, type FullGraphicData } from '@/lib/store';
import { getTemplate, type TemplateRegistryEntry } from '@/lib/templates';
import { downloadPng } from '@/lib/downloadPng';
import { money } from '@/lib/types';
import type { TemplateProps, Photo } from '@/lib/types';

export default function RenderPage() {
  const params = useParams();
  const graphicId = params.graphicId as string;

  const [data, setData] = useState<FullGraphicData | null>(null);
  const [template, setTemplate] = useState<TemplateRegistryEntry | null>(null);
  const [ready, setReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const graphicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const graphicData = getFullGraphicData(graphicId);
    if (!graphicData) return;

    setData(graphicData);

    if (!graphicData.graphic.historyUrl) {
      const tpl = getTemplate(graphicData.graphic.templateId);
      if (!tpl) return;
      setTemplate(tpl);
    }
  }, [graphicId]);

  useEffect(() => {
    if (data && (template || data.graphic.historyUrl)) {
      document.fonts.ready.then(() => {
        document.body.dataset.fontsReady = 'true';
        setReady(true);
      });
    }
  }, [data, template]);

  if (!data) {
    return (
      <>
        <header className="header">
          <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
        </header>
        <main className="page">
          <div className="container">
            <p className="text-muted">Loading...</p>
          </div>
        </main>
      </>
    );
  }

  if (!template && !data.graphic.historyUrl) {
    return (
      <>
        <header className="header">
          <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
        </header>
        <main className="page">
          <div className="container">
            <p className="text-muted">Template not found</p>
          </div>
        </main>
      </>
    );
  }

  const { graphic, listing, agent } = data;

  const handleDownload = async () => {
    if (graphic.historyUrl) {
      const link = document.createElement('a');
      link.href = graphic.historyUrl;
      link.download = `${listing.address.replace(/\s+/g, '-')}-${graphic.variant}.png`;
      link.click();
      return;
    }

    if (!graphicRef.current || downloading) return;
    setDownloading(true);
    try {
      const filename = `${listing.address.replace(/\s+/g, '-')}-${graphic.variant}.png`;
      await downloadPng(graphicRef.current, filename);
    } finally {
      setDownloading(false);
    }
  };

  // For dynamic rendering
  const Component = template?.component;
  const [width, height] = template?.size || [1080, 1080];

  const photoMap = new Map(listing.photos.map(p => [p.id, p]));
  const resolvePhoto = (id?: string): Photo | undefined =>
    id ? photoMap.get(id) : undefined;
  const resolvePhotos = (ids?: string[]): Photo[] =>
    ids?.map(id => photoMap.get(id)).filter((p): p is Photo => !!p) || [];

  const templateProps: TemplateProps | null = Component ? {
    agent,
    listing,
    variant: graphic.variant,
    overrides: graphic.overrides,
    photos: {
      hero: resolvePhoto(graphic.photoAssignments.hero) || listing.photos[0],
      strip: resolvePhotos(graphic.photoAssignments.strip),
      sub: resolvePhotos(graphic.photoAssignments.sub),
      row: resolvePhotos(graphic.photoAssignments.row),
    },
  } : null;

  // Calculate scale to fit in viewport
  const maxPreviewWidth = 500;
  const scale = Math.min(1, maxPreviewWidth / width);
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Archivo';
          src: url('/fonts/Archivo-Variable.woff2') format('woff2');
          font-weight: 100 900;
        }
        @font-face {
          font-family: 'Archivo Narrow';
          src: url('/fonts/ArchivoNarrow-Variable.woff2') format('woff2');
          font-weight: 100 900;
        }
        @font-face {
          font-family: 'Yellowtail';
          src: url('/fonts/Yellowtail-Regular.woff2') format('woff2');
          font-weight: 400;
        }
      `}</style>

      <header className="header">
        <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
        <nav className="header-nav">
          <Link href="/">Clients</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/showcase">Showcase</Link>
          <Link href="/generate">Generate</Link>
        </nav>
      </header>

      <main className="page">
        <div className="container">
          <Link href={`/agents/${agent._id}`} className="back-link">
            ← Back to {agent.name}
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '24px' }}>
            {/* Left: Preview */}
            <div>
              <div
                style={{
                  background: '#111',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {graphic.historyUrl ? (
                  <img
                    src={graphic.historyUrl}
                    alt={`${listing.address} - ${graphic.variant}`}
                    style={{
                      width: scaledWidth,
                      height: scaledHeight,
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    }}
                  />
                ) : Component && templateProps ? (
                  <div
                    style={{
                      width: scaledWidth,
                      height: scaledHeight,
                      overflow: 'hidden',
                      borderRadius: '8px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div
                      ref={graphicRef}
                      style={{
                        width,
                        height,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                      }}
                    >
                      <Component {...templateProps} />
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#666' }}>No preview available</div>
                )}
              </div>

              {/* Download button */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleDownload}
                  disabled={downloading || (!ready && !graphic.historyUrl)}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {downloading ? 'Downloading...' : 'Download PNG'}
                </button>
              </div>

              <p className="text-muted text-sm" style={{ marginTop: '8px', textAlign: 'center' }}>
                {width} × {height}px
              </p>
            </div>

            {/* Right: Details */}
            <div>
              <div className="card" style={{ marginBottom: '16px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
                  {listing.address}
                </h1>
                <p className="text-muted" style={{ marginBottom: '16px' }}>
                  {listing.city}, {listing.province}
                </p>

                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}>
                  {graphic.variant.replace('-', ' ')}
                </div>
              </div>

              <div className="card" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-muted)' }}>
                  LISTING DETAILS
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <p className="text-muted text-sm">Price</p>
                    <p style={{ fontWeight: 600 }}>{money(listing.price)}</p>
                  </div>
                  <div>
                    <p className="text-muted text-sm">MLS</p>
                    <p style={{ fontWeight: 600 }}>{listing.mls || '—'}</p>
                  </div>
                  {listing.beds && (
                    <div>
                      <p className="text-muted text-sm">Bedrooms</p>
                      <p style={{ fontWeight: 600 }}>{listing.beds}</p>
                    </div>
                  )}
                  {listing.baths && (
                    <div>
                      <p className="text-muted text-sm">Bathrooms</p>
                      <p style={{ fontWeight: 600 }}>{listing.baths}</p>
                    </div>
                  )}
                  {listing.acres && (
                    <div>
                      <p className="text-muted text-sm">Acres</p>
                      <p style={{ fontWeight: 600 }}>{listing.acres}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted text-sm">Type</p>
                    <p style={{ fontWeight: 600, textTransform: 'capitalize' }}>{listing.propertyType}</p>
                  </div>
                </div>
              </div>

              <div className="card" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-muted)' }}>
                  AGENT
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="avatar" style={{ width: '48px', height: '48px' }}>
                    {agent.headshotUrl && (
                      <img src={agent.headshotUrl} alt={agent.name} />
                    )}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600 }}>{agent.name}</p>
                    <p className="text-muted text-sm">{agent.title}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-muted)' }}>
                  GRAPHIC INFO
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <p className="text-muted text-sm">Template</p>
                    <p style={{ fontWeight: 600 }}>{template?.name || 'History'}</p>
                  </div>
                  <div>
                    <p className="text-muted text-sm">Size</p>
                    <p style={{ fontWeight: 600 }}>{width} × {height}</p>
                  </div>
                  <div>
                    <p className="text-muted text-sm">Created</p>
                    <p style={{ fontWeight: 600 }}>
                      {new Date(graphic.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {graphic.packageId && (
                    <div>
                      <p className="text-muted text-sm">Package</p>
                      <p style={{ fontWeight: 600 }}>{graphic.packageId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
