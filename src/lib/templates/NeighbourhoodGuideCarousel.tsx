'use client';

/**
 * Neighbourhood Guide Carousel — 7 frames
 *
 * Photo-led community guide.
 * F1: Full-bleed community photo with place name
 * F2: Map with drive times
 * F3-F6: Split-screen Q&A with community photos
 * F7: Price range + CTA
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
import type { NeighbourhoodGuideContent, CarouselAgent } from './carouselFormats';

interface NeighbourhoodGuideCarouselProps {
  agent: CarouselAgent;
  content: NeighbourhoodGuideContent;
  frameIndex: number;
}

const CONTENT_HEIGHT = FRAME_HEIGHT - FOOTER_HEIGHT - CONTACT_HEIGHT;

/* ---------- Cover Frame ---------- */

const CoverFrame = ({ agent, content }: { agent: CarouselAgent; content: NeighbourhoodGuideContent }) => (
  <CarouselFrame tone="dark">
    {/* Full-bleed photo */}
    {content.cover.src && (
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: FRAME_WIDTH,
        height: CONTENT_HEIGHT,
        backgroundImage: `url(${content.cover.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
    )}

    {/* Gradient overlay */}
    <div style={{
      position: 'absolute',
      left: 0,
      bottom: FOOTER_HEIGHT + CONTACT_HEIGHT,
      width: FRAME_WIDTH,
      height: 500,
      background: 'linear-gradient(to top, rgba(7,20,43,0.95) 0%, rgba(7,20,43,0) 100%)',
    }} />

    {/* Content */}
    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      bottom: FOOTER_HEIGHT + CONTACT_HEIGHT + 60,
      zIndex: 2,
    }}>
      <Kicker tone="dark" style={{ marginBottom: 16 }}>{content.region}</Kicker>
      <DisplayText size={120} tone="dark">
        {content.place}
      </DisplayText>
    </div>

    <ContactBar agent={agent} />
    <RemaxFooter />
  </CarouselFrame>
);

/* ---------- Map Frame ---------- */

const MapFrame = ({ agent, content }: { agent: CarouselAgent; content: NeighbourhoodGuideContent }) => (
  <CarouselFrame tone="light">
    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      top: SAFE_MARGIN,
      zIndex: 2,
    }}>
      <Kicker tone="light" style={{ marginBottom: 16 }}>Location</Kicker>
      <DisplayText size={72} tone="light">
        Getting Around
      </DisplayText>
      <Rule tone="light" style={{ marginTop: 24 }} />
    </div>

    {/* Map placeholder */}
    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      top: 280,
      width: FRAME_WIDTH - SAFE_MARGIN * 2,
      height: 400,
      background: THEME.navy,
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {'svgOutline' in content.map ? (
        <div style={{ color: '#fff', fontSize: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📍</div>
          PEI Map
        </div>
      ) : content.map.src ? (
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${content.map.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 12,
        }} />
      ) : (
        <div style={{ color: '#fff', fontSize: 24 }}>Map</div>
      )}
    </div>

    {/* Drive times */}
    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      top: 720,
      width: FRAME_WIDTH - SAFE_MARGIN * 2,
      zIndex: 2,
    }}>
      <Kicker tone="light" style={{ marginBottom: 24 }}>Drive Times</Kicker>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {content.driveTimes.map((dt, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            background: '#fff',
            borderRadius: 8,
            border: `1px solid ${THEME.navy}`,
          }}>
            <BodyText size={32} tone="light" style={{ fontWeight: 600 }}>
              {dt.to}
            </BodyText>
            <BodyText size={32} tone="light" style={{ color: THEME.red, fontWeight: 700 }}>
              {dt.minutes} min
            </BodyText>
          </div>
        ))}
      </div>
    </div>

    <ContactBar agent={agent} />
    <RemaxFooter />
  </CarouselFrame>
);

/* ---------- Q&A Split Frame ---------- */

const QAFrame = ({ agent, qa, index }: {
  agent: CarouselAgent;
  qa: NeighbourhoodGuideContent['qa'][0];
  index: number;
}) => {
  const tone = index % 2 === 0 ? 'light' : 'dark';
  const photoHeight = Math.round(CONTENT_HEIGHT * 0.55);
  const panelHeight = CONTENT_HEIGHT - photoHeight;

  return (
    <CarouselFrame tone={tone}>
      {/* Photo top 55% */}
      {qa.image.src && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: FRAME_WIDTH,
          height: photoHeight,
          backgroundImage: `url(${qa.image.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
      )}

      {/* Panel bottom 45% */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: photoHeight,
        width: FRAME_WIDTH,
        height: panelHeight,
        background: tone === 'light' ? THEME.paper : THEME.navy,
        padding: `40px ${SAFE_MARGIN}px`,
      }}>
        <DisplayText size={48} tone={tone} style={{ marginBottom: 20 }}>
          {qa.q}
        </DisplayText>
        <Rule tone={tone} width={200} style={{ marginBottom: 20 }} />
        <BodyText size={34} tone={tone} style={{ lineHeight: 1.4 }}>
          {qa.a}
        </BodyText>
      </div>

      <ContactBar agent={agent} />
      <RemaxFooter />
    </CarouselFrame>
  );
};

