'use client';

import type { Agent } from '@/lib/types';
import { PhoneIcon, GlobeIcon } from './social';

/**
 * Light-ground chrome for the portrait content templates.
 *
 * These sit on --theme-surface rather than --theme-primary, which is why
 * Theme carries surface/ink tokens and a separate accent-text value: the
 * dark-mode accent is a decorative color and fails contrast as small text
 * on cream.
 */

/** Monogram disc. Stands in until an agent supplies a knockout logo. */
export function Monogram({ mark, size = 86, onDark = true }: { mark: string; size?: number; onDark?: boolean }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: onDark ? '#fff' : 'var(--theme-primary)',
      color: onDark ? 'var(--theme-primary)' : '#fff',
      border: '3px solid var(--theme-accent)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--theme-font-display)', fontSize: size * 0.3, fontWeight: 900, letterSpacing: '-1px',
      flex: 'none',
    }}>{mark}</div>
  );
}

/** Eyebrow on a dark header band: white text with an accent rule beside it. */
export function BandEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 46, height: 4, background: 'var(--theme-accent)' }} />
      <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 19, fontWeight: 700, letterSpacing: '6px', textTransform: 'uppercase', color: '#fff' }}>{children}</div>
    </div>
  );
}

export const initialsOf = (name: string) =>
  name.split(/[\s/]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

/** Dark contact footer that closes every portrait content template. */
export function ContentFooter({ agent, top = 1170, height = 180 }: { agent: Agent; top?: number; height?: number }) {
  const mid = height / 2;
  return (
    <div style={{ position: 'absolute', left: 0, top, width: 1080, height, background: 'var(--theme-primary)' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 6, background: 'var(--theme-accent)' }} />
      <div style={{ position: 'absolute', left: 62, top: mid - 43 }}>
        {agent.headshotUrl
          ? <div style={{ width: 86, height: 86, borderRadius: '50%', border: '3px solid var(--theme-accent)', background: `#dfe3ea url("${agent.headshotUrl}") center 8%/cover no-repeat` }} />
          : <Monogram mark={initialsOf(agent.name)} />}
      </div>
      <div style={{ position: 'absolute', left: 176, top: mid - 40 }}>
        <div style={{ fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: '-.5px', lineHeight: 1 }}>{agent.name}</div>
        <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 15, fontWeight: 700, letterSpacing: '2.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,.66)', marginTop: 8 }}>{agent.title}</div>
      </div>
      <div style={{ position: 'absolute', right: 62, top: mid - 32, display: 'flex', flexDirection: 'column', gap: 9, alignItems: 'flex-end' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, fontWeight: 700, color: '#fff' }}><PhoneIcon color="#fff" />{agent.phone}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, fontWeight: 700, color: '#fff' }}><GlobeIcon color="#fff" />{agent.website}</span>
      </div>
    </div>
  );
}
