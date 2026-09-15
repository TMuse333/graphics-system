'use client';

import { Stage } from './Stage';
import { BandEyebrow, ContentFooter } from './light';
import type { ContentTemplateProps } from '@/lib/types';

const Arrow = ({ color, dir }: { color: string; dir: 'up' | 'down' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, flex: 'none', transform: dir === 'up' ? undefined : 'rotate(180deg)' }}>
    <path d="M12 19V5" /><path d="m5 12 7-7 7 7" />
  </svg>
);

/**
 * MarketStats — 1080×1350, light ground, no listing.
 *
 * Two headline figures with year-over-year movement, four supporting. The
 * point of the template is that the brokerage enters the numbers once and
 * every agent renders it under their own name.
 */
export function MarketStats({ agent, content }: ContentTemplateProps) {
  const stats = content.stats ?? [];
  const big = stats.slice(0, 2);
  const small = stats.slice(2, 6);

  return (
    <Stage width={1080} height={1350} theme={agent.theme} background="var(--theme-surface)">
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 250, background: 'var(--theme-primary)' }} />
      <div style={{ position: 'absolute', left: 0, top: 244, width: 1080, height: 6, background: 'var(--theme-accent)' }} />
      <div style={{ position: 'absolute', left: 72, top: 64 }}>
        <BandEyebrow>{content.kicker ?? 'Market Report'}</BandEyebrow>
        <div style={{ fontSize: 64, fontWeight: 900, color: '#fff', letterSpacing: '-2.4px', lineHeight: 1, marginTop: 12 }}>{content.title}</div>
      </div>
      <div style={{ position: 'absolute', right: 72, top: 94, textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 17, fontWeight: 700, letterSpacing: '3.4px', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)' }}>{content.subtitle ?? 'Year to date'}</div>
        <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 30, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', marginTop: 6 }}>{content.period}</div>
      </div>

      <div style={{ position: 'absolute', left: 72, top: 312, width: 936, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {big.map((s, i) => {
          const c = s.direction === 'down' ? 'var(--theme-primary)' : 'var(--theme-accent-text)';
          return (
            <div key={i} style={{ background: 'var(--theme-surface-alt)', borderRadius: 4, padding: '34px 34px 30px', boxShadow: '0 8px 24px rgba(20,20,40,.09)' }}>
              <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 17, fontWeight: 700, letterSpacing: '3.2px', textTransform: 'uppercase', color: 'var(--theme-ink-soft)' }}>{s.label}</div>
              <div style={{ fontSize: 78, fontWeight: 900, color: 'var(--theme-ink)', letterSpacing: '-3.4px', lineHeight: 1, marginTop: 12 }}>{s.value}</div>
              {s.delta && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 12 }}>
                  <Arrow color={c} dir={s.direction ?? 'up'} />
                  <span style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 20, fontWeight: 700, letterSpacing: '1.6px', textTransform: 'uppercase', color: c }}>{s.delta}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', left: 72, top: 614, width: 936, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {small.map((s, i) => (
          <div key={i} style={{ background: 'var(--theme-surface-alt)', borderRadius: 4, padding: '26px 20px', textAlign: 'center', boxShadow: '0 6px 18px rgba(20,20,40,.07)' }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: 'var(--theme-primary)', letterSpacing: '-1.6px', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 15, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--theme-ink-soft)', marginTop: 10, lineHeight: 1.25 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', left: 72, top: 846, width: 936, paddingTop: 26, borderTop: '2px solid rgba(20,20,40,.12)' }}>
        {content.closing && <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--theme-ink)', letterSpacing: '-.4px', lineHeight: 1.35, maxWidth: 820, textWrap: 'pretty' }}>{content.closing}</div>}
        {content.footnote && <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 15, fontWeight: 600, letterSpacing: '1.2px', color: 'var(--theme-ink-soft)', marginTop: 16 }}>{content.footnote}</div>}
      </div>
      <ContentFooter agent={agent} />
    </Stage>
  );
}
