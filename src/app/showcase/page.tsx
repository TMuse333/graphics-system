'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { StyleBSquare } from '@/lib/templates/StyleBSquare';
import {
  SHOWCASE_AGENT_1,
  SHOWCASE_AGENT_2,
  SHOWCASE_AGENT_3,
  LISTING_WATERFRONT,
  PHOTO_HERO,
} from '@/lib/sampleData';
import type { Variant, TemplateProps } from '@/lib/types';

export default function ShowcasePage() {
  const [fontsReady, setFontsReady] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<{
    agent: typeof SHOWCASE_AGENT_1;
    variant: Variant;
  } | null>(null);

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  return (
    <>
      {/* Load template fonts */}
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
          <span style={{ color: 'var(--accent)' }}>Showcase</span>
          <Link href="/generate">Generate</Link>
        </nav>
      </header>

      <main className="page">
        <div className="container">

          {/* ============ HERO: ONE LISTING, COMPLETE CAMPAIGN ============ */}
          <section style={{ marginBottom: '80px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '42px', fontWeight: 700, marginBottom: '12px' }}>
                One listing. Complete campaign.
              </h1>
              <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                Enter your listing once. Get every graphic you need — new listing, open house,
                price change, sold — all on-brand, ready to post.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
            }}>
              {(['new-listing', 'open-house', 'price-drop', 'just-sold'] as Variant[]).map(variant => (
                <TemplatePreview
                  key={variant}
                  agent={SHOWCASE_AGENT_1}
                  listing={LISTING_WATERFRONT}
                  variant={variant}
                  scale={0.22}
                  fontsReady={fontsReady}
                  onClick={() => setSelectedPreview({ agent: SHOWCASE_AGENT_1, variant })}
                  overrides={variant === 'open-house' ? { date: 'Sunday, Oct 15', time: '2-4 PM' } : {}}
                />
              ))}
            </div>

            <p className="text-muted text-sm" style={{ textAlign: 'center', marginTop: '16px' }}>
              42 Purcells Cove Road, Halifax · MLS® 202609847 · $1,250,000
            </p>
          </section>

          {/* ============ BRAND CONSISTENCY: SAME LISTING, THREE BRANDS ============ */}
          <section style={{ marginBottom: '80px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>
                Your brand. Every time.
              </h2>
              <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                Each agent gets graphics in their own colors — locked to your standards
                so they can't go off-brand.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
            }}>
              {[SHOWCASE_AGENT_1, SHOWCASE_AGENT_2, SHOWCASE_AGENT_3].map(agent => (
                <div key={agent._id} style={{ textAlign: 'center' }}>
                  <TemplatePreview
                    agent={agent}
                    listing={LISTING_WATERFRONT}
                    variant="new-listing"
                    scale={0.28}
                    fontsReady={fontsReady}
                    onClick={() => setSelectedPreview({ agent, variant: 'new-listing' })}
                  />
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ fontWeight: 600, marginBottom: '4px' }}>{agent.name}</p>
                    <p className="text-muted text-sm">{agent.title}</p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '8px',
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: agent.theme.primary,
                        border: '2px solid var(--border)',
                      }} />
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: agent.theme.accent,
                        border: '2px solid var(--border)',
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============ HOW IT WORKS: 3 STEPS ============ */}
          <section style={{ marginBottom: '80px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>
                What your agents do
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
            }}>
              {[
                { step: '1', title: 'Upload photos', desc: 'Drag in listing photos — we handle the cropping' },
                { step: '2', title: 'Enter details', desc: 'Address, price, beds/baths — takes 30 seconds' },
                { step: '3', title: 'Download', desc: 'Get every variant instantly, sized for every platform' },
              ].map(({ step, title, desc }) => (
                <div
                  key={step}
                  className="card"
                  style={{ padding: '32px', textAlign: 'center' }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    color: 'var(--bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 700,
                    margin: '0 auto 16px',
                  }}>
                    {step}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                    {title}
                  </h3>
                  <p className="text-muted">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ============ CTA ============ */}
          <section style={{ textAlign: 'center', paddingBottom: '40px' }}>
            <div className="card" style={{
              padding: '48px',
              background: 'linear-gradient(135deg, var(--surface) 0%, var(--card) 100%)',
              border: '1px solid var(--accent)',
            }}>
              <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
                Ready to see it with your brand?
              </h2>
              <p className="text-muted" style={{ marginBottom: '24px' }}>
                We'll set up your colors, logo, and agent profiles — then generate a sample pack.
              </p>
              <Link href="/generate" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '16px' }}>
                Try the Generator
              </Link>
            </div>
          </section>

        </div>
      </main>

      {/* Large Preview Modal */}
      {selectedPreview && (
        <PreviewModal
          agent={selectedPreview.agent}
          variant={selectedPreview.variant}
          onClose={() => setSelectedPreview(null)}
        />
      )}
    </>
  );
}

function TemplatePreview({
  agent,
  listing,
  variant,
  scale,
  fontsReady,
  onClick,
  overrides = {},
}: {
  agent: typeof SHOWCASE_AGENT_1;
  listing: typeof LISTING_WATERFRONT;
  variant: Variant;
  scale: number;
  fontsReady: boolean;
  onClick: () => void;
  overrides?: Record<string, string>;
}) {
  const width = 1080;
  const height = 1080;

  const templateProps: TemplateProps = {
    agent,
    listing,
    variant,
    overrides,
    photos: {
      hero: PHOTO_HERO,
      strip: [],
      sub: [],
      row: [],
    },
  };

  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  return (
    <div
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div
        style={{
          width: scaledWidth,
          height: scaledHeight,
          overflow: 'hidden',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          opacity: fontsReady ? 1 : 0.5,
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          margin: '0 auto',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        }}
      >
        <div
          style={{
            width,
            height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <StyleBSquare {...templateProps} />
        </div>
      </div>
      <p style={{
        fontSize: '13px',
        fontWeight: 500,
        textAlign: 'center',
        marginTop: '10px',
        textTransform: 'capitalize',
        color: 'var(--text)',
      }}>
        {variant.replace(/-/g, ' ')}
      </p>
    </div>
  );
}

function PreviewModal({
  agent,
  variant,
  onClose,
}: {
  agent: typeof SHOWCASE_AGENT_1;
  variant: Variant;
  onClose: () => void;
}) {
  const width = 1080;
  const height = 1080;

  const templateProps: TemplateProps = {
    agent,
    listing: LISTING_WATERFRONT,
    variant,
    overrides: variant === 'open-house' ? { date: 'Sunday, Oct 15', time: '2-4 PM' } : {},
    photos: {
      hero: PHOTO_HERO,
      strip: [],
      sub: [],
      row: [],
    },
  };

  // Scale to fit viewport
  const maxWidth = typeof window !== 'undefined' ? Math.min(700, window.innerWidth - 80) : 700;
  const scale = maxWidth / width;
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '40px',
      }}
      onClick={onClose}
    >
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
          {agent.name}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>
          {variant.replace(/-/g, ' ')} · 1080 × 1080px
        </p>
      </div>

      <div
        style={{
          width: scaledWidth,
          height: scaledHeight,
          overflow: 'hidden',
          borderRadius: '12px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width,
            height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <StyleBSquare {...templateProps} />
        </div>
      </div>

      <p style={{
        marginTop: '20px',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '14px',
      }}>
        Click anywhere to close
      </p>
    </div>
  );
}
