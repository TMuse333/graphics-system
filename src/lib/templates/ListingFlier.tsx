'use client';

import type { ReactNode } from 'react';
import { Stage } from './Stage';
import type { TemplateProps, Photo } from '@/lib/types';
import { money, focalCss } from '@/lib/types';

/**
 * Print Flier — 1080×1620.
 *
 * White stock, not a dark social square. Hero at the top, a stat strip
 * straddling its lower edge, a photo row, then three columns of copy and
 * a contact footer. This is the only template with a light ground, so it
 * uses the theme's primary as ink rather than as a background.
 */

const LINE = '#e3e3ea';
const BODY = '#3a3a4e';

const BedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 38, height: 38, flex: 'none' }}>
    <path d="M2 17v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" /><path d="M2 17h20" /><path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" /><path d="M8 11V9h8v2" /><path d="M3 17v3" /><path d="M21 17v3" />
  </svg>
);
const BathIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 38, height: 38, flex: 'none' }}>
    <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" /><path d="M6 12V7a2 2 0 0 1 2-2 2 2 0 0 1 2 2" /><path d="M6 19v2" /><path d="M18 19v2" />
  </svg>
);
const LotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 38, height: 38, flex: 'none' }}>
    <path d="M3 10.5 12 4l9 6.5" /><path d="M5 9.7V20h14V9.7" /><path d="M10 20v-6h4v6" />
  </svg>
);
const PinIcon = ({ size = 38, stroke = 'var(--theme-primary)' }: { size?: number; stroke?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size, flex: 'none' }}>
    <circle cx="12" cy="10" r="2.6" /><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="var(--theme-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19, flex: 'none', marginTop: 1 }}>
    <circle cx="12" cy="12" r="9.5" /><path d="m8 12.4 2.6 2.6L16 9.6" />
  </svg>
);
const footIcon = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="var(--theme-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17, flex: 'none' }}>{d}</svg>
);

