'use client';

import { useState, useEffect } from 'react';
import { getAllTemplates, type TemplateRegistryEntry } from '@/lib/templates';
import { SAMPLE_AGENT, getSampleListingForTemplate, SAMPLE_PHOTO } from '@/lib/sampleData';
import type { Variant, TemplateProps } from '@/lib/types';

type Props = {
  variant: Variant;
  currentTemplateId?: string;
  onSelect: (templateId: string) => void;
  onClose: () => void;
};

export function TemplatePickerModal({ variant, currentTemplateId, onSelect, onClose }: Props) {
  const [selected, setSelected] = useState(currentTemplateId || '');
  const [fontsReady, setFontsReady] = useState(false);

  // Get templates that support this variant
  const templates = getAllTemplates().filter(t => t.variants.includes(variant));

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  const handleApply = () => {
    if (selected) {
      onSelect(selected);
    }
    onClose();
  };

  // Preview scale - templates are 1080px, we show at 180px
  const previewScale = 180 / 1080;

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

      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
        onClick={onClose}
      >
      <div
        style={{
          background: 'var(--card)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '900px',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>
            Select Template for "{variant.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}"
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px 8px',
            }}
          >
            ×
          </button>
        </div>

        {templates.length === 0 ? (
          <p className="text-muted">No templates support this variant.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {templates.map(template => (
              <TemplatePreviewCard
                key={template.type}
                template={template}
                variant={variant}
                selected={selected === template.type}
                onSelect={() => setSelected(template.type)}
                scale={previewScale}
                fontsReady={fontsReady}
              />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleApply} disabled={!selected}>
            Apply Template
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

function TemplatePreviewCard({
  template,
  variant,
  selected,
  onSelect,
  scale,
  fontsReady,
}: {
  template: TemplateRegistryEntry;
  variant: Variant;
  selected: boolean;
  onSelect: () => void;
  scale: number;
  fontsReady: boolean;
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
      onClick={onSelect}
      style={{
        cursor: 'pointer',
        borderRadius: '12px',
        border: selected ? '3px solid var(--accent)' : '3px solid transparent',
        background: selected ? 'rgba(var(--accent-rgb), 0.1)' : 'var(--bg)',
        padding: '12px',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Preview container */}
      <div
        style={{
          width: scaledWidth,
          height: scaledHeight,
          overflow: 'hidden',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          margin: '0 auto',
          opacity: fontsReady ? 1 : 0.5,
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

      {/* Template name and radio */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
        <input
          type="radio"
          checked={selected}
          onChange={onSelect}
          style={{ margin: 0 }}
        />
        <span style={{ fontSize: '14px', fontWeight: 600 }}>{template.name}</span>
      </div>
      <p className="text-muted text-sm" style={{ marginTop: '4px', marginLeft: '24px' }}>
        {width} × {height}
      </p>
    </div>
  );
}
