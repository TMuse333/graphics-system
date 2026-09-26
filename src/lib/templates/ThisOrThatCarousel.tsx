'use client';

/**
 * This or That Carousel — 7 frames
 *
 * Symmetrical comparison that drives comments.
 * F1: Cover with 50/50 split and "VS" roundel
 * F2-F6: Comparison rows with verdicts
 * F7: "Which fits you?" engagement CTA
 */
import * as React from 'react';
import {
  CarouselFrame,
  RemaxFooter,
  ContactBar,
  DisplayText,
  BodyText,
  Kicker,
  Rule,
  THEME,
  FRAME_WIDTH,
  FRAME_HEIGHT,
  SAFE_MARGIN,
  FOOTER_HEIGHT,
  CONTACT_HEIGHT,
} from './carouselPrimitives';
import type { ThisOrThatContent, CarouselAgent } from './carouselFormats';

interface ThisOrThatCarouselProps {
  agent: CarouselAgent;
  content: ThisOrThatContent;
  frameIndex: number;
}

const CONTENT_HEIGHT = FRAME_HEIGHT - FOOTER_HEIGHT - CONTACT_HEIGHT;
const HALF_WIDTH = FRAME_WIDTH / 2;

/* ---------- VS Roundel ---------- */

const VsRoundel = ({ size = 100 }: { size?: number }) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: '50%',
    background: THEME.red,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--theme-font-display, "Archivo Black"), sans-serif',
    fontSize: size * 0.4,
    color: '#fff',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    border: '4px solid #fff',
  }}>
    VS
  </div>
);

/* ---------- Cover Frame ---------- */

const CoverFrame = ({ agent, content }: { agent: CarouselAgent; content: ThisOrThatContent }) => (
  <div style={{
    position: 'relative',
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    overflow: 'hidden',
    fontFamily: 'var(--theme-font-narrow, "Archivo Narrow"), sans-serif',
  }}>
    {/* Left half */}
    <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: HALF_WIDTH,
      height: CONTENT_HEIGHT,
      background: content.a.image.src ? undefined : THEME.navy,
      backgroundImage: content.a.image.src ? `url(${content.a.image.src})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: '60%',
        background: 'linear-gradient(to top, rgba(7,20,43,0.9) 0%, transparent 100%)',
      }} />
      {/* Label */}
      <div style={{
        position: 'absolute',
        left: SAFE_MARGIN / 2,
        bottom: 60,
        zIndex: 2,
      }}>
        <Kicker tone="dark" style={{ marginBottom: 12 }}>Option A</Kicker>
        <DisplayText size={56} tone="dark">
          {content.a.label}
        </DisplayText>
      </div>
    </div>

    {/* Right half */}
    <div style={{
      position: 'absolute',
      right: 0,
      top: 0,
      width: HALF_WIDTH,
      height: CONTENT_HEIGHT,
      background: content.b.image.src ? undefined : '#132f57',
      backgroundImage: content.b.image.src ? `url(${content.b.image.src})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: '60%',
        background: 'linear-gradient(to top, rgba(7,20,43,0.9) 0%, transparent 100%)',
      }} />
      {/* Label */}
      <div style={{
        position: 'absolute',
        right: SAFE_MARGIN / 2,
        bottom: 60,
        textAlign: 'right',
        zIndex: 2,
      }}>
        <Kicker tone="dark" style={{ marginBottom: 12 }}>Option B</Kicker>
        <DisplayText size={56} tone="dark">
          {content.b.label}
        </DisplayText>
      </div>
    </div>

    {/* Vertical divider */}
    <div style={{
      position: 'absolute',
      left: HALF_WIDTH - 2,
      top: 0,
      width: 4,
      height: CONTENT_HEIGHT,
      background: '#fff',
    }} />

    {/* VS Roundel */}
    <div style={{
      position: 'absolute',
      left: HALF_WIDTH - 60,
      top: CONTENT_HEIGHT / 2 - 60,
      zIndex: 3,
    }}>
      <VsRoundel size={120} />
    </div>

    <ContactBar agent={agent} />
    <RemaxFooter />
  </div>
);

/* ---------- Comparison Frame ---------- */

