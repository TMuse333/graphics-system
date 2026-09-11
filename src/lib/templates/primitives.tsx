'use client';

import type { CSSProperties } from 'react';
import type { Photo } from '@/lib/types';
import { focalCss } from '@/lib/types';

/**
 * Shared visual primitives for the Style B family.
 *
 * Every color comes from the theme CSS variables set by <Stage>, so one
 * template renders in any agent's palette. The bevel shadow stacks are
 * derived from --theme-accent with color-mix instead of being hardcoded,
 * which is why Theme needs no extra fields for them.
 */

/** Layered drop-shadow that gives display type its cut-metal edge. */
export const accentBevel =
  '0 2px 0 color-mix(in srgb, var(--theme-accent) 78%, #000),' +
  '0 4px 0 color-mix(in srgb, var(--theme-accent) 58%, #000),' +
  '0 6px 0 color-mix(in srgb, var(--theme-accent) 40%, #000),' +
  '0 10px 22px rgba(0,0,0,.6)';

export const neutralBevel =
  '0 2px 0 #b9bcc9,0 4px 0 #8e93a3,0 6px 0 #676c7c,0 10px 22px rgba(0,0,0,.55)';

/** Same stack, scaled up for the price figure. */
export const accentBevelLarge =
  '0 3px 0 color-mix(in srgb, var(--theme-accent) 78%, #000),' +
  '0 6px 0 color-mix(in srgb, var(--theme-accent) 58%, #000),' +
  '0 9px 0 color-mix(in srgb, var(--theme-accent) 40%, #000),' +
  '0 14px 30px rgba(0,0,0,.6)';

/** Full-bleed hero photo. Crop anchor comes from the photo's focal point. */
export function Hero({ photo }: { photo?: Photo }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#1e293b',
        backgroundImage: photo ? `url("${photo.url}")` : undefined,
        backgroundPosition: focalCss(photo),
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}

/** Darkening gradient over the top of the hero so display type stays legible. */
export function Veil({ height = 520 }: { height?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: `${height}px`,
        background:
          'linear-gradient(160deg,rgba(10,10,24,.82) 0%,rgba(10,10,24,.55) 42%,rgba(10,10,24,0) 78%)',
      }}
    />
  );
}

/**
 * Two-line headline. Line one is neutral, line two takes the accent —
 * the contrast is what makes the lockup read at thumbnail size.
 */
export function Headline({
  line1,
  line2,
  top = 70,
  left = 56,
  width = 640,
}: {
  line1: string;
  line2: string;
  top?: number;
  left?: number;
  width?: number;
}) {
  const base: CSSProperties = {
    fontFamily: 'var(--theme-font-display)',
    fontWeight: 900,
    lineHeight: 0.9,
    letterSpacing: '-2.5px',
    textTransform: 'uppercase',
  };
  return (
    <div style={{ position: 'absolute', left, top, width }}>
      <div style={{ ...base, fontSize: 78, color: '#fff', textShadow: neutralBevel }}>{line1}</div>
      <div
        style={{
          ...base,
          fontSize: 88,
          color: 'var(--theme-accent-light)',
          textShadow: accentBevel,
        }}
      >
        {line2}
      </div>
    </div>
  );
}

/** Skewed kicker ribbon — labels whatever number sits under it. */
export function Ribbon({ children, top = 300 }: { children: React.ReactNode; top?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 44,
        top,
        padding: '16px 40px 18px 46px',
        background:
          'linear-gradient(100deg,var(--theme-primary) 0%,var(--theme-primary-alt) 100%)',
        borderLeft: '6px solid var(--theme-accent)',
        borderRadius: '0 12px 12px 0',
        transform: 'skewX(-9deg)',
        boxShadow: '0 14px 34px rgba(0,0,0,.45)',
      }}
    >
      <div style={{ transform: 'skewX(9deg)' }}>
        <div
          style={{
            fontFamily: 'var(--theme-font-narrow)',
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '5px',
            textTransform: 'uppercase',
            color: '#fff',
            opacity: 0.9,
            whiteSpace: 'nowrap',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function Price({ children, top = 392 }: { children: React.ReactNode; top?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 56,
        top,
        fontFamily: 'var(--theme-font-display)',
        fontSize: 132,
        fontWeight: 900,
        letterSpacing: '-4px',
        lineHeight: 1,
        color: 'var(--theme-accent-light)',
        textShadow: accentBevelLarge,
      }}
    >
      {children}
    </div>
  );
}

