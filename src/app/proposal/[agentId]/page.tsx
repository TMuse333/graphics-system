'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Play, Calendar, MessageCircle, TrendingUp, BarChart3, CheckCircle2, ChevronLeft, ChevronRight, X, Maximize2, Lightbulb, Sparkles, ArrowRight, Users, Eye, Heart, Target, Zap, AlertCircle, ArrowDown, Menu } from 'lucide-react';
import { getAgent } from '@/lib/store';
import { greg } from '@/lib/theme';
import type { Agent } from '@/lib/types';

// Import carousel templates
import BuyerObjectionsCarousel from '@/lib/templates/BuyerObjectionsCarousel';
import MarketPulseCarousel, { SAMPLE_MARKET_PULSE } from '@/lib/templates/MarketPulseCarousel';
import MythVsFactCarousel, { SAMPLE_MYTH_VS_FACT } from '@/lib/templates/MythVsFactCarousel';
import ClientQuestionsCarousel, { SAMPLE_CLIENT_QUESTIONS } from '@/lib/templates/ClientQuestionsCarousel';
import ThisOrThatCarousel, { SAMPLE_THIS_OR_THAT } from '@/lib/templates/ThisOrThatCarousel';
import type { CarouselAgent } from '@/lib/templates/carouselFormats';

// ============ PROPOSAL DATA (per agent) ============

type ProposalData = {
  agentId: string;
  videoUrl?: string;
  analyticsScreenshotUrl?: string;
  testimonialScreenshotUrl?: string; // Optional screenshot of client saying "it worked!"
  clientQuestions: string[];
  listingGraphicsPrice: number;
  listingGraphicsCount: number;
  carouselsPrice: number;
  carouselsCount: number;
  carouselFramesMin: number;
  carouselFramesMax: number;
  bundlePrice: number;
  bundleSavings: number;
  // Stripe payment links (one-time for now)
  stripeFullPackageUrl?: string;
  stripeCarouselsUrl?: string;
  stripeListingsUrl?: string;
};

const PROPOSALS: Record<string, ProposalData> = {
  'greg-caseley': {
    agentId: 'greg-caseley',
    videoUrl: 'https://drive.google.com/file/d/1FWB0G20vyc64MzBdce33af0rdeDs76Tx/preview',
    analyticsScreenshotUrl: '',
    testimonialScreenshotUrl: '/testimonials/greg-text.png',
    clientQuestions: [
      'What\'s a conditional offer?',
      'How much deposit do I need?',
      'Should I get an inspection?',
      'What are closing costs?',
      'How do multiple offers work?',
      'When should I sell vs buy first?',
    ],
    listingGraphicsPrice: 540,
    listingGraphicsCount: 16,
    carouselsPrice: 1000,
    carouselsCount: 8,
    carouselFramesMin: 4,
    carouselFramesMax: 6,
    bundlePrice: 1400,
    bundleSavings: 140,
    // Stripe payment links (LIVE)
    stripeFullPackageUrl: 'https://buy.stripe.com/8x2bJ2cVbfOi3Uz4ABeQM0e',
    stripeCarouselsUrl: 'https://buy.stripe.com/cNi9AU8EV8lQfDhc33eQM0f',
    stripeListingsUrl: 'https://buy.stripe.com/cNicN6g7n7hMbn1aYZeQM0a',
  },
};

// Sample carousel data
const SAMPLE_BUYER_OBJECTIONS = {
  kicker: 'Buyer Guide',
  title: ['Conditional', 'Offers'] as [string, string],
  subtitle: 'What they are and **when to use them.**',
  items: [
    { label: 'Financing', objection: 'Can I back out if my mortgage falls through?', response: 'A financing condition gives you 5-10 days to secure final approval. No approval, no penalty.', icon: 'tag' as const },
    { label: 'Inspection', objection: 'What if the inspection finds problems?', response: 'An inspection condition lets you renegotiate or walk away if major issues surface.', icon: 'wrench' as const },
    { label: 'Sale of Home', objection: 'I need to sell my current home first.', response: 'A sale condition protects you, but makes your offer less competitive. We\'ll discuss timing strategy.', icon: 'clock' as const },
    { label: 'Competing', objection: 'Do conditions hurt my offer?', response: 'In a hot market, fewer conditions = stronger offer. We balance protection with competitiveness.', icon: 'users' as const },
  ],
  closing: { kicker: 'Questions?', title: 'Let\'s talk strategy', body: 'Every situation is different.', cta: 'Call me', icon: 'handshake' as const },
  portraitUrl: '/agents/greg/headshot.png',
};

type CarouselShowcaseItem = {
  id: string;
  template: 'buyer-objections' | 'market-pulse' | 'myth-vs-fact' | 'client-questions' | 'this-or-that';
  label: string;
  title: string;
  subtitle: string;
  frames: number;
  day: 'tue' | 'thu';
  color: string;
};

const CAROUSEL_SHOWCASE: CarouselShowcaseItem[] = [
  { id: 'market-pulse', template: 'market-pulse', label: 'Market Stats', title: 'PEI Q3 Snapshot', subtitle: 'Numbers that matter', frames: 5, day: 'thu', color: '#10b981' },
  { id: 'buyer-objections', template: 'buyer-objections', label: 'Buyer Guide', title: 'Conditional Offers', subtitle: 'When to use them', frames: 6, day: 'tue', color: '#3b82f6' },
  { id: 'myth-vs-fact', template: 'myth-vs-fact', label: 'Seller Myths', title: '5 Pricing Myths', subtitle: 'What sellers believe vs reality', frames: 6, day: 'tue', color: '#ef4444' },
  { id: 'client-questions', template: 'client-questions', label: 'Q&A', title: 'Questions This Month', subtitle: 'Real questions, real answers', frames: 5, day: 'tue', color: '#8b5cf6' },
  { id: 'this-or-that', template: 'this-or-that', label: 'Compare', title: 'Cottage vs Year-Round', subtitle: 'Which fits your lifestyle?', frames: 7, day: 'thu', color: '#f59e0b' },
];

type CalendarPost = {
  day: number;
  type: 'listing' | 'carousel' | 'stats';
  label: string;
};

const SAMPLE_CALENDAR: CalendarPost[] = [
  { day: 1, type: 'carousel', label: 'Market Pulse' },
  { day: 3, type: 'listing', label: 'New Listing' },
  { day: 6, type: 'carousel', label: 'Conditional Offers' },
  { day: 8, type: 'carousel', label: 'Closing Costs' },
  { day: 13, type: 'carousel', label: 'Inspection Tips' },
  { day: 14, type: 'listing', label: 'Open House' },
  { day: 15, type: 'carousel', label: 'Deposit FAQ' },
  { day: 20, type: 'carousel', label: 'Offer Strategy' },
  { day: 22, type: 'carousel', label: 'First-Time Buyers' },
  { day: 24, type: 'listing', label: 'Just Sold' },
  { day: 27, type: 'carousel', label: 'Market Outlook' },
  { day: 29, type: 'carousel', label: 'Negotiation Tips' },
];

