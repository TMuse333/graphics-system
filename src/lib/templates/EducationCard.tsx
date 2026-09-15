'use client';

import { Stage } from './Stage';
import { BandEyebrow, ContentFooter } from './light';
import type { ContentTemplateProps } from '@/lib/types';

/**
 * Education — 1080×1350, light ground, no listing.
 * Numbered advice. Five points fills the canvas; four leaves a visible hole
 * above the footer, so the form should require at least five.
 */
export function EducationCard({ agent, content }: ContentTemplateProps) {
  const points = content.points ?? [];
  return (
    <Stage width={1080} height={1350} theme={agent.theme} background="var(--theme-surface)">
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 340, background: 'var(--theme-primary)' }} />
      <div style={{ position: 'absolute', left: 0, top: 334, width: 1080, height: 6, background: 'var(--theme-accent)' }} />
      <div style={{ position: 'absolute', left: -60, top: -120, width: 420, height: 420, border: '60px solid rgba(255,255,255,.05)', borderRadius: '50%' }} />

      <div style={{ position: 'absolute', left: 72, top: 78, width: 860 }}>
        <BandEyebrow>{content.kicker ?? 'For Buyers'}</BandEyebrow>
        <div style={{ fontSize: 74, fontWeight: 900, color: '#fff', letterSpacing: '-2.6px', lineHeight: .98, marginTop: 16 }}>{content.title}</div>
      </div>

      <div style={{ position: 'absolute', left: 72, top: 402, width: 936, display: 'flex', flexDirection: 'column', gap: 30 }}>
        {points.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 26, alignItems: 'flex-start' }}>
            <div style={{ width: 58, height: 58, flex: 'none', borderRadius: 3, background: 'var(--theme-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#fff' }}>{i + 1}</div>
            <div style={{ paddingTop: 2 }}>
              <div style={{ fontSize: 31, fontWeight: 900, color: 'var(--theme-ink)', letterSpacing: '-.8px', lineHeight: 1.1 }}>{p.title}</div>
              <div style={{ fontSize: 20, fontWeight: 400, color: 'var(--theme-ink-soft)', lineHeight: 1.45, marginTop: 8, maxWidth: 800, textWrap: 'pretty' }}>{p.body}</div>
            </div>
          </div>
        ))}
      </div>

      {content.closing && (
        <div style={{ position: 'absolute', left: 72, top: 1074, width: 936, paddingTop: 24, borderTop: '2px solid rgba(20,20,40,.12)', fontSize: 25, fontWeight: 700, color: 'var(--theme-ink)', letterSpacing: '-.4px', lineHeight: 1.35, textWrap: 'pretty' }}>
          {content.closing}
        </div>
      )}
      <ContentFooter agent={agent} />
    </Stage>
  );
}