/* ---------- Close Frame ---------- */

const CloseFrame = ({ agent, content }: { agent: CarouselAgent; content: NeighbourhoodGuideContent }) => (
  <CarouselFrame tone="dark">
    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      top: 200,
      width: FRAME_WIDTH - SAFE_MARGIN * 2,
      zIndex: 2,
    }}>
      <Kicker tone="dark" style={{ marginBottom: 24 }}>Typical Price Range</Kicker>
      <DisplayText size={100} tone="dark">
        {content.priceRange}
      </DisplayText>
      <Rule tone="dark" style={{ marginTop: 40, marginBottom: 48 }} />

      <DisplayText size={56} tone="dark" style={{ marginBottom: 32 }}>
        {content.cta}
      </DisplayText>

      <BodyText size={36} tone="dark" muted>
        Homes for sale in {content.place}
      </BodyText>
    </div>

    <ContactBar agent={agent} />
    <RemaxFooter />
  </CarouselFrame>
);

/* ---------- Main Component ---------- */

export default function NeighbourhoodGuideCarousel({ agent, content, frameIndex }: NeighbourhoodGuideCarouselProps) {
  if (frameIndex === 0) {
    return <CoverFrame agent={agent} content={content} />;
  }

  if (frameIndex === 1) {
    return <MapFrame agent={agent} content={content} />;
  }

  if (frameIndex >= 2 && frameIndex <= 5) {
    const qaIndex = frameIndex - 2;
    if (content.qa[qaIndex]) {
      return <QAFrame agent={agent} qa={content.qa[qaIndex]} index={qaIndex} />;
    }
  }

  return <CloseFrame agent={agent} content={content} />;
}

/* ---------- Sample Content ---------- */

export const SAMPLE_NEIGHBOURHOOD_GUIDE: NeighbourhoodGuideContent = {
  place: 'Stratford',
  region: 'Queens County, PEI',
  cover: { type: 'community', src: '/images/pei/scenery/travel-promo.jpg' },
  map: { svgOutline: true, pin: { x: 0.6, y: 0.5 } },
  driveTimes: [
    { to: 'Downtown Charlottetown', minutes: 8 },
    { to: 'Summerside', minutes: 45 },
    { to: 'Confederation Bridge', minutes: 55 },
  ],
  qa: [
    {
      q: 'What\'s it like for families?',
      a: 'Stratford has some of the best-rated schools on the Island, plus new playgrounds, sports fields, and the boardwalk along the harbour. Most neighbourhoods are quiet, with lots of young families.',
      image: { type: 'community', src: '/images/pei/scenery/listing-promo.jpg' },
    },
    {
      q: 'What does $450K get you?',
      a: 'A three-bedroom home built in the last 10 years, often with a garage and a decent yard. Older homes or smaller lots can start around $380K.',
      image: { type: 'property', src: '/images/pei/properties/71-morrison-lane-02.png' },
    },
    {
      q: 'Is it walkable?',
      a: 'You\'ll need a car for most errands, but the boardwalk, trails, and some shops are within walking distance of most neighbourhoods. The bridge into Charlottetown is quick.',
      image: { type: 'community', src: '/images/pei/scenery/property-hero.jpg' },
    },
    {
      q: 'Who should consider it?',
      a: 'First-time buyers priced out of Charlottetown, families wanting newer builds, and anyone who works downtown but wants more space.',
      image: { type: 'property', src: '/images/pei/properties/2-laura-lane-01.png' },
    },
  ],
  priceRange: '$350K – $550K',
  cta: 'Thinking about Stratford?',
};
