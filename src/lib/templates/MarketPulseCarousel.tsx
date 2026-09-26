'use client';

/**
 * Market Pulse Carousel — 5 frames
 *
 * Stats-first monthly market snapshot.
 * F1: Full-bleed aerial with headline stat
 * F2-F4: One stat per frame with huge numbers
 * F5: "What it means" close with CTA
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
  DeltaChip,
  THEME,
  FRAME_WIDTH,
  SAFE_MARGIN,
} from './carouselPrimitives';
import type { MarketPulseContent, CarouselAgent } from './carouselFormats';

interface MarketPulseCarouselProps {
  agent: CarouselAgent;
  content: MarketPulseContent;
  frameIndex: number;
}

/* ---------- Mini Sparkline ---------- */

const Sparkline = ({ series, width = 200, height = 60 }: { series: number[]; width?: number; height?: number }) => {
  if (!series || series.length < 2) return null;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const points = series.map((v, i) => {
    const x = (i / (series.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke={THEME.red}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* ---------- Cover Frame ---------- */

const CoverFrame = ({ agent, content }: { agent: CarouselAgent; content: MarketPulseContent }) => (
  <CarouselFrame tone="dark" backgroundImage={content.hero.src} backgroundOverlay="gradient">
    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      top: SAFE_MARGIN,
      zIndex: 2,
    }}>
      <Kicker tone="dark">{content.kicker}</Kicker>
    </div>

    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      top: 280,
      width: FRAME_WIDTH - SAFE_MARGIN * 2,
      zIndex: 2,
    }}>
      <DisplayText size={180} tone="dark" style={{ lineHeight: 0.9 }}>
        {content.headline.value}
      </DisplayText>
      <Rule tone="dark" style={{ margin: '32px 0' }} />
      <BodyText size={48} tone="dark" style={{ fontWeight: 700 }}>
        {content.headline.label}
      </BodyText>
    </div>

    <div style={{
      position: 'absolute',
      right: SAFE_MARGIN,
      bottom: 280,
      zIndex: 2,
    }}>
      <BodyText size={32} tone="dark" style={{ opacity: 0.7 }}>
        Swipe for more stats →
      </BodyText>
    </div>

    <ContactBar agent={agent} />
    <RemaxFooter />
  </CarouselFrame>
);

/* ---------- Stat Frame ---------- */

const StatFrame = ({ agent, stat, index }: {
  agent: CarouselAgent;
  stat: MarketPulseContent['stats'][0];
  index: number;
}) => {
  const tone = index % 2 === 0 ? 'light' : 'dark';

  return (
    <CarouselFrame tone={tone}>
      <div style={{
        position: 'absolute',
        left: SAFE_MARGIN,
        top: 180,
        width: FRAME_WIDTH - SAFE_MARGIN * 2,
        zIndex: 2,
      }}>
        <Kicker tone={tone} style={{ marginBottom: 24 }}>{stat.label}</Kicker>

        <DisplayText size={200} tone={tone} style={{ marginBottom: 24 }}>
          {stat.value}
        </DisplayText>

        {stat.delta !== undefined && (
          <div style={{ marginBottom: 32 }}>
            <DeltaChip value={stat.delta} />
          </div>
        )}

        {stat.series && (
          <div style={{ marginBottom: 32 }}>
            <Sparkline series={stat.series} width={400} height={80} />
          </div>
        )}

        <Rule tone={tone} style={{ marginBottom: 32 }} />

        <BodyText size={42} tone={tone} style={{ marginBottom: 48, maxWidth: 800 }}>
          {stat.meaning}
        </BodyText>

        <BodyText size={22} tone={tone} muted style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
          Source: {stat.source}
        </BodyText>
      </div>

      <ContactBar agent={agent} />
      <RemaxFooter />
    </CarouselFrame>
  );
};

/* ---------- Close Frame ---------- */

const CloseFrame = ({ agent, content }: { agent: CarouselAgent; content: MarketPulseContent }) => (
  <CarouselFrame tone="dark">
    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      top: 140,
      width: FRAME_WIDTH - SAFE_MARGIN * 2,
      zIndex: 2,
    }}>
      <DisplayText size={72} tone="dark" style={{ marginBottom: 48 }}>
        What This Means
      </DisplayText>
      <Rule tone="dark" style={{ marginBottom: 48 }} />

      <div style={{ display: 'flex', gap: 40 }}>
        <div style={{ flex: 1 }}>
          <Kicker tone="dark" style={{ marginBottom: 16 }}>For Buyers</Kicker>
          <BodyText size={36} tone="dark" style={{ opacity: 0.9 }}>
            {content.close.buyers}
          </BodyText>
        </div>
        <div style={{ width: 4, background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ flex: 1 }}>
          <Kicker tone="dark" style={{ marginBottom: 16 }}>For Sellers</Kicker>
          <BodyText size={36} tone="dark" style={{ opacity: 0.9 }}>
            {content.close.sellers}
          </BodyText>
        </div>
      </div>

      <div style={{ marginTop: 80 }}>
        <DisplayText size={52} tone="dark">
          {content.close.cta}
        </DisplayText>
      </div>
    </div>

    <ContactBar agent={agent} />
    <RemaxFooter />
  </CarouselFrame>
);

/* ---------- Main Component ---------- */

export default function MarketPulseCarousel({ agent, content, frameIndex }: MarketPulseCarouselProps) {
  if (frameIndex === 0) {
    return <CoverFrame agent={agent} content={content} />;
  }

  if (frameIndex >= 1 && frameIndex <= 3) {
    const statIndex = frameIndex - 1;
    if (content.stats[statIndex]) {
      return <StatFrame agent={agent} stat={content.stats[statIndex]} index={statIndex} />;
    }
  }

  return <CloseFrame agent={agent} content={content} />;
}

/* ---------- Sample Content ---------- */

export const SAMPLE_MARKET_PULSE: MarketPulseContent = {
  kicker: 'PEI Market · Q3 2026',
  hero: { type: 'landscape', src: '/images/pei/scenery/property-hero.jpg', overlay: 'navy' },
  headline: { value: '$389K', label: 'Median Sale Price · Queens County' },
  stats: [
    {
      value: '28',
      label: 'Days on Market',
      delta: -12,
      series: [45, 42, 38, 35, 32, 28],
      meaning: 'Homes are selling faster than last quarter. Well-priced properties often see multiple offers within the first week.',
      source: 'PEI Real Estate Association',
    },
    {
      value: '412',
      label: 'Active Listings',
      delta: 8,
      series: [380, 385, 395, 402, 408, 412],
      meaning: 'Inventory is slowly climbing, giving buyers more choice than we\'ve seen since early 2024.',
      source: 'Paragon MLS',
    },
    {
      value: '94%',
      label: 'Sale-to-List Ratio',
      delta: -2,
      series: [98, 97, 96, 95, 94, 94],
      meaning: 'Sellers are getting close to asking price, but the days of multiple over-asking offers are cooling.',
      source: 'CREA Market Stats',
    },
  ],
  close: {
    buyers: 'More listings means less pressure to waive conditions. Take your time, but be ready to move when you find the right fit.',
    sellers: 'Pricing strategy matters more than ever. Overpriced homes sit while well-positioned ones still move quickly.',
    cta: 'Want the full breakdown? Let\'s chat.',
  },
};
