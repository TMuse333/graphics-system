'use client';

/**
 * Process Timeline Carousel — 10 frames
 *
 * Sequential explainer with continuous swipe feel.
 * F1: Cover with total timeline
 * F2-F9: One step per frame with timeline rule
 * F10: Checklist recap + CTA
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
  Tag,
  THEME,
  FRAME_WIDTH,
  FRAME_HEIGHT,
  SAFE_MARGIN,
  FOOTER_HEIGHT,
  CONTACT_HEIGHT,
} from './carouselPrimitives';
import type { ProcessTimelineContent, CarouselAgent } from './carouselFormats';

interface ProcessTimelineCarouselProps {
  agent: CarouselAgent;
  content: ProcessTimelineContent;
  frameIndex: number;
}

const CONTENT_HEIGHT = FRAME_HEIGHT - FOOTER_HEIGHT - CONTACT_HEIGHT;
const TIMELINE_Y = 180;

/* ---------- Timeline Rule (runs across frame edges) ---------- */

const TimelineRule = ({ stepIndex, totalSteps, tone = 'dark' }: { stepIndex: number; totalSteps: number; tone?: 'light' | 'dark' }) => {
  const nodeX = SAFE_MARGIN + 60;
  const lineColor = tone === 'light' ? THEME.navy : '#fff';
  const nodeColor = THEME.red;

  return (
    <div style={{
      position: 'absolute',
      left: 0,
      top: TIMELINE_Y,
      width: FRAME_WIDTH,
      height: 40,
      zIndex: 2,
    }}>
      {/* Horizontal line */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 18,
        width: FRAME_WIDTH,
        height: 4,
        background: lineColor,
        opacity: 0.3,
      }} />

      {/* Node */}
      <div style={{
        position: 'absolute',
        left: nodeX - 20,
        top: 0,
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: nodeColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--theme-font-display, "Archivo Black"), sans-serif',
        fontSize: 20,
        color: '#fff',
      }}>
        {stepIndex + 1}
      </div>

      {/* Step count */}
      <div style={{
        position: 'absolute',
        right: SAFE_MARGIN,
        top: 8,
        fontFamily: 'var(--theme-font-narrow, "Archivo Narrow"), sans-serif',
        fontSize: 24,
        color: tone === 'light' ? THEME.mute : 'rgba(255,255,255,0.5)',
      }}>
        Step {stepIndex + 1} of {totalSteps}
      </div>
    </div>
  );
};

/* ---------- Cover Frame ---------- */

const CoverFrame = ({ agent, content }: { agent: CarouselAgent; content: ProcessTimelineContent }) => (
  <CarouselFrame tone="dark" backgroundImage={content.panorama.src} backgroundOverlay="gradient">
    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      top: 200,
      width: FRAME_WIDTH - SAFE_MARGIN * 2,
      zIndex: 2,
    }}>
      <DisplayText size={90} tone="dark" style={{ maxWidth: 800 }}>
        {content.title}
      </DisplayText>
      <Rule tone="dark" style={{ marginTop: 40, marginBottom: 40 }} />
      <Tag>{content.totalTimeline}</Tag>
    </div>

    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      bottom: FOOTER_HEIGHT + CONTACT_HEIGHT + 80,
      zIndex: 2,
    }}>
      <BodyText size={32} tone="dark" style={{ opacity: 0.7 }}>
        Swipe to walk through each step →
      </BodyText>
    </div>

    <ContactBar agent={agent} />
    <RemaxFooter />
  </CarouselFrame>
);

/* ---------- Step Frame ---------- */

