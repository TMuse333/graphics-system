'use client';

/**
 * Shared primitives for all carousel templates.
 * Extracted from BuyerObjectionsCarousel to maintain consistency.
 */
import * as React from 'react';
import type { Tone, CarouselAgent } from './carouselFormats';

// Theme defaults
export const THEME = {
  navy: '#0d2343',
  navy2: '#132f57',
  paper: '#f4f2ed',
  red: '#d8252b',
  mute: '#5b6b85',
};

// Frame dimensions
export const FRAME_WIDTH = 1080;
export const FRAME_HEIGHT = 1350;
export const SAFE_MARGIN = 60;
export const FOOTER_HEIGHT = 150;
export const CONTACT_HEIGHT = 64;

/* ---------- RE/MAX Footer ---------- */

export const RemaxFooter = () => (
  <div style={{
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: FRAME_WIDTH,
    height: FOOTER_HEIGHT,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    zIndex: 3,
  }}>
    {/* RE/MAX Balloon */}
    <div style={{ width: 52, height: 62, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 52, height: 15, background: THEME.red, borderRadius: '26px 26px 0 0' }} />
      <div style={{ position: 'absolute', left: 0, top: 15, width: 52, height: 14, background: '#fff' }} />
      <div style={{ position: 'absolute', left: 0, top: 29, width: 52, height: 15, background: '#1d4fa3', borderRadius: '0 0 26px 26px' }} />
      <div style={{ position: 'absolute', left: 20, top: 44, width: 12, height: 16, background: '#1d4fa3', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
    </div>
    {/* Wordmark */}
    <div style={{ fontFamily: 'var(--theme-font-display, "Archivo Black"), sans-serif', fontSize: 56, letterSpacing: -2, color: '#1a1a1a', lineHeight: 0.8 }}>
      RE<span style={{ color: THEME.red }}>/</span>MAX
      <div style={{ fontFamily: 'var(--theme-font-narrow, "Archivo Narrow"), sans-serif', fontSize: 18, fontWeight: 700, letterSpacing: 4, color: THEME.red, textAlign: 'center', marginTop: 4 }}>
        HARBOURSIDE
      </div>
    </div>
  </div>
);

/* ---------- Contact Bar ---------- */

export const ContactBar = ({ agent }: { agent: CarouselAgent }) => (
  <div style={{
    position: 'absolute',
    left: 0,
    bottom: FOOTER_HEIGHT,
    width: FRAME_WIDTH,
    height: CONTACT_HEIGHT,
    background: THEME.navy,
    color: '#fff',
    borderTop: `6px solid ${THEME.red}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    fontFamily: 'var(--theme-font-narrow, "Archivo Narrow"), sans-serif',
    fontWeight: 700,
    fontSize: 25,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    zIndex: 3,
  }}>
    {agent.name} <span style={{ opacity: 0.5 }}>|</span> {agent.phone} <span style={{ opacity: 0.5 }}>|</span> {agent.website}
  </div>
);

/* ---------- Progress Indicator ---------- */

export const Progress = ({ n, total, tone = 'light' }: { n: number; total: number; tone?: Tone }) => {
  const isDark = tone === 'dark' || tone === 'red';
  return (
    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN - 4,
      top: SAFE_MARGIN - 2,
      width: FRAME_WIDTH - (SAFE_MARGIN - 4) * 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 2,
    }}>
      <div style={{
        fontFamily: 'var(--theme-font-display, "Archivo Black"), sans-serif',
        fontSize: 46,
        letterSpacing: -1,
        color: isDark ? '#fff' : THEME.navy,
      }}>
        {String(n).padStart(2, '0')}
        <span style={{ color: isDark ? '#fff' : THEME.red }}> / </span>
        {String(total).padStart(2, '0')}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            style={{
              width: 15,
              height: 15,
              borderRadius: '50%',
              background: i === n - 1
                ? (isDark ? '#fff' : THEME.navy)
                : (isDark ? 'rgba(255,255,255,0.26)' : 'rgba(13,35,67,0.22)'),
            }}
          />
        ))}
      </div>
    </div>
  );
};

/* ---------- Carousel Frame Wrapper ---------- */

interface CarouselFrameProps {
  tone: Tone;
  children: React.ReactNode;
  backgroundImage?: string;
  backgroundOverlay?: 'navy' | 'gradient' | 'none';
  className?: string;
}

export const CarouselFrame = ({ tone, children, backgroundImage, backgroundOverlay = 'none' }: CarouselFrameProps) => {
  const bg = tone === 'light' ? THEME.paper
    : tone === 'red' ? THEME.red
    : '#07142b';

  return (
    <div style={{
      position: 'relative',
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
      overflow: 'hidden',
      background: bg,
      fontFamily: 'var(--theme-font-narrow, "Archivo Narrow"), sans-serif',
    }}>
      {backgroundImage && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT - FOOTER_HEIGHT - CONTACT_HEIGHT,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: tone === 'light' ? 0.2 : 0.34,
          maskImage: `linear-gradient(180deg, transparent ${tone === 'light' ? '42%' : '38%'}, #000 100%)`,
          WebkitMaskImage: `linear-gradient(180deg, transparent ${tone === 'light' ? '42%' : '38%'}, #000 100%)`,
        }} />
      )}
      {backgroundImage && backgroundOverlay === 'navy' && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT - FOOTER_HEIGHT - CONTACT_HEIGHT,
          background: `linear-gradient(180deg, rgba(13,35,67,0.9) 0%, rgba(13,35,67,0.7) 50%, rgba(13,35,67,0.4) 100%)`,
        }} />
      )}
      {backgroundImage && backgroundOverlay === 'gradient' && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT - FOOTER_HEIGHT - CONTACT_HEIGHT,
          background: `linear-gradient(180deg, rgba(7,20,43,0.96) 0%, rgba(7,20,43,0.88) 50%, rgba(7,20,43,0.6) 100%)`,
        }} />
      )}
      {children}
    </div>
  );
};