const ComparisonFrame = ({ agent, content, row, index }: {
  agent: CarouselAgent;
  content: ThisOrThatContent;
  row: ThisOrThatContent['rows'][0];
  index: number;
}) => {
  const tone = index % 2 === 0 ? 'light' : 'dark';
  const photoStripHeight = 200;

  return (
    <CarouselFrame tone={tone}>
      {/* Photo strips at top */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: HALF_WIDTH,
        height: photoStripHeight,
        backgroundImage: content.a.image.src ? `url(${content.a.image.src})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        background: content.a.image.src ? undefined : THEME.navy,
      }} />
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: HALF_WIDTH,
        height: photoStripHeight,
        backgroundImage: content.b.image.src ? `url(${content.b.image.src})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        background: content.b.image.src ? undefined : '#132f57',
      }} />

      {/* VS Roundel in photo strip */}
      <div style={{
        position: 'absolute',
        left: HALF_WIDTH - 30,
        top: photoStripHeight / 2 - 30,
        zIndex: 3,
      }}>
        <VsRoundel size={60} />
      </div>

      {/* Criterion header */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: photoStripHeight,
        width: FRAME_WIDTH,
        padding: '32px 0',
        textAlign: 'center',
        background: THEME.red,
      }}>
        <DisplayText size={52} style={{ color: '#fff' }}>
          {row.criterion}
        </DisplayText>
      </div>

      {/* Verdicts */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: photoStripHeight + 120,
        width: FRAME_WIDTH,
        display: 'flex',
        zIndex: 2,
      }}>
        {/* A verdict */}
        <div style={{
          width: HALF_WIDTH,
          padding: `40px ${SAFE_MARGIN / 2}px`,
          borderRight: `2px solid ${tone === 'light' ? 'rgba(13,35,67,0.1)' : 'rgba(255,255,255,0.1)'}`,
        }}>
          <Kicker tone={tone} style={{ marginBottom: 16 }}>{content.a.label}</Kicker>
          <BodyText size={36} tone={tone} style={{ lineHeight: 1.4, marginBottom: 24 }}>
            {row.a}
          </BodyText>
          {row.winner === 'a' && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: 'rgba(56, 161, 105, 0.2)',
              borderRadius: 6,
            }}>
              <span style={{ color: '#38a169', fontSize: 24 }}>✓</span>
              <BodyText size={24} style={{ color: '#38a169', fontWeight: 700 }}>Edge</BodyText>
            </div>
          )}
        </div>

        {/* B verdict */}
        <div style={{
          width: HALF_WIDTH,
          padding: `40px ${SAFE_MARGIN / 2}px`,
        }}>
          <Kicker tone={tone} style={{ marginBottom: 16 }}>{content.b.label}</Kicker>
          <BodyText size={36} tone={tone} style={{ lineHeight: 1.4, marginBottom: 24 }}>
            {row.b}
          </BodyText>
          {row.winner === 'b' && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: 'rgba(56, 161, 105, 0.2)',
              borderRadius: 6,
            }}>
              <span style={{ color: '#38a169', fontSize: 24 }}>✓</span>
              <BodyText size={24} style={{ color: '#38a169', fontWeight: 700 }}>Edge</BodyText>
            </div>
          )}
          {row.winner === 'tie' && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: 'rgba(212, 175, 55, 0.2)',
              borderRadius: 6,
            }}>
              <span style={{ color: '#d4af37', fontSize: 24 }}>≈</span>
              <BodyText size={24} style={{ color: '#d4af37', fontWeight: 700 }}>Tie</BodyText>
            </div>
          )}
        </div>
      </div>

      {/* Frame number */}
      <div style={{
        position: 'absolute',
        right: SAFE_MARGIN,
        bottom: FOOTER_HEIGHT + CONTACT_HEIGHT + 40,
        fontFamily: 'var(--theme-font-display, "Archivo Black"), sans-serif',
        fontSize: 24,
        color: tone === 'light' ? THEME.mute : 'rgba(255,255,255,0.5)',
      }}>
        {index + 1}/{content.rows.length}
      </div>

      <ContactBar agent={agent} />
      <RemaxFooter />
    </CarouselFrame>
  );
};

/* ---------- Close Frame ---------- */

