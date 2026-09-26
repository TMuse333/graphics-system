'use client';

/**
 * Client Questions Carousel — 5 frames
 *
 * Conversational, quote-led, ends on social proof.
 * F1: Cover with "Questions I got this month" + headshot
 * F2-F4: Large pull quotes with agent answers
 * F5: Testimonial over sold property photo
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
import type { ClientQuestionsContent, CarouselAgent } from './carouselFormats';

interface ClientQuestionsCarouselProps {
  agent: CarouselAgent;
  content: ClientQuestionsContent;
  frameIndex: number;
}

const CONTENT_HEIGHT = FRAME_HEIGHT - FOOTER_HEIGHT - CONTACT_HEIGHT;

/* ---------- Cover Frame ---------- */

const CoverFrame = ({ agent, content }: { agent: CarouselAgent; content: ClientQuestionsContent }) => (
  <CarouselFrame tone="light">
    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      top: SAFE_MARGIN + 40,
      width: FRAME_WIDTH - SAFE_MARGIN * 2,
      zIndex: 2,
    }}>
      <Kicker tone="light" style={{ marginBottom: 24 }}>
        Real Questions
      </Kicker>
      <DisplayText size={80} tone="light" style={{ maxWidth: 700 }}>
        {content.title}
      </DisplayText>
      <Rule tone="light" style={{ marginTop: 32 }} />
    </div>

    {/* Headshot cutout */}
    {agent.headshotUrl && (
      <div style={{
        position: 'absolute',
        right: 0,
        bottom: FOOTER_HEIGHT + CONTACT_HEIGHT,
        width: 500,
        height: 650,
        backgroundImage: `url(${agent.headshotUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        maskImage: 'linear-gradient(to left, #000 70%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to left, #000 70%, transparent 100%)',
      }} />
    )}

    {/* Preview of questions */}
    <div style={{
      position: 'absolute',
      left: SAFE_MARGIN,
      bottom: FOOTER_HEIGHT + CONTACT_HEIGHT + 120,
      zIndex: 2,
    }}>
      {content.questions.slice(0, 3).map((q, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 16,
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: THEME.navy,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--theme-font-display, "Archivo Black"), sans-serif',
            fontSize: 18,
            color: '#fff',
          }}>
            {i + 1}
          </div>
          <BodyText size={28} tone="light" style={{ opacity: 0.7 }}>
            {q.q.length > 40 ? q.q.slice(0, 40) + '...' : q.q}
          </BodyText>
        </div>
      ))}
    </div>

    <ContactBar agent={agent} />
    <RemaxFooter />
  </CarouselFrame>
);

/* ---------- Question Frame ---------- */

const QuestionFrame = ({ agent, qa, index }: {
  agent: CarouselAgent;
  qa: ClientQuestionsContent['questions'][0];
  index: number;
}) => {
  const tone = index % 2 === 0 ? 'dark' : 'light';

  return (
    <CarouselFrame tone={tone}>
      {/* Large opening quote mark */}
      <div style={{
        position: 'absolute',
        left: SAFE_MARGIN - 10,
        top: 100,
        fontFamily: 'Georgia, serif',
        fontSize: 300,
        lineHeight: 0.8,
        color: THEME.red,
        opacity: 0.3,
        pointerEvents: 'none',
      }}>
        "
      </div>

      <div style={{
        position: 'absolute',
        left: SAFE_MARGIN,
        top: 180,
        width: FRAME_WIDTH - SAFE_MARGIN * 2,
        zIndex: 2,
      }}>
        {/* Question in italic */}
        <div style={{
          fontFamily: 'var(--theme-font-narrow, "Archivo Narrow"), sans-serif',
          fontSize: 52,
          fontStyle: 'italic',
          lineHeight: 1.3,
          color: tone === 'light' ? THEME.navy : '#fff',
          marginBottom: 40,
        }}>
          "{qa.q}"
        </div>

        <Rule tone={tone} width={200} style={{ marginBottom: 40 }} />

        {/* Agent's answer */}
        <div style={{ marginBottom: 16 }}>
          <span style={{
            fontFamily: 'var(--theme-font-display, "Archivo Black"), sans-serif',
            fontSize: 28,
            textTransform: 'uppercase',
            color: THEME.red,
          }}>
            {agent.name.split(' ')[0]}:
          </span>
        </div>
        <BodyText size={38} tone={tone} style={{ lineHeight: 1.4 }}>
          {qa.a}
        </BodyText>
      </div>

      {/* Question number */}
      <div style={{
        position: 'absolute',
        right: SAFE_MARGIN,
        bottom: FOOTER_HEIGHT + CONTACT_HEIGHT + 60,
        fontFamily: 'var(--theme-font-display, "Archivo Black"), sans-serif',
        fontSize: 28,
        color: tone === 'light' ? THEME.mute : 'rgba(255,255,255,0.5)',
      }}>
        Q{index + 1}
      </div>

      <ContactBar agent={agent} />
      <RemaxFooter />
    </CarouselFrame>
  );
};

/* ---------- Testimonial Frame ---------- */

const TestimonialFrame = ({ agent, content }: { agent: CarouselAgent; content: ClientQuestionsContent }) => {
  const { testimonial, cta } = content;

  return (
    <CarouselFrame tone="dark">
      {/* Background property image */}
      {testimonial.image.src && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: FRAME_WIDTH,
          height: CONTENT_HEIGHT,
          backgroundImage: `url(${testimonial.image.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
      )}

      {/* Navy overlay */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: FRAME_WIDTH,
        height: CONTENT_HEIGHT,
        background: 'linear-gradient(180deg, rgba(13,35,67,0.85) 0%, rgba(13,35,67,0.95) 100%)',
      }} />

      {/* SOLD tag */}
      <div style={{
        position: 'absolute',
        right: SAFE_MARGIN,
        top: SAFE_MARGIN,
        zIndex: 2,
      }}>
        <Tag style={{ background: THEME.red }}>SOLD</Tag>
      </div>

      {/* Content */}
      <div style={{
        position: 'absolute',
        left: SAFE_MARGIN,
        top: 200,
        width: FRAME_WIDTH - SAFE_MARGIN * 2,
        zIndex: 2,
      }}>
        {/* Large opening quote */}
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: 120,
          lineHeight: 0.5,
          color: THEME.red,
          marginBottom: 24,
        }}>
          "
        </div>

        <div style={{
          fontFamily: 'var(--theme-font-narrow, "Archivo Narrow"), sans-serif',
          fontSize: 44,
          fontStyle: 'italic',
          lineHeight: 1.35,
          color: '#fff',
          marginBottom: 40,
        }}>
          {testimonial.quote}
        </div>

        <Rule tone="dark" width={150} style={{ marginBottom: 32 }} />

        <BodyText size={32} tone="dark" style={{ opacity: 0.8 }}>
          — {testimonial.client}, {testimonial.town}
        </BodyText>

        {/* CTA */}
        <div style={{ marginTop: 80 }}>
          <DisplayText size={48} tone="dark">
            {cta}
          </DisplayText>
        </div>
      </div>

      <ContactBar agent={agent} />
      <RemaxFooter />
    </CarouselFrame>
  );
};

