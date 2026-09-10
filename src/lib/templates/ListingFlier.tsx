'use client';

import { Stage } from './Stage';
import type { TemplateProps } from '@/lib/types';
import { money } from '@/lib/types';

/**
 * STUB: Print Flier template (1080×1620)
 * Tall format for print materials.
 */
export function ListingFlier({ agent, listing, variant, overrides }: TemplateProps) {
  return (
    <Stage width={1080} height={1620} theme={agent.theme}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '60px',
          boxSizing: 'border-box',
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
          Print Flier
        </div>

        {/* Variant badge */}
        <div
          style={{
            fontSize: '32px',
            color: 'var(--theme-accent)',
            fontFamily: 'var(--theme-font-display)',
            fontWeight: 'bold',
            marginBottom: '60px',
            textTransform: 'uppercase',
          }}
        >
          {variant.replace('-', ' ')}
        </div>

        {/* Hero image placeholder */}
        <div
          style={{
            width: '100%',
            height: '400px',
            background: 'var(--theme-primary-alt)',
            border: '2px solid var(--theme-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--theme-accent-light)',
            fontSize: '24px',
            fontFamily: 'var(--theme-font-narrow)',
            marginBottom: '40px',
          }}
        >
          [Hero Image]
        </div>

        {/* Address */}
        <div
          style={{
            fontSize: '42px',
            color: '#fff',
            fontFamily: 'var(--theme-font-display)',
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '16px',
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
            marginBottom: '30px',
          }}
        >
          {listing.city}, {listing.province}
        </div>

        {/* Price */}
        <div
          style={{
            fontSize: '56px',
            color: 'var(--theme-accent)',
            fontFamily: 'var(--theme-font-display)',
            fontWeight: 'bold',
            marginBottom: '40px',
          }}
        >
          {money(listing.price)}
        </div>

        {/* Details */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'var(--theme-font-narrow)',
            marginBottom: '40px',
          }}
        >
          {listing.beds && <span>{listing.beds} Beds</span>}
          {listing.baths && <span>{listing.baths} Baths</span>}
          {listing.acres && <span>{listing.acres} Acres</span>}
        </div>

        {/* Blurb */}
        {overrides.blurb && (
          <div
            style={{
              fontSize: '20px',
              color: '#ccc',
              fontFamily: 'var(--theme-font-narrow)',
              textAlign: 'center',
              lineHeight: 1.6,
              maxWidth: '800px',
              marginBottom: '40px',
            }}
          >
            {overrides.blurb}
          </div>
        )}

        {/* Agent */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              color: '#fff',
              fontFamily: 'var(--theme-font-display)',
              fontWeight: 'bold',
            }}
          >
            {agent.name}
          </div>
          <div
            style={{
              fontSize: '18px',
              color: 'var(--theme-accent-light)',
              fontFamily: 'var(--theme-font-narrow)',
            }}
          >
            {agent.phone} · {agent.website}
          </div>
        </div>
      </div>
    </Stage>
  );
}
