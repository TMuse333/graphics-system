'use client';

import { Stage } from './Stage';
import { SlimAgentBar } from './social';
import type { ContentTemplateProps } from '@/lib/types';

/**
 * TypePoster — 1080×1080, no photo.
 * A quote or announcement carried entirely by type. This is the template an
 * agent uses on a day with no listing and no good photography.
 */
export function StyleBTypePoster({ agent, content }: ContentTemplateProps) {
  const body = content.quote ?? content.title ?? '';
  const emph = content.emphasis;
  const parts = emph && body.includes(emph) ? body.split(emph) : null;

  return (
    <Stage width={1080} height={1080} theme={agent.theme}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg,var(--theme-primary) 0%,var(--theme-primary-alt) 58%,color-mix(in srgb,var(--theme-primary-alt) 70%,#fff) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: .05, backgroundImage: 'repeating-linear-gradient(115deg,var(--theme-accent) 0 2px,transparent 2px 58px)' }} />
      <svg viewBox="0 0 24 24" style={{ position: 'absolute', left: 88, top: 104, width: 88, height: 88 }} fill="color-mix(in srgb, var(--theme-accent) 34%, transparent)">
        <path d="M9.5 5C6 5 3.2 7.9 3.2 11.4c0 3.2 2.4 5.7 5.4 5.7.5 0 1-.1 1.4-.2-.7 1.6-2.2 2.8-4 3.1l.5 2c4.3-.7 7.4-4.4 7.4-9.4C13.9 7.6 12 5 9.5 5zm10.3 0c-3.5 0-6.3 2.9-6.3 6.4 0 3.2 2.4 5.7 5.4 5.7.5 0 1-.1 1.4-.2-.7 1.6-2.2 2.8-4 3.1l.5 2c4.3-.7 7.4-4.4 7.4-9.4C24.2 7.6 22.3 5 19.8 5z" />
      </svg>
      <div style={{ position: 'absolute', left: 88, top: 228, width: 904, fontSize: 62, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', color: '#fff', textWrap: 'pretty' }}>
        {parts ? (<>{parts[0]}<span style={{ color: 'var(--theme-accent-light)' }}>{emph}</span>{parts[1]}</>) : body}
      </div>
      <div style={{ position: 'absolute', left: 88, top: 648, width: 180, height: 4, background: 'var(--theme-accent)' }} />
      {content.attribution && (
        <div style={{ position: 'absolute', left: 88, top: 690, fontFamily: 'var(--theme-font-narrow)', fontSize: 26, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#fff' }}>{content.attribution}</div>
      )}
      {content.attributionMeta && (
        <div style={{ position: 'absolute', left: 88, top: 730, fontFamily: 'var(--theme-font-narrow)', fontSize: 20, fontWeight: 600, letterSpacing: '2.4px', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>{content.attributionMeta}</div>
      )}
      <SlimAgentBar agent={agent} />
    </Stage>
  );
}