const StepFrame = ({ agent, step, index, totalSteps, panorama }: {
  agent: CarouselAgent;
  step: ProcessTimelineContent['steps'][0];
  index: number;
  totalSteps: number;
  panorama?: string;
}) => {
  // Alternate tones, but first few frames have panorama
  const tone = index % 2 === 0 ? 'dark' : 'light';
  const showPanorama = index < 2 && panorama;

  return (
    <CarouselFrame tone={tone}>
      {/* Panorama spans first 3 frames (offset for continuity) */}
      {showPanorama && (
        <div style={{
          position: 'absolute',
          left: -FRAME_WIDTH * (index + 1),
          top: 0,
          width: FRAME_WIDTH * 3,
          height: 300,
          backgroundImage: `url(${panorama})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
          maskImage: 'linear-gradient(to bottom, #000 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 60%, transparent 100%)',
        }} />
      )}

      <TimelineRule stepIndex={index} totalSteps={totalSteps} tone={tone} />

      {/* Ghost number */}
      <div style={{
        position: 'absolute',
        right: SAFE_MARGIN,
        top: 280,
        fontFamily: 'var(--theme-font-display, "Archivo Black"), sans-serif',
        fontSize: 300,
        lineHeight: 0.7,
        letterSpacing: -12,
        color: tone === 'light' ? 'rgba(13,35,67,0.06)' : 'rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Content */}
      <div style={{
        position: 'absolute',
        left: SAFE_MARGIN,
        top: 280,
        width: FRAME_WIDTH - SAFE_MARGIN * 2 - 200,
        zIndex: 2,
      }}>
        <Kicker tone={tone} style={{ marginBottom: 16 }}>{step.title}</Kicker>
        <DisplayText size={56} tone={tone} style={{ marginBottom: 32 }}>
          {step.q}
        </DisplayText>
        <Rule tone={tone} width={200} style={{ marginBottom: 32 }} />
        <BodyText size={36} tone={tone} style={{ lineHeight: 1.4 }}>
          {step.a}
        </BodyText>

        {/* Duration chip */}
        <div style={{
          marginTop: 48,
          display: 'inline-block',
          padding: '12px 24px',
          background: tone === 'light' ? THEME.navy : '#fff',
          borderRadius: 8,
        }}>
          <BodyText size={28} tone={tone === 'light' ? 'dark' : 'light'} style={{ fontWeight: 700 }}>
            ⏱ {step.duration}
          </BodyText>
        </div>
      </div>

      <ContactBar agent={agent} />
      <RemaxFooter />
    </CarouselFrame>
  );
};

/* ---------- Close Frame ---------- */

const CloseFrame = ({ agent, content }: { agent: CarouselAgent; content: ProcessTimelineContent }) => (
  <CarouselFrame tone="dark">
    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      top: 100,
      width: FRAME_WIDTH - SAFE_MARGIN * 2,
      zIndex: 2,
    }}>
      <Kicker tone="dark" style={{ marginBottom: 16 }}>Quick Recap</Kicker>
      <DisplayText size={56} tone="dark" style={{ marginBottom: 32 }}>
        Your Checklist
      </DisplayText>
      <Rule tone="dark" style={{ marginBottom: 32 }} />

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {content.steps.map((step, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '12px 0',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: THEME.red,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--theme-font-display, "Archivo Black"), sans-serif',
              fontSize: 16,
              color: '#fff',
              flexShrink: 0,
            }}>
              {i + 1}
            </div>
            <BodyText size={28} tone="dark">{step.title}</BodyText>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 48 }}>
        <DisplayText size={48} tone="dark">
          {content.cta}
        </DisplayText>
      </div>
    </div>

    <ContactBar agent={agent} />
    <RemaxFooter />
  </CarouselFrame>
);

/* ---------- Main Component ---------- */

export default function ProcessTimelineCarousel({ agent, content, frameIndex }: ProcessTimelineCarouselProps) {
  const totalSteps = content.steps.length;

  if (frameIndex === 0) {
    return <CoverFrame agent={agent} content={content} />;
  }

  if (frameIndex >= 1 && frameIndex <= totalSteps) {
    const stepIndex = frameIndex - 1;
    return (
      <StepFrame
        agent={agent}
        step={content.steps[stepIndex]}
        index={stepIndex}
        totalSteps={totalSteps}
        panorama={content.panorama.src}
      />
    );
  }

  return <CloseFrame agent={agent} content={content} />;
}

/* ---------- Sample Content ---------- */

export const SAMPLE_PROCESS_TIMELINE: ProcessTimelineContent = {
  title: 'Buying in PEI',
  totalTimeline: 'Offer to Keys: ~45 Days',
  panorama: { type: 'landscape', src: '/images/pei/scenery/property-hero.jpg' },
  steps: [
    {
      title: 'Get Pre-Approved',
      q: 'Why do I need pre-approval?',
      a: 'A pre-approval letter shows sellers you\'re serious and tells you exactly what you can afford. Most Island agents won\'t show homes without one.',
      duration: '1–3 days',
    },
    {
      title: 'Find Your Home',
      q: 'How long does the search take?',
      a: 'It depends on what you\'re looking for. Some buyers find their home in a week, others take a few months. We\'ll set up alerts so you see new listings first.',
      duration: '2–8 weeks',
    },
    {
      title: 'Make an Offer',
      q: 'What happens when I make an offer?',
      a: 'We write up the terms, present to the seller, and negotiate. Multiple-offer situations are less common now, so you\'ll often have room to negotiate.',
      duration: '1–3 days',
    },
    {
      title: 'Conditions Period',
      q: 'What are conditions?',
      a: 'Time to get your inspection, finalize financing, and do due diligence. Most buyers have 7–14 days. Don\'t skip inspection—it saves you surprises.',
      duration: '7–14 days',
    },
    {
      title: 'Home Inspection',
      q: 'What happens at inspection?',
      a: 'A licensed inspector checks the major systems—roof, foundation, electrical, plumbing, septic. You\'ll get a report with findings, and we\'ll discuss what matters.',
      duration: '2–3 hours',
    },
    {
      title: 'Finalize Financing',
      q: 'Is this different from pre-approval?',
      a: 'Yes. Now the lender reviews the specific property and your final documents. Don\'t make big purchases or change jobs until after closing.',
      duration: '5–10 days',
    },
    {
      title: 'Lawyer & Title',
      q: 'Why do I need a lawyer?',
      a: 'They handle the title search, prepare the deed, hold your deposit in trust, and make sure everything is clear before you sign.',
      duration: '1–2 weeks',
    },
    {
      title: 'Closing Day',
      q: 'What happens on closing day?',
      a: 'You sign the paperwork, the funds transfer, and you get the keys. We do a final walk-through that morning to make sure everything\'s as expected.',
      duration: '1 day',
    },
  ],
  cta: 'Ready to start? Let\'s talk.',
};
