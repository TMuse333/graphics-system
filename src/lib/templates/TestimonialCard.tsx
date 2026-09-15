'use client';

import { Stage } from './Stage';
import { ContentFooter, Monogram, initialsOf } from './light';
import type { ContentTemplateProps } from '@/lib/types';

const Star = () => (
  <svg viewBox="0 0 24 24" fill="var(--theme-accent)" style={{ width: 30, height: 30 }}>
    <path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9z" />
  </svg>
);

/**
 * Testimonial — 1080×1350, light ground, no listing.
 * Quote-led social proof. The headline above the card is the outcome, not
 * the word "testimonial" — the result is what stops the scroll.
 */
export function TestimonialCard({ agent, content }: ContentTemplateProps) {
  const head = (content.title ?? '').split('|');
  const rating = content.rating ?? 5;

  return (
    <Stage width={1080} height={1350} theme={agent.theme} background="var(--theme-surface)">
      <div style={{ position: 'absolute', right: -140, top: -140, width: 520, height: 520, borderRadius: '50%', background: 'var(--theme-primary)', opacity: .06 }} />
      <div style={{ position: 'absolute', left: -90, bottom: 280, width: 360, height: 360, border: '44px solid var(--theme-accent)', borderRadius: '50%', opacity: .09 }} />

      <div style={{ position: 'absolute', left: 72, top: 80, fontFamily: 'var(--theme-font-narrow)', fontSize: 19, fontWeight: 700, letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--theme-accent-text)' }}>
        {content.kicker ?? 'Client Story'}
      </div>
      <div style={{ position: 'absolute', left: 72, top: 122, width: 700, fontSize: 64, fontWeight: 900, color: 'var(--theme-ink)', letterSpacing: '-2.4px', lineHeight: .98 }}>
        {head[0]}{head[1] && <><br />{head[1]}</>}
      </div>
      <div style={{ position: 'absolute', left: 72, top: 296, width: 120, height: 5, background: 'var(--theme-accent)' }} />

      <div style={{ position: 'absolute', left: 72, top: 358, width: 936, background: 'var(--theme-surface-alt)', borderRadius: 4, padding: '60px 64px 54px', boxShadow: '0 14px 40px rgba(20,20,40,.11)' }}>
        <div style={{ fontFamily: 'var(--theme-font-display)', fontSize: 180, fontWeight: 900, color: 'var(--theme-accent)', opacity: .16, lineHeight: .7, height: 74 }}>&ldquo;</div>
        <div style={{ fontSize: 36, fontWeight: 500, color: 'var(--theme-ink)', lineHeight: 1.38, letterSpacing: '-.6px', textWrap: 'pretty', marginTop: 18 }}>{content.quote}</div>
        <div style={{ display: 'flex', gap: 7, marginTop: 34 }}>{Array.from({ length: rating }, (_, i) => <Star key={i} />)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 34, paddingTop: 30, borderTop: '2px solid rgba(20,20,40,.1)' }}>
          <Monogram mark={initialsOf(content.attribution ?? '')} size={70} onDark={false} />
          <div>
            <div style={{ fontSize: 27, fontWeight: 900, color: 'var(--theme-ink)', letterSpacing: '-.5px', lineHeight: 1 }}>{content.attribution}</div>
            <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 17, fontWeight: 700, letterSpacing: '2.4px', textTransform: 'uppercase', color: 'var(--theme-ink-soft)', marginTop: 7 }}>{content.attributionMeta}</div>
          </div>
        </div>
      </div>
      <ContentFooter agent={agent} />
    </Stage>
  );
}
