'use client';

import type { Agent } from '@/lib/types';

/** Shared chrome for the Style B social archetypes. */

export const PhoneIcon = ({ color = 'var(--theme-accent)' }: { color?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19, flex: 'none' }}>
    <path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3z" />
  </svg>
);

export const GlobeIcon = ({ color = 'var(--theme-accent)' }: { color?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19, flex: 'none' }}>
    <circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
  </svg>
);

/**
 * Slim contact strip. Replaces the tall curved AgentBand on archetypes
 * where the artwork above needs the room.
 */
export function SlimAgentBar({ agent, height = 132 }: { agent: Agent; height?: number }) {
  return (
    <div style={{ position: 'absolute', left: 0, bottom: 0, width: 1080, height, background: 'linear-gradient(100deg,var(--theme-primary),var(--theme-primary-alt))' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 4, background: 'var(--theme-accent)' }} />
      {agent.headshotUrl && (
        <div style={{ position: 'absolute', left: 44, top: 30, width: 72, height: 72, borderRadius: '50%', border: '3px solid var(--theme-accent)', background: `#dfe3ea url("${agent.headshotUrl}") center 8%/cover no-repeat` }} />
      )}
      <div style={{ position: 'absolute', left: 138, top: 34 }}>
        <div style={{ fontSize: 29, fontWeight: 900, color: '#fff', letterSpacing: '-.4px', lineHeight: 1 }}>{agent.name}</div>
        <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 14, fontWeight: 700, letterSpacing: '2.8px', textTransform: 'uppercase', color: 'var(--theme-accent-light)', marginTop: 7 }}>{agent.title}</div>
      </div>
      <div style={{ position: 'absolute', right: 44, top: 38, display: 'flex', gap: 24, alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 20, fontWeight: 700, color: '#fff' }}><PhoneIcon />{agent.phone}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 20, fontWeight: 700, color: '#fff' }}><GlobeIcon />{agent.website}</span>
      </div>
    </div>
  );
}

export const BEVEL_ACCENT =
  '0 2px 0 color-mix(in srgb, var(--theme-accent) 78%, #000),0 4px 0 color-mix(in srgb, var(--theme-accent) 58%, #000),0 6px 0 color-mix(in srgb, var(--theme-accent) 40%, #000),0 10px 22px rgba(0,0,0,.6)';
export const BEVEL_NEUTRAL =
  '0 2px 0 #b9bcc9,0 4px 0 #8e93a3,0 6px 0 #676c7c,0 10px 22px rgba(0,0,0,.55)';
