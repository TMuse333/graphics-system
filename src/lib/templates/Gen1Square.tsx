'use client';

import { Stage } from './Stage';
import type { TemplateProps } from '@/lib/types';

/**
 * STUB: Land & Lots template (1080×1080)
 * This will be replaced with the 778/302 split design.
 */
export function Gen1Square({ agent, listing, variant }: TemplateProps) {
  return (
    <Stage width={1080} height={1080} theme={agent.theme}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          boxSizing: 'border-box',
          background: `linear-gradient(180deg, var(--theme-primary) 0%, var(--theme-primary-alt) 100%)`,
        }}
      >
        {/* Stub indicator */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--theme-accent)',
            color: 'var(--theme-primary)',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'var(--theme-font-narrow)',
          }}
        >
          STUB
        </div>

        {/* Template name */}
        <div
          style={{
            fontSize: '24px',
            color: 'var(--theme-accent-light)',
            fontFamily: 'var(--theme-font-narrow)',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '4px',
          }}
        >
          Land & Lots
        </div>

        {/* Variant badge */}
        <div
          style={{
            fontSize: '32px',
            color: 'var(--theme-accent)',
            fontFamily: 'var(--theme-font-display)',
            fontWeight: 'bold',
            marginBottom: '40px',
            textTransform: 'uppercase',
          }}
        >
          {variant.replace('-', ' ')}
        </div>

        {/* Acres */}
        {listing.acres && (
          <div
            style={{
              fontSize: '72px',
              color: 'var(--theme-accent)',
              fontFamily: 'var(--theme-font-display)',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            {listing.acres} ACRES
          </div>
        )}

        {/* Address */}
        <div
          style={{
            fontSize: '42px',
            color: '#fff',
            fontFamily: 'var(--theme-font-display)',
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {listing.address}
        </div>

        {/* City */}
        <div
          style={{
            fontSize: '28px',
            color: 'var(--theme-accent-light)',
            fontFamily: 'var(--theme-font-narrow)',
            marginTop: '16px',
          }}
        >
          {listing.city}, {listing.province}
        </div>

        {/* Agent */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '20px',
            color: '#fff',
            fontFamily: 'var(--theme-font-narrow)',
          }}
        >
          {agent.name}
        </div>
      </div>
    </Stage>
  );
}
