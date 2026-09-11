'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllTemplates, TEMPLATE_CATEGORIES, type TemplateRegistryEntry, type TemplateCategory } from '@/lib/templates';
import { SAMPLE_AGENT, getSampleListingForTemplate, SAMPLE_PHOTO } from '@/lib/sampleData';
import type { Variant, TemplateProps } from '@/lib/types';

export default function ShowcasePage() {
  const [fontsReady, setFontsReady] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<{
    template: TemplateRegistryEntry;
    variant: Variant;
  } | null>(null);

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  const templates = getAllTemplates();

  // Group templates by category
  const byCategory = templates.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {} as Record<TemplateCategory, TemplateRegistryEntry[]>);

  // Sort categories by order
  const sortedCategories = Object.entries(byCategory).sort(
    ([a], [b]) => TEMPLATE_CATEGORIES[a as TemplateCategory].order - TEMPLATE_CATEGORIES[b as TemplateCategory].order
  );

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
          <div className="mb-xl">
            <h1 className="title">Template Showcase</h1>
            <p className="subtitle">
              All available graphic styles rendered with RE/MAX Nova branding
            </p>
          </div>

          {sortedCategories.map(([category, categoryTemplates]) => (
            <div key={category} style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border)',
              }}>
                {TEMPLATE_CATEGORIES[category as TemplateCategory].label}
              </h2>

              {categoryTemplates.map(template => (
                <TemplateRow
                  key={template.type}
                  template={template}
                  fontsReady={fontsReady}
                  onPreview={(variant) => setSelectedPreview({ template, variant })}
                />
              ))}
            </div>
          ))}

          {/* Stats */}
          <div className="card" style={{
            padding: '24px',
            textAlign: 'center',
            marginTop: '48px',
            background: 'var(--surface)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '48px' }}>
              <div>
                <p style={{ fontSize: '36px', fontWeight: 700, color: 'var(--accent)' }}>
                  {templates.length}
                </p>
                <p className="text-muted">Templates</p>
              </div>
              <div>
                <p style={{ fontSize: '36px', fontWeight: 700, color: 'var(--accent)' }}>
                  {templates.reduce((sum, t) => sum + t.variants.length, 0)}
                </p>
                <p className="text-muted">Total Variants</p>
              </div>
              <div>
                <p style={{ fontSize: '36px', fontWeight: 700, color: 'var(--accent)' }}>
                  {sortedCategories.length}
                </p>
                <p className="text-muted">Categories</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Large Preview Modal */}
      {selectedPreview && (
        <PreviewModal
          template={selectedPreview.template}
          variant={selectedPreview.variant}
          onClose={() => setSelectedPreview(null)}
        />
      )}
    </>
  );
}

function TemplateRow({
  template,
  fontsReady,
  onPreview,
}: {
  template: TemplateRegistryEntry;
  fontsReady: boolean;
  onPreview: (variant: Variant) => void;
}) {
  const [width, height] = template.size;
  const previewScale = 160 / width;

  return (
    <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{template.name}</h3>
          <p className="text-muted text-sm">{width} × {height}px · {template.variants.length} variants</p>
        </div>
        {template.requires && template.requires.length > 0 && (
          <div style={{
            padding: '4px 12px',
            background: 'var(--surface)',
            borderRadius: '16px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}>
            Requires: {template.requires.join(', ')}
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '8px',
      }}>
        {template.variants.map(variant => (
          <VariantPreview
            key={variant}
            template={template}
            variant={variant}
            scale={previewScale}
            fontsReady={fontsReady}
            onClick={() => onPreview(variant)}
          />
        ))}
      </div>
    </div>
  );
}

function VariantPreview({
  template,
  variant,
  scale,
  fontsReady,
  onClick,
}: {
  template: TemplateRegistryEntry;
  variant: Variant;
  scale: number;
  fontsReady: boolean;
  onClick: () => void;
}) {
  const Component = template.component;
  const [width, height] = template.size;
  const listing = getSampleListingForTemplate(template.type);

  const templateProps: TemplateProps = {
    agent: SAMPLE_AGENT,
    listing,
    variant,
    overrides: {},
    photos: {
      hero: SAMPLE_PHOTO,
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
      style={{
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: scaledWidth,
          height: scaledHeight,
          overflow: 'hidden',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          opacity: fontsReady ? 1 : 0.5,
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
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
          <Component {...templateProps} />
        </div>
      </div>
      <p style={{
        fontSize: '12px',
        fontWeight: 500,
        textAlign: 'center',
        marginTop: '8px',
        textTransform: 'capitalize',
        color: 'var(--text)',
      }}>
        {variant.replace(/-/g, ' ')}
      </p>
    </div>
  );
}

function PreviewModal({
  template,
  variant,
  onClose,
}: {
  template: TemplateRegistryEntry;
  variant: Variant;
  onClose: () => void;
}) {
  const Component = template.component;
  const [width, height] = template.size;
  const listing = getSampleListingForTemplate(template.type);

  const templateProps: TemplateProps = {
    agent: SAMPLE_AGENT,
    listing,
    variant,
    overrides: {},
    photos: {
      hero: SAMPLE_PHOTO,
      strip: [],
      sub: [],
      row: [],
    },
  };

  // Scale to fit viewport
  const maxWidth = Math.min(800, window.innerWidth - 80);
  const maxHeight = window.innerHeight - 200;
  const scale = Math.min(maxWidth / width, maxHeight / height, 1);
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
          {template.name}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>
          {variant.replace(/-/g, ' ')} · {width} × {height}px
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
          <Component {...templateProps} />
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
