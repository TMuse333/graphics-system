'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  TEMPLATE_REGISTRY,
  getListingTemplates,
  getContentTemplates,
  type TemplateRegistryEntry,
} from '@/lib/templates';
import {
  SHOWCASE_AGENT_1,
  SHOWCASE_AGENT_2,
  SHOWCASE_AGENT_3,
  LISTING_WATERFRONT,
  LISTING_LAND,
  PHOTO_HERO,
} from '@/lib/sampleData';
import type { Variant, Photo, ContentData, Agent } from '@/lib/types';

// Sample content data for content templates
const SAMPLE_CONTENT: ContentData = {
  kicker: 'Market Insight',
  title: 'Halifax Real Estate|August 2026',
  subtitle: 'A seller\'s market continues',
  period: 'August 2026',
  points: [
    { title: 'Get pre-approved first', body: 'Know your budget before you start looking. Pre-approval shows sellers you\'re serious.' },
    { title: 'Work with a local expert', body: 'A realtor who knows the neighborhood can find opportunities others miss.' },
    { title: 'Consider the full cost', body: 'Property taxes, insurance, and maintenance add up. Budget beyond the mortgage.' },
    { title: 'Don\'t skip the inspection', body: 'A thorough inspection can save you from expensive surprises down the road.' },
    { title: 'Think long-term', body: 'Buy for where you\'ll be in 5-10 years, not just where you are today.' },
  ],
  stats: [
    { value: '$625K', label: 'Median Price', delta: '+8.2% YoY', direction: 'up' },
    { value: '14', label: 'Days on Market', delta: '-3 days', direction: 'down' },
    { value: '97%', label: 'List-to-Sale', delta: '+2%', direction: 'up' },
    { value: '412', label: 'Active Listings', delta: '-18%', direction: 'down' },
    { value: '156', label: 'Homes Sold', delta: '+12%', direction: 'up' },
    { value: '2.1', label: 'Months Supply', delta: '-0.4', direction: 'down' },
  ],
  quote: 'Working with Greg made all the difference. He found us our dream home before it even hit the market.',
  emphasis: 'dream home',
  attribution: 'Sarah & Mike Thompson',
  attributionMeta: 'Bought in Bedford, August 2026',
  rating: 5,
  closing: 'Ready to make your move?',
  footnote: 'Source: Halifax Regional MLS®',
};

