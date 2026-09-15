'use client';

import type { CSSProperties, ReactNode } from 'react';
import type { Photo } from '@/lib/types';
import { focalCss } from '@/lib/types';

/**
 * Gen-1 primitives — the classic visual language.
 *
 * Distinct from Style B: hard rectangles, flat bands, a gold rule across
 * the full width, cream address chip with a map pin. No bevels, no curves.
 * Keep the two systems separate; they are deliberately different products.
 */

export const CREAM = '#f5f5f5';
export const CREAM_DIM = '#d8d8d8';
/** Deepest shade of the primary, for the band gradient's top-left corner. */
export const INK_DEEP = 'color-mix(in srgb, var(--theme-primary) 82%, #000)';

const F_DISPLAY = 'var(--theme-font-display)';
const F_NARROW = 'var(--theme-font-narrow)';

const abs = (style: CSSProperties): CSSProperties => ({ position: 'absolute', ...style });

/** Full-bleed hero, cropped to the photo's focal point. */
export function Gen1Hero({ photo, height }: { photo?: Photo; height: number }) {
  return (
    <div
      style={abs({
        left: 0,
        top: 0,
        width: 1080,
        height,
        background: '#1e293b',
        backgroundImage: photo ? `url("${photo.url}")` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: focalCss(photo),
        backgroundRepeat: 'no-repeat',
      })}
    />
  );
}

/** Darkening wash. Top scrim protects the headline, bottom the chips. */
export function Gen1Scrim({
  top,
  height,
  direction,
}: {
  top: number;
  height: number;
  direction: 'top' | 'bottom';
}) {
  const P = 'var(--theme-primary)';
  const gradient =
    direction === 'top'
      ? `linear-gradient(to bottom, color-mix(in srgb,${P} 78%,transparent) 0%, color-mix(in srgb,${P} 45%,transparent) 30%, color-mix(in srgb,${P} 15%,transparent) 55%, transparent 75%)`
      : `linear-gradient(to bottom, transparent 0%, color-mix(in srgb,${P} 45%,transparent) 60%, color-mix(in srgb,${P} 82%,transparent) 100%)`;
  return <div style={abs({ left: 0, top, width: 1080, height, background: gradient })} />;
}

