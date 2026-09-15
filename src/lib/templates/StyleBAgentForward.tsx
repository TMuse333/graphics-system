'use client';

import { Stage } from './Stage';
import { PhoneIcon, GlobeIcon, BEVEL_NEUTRAL } from './social';
import type { ContentTemplateProps } from '@/lib/types';

/**
 * AgentForward — 1080×1080, no listing.
 * The headshot is the subject. Intro posts and brokerage recruiting.
 *
 * Wants a cut-out headshot on transparent ground; a studio-backdrop photo
 * reads as a rectangle against the gradient.
 */
export function StyleBAgentForward({ agent, content }: ContentTemplateProps) {
  const [first, ...rest] = agent.name.split(' ');
  return (
    <Stage width={1080} height={1080} theme={agent.theme}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg,var(--theme-primary) 0%,var(--theme-primary-alt) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: .06, backgroundImage: 'radial-gradient(circle at 78% 42%,var(--theme-accent) 0 2px,transparent 2px)', backgroundSize: '34px 34px' }} />
      {agent.headshotUrl && (
        <div style={{ position: 'absolute', right: -40, bottom: 0, width: 620, height: 1010, background: `url("${agent.headshotUrl}") bottom center/contain no-repeat` }} />
      )}
      <div style={{ position: 'absolute', right: 74, bottom: 0, width: 500, height: 520, background: 'linear-gradient(180deg,transparent,rgba(14,14,34,.55))' }} />
      <div style={{ position: 'absolute', left: 72, top: 150, width: 520 }}>
        <div style={{ fontFamily: 'var(--theme-font-script)', fontSize: 56, color: 'var(--theme-accent-light)', lineHeight: 1 }}>{content.kicker ?? "Hi, I'm"}</div>
        <div style={{ fontSize: 94, fontWeight: 900, color: '#fff', letterSpacing: '-3.4px', lineHeight: .92, marginTop: 6, textShadow: BEVEL_NEUTRAL }}>
          {first}<br />{rest.join(' ')}
        </div>
        <div style={{ height: 4, width: 140, background: 'var(--theme-accent)', margin: '30px 0 26px' }} />
        <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 21, fontWeight: 700, letterSpacing: '3.2px', textTransform: 'uppercase', color: 'var(--theme-accent-light)', lineHeight: 1.5 }}>
          {content.title ?? agent.title}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 44 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 13, fontSize: 23, fontWeight: 700, color: '#fff' }}><PhoneIcon />{agent.phone}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 13, fontSize: 23, fontWeight: 700, color: '#fff' }}><GlobeIcon />{agent.website}</span>
        </div>
      </div>
    </Stage>
  );
}