export default function ShowcasePage() {
  const [fontsReady, setFontsReady] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const listingTemplates = getListingTemplates();
  const contentTemplates = getContentTemplates();

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

          {/* ============ HERO ============ */}
          <section style={{ marginBottom: '60px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '42px', fontWeight: 700, marginBottom: '12px' }}>
              {listingTemplates.length + contentTemplates.length} templates. Your brand.
            </h1>
            <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              Listing posts, market updates, testimonials, education — every graphic
              a real estate agent needs, all on-brand and ready to post.
            </p>
          </section>

          {/* ============ LISTING TEMPLATES ============ */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
              Listing Templates
            </h2>
            <p className="text-muted" style={{ marginBottom: '24px' }}>
              Property graphics for every stage of the listing lifecycle
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '24px',
            }}>
              {listingTemplates.map(template => (
                <TemplateCard
                  key={template.type}
                  template={template}
                  agent={SHOWCASE_AGENT_1}
                  fontsReady={fontsReady}
                  onClick={() => setSelectedTemplate(template.type)}
                />
              ))}
            </div>
          </section>

          {/* ============ CONTENT TEMPLATES ============ */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
              Content Templates
            </h2>
            <p className="text-muted" style={{ marginBottom: '24px' }}>
              Non-listing content for days without a property to post
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '24px',
            }}>
              {contentTemplates.map(template => (
                <TemplateCard
                  key={template.type}
                  template={template}
                  agent={SHOWCASE_AGENT_1}
                  fontsReady={fontsReady}
                  onClick={() => setSelectedTemplate(template.type)}
                  isContent
                />
              ))}
            </div>
          </section>

          {/* ============ BRAND CONSISTENCY ============ */}
          <section style={{ marginBottom: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
                Your brand. Every time.
              </h2>
              <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto' }}>
                Same template, three different agents — each gets their own colors.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
            }}>
              {[SHOWCASE_AGENT_1, SHOWCASE_AGENT_2, SHOWCASE_AGENT_3].map(agent => (
                <BrandCard key={agent._id} agent={agent} fontsReady={fontsReady} />
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

      {/* Preview Modal */}
      {selectedTemplate && (
        <PreviewModal
          templateId={selectedTemplate}
          agent={SHOWCASE_AGENT_1}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </>
  );
}

function TemplateCard({
  template,
  agent,
  fontsReady,
  onClick,
  isContent = false,
}: {
  template: TemplateRegistryEntry;
  agent: Agent;
  fontsReady: boolean;
  onClick: () => void;
  isContent?: boolean;
}) {
  const [width, height] = template.size;
  const Component = template.component;

  // Scale to fit ~200px width
  const scale = 200 / width;
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  // Build props based on template kind
  const listing = template.requires?.includes('acres') ? LISTING_LAND : LISTING_WATERFRONT;
  const variant = template.variants[0] || 'new-listing';

  const photoProps = {
    hero: PHOTO_HERO,
    strip: template.photos.strip ? [PHOTO_HERO, PHOTO_HERO] : [],
    sub: template.photos.sub ? [PHOTO_HERO, PHOTO_HERO] : [],
    row: template.photos.row ? [PHOTO_HERO, PHOTO_HERO, PHOTO_HERO] : [],
  };

  const overrides = variant === 'open-house'
    ? { date: 'Sunday, Oct 15', time: '2-4 PM' }
    : template.type === 'listing-flier'
    ? { blurb: 'Stunning waterfront property.', features: ['Ocean views', 'Modern kitchen'], location: 'Walk to beach' }
    : {};

  const props = isContent
    ? { agent, content: SAMPLE_CONTENT }
    : { agent, listing, variant, overrides, photos: photoProps };

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
          <Component {...props} />
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <p style={{ fontWeight: 600, marginBottom: '2px' }}>{template.name}</p>
        <p className="text-muted text-sm">{template.blurb || `${width}×${height}`}</p>
      </div>
    </div>
  );
}

function BrandCard({ agent, fontsReady }: { agent: Agent; fontsReady: boolean }) {
  const template = TEMPLATE_REGISTRY['style-b-square'];
  const Component = template.component;
  const [width, height] = template.size;
  const scale = 280 / width;

  const props = {
    agent,
    listing: LISTING_WATERFRONT,
    variant: 'new-listing' as Variant,
    overrides: {},
    photos: { hero: PHOTO_HERO, strip: [], sub: [], row: [] },
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          width: width * scale,
          height: height * scale,
          overflow: 'hidden',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          opacity: fontsReady ? 1 : 0.5,
          margin: '0 auto',
        }}
      >
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <Component {...props} />
        </div>
      </div>
      <div style={{ marginTop: '16px' }}>
        <p style={{ fontWeight: 600, marginBottom: '4px' }}>{agent.name}</p>
        <p className="text-muted text-sm">{agent.title}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: agent.theme.primary, border: '2px solid var(--border)' }} />
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: agent.theme.accent, border: '2px solid var(--border)' }} />
        </div>
      </div>
    </div>
  );
}

function PreviewModal({
  templateId,
  agent,
  onClose,
}: {
  templateId: string;
  agent: Agent;
  onClose: () => void;
}) {
  const template = TEMPLATE_REGISTRY[templateId];
  if (!template) return null;

  const [width, height] = template.size;
  const Component = template.component;
  const isContent = template.kind === 'content';

  const listing = template.requires?.includes('acres') ? LISTING_LAND : LISTING_WATERFRONT;
  const variant = template.variants[0] || 'new-listing';

  const photoProps = {
    hero: PHOTO_HERO,
    strip: template.photos.strip ? [PHOTO_HERO, PHOTO_HERO] : [],
    sub: template.photos.sub ? [PHOTO_HERO, PHOTO_HERO] : [],
    row: template.photos.row ? [PHOTO_HERO, PHOTO_HERO, PHOTO_HERO] : [],
  };

  const overrides = variant === 'open-house'
    ? { date: 'Sunday, Oct 15', time: '2-4 PM' }
    : templateId === 'listing-flier'
    ? { blurb: 'Stunning waterfront property with panoramic ocean views.', features: ['Ocean views', 'Modern kitchen', 'Hardwood floors'], location: 'Walk to beach\n5 min to downtown' }
    : {};

  const props = isContent
    ? { agent, content: SAMPLE_CONTENT }
    : { agent, listing, variant, overrides, photos: photoProps };

  // Scale to fit viewport
  const maxWidth = typeof window !== 'undefined' ? Math.min(700, window.innerWidth - 80) : 700;
  const maxHeight = typeof window !== 'undefined' ? window.innerHeight - 160 : 800;
  const scale = Math.min(maxWidth / width, maxHeight / height);

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
          {template.name}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>
          {width} × {height}px
        </p>
      </div>

      <div
        style={{
          width: width * scale,
          height: height * scale,
          overflow: 'hidden',
          borderRadius: '12px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <Component {...props} />
        </div>
      </div>

      <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
        Click anywhere to close
      </p>
    </div>
  );
}