/** Gold strip across the top: status, brand line, region. */
export function Gen1TopBar({
  left,
  center,
  right,
}: {
  left: string;
  center: string;
  right: string;
}) {
  const cell: CSSProperties = {
    position: 'absolute',
    top: 0,
    height: 45,
    display: 'flex',
    alignItems: 'center',
    fontFamily: F_NARROW,
    fontWeight: 700,
    fontSize: 17,
    color: 'var(--theme-primary)',
    letterSpacing: '3.7px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  };
  return (
    <>
      <div style={abs({ left: 0, top: 0, width: 1080, height: 45, background: 'var(--theme-accent)' })} />
      <div style={{ ...cell, left: 49, width: 250, justifyContent: 'flex-start' }}>{left}</div>
      <div style={{ ...cell, left: 290, width: 500, justifyContent: 'center' }}>{center}</div>
      <div style={{ ...cell, left: 781, width: 250, justifyContent: 'flex-end' }}>{right}</div>
    </>
  );
}

/** Centred eyebrow flanked by two short gold rules. */
export function Gen1Eyebrow({ children, top = 94 }: { children: ReactNode; top?: number }) {
  return (
    <>
      <div style={abs({ left: 402, top: top + 9, width: 35, height: 2, background: 'var(--theme-accent)' })} />
      <div style={abs({ left: 643, top: top + 9, width: 35, height: 2, background: 'var(--theme-accent)' })} />
      <div
        style={abs({
          left: 445,
          top,
          width: 190,
          fontFamily: F_NARROW,
          fontSize: 19,
          fontWeight: 700,
          color: 'var(--theme-accent-light)',
          textAlign: 'center',
          letterSpacing: '6.8px',
          textTransform: 'uppercase',
          lineHeight: '22px',
        })}
      >
        {children}
      </div>
    </>
  );
}

/** Two centred display lines; the second takes the accent. */
export function Gen1Title({
  line1,
  line2,
  top,
  size = 91,
  size2,
  gap = 82,
}: {
  line1: string;
  line2?: string;
  top: number;
  size?: number;
  size2?: number;
  gap?: number;
}) {
  const base: CSSProperties = {
    position: 'absolute',
    left: 54,
    width: 972,
    fontFamily: F_DISPLAY,
    fontWeight: 900,
    textAlign: 'center',
    letterSpacing: '-0.9px',
    lineHeight: 0.92,
    textTransform: 'uppercase',
    textShadow: '0 3px 18px rgba(15,15,30,0.7)',
  };
  return (
    <>
      <div style={{ ...base, top, fontSize: size, color: CREAM }}>{line1}</div>
      {line2 && (
        <div style={{ ...base, top: top + gap, fontSize: size2 ?? size, color: 'var(--theme-accent)' }}>
          {line2}
        </div>
      )}
    </>
  );
}

/** Dark stat card with a gold spine. Rows are label/value pairs. */
export function Gen1StatChip({
  rows,
  left = 49,
  top = 475,
  width = 230,
  height = 130,
}: {
  rows: { value: string; label: string; valueSize?: number }[];
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}) {
  return (
    <div
      style={abs({
        left,
        top,
        width,
        height,
        background: 'color-mix(in srgb, var(--theme-primary) 82%, transparent)',
        border: '1px solid color-mix(in srgb, var(--theme-accent) 35%, transparent)',
        boxSizing: 'border-box',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 10,
        paddingLeft: 22,
      })}
    >
      <div style={abs({ left: 0, top: 0, width: 4, height, background: 'var(--theme-accent)' })} />
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span
            style={{
              fontFamily: F_DISPLAY,
              fontSize: r.valueSize ?? 46,
              fontWeight: 900,
              color: CREAM,
              letterSpacing: '-1px',
              lineHeight: 1,
            }}
          >
            {r.value}
          </span>
          <span
            style={{
              fontFamily: F_NARROW,
              fontSize: 19,
              fontWeight: 700,
              color: 'var(--theme-accent-light)',
              letterSpacing: '2.4px',
              textTransform: 'uppercase',
            }}
          >
            {r.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Gold price tag with the notched arrow on its left edge. */
export function Gen1PriceTag({
  label,
  value,
  left = 801,
  top = 475,
  width = 230,
  height = 110,
}: {
  label: string;
  value: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}) {
  return (
    <>
      <div
        style={abs({
          left,
          top,
          width,
          height,
          background: 'var(--theme-accent)',
          borderRadius: 2,
          boxShadow: '0 10px 30px rgba(0,0,0,0.55)',
        })}
      />
      <div
        style={abs({
          left: left - 6,
          top: top + 38,
          width: 0,
          height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: '6px solid var(--theme-accent)',
        })}
      />
      <div
        style={abs({
          left: left + 20,
          top: top + 17,
          width: width - 40,
          fontFamily: F_NARROW,
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--theme-primary)',
          opacity: 0.9,
          textAlign: 'right',
          letterSpacing: '4.5px',
          textTransform: 'uppercase',
        })}
      >
        {label}
      </div>
      <div
        style={abs({
          left: left + 20,
          top: top + 40,
          width: width - 40,
          fontFamily: F_DISPLAY,
          fontSize: 45,
          fontWeight: 900,
          color: 'var(--theme-primary)',
          textAlign: 'right',
          letterSpacing: '-0.9px',
          lineHeight: 1,
        })}
      >
        {value}
      </div>
    </>
  );
}

/** Cream slab with a gold map pin — the address lockup. */
export function Gen1AddressChip({
  lines,
  top = 638,
  height = 108,
  left = 250,
  width = 580,
}: {
  lines: ReactNode;
  top?: number;
  height?: number;
  left?: number;
  width?: number;
}) {
  return (
    <>
      <div style={abs({ left, top, width, height, background: CREAM, boxShadow: '0 8px 20px rgba(0,0,0,0.45)' })} />
      <div
        style={abs({
          left: left + 20,
          top: top + height / 2 - 14,
          width: 28,
          height: 28,
          background: 'var(--theme-accent)',
          borderRadius: '50% 50% 50% 0',
          transform: 'rotate(-45deg)',
        })}
      >
        <div
          style={abs({
            left: '50%',
            top: '50%',
            width: 8,
            height: 8,
            margin: '-4px 0 0 -4px',
            background: CREAM,
            borderRadius: '50%',
          })}
        />
      </div>
      <div
        style={abs({
          left: left + 60,
          top,
          width: width - 80,
          height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          fontFamily: F_NARROW,
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--theme-primary)',
          letterSpacing: '3.6px',
          textTransform: 'uppercase',
          lineHeight: 1.3,
        })}
      >
        {lines}
      </div>
    </>
  );
}

const GlobeGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
  </svg>
);

/** Gold disc + text, the contact row unit. */
export function Gen1ContactLine({
  glyph,
  text,
  left,
  top,
}: {
  glyph: 'phone' | 'email' | 'web';
  text: string;
  left: number;
  top: number;
}) {
  return (
    <>
      <div
        style={abs({
          left,
          top,
          width: 32,
          height: 32,
          background: 'var(--theme-accent)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--theme-primary)',
          fontSize: 16,
          fontWeight: 700,
        })}
      >
        {glyph === 'phone' ? '\u260F' : glyph === 'email' ? '@' : <GlobeGlyph />}
      </div>
      <div
        style={abs({
          left: left + 46,
          top: top + 7,
          fontFamily: F_DISPLAY,
          fontSize: 19,
          fontWeight: 600,
          color: CREAM,
          whiteSpace: 'nowrap',
        })}
      >
        {text}
      </div>
    </>
  );
}

/** Flat contact band with the full-width gold rule on its top edge. */
export function Gen1Band({
  top,
  height,
  children,
}: {
  top: number;
  height: number;
  children?: ReactNode;
}) {
  return (
    <>
      <div
        style={abs({
          left: 0,
          top,
          width: 1080,
          height,
          background: `linear-gradient(to bottom right, ${INK_DEEP} 0%, var(--theme-primary) 55%, var(--theme-primary-alt) 100%)`,
        })}
      />
      <div style={abs({ left: 0, top, width: 1080, height: 5, background: 'var(--theme-accent)' })} />
      {children}
    </>
  );
}

/** Agent name block: kicker, name, role. */
export function Gen1AgentIdent({
  kicker,
  name,
  role,
  left = 54,
  top,
  nameSize = 50,
}: {
  kicker?: string;
  name: string;
  role: string;
  left?: number;
  top: number;
  nameSize?: number;
}) {
  return (
    <>
      {kicker && (
        <div
          style={abs({
            left,
            top,
            fontFamily: F_NARROW,
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--theme-accent-light)',
            letterSpacing: '5.1px',
            textTransform: 'uppercase',
          })}
        >
          {kicker}
        </div>
      )}
      <div
        style={abs({
          left,
          top: top + (kicker ? 28 : 0),
          width: 700,
          fontFamily: F_DISPLAY,
          fontSize: nameSize,
          fontWeight: 900,
          color: CREAM,
          letterSpacing: '-0.5px',
          lineHeight: 0.95,
          textTransform: 'uppercase',
        })}
      >
        {name}
      </div>
      <div
        style={abs({
          left,
          top: top + (kicker ? 28 : 0) + nameSize * 1.24,
          width: 700,
          fontFamily: F_NARROW,
          fontSize: 17,
          fontWeight: 700,
          color: 'var(--theme-accent-light)',
          letterSpacing: '3.1px',
          textTransform: 'uppercase',
        })}
      >
        {role}
      </div>
    </>
  );
}

/** Cut-out headshot, sits flush to the bottom of the stage. */
export function Gen1Headshot({
  url,
  left,
  top,
  width,
  height,
  fit = 'contain',
}: {
  url?: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fit?: 'contain' | 'cover';
}) {
  if (!url) return null;
  return (
    <div
      style={abs({
        left,
        top,
        width,
        height,
        background: `url("${url}") bottom center / ${fit} no-repeat`,
      })}
    />
  );
}

export function Gen1Logo({
  url,
  left,
  top,
  size,
}: {
  url?: string;
  left: number;
  top: number;
  size: number;
}) {
  if (!url) return null;
  return (
    <div
      style={abs({
        left,
        top,
        width: size,
        height: size * 0.72,
        // Dark-ink marks need a light plate on the band, not a filter.
        background: `#fff url("${url}") center / contain no-repeat content-box`,
        borderRadius: 4,
        padding: 9,
        boxShadow: '0 6px 18px rgba(0,0,0,.28)',
      })}
    />
  );
}
