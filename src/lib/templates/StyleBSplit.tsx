'use client';

import { Stage } from './Stage';
import { BEVEL_ACCENT, BEVEL_NEUTRAL } from './social';
import type { TemplateProps } from '@/lib/types';
import { money, focalCss } from '@/lib/types';

/**
 * SplitVertical — 1080×1080.
 * Hard 50/50 vertical divide: photo left, content right. The stat rows are
 * ruled rather than chipped, which keeps the right column reading as one block.
 */
export function StyleBSplit({ agent, listing, overrides, photos }: TemplateProps) {
  const rows: [string | number, string][] = [];
  if (listing.beds != null) rows.push([listing.beds, 'Bedrooms']);
  if (listing.baths != null) rows.push([listing.baths, 'Bathrooms']);
  if (listing.acres != null) rows.push([listing.acres, 'Acre Lot']);

  const head = (overrides.headline ?? `${listing.city}|${listing.province}`).split('|');

  return (
    <Stage width={1080} height={1080} theme={agent.theme}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 1080, background: photos.hero ? `#1e293b url("${photos.hero.url}") ${focalCss(photos.hero)}/cover no-repeat` : '#1e293b' }} />
      <div style={{ position: 'absolute', left: 540, top: 0, width: 540, height: 1080, background: 'linear-gradient(165deg,var(--theme-primary),var(--theme-primary-alt))' }} />
      <div style={{ position: 'absolute', left: 536, top: 0, width: 8, height: 1080, background: 'var(--theme-accent)' }} />

      <div style={{ position: 'absolute', left: 596, top: 96, width: 428 }}>
        <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 18, fontWeight: 700, letterSpacing: '5.4px', textTransform: 'uppercase', color: 'var(--theme-accent)' }}>
          {overrides.eyebrow ?? 'Coming Soon'}
        </div>
        <div style={{ fontSize: 76, fontWeight: 900, color: '#fff', letterSpacing: '-2.6px', lineHeight: .94, marginTop: 18, textShadow: BEVEL_NEUTRAL }}>
          {head[0]}<br /><span style={{ color: 'var(--theme-accent-light)', textShadow: BEVEL_ACCENT }}>{head[1]}</span>
        </div>
        <div style={{ height: 3, width: 120, background: 'var(--theme-accent)', margin: '34px 0 28px' }} />
        <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 25, fontWeight: 700, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#fff', lineHeight: 1.25 }}>{listing.address}</div>
        <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 18, fontWeight: 600, letterSpacing: '2.6px', textTransform: 'uppercase', color: 'var(--theme-accent-light)', marginTop: 10 }}>MLS® {listing.mls}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 40 }}>
          {rows.map(([v, k]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'baseline', gap: 14, borderBottom: '1px solid rgba(255,255,255,.14)', paddingBottom: 11 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1, minWidth: 64 }}>{v}</span>
              <span style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 17, fontWeight: 700, letterSpacing: '2.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,.62)' }}>{k}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 54, fontWeight: 900, color: 'var(--theme-accent-light)', letterSpacing: '-1.8px', marginTop: 38, textShadow: BEVEL_ACCENT }}>{money(listing.price)}</div>
      </div>

      <div style={{ position: 'absolute', left: 0, bottom: 0, width: 540, height: 196, background: 'linear-gradient(180deg,transparent,rgba(10,10,24,.9))' }} />
      <div style={{ position: 'absolute', left: 44, bottom: 44, display: 'flex', alignItems: 'center', gap: 18 }}>
        {agent.headshotUrl && <div style={{ width: 76, height: 76, borderRadius: '50%', border: '3px solid var(--theme-accent)', background: `#dfe3ea url("${agent.headshotUrl}") center 8%/cover no-repeat` }} />}
        <div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{agent.name}</div>
          <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 15, fontWeight: 700, letterSpacing: '2px', color: 'var(--theme-accent-light)', marginTop: 7 }}>{agent.phone}</div>
        </div>
      </div>
    </Stage>
  );
}
