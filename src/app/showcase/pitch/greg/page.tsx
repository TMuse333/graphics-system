'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { TEMPLATE_REGISTRY } from '@/lib/templates';
import {
  SHOWCASE_AGENT_1,
  LISTING_WATERFRONT,
  LISTING_LAND,
  PHOTO_HERO,
} from '@/lib/sampleData';
import type { ContentData, Agent, Listing } from '@/lib/types';
import BuyerObjectionsCarousel from '@/lib/templates/BuyerObjectionsCarousel';

// ============ GREG'S CONTENT ============

const MARKET_STATS: ContentData = {
  kicker: 'Market Update',
  title: 'Halifax Real Estate|October 2026',
  period: 'October 2026',
  stats: [
    { value: '$642K', label: 'Median Price', delta: '+6.8% YoY', direction: 'up' },
    { value: '18', label: 'Days on Market', delta: '-2 days', direction: 'down' },
    { value: '96%', label: 'List-to-Sale', delta: '+1.5%', direction: 'up' },
    { value: '389', label: 'Active Listings', delta: '-12%', direction: 'down' },
  ],
  closing: 'Thinking of selling? Now is a great time.',
  footnote: 'Source: Halifax Regional MLS®',
};

const TESTIMONIAL: ContentData = {
  kicker: 'Client Story',
  title: 'Sold in 6 Days',
  quote: 'Greg understood exactly what we needed. He found us the perfect home before it even hit the market.',
  emphasis: 'perfect home',
  attribution: 'Sarah & Mike Thompson',
  attributionMeta: 'Bought in Bedford, September 2026',
  rating: 5,
};

const EDUCATION: ContentData = {
  kicker: 'Buyer Tips',
  title: 'First-Time|Home Buyer?',
  points: [
    { title: 'Get pre-approved first', body: '' },
    { title: 'Work with a local expert', body: '' },
    { title: 'Consider the full cost', body: '' },
    { title: "Don't skip the inspection", body: '' },
    { title: 'Think long-term', body: '' },
  ],
};

const PROCESS: ContentData = {
  kicker: 'Selling My',
  title: 'Condominium',
  subtitle: 'A Four Step Process',
  points: [
    { title: 'Pricing & Market Review', body: '' },
    { title: 'Documents & Disclosure', body: '' },
    { title: 'Preparation & Photography', body: '' },
    { title: 'Listing, Showings & Offers', body: '' },
  ],
};

const CAROUSEL_DATA = {
  kicker: 'Seller Guide',
  title: ['Buyer', 'Objections'] as [string, string],
  subtitle: 'Learn what can **kill a sale.**',
  items: [
    { label: 'Price', objection: 'Too high compared to similar condos.', response: 'We price against live comparables, then review the position every week it sits on market.', icon: 'tag' as const },
    { label: 'Condition', objection: 'Needs work or looks poorly maintained.', response: 'A pre-list walkthrough flags the low-cost fixes that change a buyer\'s first impression.', icon: 'wrench' as const },
    { label: 'Fees', objection: 'Condo fees are too high.', response: 'We show buyers what the fee actually covers, and what it saves them month to month.', icon: 'clock' as const },
    { label: 'Special Assessments', objection: 'Potential costs create worry.', response: 'Documents pulled and explained up front, so nothing surprises a buyer late in the deal.', icon: 'map-pin' as const },
    { label: 'Financing', objection: 'Lenders may be concerned.', response: 'Lender-ready paperwork from day one keeps approvals from stalling the closing.', icon: 'users' as const },
  ],
  closing: { kicker: 'Thinking of selling?', title: 'Let\'s get ahead of it', body: 'A pricing and condition review before you list.', cta: 'Call me', icon: 'handshake' as const },
  portraitUrl: '/agents/greg/headshot.png',
};

type ScheduledPost = {
  id: string;
  date: number;
  type: 'listing' | 'content' | 'carousel';
  templateId: string;
  label: string;
  variant?: string;
  listing?: Listing;
  content?: ContentData;
};

const OCTOBER_POSTS: ScheduledPost[] = [
  { id: '1', date: 1, type: 'content', templateId: 'market-stats', label: 'Market Stats', content: MARKET_STATS },
  { id: '2', date: 3, type: 'listing', templateId: 'coming-soon-nova', label: 'Coming Soon', variant: 'coming-soon', listing: LISTING_WATERFRONT },
  { id: '3', date: 5, type: 'content', templateId: 'testimonial-card', label: 'Testimonial', content: TESTIMONIAL },
  { id: '4', date: 7, type: 'listing', templateId: 'style-b-square', label: 'New Listing', variant: 'new-listing', listing: LISTING_WATERFRONT },
  { id: '5', date: 9, type: 'carousel', templateId: 'buyer-objections', label: 'Carousel' },
  { id: '6', date: 11, type: 'listing', templateId: 'style-b-square', label: 'Open House', variant: 'open-house', listing: LISTING_WATERFRONT },
  { id: '7', date: 14, type: 'content', templateId: 'education-card', label: 'Buyer Tips', content: EDUCATION },
  { id: '8', date: 16, type: 'listing', templateId: 'gen1-square', label: 'Land Listing', variant: 'new-listing', listing: LISTING_LAND },
  { id: '9', date: 18, type: 'content', templateId: 'process-explainer', label: 'Process Guide', content: PROCESS },
  { id: '10', date: 21, type: 'listing', templateId: 'style-b-square', label: 'Price Drop', variant: 'price-drop', listing: LISTING_WATERFRONT },
  { id: '11', date: 24, type: 'content', templateId: 'stat-board', label: 'Quick Stats', content: MARKET_STATS },
  { id: '12', date: 26, type: 'listing', templateId: 'style-b-square', label: 'Just Sold', variant: 'just-sold', listing: LISTING_WATERFRONT },
  { id: '13', date: 28, type: 'content', templateId: 'type-poster', label: 'Quote', content: TESTIMONIAL },
  { id: '14', date: 30, type: 'content', templateId: 'agent-forward', label: 'Agent Intro', content: { kicker: 'Your Local Expert', title: 'Greg Caseley' } },
];

