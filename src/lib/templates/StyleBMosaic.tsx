'use client';

import { Stage } from './Stage';
import { SlimAgentBar } from './social';
import type { TemplateProps, Photo } from '@/lib/types';
import { money, focalCss } from '@/lib/types';

/**
 * PhotoMosaic — 1080×1080.
 * Four-up grid with type reduced to a thin top overlay. For listings whose
 * photography is the selling point.
 */
export function StyleBMosaic({ agent, listing, overrides, photos }: TemplateProps) {
  const tiles: (Photo | undefined)[] = [photos.hero, ...(photos.strip ?? []), ...(photos.row ?? [])].slice(0, 4);
  while (tiles.length < 4) tiles.push(photos.hero);

  return (
    <Stage width={1080} height={1080} theme={agent.theme}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 948, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 5 }}>
        {tiles.map((p, i) => (
          <div key={`tile-${i}`} style={{ background: p ? `#1e293b url("${p.url}") ${focalCss(p)}/cover no-repeat` : '#1e293b' }} />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 230, background: 'linear-gradient(180deg,rgba(10,10,24,.72),transparent)' }} />
      <div style={{ position: 'absolute', left: 48, top: 44 }}>
        <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 19, fontWeight: 700, letterSpacing: '5.5px', textTransform: 'uppercase', color: 'var(--theme-accent)' }}>
          {overrides.eyebrow ?? 'Just Listed'}
        </div>
        <div style={{ fontSize: 52, fontWeight: 900, color: '#fff', letterSpacing: '-1.4px', lineHeight: 1.02, marginTop: 8, textShadow: '0 3px 16px rgba(0,0,0,.55)' }}>
          {overrides.headline ?? listing.address}
        </div>
      </div>
      <div style={{ position: 'absolute', right: 44, top: 52, padding: '14px 26px', background: 'var(--theme-accent)', borderRadius: 3 }}>
        <div style={{ fontSize: 38, fontWeight: 900, color: 'var(--theme-primary)', letterSpacing: '-1.2px', lineHeight: 1 }}>{overrides.badge ?? money(listing.price)}</div>
      </div>
      <SlimAgentBar agent={agent} />
    </Stage>
  );
}