/* ---------- Main Component ---------- */

export default function ClientQuestionsCarousel({ agent, content, frameIndex }: ClientQuestionsCarouselProps) {
  if (frameIndex === 0) {
    return <CoverFrame agent={agent} content={content} />;
  }

  if (frameIndex >= 1 && frameIndex <= 3) {
    const qaIndex = frameIndex - 1;
    if (content.questions[qaIndex]) {
      return <QuestionFrame agent={agent} qa={content.questions[qaIndex]} index={qaIndex} />;
    }
  }

  return <TestimonialFrame agent={agent} content={content} />;
}

/* ---------- Sample Content ---------- */

export const SAMPLE_CLIENT_QUESTIONS: ClientQuestionsContent = {
  title: 'Questions I Got This Month',
  questions: [
    {
      q: 'Can I buy a cottage as a non-resident?',
      a: 'Yes, but there are rules. Non-residents can own up to 5 acres without special permission. Larger parcels need approval from the Island Regulatory and Appeals Commission. The process is straightforward—I can walk you through it.',
    },
    {
      q: 'Should I sell first or buy first?',
      a: 'It depends on your situation. If you need the equity from your current home, sell first with a longer closing. If you can carry two mortgages briefly, buy first for less stress. We can explore bridge financing too.',
    },
    {
      q: 'How much does it really cost to close?',
      a: 'Budget 1.5–2% of the purchase price. That covers legal fees (~$1,500), land transfer tax (1% up to $30K, 2% after), title insurance, and adjustments for property tax and oil. I\'ll break it down for your specific situation.',
    },
  ],
  testimonial: {
    quote: 'Greg answered every question before I even thought to ask. Moving from Ontario, I had no idea about the land ownership rules here. He made the whole process feel simple.',
    client: 'Sarah M.',
    town: 'Stratford',
    image: { type: 'property', src: '/images/pei/properties/2-laura-lane-02.png' },
  },
  cta: 'Got a question? Just ask.',
};