// ============ PAGE ============

export default function GregPitchPage() {
  const [fontsReady, setFontsReady] = useState(false);
  const [carouselFrame, setCarouselFrame] = useState(0);

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  const agent = SHOWCASE_AGENT_1;

  return (
    <>
      <style>{`
        @font-face { font-family: 'Archivo'; src: url('/fonts/Archivo-Variable.woff2') format('woff2'); font-weight: 100 900; }
        @font-face { font-family: 'Archivo Narrow'; src: url('/fonts/ArchivoNarrow-Variable.woff2') format('woff2'); font-weight: 100 900; }
        @font-face { font-family: 'Yellowtail'; src: url('/fonts/Yellowtail-Regular.woff2') format('woff2'); font-weight: 400; }
        .section-label { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
        .section-title { font-size: 28px; font-weight: 700; margin-bottom: 6px; }
        .section-desc { font-size: 15px; color: var(--muted); margin-bottom: 32px; }
      `}</style>

      <header className="header">
        <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
        <span style={{ fontSize: '14px', color: 'var(--muted)' }}>For Greg</span>
      </header>

      <main className="page" style={{ background: 'var(--surface)' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>

          {/* ============ INTRO ============ */}
          <section style={{ textAlign: 'center', padding: '60px 0 48px' }}>
            <p style={{ fontSize: '18px', color: 'var(--muted)', marginBottom: '12px' }}>Hey Greg,</p>
            <h1 style={{ fontSize: '38px', fontWeight: 700, marginBottom: '16px', lineHeight: 1.2 }}>
              Here's what the next level looks like
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--muted)', maxWidth: '500px', margin: '0 auto' }}>
              We've been doing 16 graphics a month. This adds carousels, video, and tracking.
            </p>
          </section>

          {/* ============ WHAT'S NEW ============ */}
          <section style={{ marginBottom: '64px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <p className="section-label">What's New</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
              <NewFeatureCard title="Carousels" desc="7-frame educational posts that position you as the expert" />
              <NewFeatureCard title="Video Reels" desc="10-second animated loops for your listings" />
              <NewFeatureCard title="Analytics" desc="Meta API tracking — see what's working, adjust the mix" />
            </div>
          </section>

          {/* ============ YOUR OCTOBER ============ */}
          <section style={{ marginBottom: '64px' }}>
            <p className="section-label">Your Calendar</p>
            <h2 className="section-title">October 2026</h2>
            <p className="section-desc">14 posts — listing graphics, content pieces, and a carousel.</p>
            <CalendarGrid posts={OCTOBER_POSTS} agent={agent} fontsReady={fontsReady} />
          </section>

          {/* ============ CAROUSEL ============ */}
          <section style={{ marginBottom: '64px' }}>
            <p className="section-label">Carousel</p>
            <h2 className="section-title">Buyer Objections</h2>
            <p className="section-desc">7 frames. Educates sellers on what kills deals.</p>
            <CarouselPreview agent={agent} fontsReady={fontsReady} currentFrame={carouselFrame} onFrameChange={setCarouselFrame} />
          </section>

          {/* ============ VIDEO ============ */}
          <section style={{ marginBottom: '64px' }}>
            <p className="section-label">Video</p>
            <h2 className="section-title">Open House Reel</h2>
            <p className="section-desc">10-second loop. Property, date, address, contact.</p>
            <div style={{ maxWidth: '280px', margin: '0 auto', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}>
              <iframe src="https://drive.google.com/file/d/1RqVD6_gLt0imoCnxtRU6xQDD5WuywKfN/preview" width="280" height="498" allow="autoplay" style={{ display: 'block', border: 'none' }} />
            </div>
          </section>

          {/* ============ ANALYTICS ============ */}
          <section style={{ marginBottom: '64px' }}>
            <p className="section-label">Analytics</p>
            <h2 className="section-title">Tracking What Works</h2>
            <p className="section-desc">Meta API connected. We see what gets engagement and optimize over time.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <MetricPill label="Impressions" />
              <MetricPill label="Reach" />
              <MetricPill label="Engagement" />
              <MetricPill label="Video Views" />
            </div>
          </section>

          {/* ============ CTA ============ */}
          <section style={{ textAlign: 'center', padding: '48px 0 80px' }}>
            <div style={{ padding: '40px', background: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)', maxWidth: '500px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>The Upgrade</h2>
              <div style={{ textAlign: 'left', maxWidth: '320px', margin: '0 auto 24px' }}>
                <CheckItem text="Everything we've been doing" />
                <CheckItem text="+ Educational carousels" />
                <CheckItem text="+ Video reels for listings" />
                <CheckItem text="+ Analytics tracking" />
              </div>
              <a href="mailto:thomas@example.com?subject=Let's do it" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '15px', textDecoration: 'none' }}>
                Let's Talk
              </a>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}

// ============ COMPONENTS ============

function NewFeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}

function MetricPill({ label }: { label: string }) {
  return (
    <div style={{ padding: '10px 20px', background: 'var(--card)', borderRadius: '20px', fontSize: '14px', fontWeight: 500, border: '1px solid var(--border)' }}>
      {label}
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', fontSize: '15px' }}>
      <span style={{ color: 'var(--accent)' }}>✓</span>
      <span>{text}</span>
    </div>
  );
}

function CalendarGrid({ posts, agent, fontsReady }: { posts: ScheduledPost[]; agent: Agent; fontsReady: boolean }) {
  const startDay = 4;
  const totalDays = 31;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let i = 1; i <= totalDays; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);
  const postsByDate = new Map<number, ScheduledPost>();
  posts.forEach(p => postsByDate.set(p.date, p));

  return (
    <div style={{ background: 'var(--card)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        {days.map(d => (
          <div key={d} style={{ padding: '10px', textAlign: 'center', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {cells.map((day, i) => {
          const post = day ? postsByDate.get(day) : null;
          return (
            <div key={i} style={{ minHeight: '100px', padding: '6px', borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: day ? 'var(--card)' : 'var(--surface)' }}>
              {day && (
                <>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>{day}</div>
                  {post && <CalendarPostCard post={post} agent={agent} fontsReady={fontsReady} />}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarPostCard({ post, agent, fontsReady }: { post: ScheduledPost; agent: Agent; fontsReady: boolean }) {
  if (post.type === 'carousel') {
    return (
      <div style={{ background: 'linear-gradient(135deg, #0d2343 0%, #132f57 100%)', borderRadius: '4px', padding: '6px' }}>
        <div style={{ fontSize: '14px', marginBottom: '2px' }}>📱</div>
        <div style={{ fontSize: '8px', color: '#fff', fontWeight: 600 }}>{post.label}</div>
      </div>
    );
  }

  const template = TEMPLATE_REGISTRY[post.templateId];
  if (!template) return null;

  const Component = template.component;
  const [width, height] = template.size;
  const scale = 80 / width;

  const props = post.type === 'content'
    ? { agent, content: post.content }
    : { agent, listing: post.listing, variant: post.variant || 'new-listing', overrides: {}, photos: { hero: PHOTO_HERO, strip: [], sub: [], row: [] } };

  return (
    <div style={{ width: width * scale, height: height * scale, overflow: 'hidden', borderRadius: '3px', boxShadow: '0 1px 4px rgba(0,0,0,0.12)', opacity: fontsReady ? 1 : 0.5 }}>
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
        <Component {...props} />
      </div>
    </div>
  );
}

function CarouselPreview({ agent, fontsReady, currentFrame, onFrameChange }: { agent: Agent; fontsReady: boolean; currentFrame: number; onFrameChange: (f: number) => void }) {
  const totalFrames = 7;
  const scale = 320 / 1080;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ width: 1080 * scale, height: 1350 * scale, overflow: 'hidden', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', opacity: fontsReady ? 1 : 0.5 }}>
        <div style={{ width: 1080, height: 1350, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <BuyerObjectionsCarousel agent={agent as any} carousel={CAROUSEL_DATA as any} frameIndex={currentFrame} totalFrames={totalFrames} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button onClick={() => onFrameChange(Math.max(0, currentFrame - 1))} disabled={currentFrame === 0} style={{ padding: '6px 12px', fontSize: '13px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '4px', cursor: currentFrame === 0 ? 'not-allowed' : 'pointer', opacity: currentFrame === 0 ? 0.4 : 1 }}>←</button>
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: totalFrames }, (_, i) => (
            <button key={i} onClick={() => onFrameChange(i)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: i === currentFrame ? 'var(--accent)' : 'var(--surface)', color: i === currentFrame ? '#fff' : 'var(--text)', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}>{i + 1}</button>
          ))}
        </div>
        <button onClick={() => onFrameChange(Math.min(totalFrames - 1, currentFrame + 1))} disabled={currentFrame === totalFrames - 1} style={{ padding: '6px 12px', fontSize: '13px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '4px', cursor: currentFrame === totalFrames - 1 ? 'not-allowed' : 'pointer', opacity: currentFrame === totalFrames - 1 ? 0.4 : 1 }}>→</button>
      </div>
    </div>
  );
}
