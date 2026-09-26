'use client';

/**
 * Myth vs Fact Carousel — 6 frames
 *
 * Seller-focused myth busting. Red-dominant.
 * F1: Cover on red background
 * F2-F5: Horizontal split - myth (red, struck) / fact (paper)
 * F6: Valuation CTA
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
import type { MythVsFactContent, CarouselAgent } from './carouselFormats';

interface MythVsFactCarouselProps {
  agent: CarouselAgent;
  content: MythVsFactContent;
  frameIndex: number;
}

const CONTENT_HEIGHT = FRAME_HEIGHT - FOOTER_HEIGHT - CONTACT_HEIGHT;

/* ---------- Cover Frame (Red) ---------- */

const CoverFrame = ({ agent, content }: { agent: CarouselAgent; content: MythVsFactContent }) => (
  <CarouselFrame tone="red">
    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      top: '50%',
      transform: 'translateY(-60%)',
      width: FRAME_WIDTH - SAFE_MARGIN * 2,
      zIndex: 2,
    }}>
      <Kicker style={{ color: THEME.paper, marginBottom: 24 }}>
        Seller Edition
      </Kicker>
      <DisplayText size={140} style={{ color: THEME.paper, lineHeight: 0.95 }}>
        {content.title}
      </DisplayText>
      <Rule width={300} style={{ background: THEME.paper, marginTop: 40 }} />
    </div>

    <div style={{
      position: 'absolute',
      right: SAFE_MARGIN,
      bottom: FOOTER_HEIGHT + CONTACT_HEIGHT + 60,
      zIndex: 2,
    }}>
      <BodyText size={28} style={{ color: THEME.paper, opacity: 0.8 }}>
        Swipe to bust some myths →
      </BodyText>
    </div>

    <ContactBar agent={agent} />
    <RemaxFooter />
  </CarouselFrame>
);

/* ---------- Myth/Fact Frame ---------- */

const MythFactFrame = ({ agent, item, index }: {
  agent: CarouselAgent;
  item: MythVsFactContent['items'][0];
  index: number;
}) => {
  const mythHeight = Math.round(CONTENT_HEIGHT * 0.42);
  const factHeight = CONTENT_HEIGHT - mythHeight;

  return (
    <div style={{
      position: 'relative',
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
      overflow: 'hidden',
      fontFamily: 'var(--theme-font-narrow, "Archivo Narrow"), sans-serif',
    }}>
      {/* Myth panel (red, top) */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: FRAME_WIDTH,
        height: mythHeight,
        background: THEME.red,
        padding: SAFE_MARGIN,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <Kicker style={{ color: THEME.paper, marginBottom: 20, letterSpacing: 6 }}>
          MYTH
        </Kicker>
        <div style={{
          fontFamily: 'var(--theme-font-display, "Archivo Black"), sans-serif',
          fontSize: 52,
          textTransform: 'uppercase',
          lineHeight: 1.1,
          letterSpacing: -1,
          color: THEME.paper,
          textDecoration: 'line-through',
          textDecorationThickness: 4,
          textDecorationColor: THEME.paper,
        }}>
          "{item.myth}"
        </div>
      </div>

      {/* Fact panel (paper, bottom) */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: mythHeight,
        width: FRAME_WIDTH,
        height: factHeight,
        background: THEME.paper,
        padding: SAFE_MARGIN,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <Kicker tone="light" style={{ marginBottom: 20, letterSpacing: 6 }}>
          FACT
        </Kicker>
        <BodyText size={44} tone="light" style={{ lineHeight: 1.35 }}>
          {item.fact}
        </BodyText>

        {/* Before/After images if present */}
        {item.beforeAfter && (
          <div style={{ display: 'flex', gap: 20, marginTop: 32 }}>
            <div style={{
              flex: 1,
              height: 160,
              backgroundImage: `url(${item.beforeAfter[0].src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 8,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                padding: '4px 12px',
                background: THEME.navy,
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                borderRadius: 4,
              }}>
                Before
              </div>
            </div>
            <div style={{
              flex: 1,
              height: 160,
              backgroundImage: `url(${item.beforeAfter[1].src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 8,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                padding: '4px 12px',
                background: THEME.red,
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                borderRadius: 4,
              }}>
                After
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Frame number */}
      <div style={{
        position: 'absolute',
        right: SAFE_MARGIN,
        top: SAFE_MARGIN,
        fontFamily: 'var(--theme-font-display, "Archivo Black"), sans-serif',
        fontSize: 32,
        color: THEME.paper,
        opacity: 0.6,
        zIndex: 2,
      }}>
        {index + 1}/4
      </div>

      <ContactBar agent={agent} />
      <RemaxFooter />
    </div>
  );
};

/* ---------- Close Frame ---------- */

const CloseFrame = ({ agent, content }: { agent: CarouselAgent; content: MythVsFactContent }) => (
  <CarouselFrame tone="dark">
    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      top: 200,
      width: FRAME_WIDTH - SAFE_MARGIN * 2,
      zIndex: 2,
    }}>
      <Kicker tone="dark" style={{ marginBottom: 24 }}>
        The Truth?
      </Kicker>
      <DisplayText size={72} tone="dark" style={{ marginBottom: 40 }}>
        Your Home's Value<br/>Isn't a Myth
      </DisplayText>
      <Rule tone="dark" style={{ marginBottom: 48 }} />

      <BodyText size={40} tone="dark" style={{ marginBottom: 48, opacity: 0.85 }}>
        {content.cta}
      </BodyText>

      <div style={{
        display: 'inline-block',
        padding: '20px 40px',
        background: THEME.red,
        borderRadius: 8,
      }}>
        <BodyText size={32} tone="dark" style={{ fontWeight: 700 }}>
          Get Your Free Home Valuation
        </BodyText>
      </div>
    </div>

    <ContactBar agent={agent} />
    <RemaxFooter />
  </CarouselFrame>
);

/* ---------- Main Component ---------- */

export default function MythVsFactCarousel({ agent, content, frameIndex }: MythVsFactCarouselProps) {
  if (frameIndex === 0) {
    return <CoverFrame agent={agent} content={content} />;
  }

  if (frameIndex >= 1 && frameIndex <= 4) {
    const itemIndex = frameIndex - 1;
    if (content.items[itemIndex]) {
      return <MythFactFrame agent={agent} item={content.items[itemIndex]} index={itemIndex} />;
    }
  }

  return <CloseFrame agent={agent} content={content} />;
}

/* ---------- Sample Content ---------- */

export const SAMPLE_MYTH_VS_FACT: MythVsFactContent = {
  title: '5 Seller\nMyths',
  items: [
    {
      myth: 'Price high to leave room to negotiate',
      fact: 'Overpriced homes sit longer, get fewer showings, and often sell for less than if priced right from the start. The first two weeks are your best shot.',
    },
    {
      myth: 'Only spring sells',
      fact: 'Winter buyers are serious. Less competition means more attention on your listing. PEI sees solid activity year-round.',
    },
    {
      myth: 'Staging doesn\'t matter here',
      fact: 'Staged homes sell faster and for more—even on the Island. It doesn\'t have to be expensive; decluttering and good photos go a long way.',
    },
    {
      myth: 'I can sell it myself and save the commission',
      fact: 'FSBOs typically sell for 10–15% less than agent-assisted sales. Marketing, negotiation, and legal protection matter.',
    },
  ],
  cta: 'Skip the myths. Get a straight answer about what your home is worth—no pressure, no obligation.',
};
