'use client';

import { Stage } from './Stage';
import { SlimAgentBar } from './social';
import type { TemplateProps } from '@/lib/types';
import { money, focalCss } from '@/lib/types';

/**
 * FloatingCard — 1080×1080.
 * White card over a darkened photo. The only light-silhouette square in the
 * set, which is what makes it read differently in a feed.
 */
export function StyleBFloatingCard({ agent, listing, variant, overrides, photos }: TemplateProps) {
  const isOpenHouse = variant === 'open-house';
  const bigLines = (overrides.headline ?? (isOpenHouse ? `${overrides.date ?? 'Saturday'}|${overrides.time ?? '1 – 3 PM'}` : `${listing.city}|${listing.province}`)).split('|');

  return (
    <Stage width={1080} height={1080} theme={agent.theme}>
      <div style={{ position: 'absolute', inset: 0, background: photos.hero ? `#1e293b url("${photos.hero.url}") ${focalCss(photos.hero)}/cover no-repeat` : '#1e293b' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,12,26,.58)' }} />
      <div style={{ position: 'absolute', left: 112, top: 150, width: 856, background: '#fff', borderRadius: 4, padding: '62px 70px 58px', boxShadow: '0 30px 70px rgba(0,0,0,.5)' }}>
        <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 20, fontWeight: 700, letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--theme-accent-text, var(--theme-accent))' }}>
          {overrides.eyebrow ?? (isOpenHouse ? 'Open House' : 'Just Listed')}
        </div>
        {bigLines.map((l, i) => (
          <div key={i} style={{ fontSize: 74, fontWeight: 900, color: 'var(--theme-primary)', letterSpacing: '-2.4px', lineHeight: 1, marginTop: i === 0 ? 16 : 0 }}>{l.trim()}</div>
        ))}
        <div style={{ height: 2, background: '#e6e6ee', margin: '34px 0 30px' }} />
        <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 30, fontWeight: 700, letterSpacing: '1.6px', textTransform: 'uppercase', color: 'var(--theme-primary)', lineHeight: 1.22 }}>
          {listing.address}<br />{listing.city}, {listing.province}
        </div>
        <div style={{ display: 'flex', gap: 44, marginTop: 30, alignItems: 'baseline' }}>
          {listing.beds != null && (
            <div><span style={{ fontSize: 40, fontWeight: 900, color: 'var(--theme-primary)' }}>{listing.beds}</span><span style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 17, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: '#6f6f80', marginLeft: 9 }}>Bed</span></div>
          )}
          {listing.baths != null && (
            <div><span style={{ fontSize: 40, fontWeight: 900, color: 'var(--theme-primary)' }}>{listing.baths}</span><span style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 17, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: '#6f6f80', marginLeft: 9 }}>Bath</span></div>
          )}
          <div style={{ marginLeft: 'auto', fontSize: 44, fontWeight: 900, color: 'var(--theme-accent-text, var(--theme-accent))', letterSpacing: '-1.4px' }}>{money(listing.price)}</div>
        </div>
      </div>
      <SlimAgentBar agent={agent} />
    </Stage>
  );
}