function Stat({ icon, value, label, small }: { icon: ReactNode; value: string; label: string; small?: boolean }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      {icon}
      <div>
        <div style={{ fontSize: small ? 26 : 34, fontWeight: 900, lineHeight: 1, color: 'var(--theme-primary)' }}>{value}</div>
        <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 15, fontWeight: 700, letterSpacing: '2.4px', textTransform: 'uppercase', color: '#6b6b7a', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

export function ListingFlier({ agent, listing, overrides, photos }: TemplateProps) {
  const row = (photos.row ?? []).slice(0, 3);
  const features = overrides.features ?? [];
  const locationPoints = overrides.location?.split('\n').filter(Boolean) ?? [];

  const stats: { icon: ReactNode; value: string; label: string; small?: boolean }[] = [];
  if (listing.beds) stats.push({ icon: <BedIcon />, value: String(listing.beds), label: 'Bedrooms' });
  if (listing.baths) stats.push({ icon: <BathIcon />, value: String(listing.baths), label: 'Bathrooms' });
  if (listing.acres) stats.push({ icon: <LotIcon />, value: String(listing.acres), label: 'Acre Lot' });
  stats.push({ icon: <PinIcon />, value: listing.city, label: listing.province, small: true });

  return (
    <Stage width={1080} height={1620} theme={agent.theme}>
      <div style={{ position: 'absolute', inset: 0, background: '#fff', fontFamily: 'var(--theme-font-display)', color: '#22223a' }}>
        {/* hero */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 800, background: '#1e293b', backgroundImage: photos.hero ? `url("${photos.hero.url}")` : undefined, backgroundSize: 'cover', backgroundPosition: focalCss(photos.hero), backgroundRepeat: 'no-repeat' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 330, background: 'linear-gradient(180deg,rgba(16,16,34,.62),rgba(16,16,34,.12) 72%,rgba(16,16,34,0))' }} />

        {/* headline ribbon */}
        <div style={{ position: 'absolute', left: 44, top: 56, width: 500, padding: '22px 34px 26px', background: 'linear-gradient(135deg,var(--theme-primary) 0%,var(--theme-primary-alt) 100%)', border: '3px solid var(--theme-accent)', borderRadius: 6, transform: 'rotate(-1.6deg)', boxShadow: '0 16px 40px rgba(0,0,0,.42)' }}>
          <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 22, fontWeight: 700, letterSpacing: '4.4px', textTransform: 'uppercase', color: 'var(--theme-accent)', marginBottom: 2 }}>
            {overrides.eyebrow ?? 'Just Listed'}
          </div>
          <div style={{ fontSize: 66, fontWeight: 900, lineHeight: 0.94, letterSpacing: '-1.5px', color: '#fff', textTransform: 'uppercase' }}>
            {overrides.headline ?? listing.city}
          </div>
          {overrides.blurb && (
            <div style={{ fontFamily: 'var(--theme-font-script)', fontSize: 34, lineHeight: 1, color: 'var(--theme-accent-light)', marginTop: 10 }}>
              {overrides.blurb.split('.')[0]}.
            </div>
          )}
        </div>

        {/* price flag */}
        <div style={{ position: 'absolute', right: 44, top: 56, width: 300, background: '#fff', borderRadius: 6, padding: '20px 26px 26px', textAlign: 'center', boxShadow: '0 16px 40px rgba(0,0,0,.35)' }}>
          <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 18, fontWeight: 700, letterSpacing: '3.5px', textTransform: 'uppercase', color: 'var(--theme-primary)' }}>
            {overrides.badge ?? 'Priced At'}
          </div>
          <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-2px', color: 'var(--theme-primary)', lineHeight: 1.06, marginTop: 2 }}>{money(listing.price)}</div>
          <div style={{ width: 96, height: 4, background: 'var(--theme-accent)', borderRadius: 2, margin: '10px auto 0' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: -26, height: 26, background: '#fff', clipPath: 'polygon(0 0,100% 0,50% 100%)' }} />
        </div>

        {/* stat strip */}
        <div style={{ position: 'absolute', left: 44, top: 706, width: 992, height: 112, background: '#fff', borderRadius: 8, boxShadow: '0 14px 34px rgba(0,0,0,.22)', display: 'flex', alignItems: 'center' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', borderLeft: i ? `1px solid ${LINE}` : undefined }}>
              <Stat {...s} />
            </div>
          ))}
        </div>

        {/* photo row */}
        {row.length > 0 && (
          <div style={{ position: 'absolute', left: 44, top: 854, width: 992, height: 222, display: 'flex', gap: 16 }}>
            {row.map((p: Photo, i) => (
              <div key={`row-${i}`} style={{ flex: 1, borderRadius: 6, background: `#dfe3ea url("${p.url}") ${focalCss(p)}/cover no-repeat`, boxShadow: '0 8px 22px rgba(0,0,0,.14)' }} />
            ))}
          </div>
        )}

        {/* three columns */}
        <div style={{ position: 'absolute', left: 44, top: 1096, width: 992, display: 'flex', gap: 34 }}>
          <div style={{ width: 330 }}>
            <div style={{ fontFamily: 'var(--theme-font-script)', fontSize: 38, lineHeight: 1, color: 'var(--theme-accent)', marginBottom: 2 }}>About this</div>
            <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-.6px', textTransform: 'uppercase', color: 'var(--theme-primary)', lineHeight: 1 }}>Property.</div>
            {overrides.blurb && <div style={{ fontSize: 16, lineHeight: 1.5, marginTop: 12, textWrap: 'pretty', color: BODY }}>{overrides.blurb}</div>}
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `2px solid ${LINE}` }}>
              <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 24, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--theme-primary)', lineHeight: 1.15 }}>
                {listing.address}<br />{listing.city}, {listing.province}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '1.4px', textTransform: 'uppercase', color: '#7a7a8a', marginTop: 7 }}>MLS&reg; {listing.mls}</div>
            </div>
          </div>

          <div style={{ width: 314 }}>
            <div style={{ fontFamily: 'var(--theme-font-script)', fontSize: 34, color: 'var(--theme-accent)', lineHeight: 1, marginBottom: 6 }}>The details</div>
            <ul style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {features.map((f, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15.5, lineHeight: 1.3, color: BODY }}>
                  <CheckIcon />{f}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ width: 266 }}>
            <div style={{ fontFamily: 'var(--theme-font-script)', fontSize: 34, color: 'var(--theme-accent)', lineHeight: 1, marginBottom: 6 }}>The location</div>
            <ul style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {locationPoints.map((f, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15.5, lineHeight: 1.3, color: BODY }}>
                  <PinIcon size={19} />{f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* footer */}
        <div style={{ position: 'absolute', left: 0, bottom: 210, width: 1080, height: 6, background: 'var(--theme-accent)' }} />
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: 1080, height: 210, background: 'linear-gradient(100deg,var(--theme-primary) 0%,var(--theme-primary-alt) 100%)' }}>
          {agent.logoUrl && <div style={{ position: 'absolute', left: 52, bottom: 56, width: 150, height: 108, background: `#fff url("${agent.logoUrl}") center/contain no-repeat content-box`, borderRadius: 4, padding: 9, boxShadow: '0 6px 18px rgba(0,0,0,.28)' }} />}
          <div style={{ position: 'absolute', left: 206, bottom: 66, width: 280, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--theme-font-script)', fontSize: 34, color: 'var(--theme-accent-light)', lineHeight: 1.05 }}>Book your showing!</div>
            <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 15, fontWeight: 700, letterSpacing: '2.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,.82)', marginTop: 9 }}>Call or text anytime</div>
          </div>
          <div style={{ position: 'absolute', left: 512, bottom: 44, width: 2, height: 122, background: 'rgba(255,255,255,.18)' }} />
          <div style={{ position: 'absolute', left: 560, bottom: 52, width: 300 }}>
            <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-.5px', color: '#fff', lineHeight: 1 }}>{agent.name}</div>
            <div style={{ fontFamily: 'var(--theme-font-narrow)', fontSize: 15, fontWeight: 700, letterSpacing: '2.8px', textTransform: 'uppercase', color: 'var(--theme-accent)', marginTop: 7 }}>{agent.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,.92)' }}>
                {footIcon(<path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3z" />)}{agent.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,.92)' }}>
                {footIcon(<><path d="M3 6h18v12H3z" /><path d="m3 7 9 6 9-6" /></>)}{agent.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,.92)' }}>
                {footIcon(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" /></>)}{agent.website}
              </div>
            </div>
          </div>
          {agent.headshotUrl && <div style={{ position: 'absolute', right: 26, bottom: 0, width: 216, height: 262, background: `url("${agent.headshotUrl}") center 12%/cover no-repeat` }} />}
        </div>
      </div>
    </Stage>
  );
}