// ============ PAGE ============

export default function ProposalPage() {
  const params = useParams();
  const agentId = params.agentId as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [carouselFrames, setCarouselFrames] = useState<Record<string, number>>({});
  const [expandedCarousel, setExpandedCarousel] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  // Hardcoded stats (no API dependency for now)
  const liveStats = {
    headline: {
      totalReachFormatted: '2.7K',
      videoViewsFormatted: '4.0K',
      engagementRate: '25.81%',
      totalPosts: 7,
    },
    topPosts: {
      byReach: [{
        caption: 'No caption',
        metrics: { reach: 1098, engagement: 49 }
      }]
    },
    recent: {
      posts: 2,
      reachFormatted: '1.8K',
    },
    averages: {
      reachPerPostFormatted: '390',
    }
  };
  const statsLoading = false;

  const proposal = PROPOSALS[agentId] || PROPOSALS['greg-caseley'];

  useEffect(() => {
    const loadedAgent = getAgent(agentId);
    setAgent(loadedAgent || greg);
    document.fonts.ready.then(() => setFontsReady(true));
  }, [agentId]);

  // Track scroll progress for floating CTA
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!agent) return null;

  const showFloatingCta = scrollProgress > 0.1;
  const ctaPulse = scrollProgress > 0.4;

  return (
    <div className="proposal-page">
      {/* Background blur orbs */}
      <div className="blur-orb" style={{ width: 600, height: 600, background: 'rgba(var(--p-primary-rgb), 0.15)', top: -200, right: -200 }} />
      <div className="blur-orb" style={{ width: 500, height: 500, background: 'rgba(var(--p-secondary-rgb), 0.1)', bottom: 200, left: -150 }} />
      <div className="blur-orb" style={{ width: 400, height: 400, background: 'rgba(var(--p-accent-rgb), 0.08)', top: '50%', right: '10%' }} />

      <style>{`
        @font-face { font-family: 'Archivo'; src: url('/fonts/Archivo-Variable.woff2') format('woff2'); font-weight: 100 900; }
        @font-face { font-family: 'Archivo Narrow'; src: url('/fonts/ArchivoNarrow-Variable.woff2') format('woff2'); font-weight: 100 900; }
        @font-face { font-family: 'Yellowtail'; src: url('/fonts/Yellowtail-Regular.woff2') format('woff2'); font-weight: 400; }
      `}</style>

      {/* ============ HEADER ============ */}
      <header
        className="glass-card animate-fadeIn fixed top-4 left-4 right-4 z-50 flex justify-between items-center px-4 md:px-6 py-3 rounded-xl"
      >
        <span className="gradient-text text-xs md:text-base font-bold tracking-wide">
          LISTING GRAPHICS
        </span>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a
            href="#addition"
            style={{ fontSize: 13, color: 'var(--text-60)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-90)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-60)'}
          >
            The Upgrade
          </a>
          <a
            href="#formats"
            style={{ fontSize: 13, color: 'var(--text-60)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-90)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-60)'}
          >
            Formats
          </a>
          <a
            href="#dashboard"
            style={{ fontSize: 13, color: 'var(--text-60)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-90)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-60)'}
          >
            Dashboard
          </a>
          <a
            href={proposal.stripeFullPackageUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg, var(--p-accent), #059669)',
              padding: '8px 16px',
              borderRadius: 8,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
            }}
          >
            Get Started
            <ArrowRight style={{ width: 14, height: 14 }} />
          </a>
        </nav>

        {/* Mobile Navigation */}
        <div className="mobile-nav" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href={proposal.stripeFullPackageUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg, var(--p-accent), #059669)',
              padding: '8px 16px',
              borderRadius: 8,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
            }}
          >
            Get Started
            <ArrowRight style={{ width: 14, height: 14 }} />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 8,
              padding: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mobileMenuOpen ? (
              <X style={{ width: 20, height: 20, color: 'var(--text-80)' }} />
            ) : (
              <Menu style={{ width: 20, height: 20, color: 'var(--text-80)' }} />
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div
            className="mobile-dropdown"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 8,
              background: 'rgba(15, 23, 42, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <a
              href="#addition"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: 14, color: 'var(--text-70)', textDecoration: 'none', padding: '8px 0' }}
            >
              The Upgrade
            </a>
            <a
              href="#formats"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: 14, color: 'var(--text-70)', textDecoration: 'none', padding: '8px 0' }}
            >
              Formats
            </a>
            <a
              href="#dashboard"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: 14, color: 'var(--text-70)', textDecoration: 'none', padding: '8px 0' }}
            >
              Dashboard
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: 14, color: 'var(--text-70)', textDecoration: 'none', padding: '8px 0' }}
            >
              Pricing
            </a>
          </div>
        )}
      </header>

      {/* Mobile/Desktop Nav Styles */}
      <style jsx>{`
        .desktop-nav { display: flex; }
        .mobile-nav { display: none; }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', paddingTop: 80 }}>

        {/* ============ 1. VIDEO INTRO ============ */}
        <section className="proposal-section animate-fadeInUp" style={{ textAlign: 'center', paddingTop: 40 }}>
          {/* Personal greeting */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
              Hey <span style={{ color: 'var(--p-accent)' }}>{agent.name.split(' ')[0]}</span>,
            </h1>
            <p style={{ fontSize: 17, color: 'var(--text-70)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
              I&apos;ve been thinking about how to get you more consistent visibility — without adding anything to your day.
            </p>
            <p style={{ fontSize: 17, color: 'var(--text-70)', maxWidth: 500, margin: '12px auto 0', lineHeight: 1.6 }}>
              I&apos;ve made this solution for you to continue helping you grow.
            </p>
          </div>
        </section>

        {/* ============ 2. VIDEO ============ */}
        <section className="proposal-section animate-fadeInUp" style={{ textAlign: 'center' }}>
          {proposal.videoUrl ? (
            <div
              className="glass-card glass-card-glow"
              style={{
                maxWidth: 700,
                margin: '0 auto',
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              <iframe
                src={proposal.videoUrl}
                width="100%"
                height="394"
                allow="autoplay; fullscreen"
                style={{ display: 'block', border: 'none' }}
              />
            </div>
          ) : (
            <div
              className="glass-card glass-card-glow"
              style={{
                maxWidth: 700,
                margin: '0 auto',
                padding: '80px 40px',
                borderRadius: 20,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--p-primary), var(--p-secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: 'var(--glow-lg) rgba(var(--p-primary-rgb), 0.4)',
                }}
              >
                <Play style={{ width: 32, height: 32, color: '#fff' }} />
              </div>
              <p style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>A quick note from Thomas</p>
              <p style={{ color: 'var(--text-50)', fontSize: 15 }}>
                Video walkthrough coming soon
              </p>
            </div>
          )}
        </section>

        {/* ============ 2. UPSELL FLOW: WORKING → GAP → ADDITION → RESULT ============ */}
        <section className="proposal-section">
          {/* What's Working */}
          <div className="animate-fadeInUp animation-delay-100" style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="pill-badge pill-badge-accent" style={{ marginBottom: 16 }}>
              <CheckCircle2 style={{ width: 14, height: 14 }} />
              What&apos;s Working
            </span>
            <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16, lineHeight: 1.3 }}>
              Your listing graphics are <span className="gradient-text-accent">doing their job</span>.
            </h2>
            <p style={{ fontSize: 18, color: 'var(--text-50)', maxWidth: 550, margin: '0 auto', lineHeight: 1.6 }}>
              Announcements work. People see a listing, they reach out.
            </p>

            {/* Testimonial proof */}
            {proposal.testimonialScreenshotUrl && (
              <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
                <div
                  className="glass-card"
                  style={{
                    padding: 20,
                    maxWidth: 340,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: '1px solid var(--glass-border)',
                      marginBottom: 12,
                    }}
                  >
                    <img
                      src={proposal.testimonialScreenshotUrl}
                      alt="Client testimonial"
                      style={{ width: '100%', display: 'block' }}
                    />
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-50)' }}>
                    This is already happening.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Arrow down */}
          <div className="animate-fadeInUp animation-delay-200" style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 2, height: 40, background: 'linear-gradient(to bottom, var(--p-accent), var(--p-warm))' }} />
              <ArrowDown style={{ width: 20, height: 20, color: 'var(--p-warm)' }} />
            </div>
          </div>

          {/* The Gap */}
          <div className="animate-fadeInUp animation-delay-200" style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="pill-badge" style={{ background: 'rgba(var(--p-warm-rgb), 0.15)', border: '1px solid rgba(var(--p-warm-rgb), 0.3)', color: 'var(--p-warm)', marginBottom: 16 }}>
              <AlertCircle style={{ width: 14, height: 14 }} />
              The Gap
            </span>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, lineHeight: 1.3 }}>
              But announcements only reach people <span style={{ color: 'var(--p-warm)' }}>ready right now</span>.
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-50)', maxWidth: 550, margin: '0 auto 28px', lineHeight: 1.6 }}>
              What about the rest of your followers?
            </p>

            {/* Gap points */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
              {[
                'Followers who\'ll be ready in 6 months',
                'People with questions they haven\'t asked',
                'The ones "just looking" who scroll past',
              ].map((point, i) => (
                <div
                  key={i}
                  className="glass-card"
                  style={{
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--p-warm)' }} />
                  <span style={{ fontSize: 14, color: 'var(--text-70)' }}>{point}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 16, color: 'var(--text-50)', maxWidth: 450, margin: '0 auto', lineHeight: 1.6 }}>
              Between listings, your feed goes quiet. They forget. They find someone else.
            </p>
          </div>

          {/* Arrow down */}
          <div className="animate-fadeInUp animation-delay-300" style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 2, height: 40, background: 'linear-gradient(to bottom, var(--p-warm), var(--p-primary))' }} />
              <ArrowDown style={{ width: 20, height: 20, color: 'var(--p-primary)' }} />
            </div>
          </div>

          {/* The Addition */}
          <div id="addition" className="animate-fadeInUp animation-delay-300" style={{ textAlign: 'center', marginBottom: 48, scrollMarginTop: 100 }}>
            {/* Gold upgrade banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, var(--p-warm), #d97706)',
                padding: '10px 24px',
                borderRadius: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
                boxShadow: 'var(--glow-md) rgba(var(--p-warm-rgb), 0.4)',
              }}
            >
              <Sparkles style={{ width: 18, height: 18, color: '#fff' }} />
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#fff' }}>
                The New Upgrade
              </span>
            </div>

            <span className="pill-badge pill-badge-primary" style={{ marginBottom: 16, display: 'flex' }}>
              <Lightbulb style={{ width: 14, height: 14 }} />
              The Addition
            </span>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, lineHeight: 1.3 }}>
              Answer the questions <span style={{ color: 'var(--p-primary)' }}>they already have</span>.
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-50)', maxWidth: 550, margin: '0 auto 32px', lineHeight: 1.6 }}>
              Carousels go out <strong style={{ color: 'var(--p-primary)' }}>twice a week</strong> — filling the gaps between listings with helpful content.
            </p>

            {/* Question cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
              {proposal.clientQuestions.map((q, i) => (
                <div
                  key={i}
                  className="question-card animate-fadeInUp"
                  style={{ animationDelay: `${400 + i * 80}ms` }}
                >
                  <MessageCircle style={{ width: 18, height: 18, color: 'var(--p-primary)', marginBottom: 8 }} />
                  <p style={{ fontSize: 14, color: 'var(--text-90)' }}>&ldquo;{q}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow down */}
          <div className="animate-fadeInUp animation-delay-400" style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 2, height: 40, background: 'linear-gradient(to bottom, var(--p-primary), var(--p-secondary))' }} />
              <ArrowDown style={{ width: 20, height: 20, color: 'var(--p-secondary)' }} />
            </div>
          </div>

          {/* What This Adds */}
          <div className="animate-fadeInUp animation-delay-400" style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="pill-badge" style={{ background: 'rgba(var(--p-secondary-rgb), 0.15)', border: '1px solid rgba(var(--p-secondary-rgb), 0.3)', color: 'var(--p-secondary)', marginBottom: 16 }}>
              <Sparkles style={{ width: 14, height: 14 }} />
              What This Adds
            </span>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
              Benefits you <span style={{ color: 'var(--p-secondary)' }}>don&apos;t get</span> from announcements alone
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-50)', maxWidth: 500, margin: '0 auto 32px' }}>
              Consistent content creates compounding effects:
            </p>
          </div>

          {/* Horizontal flow - Input steps */}
          <div className="animate-fadeInUp animation-delay-500 flex flex-wrap items-center justify-center gap-3 mb-8">
            <FlowStep icon={<Calendar style={{ width: 18, height: 18 }} />} label="Consistent Posting" sublabel="Tue + Thu" color="var(--p-primary)" />
            <div className="flow-connector" />
            <FlowStep icon={<TrendingUp style={{ width: 18, height: 18 }} />} label="Algorithm Rewards" sublabel="More reach" color="var(--p-secondary)" />
            <div className="flow-connector" />
            <FlowStep icon={<Eye style={{ width: 18, height: 18 }} />} label="They See You More" sublabel="In their feed" color="var(--p-pink)" />
            <div className="flow-connector" />
            <FlowStep icon={<Heart style={{ width: 18, height: 18 }} />} label="Trust Builds" sublabel="You're the expert" color="#ef4444" />
          </div>

          {/* Outcome cards */}
          <div className="animate-fadeInUp animation-delay-500 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(var(--p-accent-rgb), 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Target style={{ width: 24, height: 24, color: 'var(--p-accent)' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: 'var(--p-accent)' }}>Top of Mind</p>
              <p style={{ fontSize: 13, color: 'var(--text-50)', lineHeight: 1.5 }}>
                When they&apos;re ready, you&apos;re the first person they think of.
              </p>
            </div>

            <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(var(--p-warm-rgb), 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Zap style={{ width: 24, height: 24, color: 'var(--p-warm)' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: 'var(--p-warm)' }}>Faster Action</p>
              <p style={{ fontSize: 13, color: 'var(--text-50)', lineHeight: 1.5 }}>
                Your content moves the timeline up. They engage sooner.
              </p>
            </div>

            <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(var(--p-secondary-rgb), 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Users style={{ width: 24, height: 24, color: 'var(--p-secondary)' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: 'var(--p-secondary)' }}>Real-Life Credibility</p>
              <p style={{ fontSize: 13, color: 'var(--text-50)', lineHeight: 1.5 }}>
                Share your profile with confidence. A professional presence.
              </p>
            </div>
          </div>

          {/* Arrow down to result */}
          <div className="animate-fadeInUp animation-delay-500" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 2, height: 32, background: 'linear-gradient(to bottom, var(--glass-border), var(--p-accent))' }} />
            <div
              className="glow-accent"
              style={{
                padding: '16px 48px',
                background: 'linear-gradient(135deg, var(--p-accent) 0%, #059669 100%)',
                borderRadius: 12,
              }}
            >
              <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', textAlign: 'center' }}>Even More Leads</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 2 }}>in addition to what you&apos;re already getting</p>
            </div>
          </div>
        </section>

        {/* ============ 3. YOUR VOICE ============ */}
        <section className="proposal-section animate-fadeInUp">
          <div
            className="glass-card"
            style={{ padding: 40 }}
          >
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="flex-1 min-w-0">
                <span className="pill-badge" style={{ background: 'rgba(var(--p-secondary-rgb), 0.15)', border: '1px solid rgba(var(--p-secondary-rgb), 0.3)', color: 'var(--p-secondary)', marginBottom: 16 }}>
                  <MessageCircle style={{ width: 14, height: 14 }} />
                  Your Voice
                </span>
                <h3 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12, marginTop: 16 }}>
                  These are <em>your</em> answers, not generic advice
                </h3>
                <p style={{ color: 'var(--text-50)', lineHeight: 1.6, marginBottom: 24 }}>
                  I&apos;ll capture your actual expertise through a simple chat. Your take on the market, how you handle objections, your process — that becomes the carousel content.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="check-item">
                    <div className="check-icon" style={{ background: 'rgba(var(--p-accent-rgb), 0.2)' }}>
                      <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--p-accent)' }} />
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--text-70)' }}>10-15 minute chat to capture your insights</span>
                  </div>
                  <div className="check-item">
                    <div className="check-icon" style={{ background: 'rgba(var(--p-accent-rgb), 0.2)' }}>
                      <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--p-accent)' }} />
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--text-70)' }}>Content sounds like you, not a template</span>
                  </div>
                  <div className="check-item">
                    <div className="check-icon" style={{ background: 'rgba(var(--p-accent-rgb), 0.2)' }}>
                      <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--p-accent)' }} />
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--text-70)' }}>Update anytime as the market changes</span>
                  </div>
                </div>
              </div>

              <div
                className="glass-card w-full lg:w-[280px] lg:flex-shrink-0 p-5"
              >
                <p style={{ fontSize: 11, color: 'var(--text-50)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                  Sample Question
                </p>
                <div
                  style={{
                    background: 'var(--glass-hover)',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: 'var(--text-70)',
                  }}
                >
                  &ldquo;When a buyer says they&apos;re not ready yet, what do you tell them?&rdquo;
                </div>
                <div
                  style={{
                    background: 'linear-gradient(135deg, var(--p-primary), var(--p-secondary))',
                    color: '#fff',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 13,
                    lineHeight: 1.5,
                    marginLeft: 24,
                  }}
                >
                  Your answer becomes a carousel slide...
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                  <ArrowDown style={{ width: 20, height: 20, color: 'var(--text-30)' }} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    background: 'rgba(var(--p-primary-rgb), 0.15)',
                    border: '1px solid rgba(var(--p-primary-rgb), 0.3)',
                    borderRadius: 8,
                    marginTop: 12,
                  }}
                >
                  <Sparkles style={{ width: 14, height: 14, color: 'var(--p-primary)' }} />
                  <span style={{ fontSize: 12, color: 'var(--p-primary)', fontWeight: 600 }}>BuyerObjectionsCarousel</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 4. WHAT IT LOOKS LIKE (Calendar) ============ */}
        </main>
        <section
          className="animate-fadeInUp"
          style={{
            position: 'relative',
            padding: '64px 24px',
            margin: '48px 0',
            background: 'linear-gradient(180deg, rgba(var(--p-primary-rgb), 0.08) 0%, transparent 100%)',
            borderTop: '1px solid rgba(var(--p-primary-rgb), 0.2)',
            borderBottom: '1px solid rgba(var(--p-primary-rgb), 0.1)',
          }}
        >
          {/* Blue glow at top */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 400, height: 200, background: 'rgba(var(--p-primary-rgb), 0.15)', filter: 'blur(80px)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <span className="pill-badge pill-badge-primary" style={{ marginBottom: 16 }}>
                <Calendar style={{ width: 14, height: 14 }} />
                What It Looks Like
              </span>
              <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, marginTop: 16 }}>
                You manage listings. <span className="gradient-text">I manage content.</span>
              </h2>
              <p style={{ fontSize: 17, color: 'var(--text-50)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
                Carousels go out <strong style={{ color: 'var(--p-primary)' }}>twice a week</strong> — {proposal.carouselsCount} per month, consistent rhythm.
              </p>
            </div>

            <ProposalCalendar posts={SAMPLE_CALENDAR} accentColor={agent.theme.accent} />

            <div style={{ display: 'flex', gap: 24, marginTop: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              <CalendarLegend color={agent.theme.accent} label="Your Listings" />
              <CalendarLegend color="var(--p-primary)" label="Answer Carousel" />
              <CalendarLegend color="var(--p-secondary)" label="Market Stats" />
            </div>
          </div>
        </section>
        {/* ============ 5. THE FORMATS ============ */}
        <section
          id="formats"
          className="animate-fadeInUp"
          style={{
            position: 'relative',
            padding: '64px 24px',
            margin: '0 0 48px 0',
            background: 'linear-gradient(180deg, rgba(var(--p-warm-rgb), 0.08) 0%, transparent 100%)',
            borderTop: '1px solid rgba(var(--p-warm-rgb), 0.2)',
            borderBottom: '1px solid rgba(var(--p-warm-rgb), 0.1)',
            scrollMarginTop: 80,
          }}
        >
          {/* Warm glow at top */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 400, height: 200, background: 'rgba(var(--p-warm-rgb), 0.15)', filter: 'blur(80px)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <span className="pill-badge" style={{ background: 'rgba(var(--p-warm-rgb), 0.15)', border: '1px solid rgba(var(--p-warm-rgb), 0.3)', color: 'var(--p-warm)', marginBottom: 16 }}>
                <Sparkles style={{ width: 14, height: 14 }} />
                The Formats
              </span>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, marginTop: 16 }}>
              5 carousel styles, rotating monthly
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-50)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
              Click any carousel to preview all frames. Each format targets a different type of engagement.
            </p>
          </div>

          {/* Template type pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            {CAROUSEL_SHOWCASE.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '6px 14px',
                  background: `${item.color}20`,
                  border: `1px solid ${item.color}50`,
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 10, opacity: 0.7 }}>{item.day.toUpperCase()}</span>
                {item.label}
              </div>
            ))}
          </div>

          {/* Sample Carousels - showing variety */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {CAROUSEL_SHOWCASE.slice(0, 3).map((item) => (
              <CarouselPreviewNew
                key={item.id}
                agent={agent}
                item={item}
                currentFrame={carouselFrames[item.id] || 0}
                onFrameChange={(f) => setCarouselFrames(prev => ({ ...prev, [item.id]: f }))}
                onExpand={() => setExpandedCarousel(item.id)}
                fontsReady={fontsReady}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[600px] mx-auto">
            {CAROUSEL_SHOWCASE.slice(3, 5).map((item) => (
              <CarouselPreviewNew
                key={item.id}
                agent={agent}
                item={item}
                currentFrame={carouselFrames[item.id] || 0}
                onFrameChange={(f) => setCarouselFrames(prev => ({ ...prev, [item.id]: f }))}
                onExpand={() => setExpandedCarousel(item.id)}
                fontsReady={fontsReady}
              />
            ))}
          </div>

          {/* Rotation breakdown */}
          <div className="glass-card" style={{ marginTop: 32, padding: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-90)' }}>Monthly Rotation ({proposal.carouselsCount} posts):</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-50)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Tuesdays (Education)</p>
                <p style={{ fontSize: 13, color: 'var(--text-70)' }}>Buyer Objections, Client Questions, Myth vs Fact, Process Guides</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-50)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Thursdays (Local)</p>
                <p style={{ fontSize: 13, color: 'var(--text-70)' }}>Market Pulse, Neighbourhood Guides, This or That, Comparisons</p>
              </div>
            </div>
          </div>

          {/* Custom topics callout */}
          <div
            className="glass-card glass-card-glow"
            style={{
              marginTop: 24,
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(var(--p-secondary-rgb), 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MessageCircle style={{ width: 22, height: 22, color: 'var(--p-secondary)' }} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: 'var(--text-90)' }}>Don&apos;t see a topic you want?</p>
              <p style={{ fontSize: 13, color: 'var(--text-50)', lineHeight: 1.5 }}>
                These are starting points. If there&apos;s a subject you&apos;d rather cover — or a format you have in mind — I&apos;ll build it.
              </p>
            </div>
          </div>
          </div>
        </section>
        <main style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>

        {/* ============ 6. THE DASHBOARD ============ */}
        <section id="dashboard" className="proposal-section animate-fadeInUp" style={{ scrollMarginTop: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="pill-badge" style={{ background: 'rgba(var(--p-primary-rgb), 0.15)', border: '1px solid rgba(var(--p-primary-rgb), 0.3)', color: 'var(--p-primary)', marginBottom: 16 }}>
              <BarChart3 style={{ width: 14, height: 14 }} />
              The Dashboard
            </span>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, marginTop: 16 }}>
              Know what&apos;s working. <span className="gradient-text">Adjust what isn&apos;t.</span>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-50)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
              No more guessing if your content is doing its job.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            <div className="glass-card" style={{ padding: 28, textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(var(--p-primary-rgb), 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Calendar style={{ width: 26, height: 26, color: 'var(--p-primary)' }} />
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-90)' }}>Planned</p>
              <p style={{ fontSize: 14, color: 'var(--text-50)', lineHeight: 1.5 }}>
                See exactly what&apos;s going out and when. No surprises.
              </p>
            </div>

            <div className="glass-card" style={{ padding: 28, textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(var(--p-accent-rgb), 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <TrendingUp style={{ width: 26, height: 26, color: 'var(--p-accent)' }} />
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-90)' }}>Tracked</p>
              <p style={{ fontSize: 14, color: 'var(--text-50)', lineHeight: 1.5 }}>
                Metrics per post: reach, saves, shares. See what resonates.
              </p>
            </div>

            <div className="glass-card" style={{ padding: 28, textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(var(--p-secondary-rgb), 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Sparkles style={{ width: 26, height: 26, color: 'var(--p-secondary)' }} />
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-90)' }}>Adjusted</p>
              <p style={{ fontSize: 14, color: 'var(--text-50)', lineHeight: 1.5 }}>
                Monthly review to double down on what works, drop what doesn&apos;t.
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: 20, maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 15, color: 'var(--text-70)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--p-accent)' }}>Reduce uncertainty.</strong> You&apos;ll always know what&apos;s scheduled, how it performed, and what we&apos;re changing.
            </p>
          </div>
        </section>

        {/* ============ 7. LIVE STATS (from Strategy App) ============ */}
        <section className="proposal-section animate-fadeInUp">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="pill-badge pill-badge-accent" style={{ marginBottom: 16 }}>
              <TrendingUp style={{ width: 14, height: 14 }} />
              Live Results
            </span>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, marginTop: 16 }}>
              What this system tracks <span className="gradient-text-accent">for me</span>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-50)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
              Real data from my own Instagram — the same tracking you&apos;ll get.
            </p>
          </div>

          {statsLoading ? (
            <div className="glass-card" style={{ padding: 48, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
              <div style={{ width: 32, height: 32, border: '3px solid var(--glass-border)', borderTopColor: 'var(--p-accent)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
              <p style={{ color: 'var(--text-50)' }}>Loading live stats...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : liveStats ? (
            <>
              {/* Main stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
                  <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--p-primary)', marginBottom: 4 }}>
                    {liveStats.headline?.totalReachFormatted || '—'}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-50)', textTransform: 'uppercase', letterSpacing: 1 }}>Total Reach</p>
                </div>
                <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
                  <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--p-secondary)', marginBottom: 4 }}>
                    {liveStats.headline?.videoViewsFormatted || '—'}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-50)', textTransform: 'uppercase', letterSpacing: 1 }}>Video Views</p>
                </div>
                <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
                  <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--p-accent)', marginBottom: 4 }}>
                    {liveStats.headline?.engagementRate || '—'}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-50)', textTransform: 'uppercase', letterSpacing: 1 }}>Engagement</p>
                </div>
                <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
                  <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--p-warm)', marginBottom: 4 }}>
                    {liveStats.headline?.totalPosts || '—'}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-50)', textTransform: 'uppercase', letterSpacing: 1 }}>Posts Tracked</p>
                </div>
              </div>

              {/* Top performer + Recent activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Top Performer */}
                {liveStats.topPosts?.byReach?.[0] && (
                  <div className="glass-card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--p-accent)' }} />
                      <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--p-accent)' }}>
                        Top Performer
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-70)', lineHeight: 1.5, marginBottom: 12, fontStyle: 'italic' }}>
                      &ldquo;{liveStats.topPosts.byReach[0].caption?.slice(0, 80) || 'No caption'}...&rdquo;
                    </p>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Eye style={{ width: 14, height: 14, color: 'var(--text-50)' }} />
                        <span style={{ fontSize: 13, color: 'var(--text-70)' }}>
                          {liveStats.topPosts.byReach[0].metrics?.reach?.toLocaleString() || '—'} reach
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Heart style={{ width: 14, height: 14, color: 'var(--text-50)' }} />
                        <span style={{ fontSize: 13, color: 'var(--text-70)' }}>
                          {liveStats.topPosts.byReach[0].metrics?.engagement?.toLocaleString() || '—'} engagement
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                {liveStats.recent && (
                  <div className="glass-card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--p-primary)' }} />
                      <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--p-primary)' }}>
                        Last 30 Days
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-90)' }}>
                        {liveStats.recent.posts || 0}
                      </span>
                      <span style={{ fontSize: 15, color: 'var(--text-50)' }}>posts</span>
                      <span style={{ fontSize: 15, color: 'var(--text-30)' }}>→</span>
                      <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--p-primary)' }}>
                        {liveStats.recent.reachFormatted || '0'}
                      </span>
                      <span style={{ fontSize: 15, color: 'var(--text-50)' }}>reach</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-50)' }}>
                      Avg {liveStats.averages?.reachPerPostFormatted || '—'} reach per post
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="glass-card" style={{ padding: 32, textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
              <p style={{ color: 'var(--text-50)' }}>Stats unavailable right now. Check back later!</p>
            </div>
          )}
        </section>

        {/* Expanded Carousel Modal */}
        {expandedCarousel !== null && (
          <CarouselModalNew
            agent={agent}
            item={CAROUSEL_SHOWCASE.find(c => c.id === expandedCarousel)!}
            currentFrame={carouselFrames[expandedCarousel] || 0}
            onFrameChange={(f) => setCarouselFrames(prev => ({ ...prev, [expandedCarousel]: f }))}
            onClose={() => setExpandedCarousel(null)}
            fontsReady={fontsReady}
          />
        )}

        {/* ============ 6. THE OFFER ============ */}
        <section id="pricing" className="proposal-section animate-fadeInUp" style={{ paddingBottom: 80, scrollMarginTop: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="pill-badge pill-badge-accent" style={{ marginBottom: 16 }}>
              <Target style={{ width: 14, height: 14 }} />
              The Offer
            </span>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginTop: 16 }}>
              Choose what fits
            </h2>
          </div>

          {/* Hero row: Full Package + Calendar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1000px] mx-auto mb-8">
            {/* Full Package - Hero Card */}
            <div
              className="glass-card glow-accent"
              style={{
                padding: '40px 32px 32px',
                textAlign: 'center',
                position: 'relative',
                border: '2px solid var(--p-accent)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -14,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, var(--p-accent), #059669)',
                  color: '#fff',
                  padding: '6px 20px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  whiteSpace: 'nowrap',
                }}
              >
                Best Value
              </div>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--p-accent), #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#fff',
                  margin: '12px auto 16px',
                }}
              >
                ALL
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Full Package</h3>
              <p style={{ color: 'var(--text-50)', fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>
                Everything. Listings discounted to <strong style={{ color: 'var(--p-accent)' }}>${proposal.listingGraphicsPrice - proposal.bundleSavings}</strong>.
              </p>
              <p style={{ fontSize: 38, fontWeight: 700 }}>
                <span className="gradient-text-accent">${proposal.bundlePrice}</span>
                <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--text-50)' }}>/mo</span>
              </p>
              <p style={{ fontSize: 12, color: 'var(--p-accent)', fontWeight: 600, marginBottom: 20 }}>Save ${proposal.bundleSavings} on listings</p>

              {/* Benefits checklist */}
              <div
                style={{
                  background: 'rgba(var(--p-accent-rgb), 0.1)',
                  borderRadius: 10,
                  padding: 16,
                  textAlign: 'left',
                  marginBottom: 20,
                }}
              >
                <div style={{ display: 'grid', gap: 10 }}>
                  {['Never scramble for listing graphics', 'Consistent posting twice a week', 'Content planned monthly', 'Performance tracked', 'Strategy adjusted monthly'].map((benefit, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--p-accent)', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'var(--text-70)' }}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {proposal.stripeFullPackageUrl && (
                <a
                  href={proposal.stripeFullPackageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proposal-cta"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Get Started
                  <ArrowRight style={{ width: 18, height: 18 }} />
                </a>
              )}
            </div>

            {/* Calendar Card */}
            <div
              className="glass-card glow-primary"
              style={{
                padding: '40px 32px 32px',
                position: 'relative',
                border: '2px solid var(--p-primary)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -14,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, var(--p-primary), var(--p-secondary))',
                  color: '#fff',
                  padding: '6px 20px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  whiteSpace: 'nowrap',
                }}
              >
                Your October
              </div>

              {/* Mini calendar grid */}
              <div className="mini-calendar" style={{ marginBottom: 16 }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: 'var(--text-50)', padding: 4 }}>
                    {d}
                  </div>
                ))}
                {[null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day, i) => {
                  const isCarousel = day && [1, 6, 8, 13, 15, 20, 22, 27, 29].includes(day);
                  const isListing = day && [3, 14, 24].includes(day);
                  return (
                    <div
                      key={i}
                      className="mini-calendar-day"
                      style={{
                        background: isCarousel ? 'var(--p-primary)' : isListing ? agent.theme.accent : day ? 'var(--glass-hover)' : 'transparent',
                        fontWeight: isCarousel || isListing ? 700 : 400,
                        color: isCarousel ? '#fff' : isListing ? '#000' : 'var(--text-50)',
                      }}
                    >
                      {day || ''}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--p-primary)' }} />
                  <span style={{ fontSize: 11, color: 'var(--text-50)' }}>Carousel</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: agent.theme.accent }} />
                  <span style={{ fontSize: 11, color: 'var(--text-50)' }}>Your Listing</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[{ value: '8', label: 'Carousels' }, { value: '32-48', label: 'Frames' }, { value: '2×', label: 'Per Week' }].map((stat, i) => (
                  <div key={i} className="stat-box">
                    <p className="stat-box-value" style={{ color: 'var(--p-primary)' }}>{stat.value}</p>
                    <p className="stat-box-label">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Calendar, label: 'I schedule it' },
                  { icon: Sparkles, label: 'I create it' },
                  { icon: BarChart3, label: 'I track it' },
                  { icon: CheckCircle2, label: 'You approve' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--glass-hover)', borderRadius: 6 }}>
                    <item.icon style={{ width: 14, height: 14, color: 'var(--p-primary)', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-70)' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Individual options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[700px] mx-auto mb-10">
            {/* Answer Carousels */}
            <div
              className="glass-card"
              style={{
                padding: 24,
                textAlign: 'center',
                position: 'relative',
                border: '1px solid rgba(var(--p-primary-rgb), 0.3)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--p-primary)',
                  color: '#fff',
                  padding: '4px 14px',
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                New
              </div>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--p-primary), var(--p-secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#fff',
                  margin: '8px auto 12px',
                }}
              >
                {proposal.carouselsCount * proposal.carouselFramesMin}–{proposal.carouselsCount * proposal.carouselFramesMax}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Answer Carousels</h3>
              <p style={{ color: 'var(--text-50)', fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
                {proposal.carouselsCount} carousels/month
              </p>
              <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--p-primary)' }}>${proposal.carouselsPrice}<span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-50)' }}>/mo</span></p>

              <div style={{ marginTop: 16, textAlign: 'left', padding: '12px 0', borderTop: '1px solid var(--glass-border)', marginBottom: 16 }}>
                {['Twice a week posts', 'Metrics tracked per post', 'Monthly performance review', 'No content creation work'].map((benefit, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < 3 ? 8 : 0 }}>
                    <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--p-primary)', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-70)' }}>{benefit}</span>
                  </div>
                ))}
              </div>

              {proposal.stripeCarouselsUrl && (
                <a
                  href={proposal.stripeCarouselsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 20px',
                    background: 'var(--p-primary)',
                    color: '#fff',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  Get Started
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </a>
              )}
            </div>

            {/* Listing Graphics */}
            <div
              className="glass-card"
              style={{
                padding: 24,
                textAlign: 'center',
                position: 'relative',
                border: `1px solid ${agent.theme.accent}50`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: agent.theme.accent,
                  color: '#000',
                  padding: '4px 14px',
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Current
              </div>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: agent.theme.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#000',
                  margin: '8px auto 12px',
                }}
              >
                {proposal.listingGraphicsCount}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Listing Graphics</h3>
              <p style={{ color: 'var(--text-50)', fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
                Per pack, use as needed
              </p>
              <p style={{ fontSize: 28, fontWeight: 700, color: agent.theme.accent }}>${proposal.listingGraphicsPrice}<span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-50)' }}>/pack</span></p>

              <div style={{ marginTop: 16, textAlign: 'left', padding: '12px 0', borderTop: '1px solid var(--glass-border)', marginBottom: 16 }}>
                {['New listing announcements', 'Just sold celebrations', 'Open house promos', 'Price change updates'].map((benefit, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < 3 ? 8 : 0 }}>
                    <CheckCircle2 style={{ width: 14, height: 14, color: agent.theme.accent, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-70)' }}>{benefit}</span>
                  </div>
                ))}
              </div>

              {proposal.stripeListingsUrl && (
                <a
                  href={proposal.stripeListingsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 20px',
                    background: agent.theme.accent,
                    color: '#000',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  Get Started
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </a>
              )}
            </div>
          </div>

          {/* Closing message */}
          <div style={{ textAlign: 'center' }}>
            <div className="glass-card" style={{ padding: 32, maxWidth: 500, margin: '0 auto' }}>
              <Sparkles style={{ width: 28, height: 28, color: 'var(--p-accent)', margin: '0 auto 16px' }} />
              <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-90)', marginBottom: 8 }}>
                The journey to improving your online presence continues here.
              </p>
              <p style={{ fontSize: 14, color: 'var(--text-50)' }}>
                Pick a package above and let&apos;s get started.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Floating CTA - appears and pulses as user scrolls */}
      <a
        href={proposal.stripeFullPackageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`sticky-cta ${showFloatingCta ? 'visible' : ''} ${ctaPulse ? 'pulse' : ''}`}
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#fff',
          background: 'linear-gradient(135deg, var(--p-accent), #059669)',
          padding: '14px 24px',
          borderRadius: 50,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
        }}
      >
        Get Started
        <ArrowRight style={{ width: 16, height: 16 }} />
      </a>
    </div>
  );
}

// ============ COMPONENTS ============

function ProposalCalendar({ posts, accentColor }: { posts: CalendarPost[]; accentColor: string }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const startDay = 4;
  const totalDays = 31;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let i = 1; i <= totalDays; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);

  const postsByDay = new Map<number, CalendarPost>();
  posts.forEach(p => postsByDay.set(p.day, p));

  const getPostColor = (type: string) => {
    switch (type) {
      case 'listing': return accentColor;
      case 'carousel': return 'var(--p-primary)';
      case 'stats': return 'var(--p-secondary)';
      default: return 'var(--text-50)';
    }
  };

  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--glass-hover)', borderBottom: '1px solid var(--glass-border)' }}>
        {days.map(d => (
          <div key={d} style={{ padding: 12, textAlign: 'center', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-50)' }}>
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {cells.map((day, i) => {
          const post = day ? postsByDay.get(day) : null;
          return (
            <div
              key={i}
              style={{
                minHeight: 80,
                padding: 8,
                borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid var(--glass-border)',
                borderBottom: '1px solid var(--glass-border)',
                background: day ? 'transparent' : 'var(--glass-bg)',
              }}
            >
              {day && (
                <>
                  <div style={{ fontSize: 11, color: 'var(--text-50)', marginBottom: 6 }}>{day}</div>
                  {post && (
                    <div
                      style={{
                        padding: '6px 8px',
                        background: getPostColor(post.type),
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#fff',
                      }}
                    >
                      {post.label}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarLegend({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
      <span style={{ fontSize: 13, color: 'var(--text-50)' }}>{label}</span>
    </div>
  );
}

function FlowStep({ icon, label, sublabel, color }: { icon: React.ReactNode; label: string; sublabel: string; color: string }) {
  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 20px',
        minWidth: 140,
        border: `1px solid ${color}40`,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: `${color}25`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          marginBottom: 8,
        }}
      >
        {icon}
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, textAlign: 'center', color: 'var(--text-90)' }}>{label}</p>
      <p style={{ fontSize: 11, color: 'var(--text-50)', textAlign: 'center' }}>{sublabel}</p>
    </div>
  );
}

function toCarouselAgent(agent: Agent): CarouselAgent {
  return {
    name: agent.name,
    phone: agent.phone,
    email: agent.email,
    website: agent.website,
    brokerage: 'RE/MAX Harbourside',
    headshotUrl: agent.headshotUrl,
  };
}

function renderCarouselFrame(
  template: CarouselShowcaseItem['template'],
  agent: Agent,
  frameIndex: number,
) {
  const carouselAgent = toCarouselAgent(agent);

  switch (template) {
    case 'market-pulse':
      return <MarketPulseCarousel agent={carouselAgent} content={SAMPLE_MARKET_PULSE} frameIndex={frameIndex} />;
    case 'myth-vs-fact':
      return <MythVsFactCarousel agent={carouselAgent} content={SAMPLE_MYTH_VS_FACT} frameIndex={frameIndex} />;
    case 'client-questions':
      return <ClientQuestionsCarousel agent={carouselAgent} content={SAMPLE_CLIENT_QUESTIONS} frameIndex={frameIndex} />;
    case 'this-or-that':
      return <ThisOrThatCarousel agent={carouselAgent} content={SAMPLE_THIS_OR_THAT} frameIndex={frameIndex} />;
    case 'buyer-objections':
    default:
      return (
        <BuyerObjectionsCarousel
          agent={agent as any}
          carousel={SAMPLE_BUYER_OBJECTIONS as any}
          frameIndex={frameIndex}
          totalFrames={6}
        />
      );
  }
}

function CarouselPreviewNew({
  agent,
  item,
  currentFrame,
  onFrameChange,
  onExpand,
  fontsReady,
}: {
  agent: Agent;
  item: CarouselShowcaseItem;
  currentFrame: number;
  onFrameChange: (f: number) => void;
  onExpand: () => void;
  fontsReady: boolean;
}) {
  const scale = 200 / 1080;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          onClick={(e) => { e.stopPropagation(); onFrameChange(Math.max(0, currentFrame - 1)); }}
          disabled={currentFrame === 0}
          className="glass-card"
          style={{
            position: 'absolute',
            left: -16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: 'none',
            cursor: currentFrame === 0 ? 'not-allowed' : 'pointer',
            opacity: currentFrame === 0 ? 0.3 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <ChevronLeft style={{ width: 18, height: 18, color: 'var(--text-90)' }} />
        </button>

        <div
          onClick={onExpand}
          style={{
            width: 1080 * scale,
            height: 1350 * scale,
            overflow: 'hidden',
            borderRadius: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            opacity: fontsReady ? 1 : 0.5,
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <div style={{ width: 1080, height: 1350, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
            {renderCarouselFrame(item.template, agent, currentFrame)}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Maximize2 style={{ width: 14, height: 14, color: '#fff' }} />
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onFrameChange(Math.min(item.frames - 1, currentFrame + 1)); }}
          disabled={currentFrame === item.frames - 1}
          className="glass-card"
          style={{
            position: 'absolute',
            right: -16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: 'none',
            cursor: currentFrame === item.frames - 1 ? 'not-allowed' : 'pointer',
            opacity: currentFrame === item.frames - 1 ? 0.3 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <ChevronRight style={{ width: 18, height: 18, color: 'var(--text-90)' }} />
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
        {Array.from({ length: item.frames }, (_, i) => (
          <button
            key={i}
            onClick={() => onFrameChange(i)}
            style={{
              width: i === currentFrame ? 20 : 8,
              height: 8,
              borderRadius: 4,
              border: 'none',
              background: i === currentFrame ? item.color : 'var(--glass-border)',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.15s ease',
            }}
          />
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <span
          style={{
            padding: '3px 8px',
            background: `${item.color}20`,
            border: `1px solid ${item.color}50`,
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 600,
            color: item.color,
            marginBottom: 6,
            display: 'inline-block',
          }}
        >
          {item.label}
        </span>
        <p style={{ fontSize: 13, fontWeight: 600, marginTop: 6, color: 'var(--text-90)' }}>{item.title}</p>
        <p style={{ fontSize: 11, color: 'var(--text-50)' }}>{item.subtitle}</p>
      </div>
    </div>
  );
}

function CarouselModalNew({
  agent,
  item,
  currentFrame,
  onFrameChange,
  onClose,
  fontsReady,
}: {
  agent: Agent;
  item: CarouselShowcaseItem;
  currentFrame: number;
  onFrameChange: (f: number) => void;
  onClose: () => void;
  fontsReady: boolean;
}) {
  const scale = 380 / 1080;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') onFrameChange(Math.max(0, currentFrame - 1));
    if (e.key === 'ArrowRight') onFrameChange(Math.min(item.frames - 1, currentFrame + 1));
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 40,
      }}
    >
      <button
        onClick={onClose}
        className="glass-card"
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X style={{ width: 24, height: 24, color: '#fff' }} />
      </button>

      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <span
          style={{
            padding: '4px 12px',
            background: `${item.color}30`,
            border: `1px solid ${item.color}`,
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            color: item.color,
            marginBottom: 12,
            display: 'inline-block',
          }}
        >
          {item.label}
        </span>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4, marginTop: 12 }}>{item.title}</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{item.subtitle}</p>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'flex', alignItems: 'center', gap: 24 }}
      >
        <button
          onClick={() => onFrameChange(Math.max(0, currentFrame - 1))}
          disabled={currentFrame === 0}
          className="glass-card"
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: 'none',
            cursor: currentFrame === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: currentFrame === 0 ? 0.3 : 1,
          }}
        >
          <ChevronLeft style={{ width: 28, height: 28, color: '#fff' }} />
        </button>

        <div
          style={{
            width: 1080 * scale,
            height: 1350 * scale,
            overflow: 'hidden',
            borderRadius: 12,
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            opacity: fontsReady ? 1 : 0.5,
          }}
        >
          <div style={{ width: 1080, height: 1350, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            {renderCarouselFrame(item.template, agent, currentFrame)}
          </div>
        </div>

        <button
          onClick={() => onFrameChange(Math.min(item.frames - 1, currentFrame + 1))}
          disabled={currentFrame === item.frames - 1}
          className="glass-card"
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: 'none',
            cursor: currentFrame === item.frames - 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: currentFrame === item.frames - 1 ? 0.3 : 1,
          }}
        >
          <ChevronRight style={{ width: 28, height: 28, color: '#fff' }} />
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
        {Array.from({ length: item.frames }, (_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); onFrameChange(i); }}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: i === currentFrame ? item.color : 'rgba(255,255,255,0.1)',
              color: i === currentFrame ? '#fff' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
        Use arrow keys to navigate • Click outside to close
      </p>
    </div>
  );
}