const CloseFrame = ({ agent, content }: { agent: CarouselAgent; content: ThisOrThatContent }) => (
  <CarouselFrame tone="dark">
    <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: FRAME_WIDTH,
      height: CONTENT_HEIGHT,
      display: 'flex',
    }}>
      {/* Faded A */}
      <div style={{
        width: HALF_WIDTH,
        backgroundImage: content.a.image.src ? `url(${content.a.image.src})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        background: content.a.image.src ? undefined : THEME.navy,
        opacity: 0.3,
      }} />
      {/* Faded B */}
      <div style={{
        width: HALF_WIDTH,
        backgroundImage: content.b.image.src ? `url(${content.b.image.src})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        background: content.b.image.src ? undefined : '#132f57',
        opacity: 0.3,
      }} />
    </div>

    {/* Overlay */}
    <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: FRAME_WIDTH,
      height: CONTENT_HEIGHT,
      background: 'rgba(7,20,43,0.85)',
    }} />

    {/* Content */}
    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      top: 200,
      width: FRAME_WIDTH - SAFE_MARGIN * 2,
      textAlign: 'center',
      zIndex: 2,
    }}>
      <DisplayText size={80} tone="dark" style={{ marginBottom: 40 }}>
        Which Fits You?
      </DisplayText>
      <Rule tone="dark" width={200} style={{ margin: '0 auto 48px' }} />

      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 64 }}>
        <div style={{
          padding: '24px 48px',
          background: THEME.red,
          borderRadius: 8,
        }}>
          <DisplayText size={36} tone="dark">
            A: {content.a.label}
          </DisplayText>
        </div>
        <div style={{
          padding: '24px 48px',
          background: '#fff',
          borderRadius: 8,
        }}>
          <DisplayText size={36} tone="light">
            B: {content.b.label}
          </DisplayText>
        </div>
      </div>

      <BodyText size={36} tone="dark" style={{ opacity: 0.8, marginBottom: 24 }}>
        Comment A or B below!
      </BodyText>

      <BodyText size={32} tone="dark" muted>
        {content.cta}
      </BodyText>
    </div>

    <ContactBar agent={agent} />
    <RemaxFooter />
  </CarouselFrame>
);

/* ---------- Main Component ---------- */

export default function ThisOrThatCarousel({ agent, content, frameIndex }: ThisOrThatCarouselProps) {
  if (frameIndex === 0) {
    return <CoverFrame agent={agent} content={content} />;
  }

  if (frameIndex >= 1 && frameIndex <= content.rows.length) {
    const rowIndex = frameIndex - 1;
    return (
      <ComparisonFrame
        agent={agent}
        content={content}
        row={content.rows[rowIndex]}
        index={rowIndex}
      />
    );
  }

  return <CloseFrame agent={agent} content={content} />;
}

/* ---------- Sample Content ---------- */

export const SAMPLE_THIS_OR_THAT: ThisOrThatContent = {
  a: { label: 'Cottage', image: { type: 'property', src: '/images/pei/properties/lot1-main.png' } },
  b: { label: 'Year-Round', image: { type: 'property', src: '/images/pei/properties/71-morrison-lane-01.png' } },
  rows: [
    {
      criterion: 'Cost',
      a: 'Lower purchase price, but seasonal heating and winterization costs add up if you want to visit off-season.',
      b: 'Higher upfront, but no seasonal surprises. Modern builds are more efficient.',
      winner: 'tie',
    },
    {
      criterion: 'Maintenance',
      a: 'You\'ll need to winterize pipes, check for rodents in spring, and deal with issues from afar.',
      b: 'Regular upkeep, but you\'re there to catch problems early.',
      winner: 'b',
    },
    {
      criterion: 'Resale',
      a: 'Strong summer market, but smaller buyer pool. Condition matters more.',
      b: 'Year-round demand means faster sales and more predictable pricing.',
      winner: 'b',
    },
    {
      criterion: 'Lifestyle',
      a: 'The escape. No pressure to be there, but you might feel guilty when you\'re not.',
      b: 'Your everyday life, with all the Island perks built in.',
      winner: 'a',
    },
    {
      criterion: 'Rental Income',
      a: 'Strong short-term rental potential in summer. Regulations are tightening, though.',
      b: 'Long-term rental if needed, but most owners live in them.',
      winner: 'a',
    },
  ],
  cta: 'Not sure? Let\'s talk through what makes sense for you.',
};
