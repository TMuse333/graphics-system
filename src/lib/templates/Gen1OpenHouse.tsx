'use client';

import { Stage } from './Stage';
import type { TemplateProps } from '@/lib/types';

/**
 * STUB: Open House (Classic) template (1080×1080)
 * Supports dual-agent layouts.
 */
export function Gen1OpenHouse({ agent, listing, variant, overrides, coAgent }: TemplateProps) {
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
          Open House (Classic)
        </div>

        {/* Open House badge */}
        <div
          style={{
            fontSize: '48px',
            color: 'var(--theme-accent)',
            fontFamily: 'var(--theme-font-display)',
            fontWeight: 'bold',
            marginBottom: '20px',
            textTransform: 'uppercase',
          }}
        >
          OPEN HOUSE
        </div>

        {/* Date & Time */}
        {(overrides.date || overrides.time) && (
          <div
            style={{
              fontSize: '32px',
              color: '#fff',
              fontFamily: 'var(--theme-font-narrow)',
              marginBottom: '40px',
            }}
          >
            {overrides.date} {overrides.time && `· ${overrides.time}`}
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

        {/* Agents */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            gap: '40px',
            fontSize: '20px',
            color: '#fff',
            fontFamily: 'var(--theme-font-narrow)',
          }}
        >
          <span>{agent.name}</span>
          {coAgent && <span>{coAgent.name}</span>}
        </div>
      </div>
    </Stage>
  );
}