/* ---------- Typography ---------- */

export const DisplayText = ({ children, size = 90, tone = 'light', style }: {
  children: React.ReactNode;
  size?: number;
  tone?: Tone;
  style?: React.CSSProperties;
}) => (
  <div style={{
    fontFamily: 'var(--theme-font-display, "Archivo Black"), sans-serif',
    fontSize: size,
    textTransform: 'uppercase',
    lineHeight: 0.88,
    letterSpacing: -1,
    color: tone === 'light' ? THEME.navy : '#fff',
    ...style,
  }}>
    {children}
  </div>
);

export const BodyText = ({ children, size = 38, tone = 'light', muted = false, style }: {
  children: React.ReactNode;
  size?: number;
  tone?: Tone;
  muted?: boolean;
  style?: React.CSSProperties;
}) => (
  <div style={{
    fontFamily: 'var(--theme-font-narrow, "Archivo Narrow"), sans-serif',
    fontSize: size,
    lineHeight: 1.24,
    color: muted
      ? (tone === 'light' ? THEME.mute : '#a9bbd4')
      : (tone === 'light' ? THEME.navy : '#fff'),
    ...style,
  }}>
    {children}
  </div>
);

export const Kicker = ({ children, tone = 'light', style }: {
  children: React.ReactNode;
  tone?: Tone;
  style?: React.CSSProperties;
}) => (
  <div style={{
    fontFamily: 'var(--theme-font-narrow, "Archivo Narrow"), sans-serif',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 4,
    fontSize: 25,
    color: tone === 'light' ? THEME.red : '#fff',
    ...style,
  }}>
    {children}
  </div>
);

export const Rule = ({ width = 300, tone = 'light', style }: {
  width?: number;
  tone?: Tone;
  style?: React.CSSProperties;
}) => (
  <div style={{
    height: 7,
    width,
    background: tone === 'light' ? THEME.navy : '#fff',
    ...style,
  }} />
);

export const Tag = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    display: 'inline-block',
    background: THEME.navy,
    color: '#fff',
    fontFamily: 'var(--theme-font-narrow, "Archivo Narrow"), sans-serif',
    fontWeight: 700,
    fontSize: 24,
    letterSpacing: 3,
    textTransform: 'uppercase',
    padding: '9px 20px',
    ...style,
  }}>
    {children}
  </div>
);

/* ---------- Delta Chip ---------- */

export const DeltaChip = ({ value, style }: { value: number; style?: React.CSSProperties }) => {
  const isUp = value >= 0;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '6px 12px',
      borderRadius: 4,
      background: isUp ? 'rgba(56, 161, 105, 0.2)' : 'rgba(229, 62, 62, 0.2)',
      color: isUp ? '#38a169' : THEME.red,
      fontWeight: 700,
      fontSize: 24,
      ...style,
    }}>
      {isUp ? '▲' : '▼'} {Math.abs(value)}%
    </span>
  );
};

/* ---------- Ghost Number ---------- */

export const GhostNumber = ({ n, tone = 'light' }: { n: number | string; tone?: Tone }) => (
  <div style={{
    position: 'absolute',
    right: 34,
    top: 452,
    fontFamily: 'var(--theme-font-display, "Archivo Black"), sans-serif',
    fontSize: 420,
    lineHeight: 0.7,
    letterSpacing: -18,
    pointerEvents: 'none',
    color: tone === 'light' ? 'rgba(13,35,67,0.07)' : 'rgba(255,255,255,0.06)',
  }}>
    {typeof n === 'number' ? String(n).padStart(2, '0') : n}
  </div>
);

/* ---------- Icon Box ---------- */

export const IconBox = ({ children, tone = 'light', size = 248, style }: {
  children: React.ReactNode;
  tone?: Tone;
  size?: number;
  style?: React.CSSProperties;
}) => (
  <div style={{
    width: size,
    height: size,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: tone === 'light' ? THEME.navy : '#fff',
    color: tone === 'light' ? '#fff' : THEME.navy,
    ...style,
  }}>
    {children}
  </div>
);
