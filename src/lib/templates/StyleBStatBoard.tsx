'use client';

import { Stage } from './Stage';
import { SlimAgentBar } from './social';
import type { ContentTemplateProps } from '@/lib/types';

/**
 * StatBoard — 1080×1080, no photo.
 * Four figures in a 2×2. Deliberately capped at four: more than that and it
 * stops being readable at feed size.
 */
export function StyleBStatBoard({ agent, content }: ContentTemplateProps) {
  const stats = (content.stats ?? []).slice(0, 4);
  return (
    <Stage width={1080} height={1080} theme={agent.theme}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(150deg,var(--theme-primary),var(--theme-primary-alt))' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 6, background: 'var(--theme-accent)' }} />
      <div style={{ position: 'absolute', left: 64, top: 72 }}>
        <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 19, fontWeight: 700, letterSpacing: '5.6px', textTransform: 'uppercase', color: 'var(--theme-accent)' }}>{content.kicker ?? 'Market Update'}</div>
        <div style={{ fontSize: 66, fontWeight: 900, color: '#fff', letterSpacing: '-2.2px', lineHeight: 1, marginTop: 12 }}>{content.title}</div>
        <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 22, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,.52)', marginTop: 12 }}>{content.period}</div>
      </div>
      <div style={{ position: 'absolute', left: 64, top: 310, width: 952, height: 520, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 20 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid color-mix(in srgb, var(--theme-accent) 24%, transparent)', borderRadius: 3, padding: '34px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 74, fontWeight: 900, color: 'var(--theme-accent-light)', letterSpacing: '-3px', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 19, fontWeight: 700, letterSpacing: '2.8px', textTransform: 'uppercase', color: '#fff', marginTop: 12 }}>{s.label}</div>
            {s.delta && <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 15, fontWeight: 600, letterSpacing: '1.4px', color: 'rgba(255,255,255,.45)', marginTop: 5 }}>{s.delta}</div>}
          </div>
        ))}
      </div>
      <SlimAgentBar agent={agent} />
    </Stage>
  );
}