/** Address block with the accent rule down its left edge. */
export function AddressChip({
  address,
  locality,
  meta,
  top = 566,
}: {
  address: string;
  locality: string;
  meta: string;
  top?: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 56,
        top,
        padding: '14px 28px',
        background: 'color-mix(in srgb, var(--theme-primary) 90%, transparent)',
        borderLeft: '5px solid var(--theme-accent)',
        borderRadius: '0 14px 14px 0',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--theme-font-narrow)',
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: '1.4px',
          textTransform: 'uppercase',
          color: '#fff',
          lineHeight: 1.06,
        }}
      >
        {address}
        <br />
        {locality}
      </div>
      <div
        style={{
          fontFamily: 'var(--theme-font-display)',
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '2.2px',
          textTransform: 'uppercase',
          color: 'var(--theme-accent)',
          marginTop: 8,
        }}
      >
        {meta}
      </div>
    </div>
  );
}

/** Up to two supporting shots, stacked on the right above the band. */
export function PhotoStrip({ photos = [] }: { photos?: Photo[] }) {
  const shots = photos.slice(0, 2);
  if (!shots.length) return null;
  return (
    <div
      style={{
        position: 'absolute',
        right: 48,
        top: 72,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      {shots.map((p, i) => (
        <div
          key={p.id ?? i}
          style={{
            width: 246,
            height: 168,
            borderRadius: 14,
            border: '4px solid var(--theme-accent)',
            background: `#dfe3ea url("${p.url}") ${focalCss(p)}/cover no-repeat`,
            boxShadow: '0 14px 32px rgba(0,0,0,.45)',
          }}
        />
      ))}
    </div>
  );
}

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="var(--theme-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flex: 'none' }}>
    <path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3z" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="var(--theme-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flex: 'none' }}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
  </svg>
);

/**
 * Curved agent band across the bottom. The curve is one SVG path drawn
 * twice — filled, then stroked in the accent — so the accent line sits
 * exactly on the fill's top edge at any scale.
 */
const BAND_CURVE =
  'M0,34 C 152,34 262,88 392,88 C 534,88 626,42 790,28 C 902,20 984,22 1080,22';

export function AgentBand({
  name,
  role,
  phone,
  website,
  logoUrl,
  headshotUrl,
  height = 320,
}: {
  name: string;
  role: string;
  phone: string;
  website: string;
  logoUrl?: string;
  headshotUrl?: string;
  height?: number;
}) {
  return (
    <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height }}>
      <svg
        viewBox={`0 0 1080 ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height }}
      >
        <defs>
          <linearGradient id="band-fill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--theme-primary)" />
            <stop offset="1" stopColor="var(--theme-primary-alt)" />
          </linearGradient>
        </defs>
        <path d={`${BAND_CURVE} L1080,${height} L0,${height} Z`} fill="url(#band-fill)" />
        <path d={BAND_CURVE} fill="none" stroke="var(--theme-accent)" strokeWidth="7" />
      </svg>

      {logoUrl && (
        <div
          style={{
            position: 'absolute',
            left: 56,
            bottom: 56,
            width: 128,
            height: 128,
            background: `url("${logoUrl}") center/contain no-repeat`,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          left: 236,
          bottom: 62,
          width: 2,
          height: 116,
          background: 'rgba(255,255,255,.18)',
        }}
      />
      <div style={{ position: 'absolute', left: 284, bottom: 74 }}>
        <div
          style={{
            fontFamily: 'var(--theme-font-script)',
            fontSize: 55,
            lineHeight: 1,
            color: 'var(--theme-accent-light)',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: 'var(--theme-font-narrow)',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '3.4px',
            textTransform: 'uppercase',
            color: '#fff',
            opacity: 0.85,
            marginTop: 10,
          }}
        >
          {role}
        </div>
        <div style={{ display: 'flex', gap: 26, marginTop: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--theme-font-display)', fontSize: 19, fontWeight: 700, color: '#fff' }}>
            <PhoneIcon />
            {phone}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--theme-font-display)', fontSize: 19, fontWeight: 700, color: '#fff' }}>
            <GlobeIcon />
            {website}
          </span>
        </div>
      </div>
      {headshotUrl && (
        <div
          style={{
            position: 'absolute',
            right: -18,
            bottom: -42,
            width: 338,
            height: 338,
            borderRadius: '50%',
            border: '7px solid var(--theme-accent)',
            background: `#dfe3ea url("${headshotUrl}") center 8%/cover no-repeat`,
            boxShadow: '0 16px 40px rgba(0,0,0,.5)',
          }}
        />
      )}
    </div>
  );
}

/** MLS line: land shows acreage, residential shows bed/bath. */
export function metaLine(listing: {
  mls: string;
  propertyType: 'residential' | 'land';
  acres?: number;
  beds?: number;
  baths?: number;
}) {
  const parts = [`MLS\u00ae ${listing.mls}`];
  if (listing.propertyType === 'land') {
    if (listing.acres) parts.push(`${listing.acres} Acres`);
  } else {
    if (listing.beds) parts.push(`${listing.beds} Bed`);
    if (listing.baths) parts.push(`${listing.baths} Bath`);
    if (listing.acres) parts.push(`${listing.acres} Acres`);
  }
  return parts.join(' \u00b7 ');
}
