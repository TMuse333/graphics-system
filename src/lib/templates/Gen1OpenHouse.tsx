'use client';

import { Stage } from './Stage';
import {
  Gen1Hero,
  Gen1Scrim,
  Gen1Title,
  Gen1Band,
  Gen1AgentIdent,
  Gen1ContactLine,
  Gen1Headshot,
  Gen1Logo,
  CREAM,
  CREAM_DIM,
} from './gen1';
import type { TemplateProps, Photo } from '@/lib/types';
import { focalCss } from '@/lib/types';

/**
 * Open House (Classic) — 1080×1080.
 *
 * Band hero, then an editorial body panel: address and description on the
 * left, two supporting photos stacked on the right. Supports a co-listing
 * agent, which splits the contact band into two idents.
 */

function SidePhoto({ photo, top }: { photo?: Photo; top: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 696,
        top,
        width: 330,
        height: 225,
        background: '#1e293b',
        backgroundImage: photo ? `url("${photo.url}")` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: focalCss(photo),
        backgroundRepeat: 'no-repeat',
        border: '1px solid color-mix(in srgb, var(--theme-accent) 35%, transparent)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
      }}
    />
  );
}

export function Gen1OpenHouse({ agent, listing, overrides, photos, coAgent }: TemplateProps) {
  const when = [overrides.date, overrides.time].filter(Boolean).join(' \u00b7 ');
  const sub = photos.sub ?? [];
  const dual = Boolean(coAgent);

  return (
    <Stage width={1080} height={1080} theme={agent.theme}>
      <Gen1Hero photo={photos.hero} height={360} />
      <Gen1Scrim top={0} height={100} direction="top" />
      <Gen1Scrim top={190} height={170} direction="bottom" />

      <Gen1Title
        line1={overrides.headline ?? 'Open House'}
        line2={when || undefined}
        top={176}
        size={54}
        size2={26}
        gap={64}
      />

      {/* body panel */}
      <div style={{ position: 'absolute', left: 0, top: 360, width: 1080, height: 500, background: 'var(--theme-primary)' }} />
      <div
        style={{
          position: 'absolute',
          left: 54,
          top: 392,
          width: 600,
          fontFamily: 'var(--theme-font-display)',
          fontWeight: 900,
          fontSize: 36,
          color: CREAM,
          letterSpacing: '-0.3px',
        }}
      >
        {listing.address}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 54,
          top: 440,
          width: 600,
          fontFamily: 'var(--theme-font-narrow)',
          fontWeight: 600,
          fontSize: 19,
          color: 'var(--theme-accent-light)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}
      >
        {listing.city}, {listing.province}
      </div>
      {overrides.blurb && (
        <div
          style={{
            position: 'absolute',
            left: 54,
            top: 486,
            width: 600,
            height: 250,
            fontFamily: 'var(--theme-font-display)',
            fontWeight: 400,
            fontSize: 19,
            lineHeight: 1.55,
            color: CREAM_DIM,
            textWrap: 'pretty',
          }}
        >
          {overrides.blurb}
        </div>
      )}

      <SidePhoto photo={sub[0]} top={390} />
      <SidePhoto photo={sub[1]} top={629} />

      <Gen1Band top={860} height={220}>
        <div
          style={{
            position: 'absolute',
            left: 460,
            top: 828,
            width: 325,
            textAlign: 'right',
            fontFamily: 'var(--theme-font-narrow)',
            fontSize: 21,
            fontWeight: 700,
            color: 'var(--theme-accent-light)',
            letterSpacing: '3.4px',
            textTransform: 'uppercase',
          }}
        >
          MLS {listing.mls}
        </div>

        {dual ? (
          <>
            <Gen1AgentIdent name={agent.name} role={agent.title} top={898} nameSize={38} left={54} />
            <Gen1ContactLine glyph="phone" text={agent.phone} left={54} top={984} />
            <Gen1AgentIdent name={coAgent!.name} role={coAgent!.title} top={898} nameSize={38} left={470} />
            <Gen1ContactLine glyph="phone" text={coAgent!.phone} left={470} top={984} />
            <Gen1Headshot url={agent.headshotUrl} left={330} top={840} width={130} height={240} />
            <Gen1Headshot url={coAgent!.headshotUrl} left={900} top={840} width={130} height={240} />
          </>
        ) : (
          <>
            <Gen1AgentIdent kicker="Contact Me Today" name={agent.name} role={agent.title} top={874} />
            <Gen1ContactLine glyph="phone" text={agent.phone} left={54} top={966} />
            <Gen1ContactLine glyph="email" text={agent.email} left={380} top={966} />
            <Gen1ContactLine glyph="web" text={agent.website} left={54} top={1000} />
            <Gen1Logo url={agent.logoUrl} left={690} top={900} size={130} />
            <Gen1Headshot url={agent.headshotUrl} left={850} top={780} width={217} height={300} />
          </>
        )}
      </Gen1Band>
    </Stage>
  );
}
