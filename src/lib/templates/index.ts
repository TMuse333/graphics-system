import type { ComponentType } from 'react';
import type {
  TemplateProps,
  ContentTemplateProps,
  ContentFieldType,
  Variant,
} from '@/lib/types';
import type {
  RecurringConfig,
  LayoutPattern,
  CarouselRegistryEntry,
  CarouselTemplateProps,
} from '@/lib/types-carousel';

import { StyleBSquare } from './StyleBSquare';
import { Gen1Square } from './Gen1Square';
import { Gen1OpenHouse } from './Gen1OpenHouse';
import { ListingFlier } from './ListingFlier';
import { StyleBMosaic } from './StyleBMosaic';
import { StyleBFloatingCard } from './StyleBFloatingCard';
import { StyleBSplit } from './StyleBSplit';
import { StyleBTypePoster } from './StyleBTypePoster';
import { StyleBStatBoard } from './StyleBStatBoard';
import { StyleBAgentForward } from './StyleBAgentForward';
import { EducationCard } from './EducationCard';
import { MarketStats } from './MarketStats';
import { TestimonialCard } from './TestimonialCard';
// New templates from Claude Design (Chris Musial pitch)
import ComingSoon from './ComingSoon';
import ProcessExplainer from './ProcessExplainer';
import BuyerObjectionsCarousel from './BuyerObjectionsCarousel';

// Carousel imports
import MarketPulseCarousel, { SAMPLE_MARKET_PULSE } from './MarketPulseCarousel';
import NeighbourhoodGuideCarousel, { SAMPLE_NEIGHBOURHOOD_GUIDE } from './NeighbourhoodGuideCarousel';
import ProcessTimelineCarousel, { SAMPLE_PROCESS_TIMELINE } from './ProcessTimelineCarousel';
import MythVsFactCarousel, { SAMPLE_MYTH_VS_FACT } from './MythVsFactCarousel';
import ClientQuestionsCarousel, { SAMPLE_CLIENT_QUESTIONS } from './ClientQuestionsCarousel';
import ThisOrThatCarousel, { SAMPLE_THIS_OR_THAT } from './ThisOrThatCarousel';

// ============ REGISTRY TYPES ============

export type TemplateFieldType = 'date' | 'time' | 'badge' | 'blurb' | 'features' | 'location';

export type PhotoSlots = {
  hero?: number;            // exactly N required
  strip?: [number, number]; // [min, max] optional range
  sub?: [number, number];
  row?: [number, number];
};

/**
 * kind splits the registry in two:
 *   'listing' — needs a Listing, takes TemplateProps
 *   'content' — needs no property at all, takes ContentTemplateProps
 * The editor reads this to decide whether to show a listing picker or a
 * content form.
 */
export type TemplateKind = 'listing' | 'content';

export type TemplateRegistryEntry = {
  type: string;
  name: string;
  kind: TemplateKind;
  category: TemplateCategory;
  size: [number, number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>; // TemplateProps for listing, ContentTemplateProps for content
  variants: Variant[];
  photos: PhotoSlots;
  fields?: Partial<Record<Variant, TemplateFieldType[]>>;
  contentFields?: ContentFieldType[];
  requires?: ('acres' | 'beds' | 'baths')[];
  agents?: [number, number];
  /** Short line for the showcase; what this template is FOR. */
  blurb?: string;
  /** Layout pattern for design system consistency */
  layout?: LayoutPattern;
  /** Recurring content hints for Strategy App */
  recurring?: RecurringConfig;
};

export type TemplateCategory = 'social' | 'land' | 'openhouse' | 'print' | 'content';

// ============ CATEGORY METADATA ============

export const TEMPLATE_CATEGORIES: Record<TemplateCategory, { label: string; order: number }> = {
  social: { label: 'Social Square', order: 1 },
  land: { label: 'Land & Lots', order: 2 },
  openhouse: { label: 'Open House (Classic)', order: 3 },
  content: { label: 'Content & Community', order: 4 },
  print: { label: 'Print Flier', order: 5 },
};

const SQ: [number, number] = [1080, 1080];
const PORTRAIT: [number, number] = [1080, 1350];
const LISTING_VARIANTS: Variant[] = ['new-listing', 'open-house', 'coming-soon', 'price-drop', 'just-sold'];

// ============ SUB-REGISTRIES ============

const SOCIAL_REGISTRY: Record<string, TemplateRegistryEntry> = {
  'style-b-square': {
    type: 'style-b-square',
    name: 'Social Square',
    kind: 'listing',
    category: 'social',
    size: SQ,
    component: StyleBSquare,
    variants: LISTING_VARIANTS,
    photos: { hero: 1, strip: [0, 2] },
    fields: { 'open-house': ['date', 'time'], 'just-sold': ['badge'] },
    blurb: 'The workhorse listing post. Hero photo, price, address, agent band.',
  },
  'style-b-mosaic': {
    type: 'style-b-mosaic',
    name: 'Photo Mosaic',
    kind: 'listing',
    category: 'social',
    size: SQ,
    component: StyleBMosaic,
    variants: LISTING_VARIANTS,
    photos: { hero: 1, strip: [1, 3] },
    fields: { 'just-sold': ['badge'] },
    blurb: 'Four-up grid for listings where the photography is the selling point.',
  },
  'style-b-floating-card': {
    type: 'style-b-floating-card',
    name: 'Floating Card',
    kind: 'listing',
    category: 'social',
    size: SQ,
    component: StyleBFloatingCard,
    variants: LISTING_VARIANTS,
    photos: { hero: 1 },
    fields: { 'open-house': ['date', 'time'] },
    blurb: 'White card over a darkened photo. The light option in a dark set.',
  },
  'style-b-split': {
    type: 'style-b-split',
    name: 'Split Vertical',
    kind: 'listing',
    category: 'social',
    size: SQ,
    component: StyleBSplit,
    variants: LISTING_VARIANTS,
    photos: { hero: 1 },
    blurb: 'Hard 50/50 divide. Photo one side, the full spec list the other.',
  },
  'coming-soon-nova': {
    type: 'coming-soon-nova',
    name: 'Coming Soon (Nova)',
    kind: 'listing',
    category: 'social',
    size: SQ,
    component: ComingSoon,
    variants: ['coming-soon'],
    photos: { hero: 1 },
    layout: 'sandwich',
    blurb: 'Sandwich layout listing announcement. Navy band, clean photo window, spec strip.',
  },
};

const LAND_REGISTRY: Record<string, TemplateRegistryEntry> = {
  'gen1-square': {
    type: 'gen1-square',
    name: 'Land & Lots',
    kind: 'listing',
    category: 'land',
    size: SQ,
    component: Gen1Square,
    variants: ['new-listing', 'price-drop', 'sold', 'featured'],
    photos: { hero: 1 },
    requires: ['acres'],
    blurb: 'Acreage and vacant lots, where there are no interiors to show.',
  },
};

const OPENHOUSE_REGISTRY: Record<string, TemplateRegistryEntry> = {
  'gen1-open-house': {
    type: 'gen1-open-house',
    name: 'Open House (Classic)',
    kind: 'listing',
    category: 'openhouse',
    size: SQ,
    component: Gen1OpenHouse,
    variants: ['open-house'],
    photos: { hero: 1, sub: [0, 2] },
    fields: { 'open-house': ['date', 'time', 'blurb'] },
    agents: [1, 2],
    blurb: 'Editorial layout with room for a description. Supports co-listing.',
  },
};

const CONTENT_REGISTRY: Record<string, TemplateRegistryEntry> = {
  'education-card': {
    type: 'education-card',
    name: 'Education',
    kind: 'content',
    category: 'content',
    size: PORTRAIT,
    component: EducationCard,
    variants: [],
    photos: {},
    contentFields: ['kicker', 'title', 'points', 'closing'],
    blurb: 'Numbered advice for buyers or sellers. Needs five points to fill the canvas.',
  },
  'market-stats': {
    type: 'market-stats',
    name: 'Market Report',
    kind: 'content',
    category: 'content',
    size: PORTRAIT,
    component: MarketStats,
    variants: [],
    photos: {},
    contentFields: ['kicker', 'title', 'subtitle', 'period', 'stats', 'closing', 'footnote'],
    blurb: 'Six figures for an area. Enter the numbers once, render per agent.',
    layout: 'sandwich',
    recurring: {
      frequency: 'monthly',
      description: 'Monthly market snapshot',
      suggestedDay: 1,
      requiresFreshData: true,
    },
  },
  'testimonial-card': {
    type: 'testimonial-card',
    name: 'Testimonial',
    kind: 'content',
    category: 'content',
    size: PORTRAIT,
    component: TestimonialCard,
    variants: [],
    photos: {},
    contentFields: ['kicker', 'title', 'quote', 'rating', 'attribution', 'attributionMeta'],
    blurb: 'Client quote with the outcome as the headline.',
  },
  'type-poster': {
    type: 'type-poster',
    name: 'Type Poster',
    kind: 'content',
    category: 'content',
    size: SQ,
    component: StyleBTypePoster,
    variants: [],
    photos: {},
    contentFields: ['quote', 'emphasis', 'attribution', 'attributionMeta'],
    blurb: 'Type only. The post for a day with no listing and no photography.',
  },
  'stat-board': {
    type: 'stat-board',
    name: 'Stat Board',
    kind: 'content',
    category: 'content',
    size: SQ,
    component: StyleBStatBoard,
    variants: [],
    photos: {},
    contentFields: ['kicker', 'title', 'period', 'stats'],
    blurb: 'Square market snapshot. Four figures, capped on purpose.',
    recurring: {
      frequency: 'monthly',
      description: 'Monthly market stats (square format)',
      suggestedDay: 1,
      requiresFreshData: true,
    },
  },
  'agent-forward': {
    type: 'agent-forward',
    name: 'Agent Intro',
    kind: 'content',
    category: 'content',
    size: SQ,
    component: StyleBAgentForward,
    variants: [],
    photos: {},
    contentFields: ['kicker', 'title'],
    blurb: 'Headshot as the subject. Intro posts and brokerage recruiting.',
  },
  'process-explainer': {
    type: 'process-explainer',
    name: 'Process Explainer',
    kind: 'content',
    category: 'content',
    size: PORTRAIT,
    component: ProcessExplainer,
    variants: [],
    photos: {},
    contentFields: ['kicker', 'title', 'subtitle', 'points'],
    layout: 'sandwich',
    blurb: 'Sandwich layout: navy title band, photo, numbered step stack. Great for buying/selling guides.',
  },
};

const PRINT_REGISTRY: Record<string, TemplateRegistryEntry> = {
  'listing-flier': {
    type: 'listing-flier',
    name: 'Print Flier',
    kind: 'listing',
    category: 'print',
    size: [1080, 1620],
    component: ListingFlier,
    variants: ['new-listing'],
    photos: { hero: 1, row: [2, 3] },
    fields: { 'new-listing': ['blurb', 'features', 'location'] },
    blurb: 'Letterbox-ready print piece. The only light-ground listing template.',
    layout: 'sandwich',
  },
};

// ============ CAROUSEL REGISTRY ============
// Carousels are multi-frame content - separate from single-image templates

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

export const CAROUSEL_REGISTRY: Record<string, CarouselRegistryEntry> = {
  'buyer-objections': {
    type: 'buyer-objections',
    name: 'Buyer Guide',
    kind: 'carousel',
    category: 'content',
    frameSize: PORTRAIT,
    frameCount: 'variable',
    component: BuyerObjectionsCarousel,
    contentFields: ['kicker', 'title'],
    frameFields: ['number', 'icon', 'title', 'body'],
    alternatingGrounds: true,
    blurb: 'Address common buyer concerns and objections with clear answers.',
    icon: 'HelpCircle',
    color: '#3b82f6',
    day: 'tue',
    audience: 'buyers',
    sampleData: SAMPLE_BUYER_OBJECTIONS,
    questions: [
      { id: 'topic', type: 'text', label: 'What topic or objection type?', placeholder: 'e.g., "Conditional Offers", "Financing Concerns"', required: true },
      { id: 'objections', type: 'textarea', label: 'What objections or concerns do buyers have? (one per line)', placeholder: 'What if my financing falls through?\nWhat if the inspection finds problems?', required: true },
      { id: 'responses', type: 'textarea', label: 'How do you respond to each? (one per line)', placeholder: 'A financing condition protects you...\nAn inspection condition lets you...' },
    ],
  },

  'market-pulse': {
    type: 'market-pulse',
    name: 'Market Stats',
    kind: 'carousel',
    category: 'content',
    frameSize: PORTRAIT,
    frameCount: 5,
    component: MarketPulseCarousel,
    contentFields: ['kicker', 'title', 'stats'],
    frameFields: ['title', 'body'],
    alternatingGrounds: true,
    blurb: 'Local market updates - average prices, days on market, trends.',
    icon: 'TrendingUp',
    color: '#10b981',
    day: 'thu',
    audience: 'both',
    sampleData: SAMPLE_MARKET_PULSE,
    questions: [
      { id: 'areas', type: 'multi-select', label: 'Which areas should we cover?', options: ['Charlottetown', 'Stratford', 'Cornwall', 'Summerside', 'North Shore', 'South Shore', 'Western PEI'] },
      { id: 'metrics', type: 'multi-select', label: 'What metrics matter most?', options: ['Average price', 'Days on market', 'Inventory levels', 'Price trends', 'Sales volume', 'New listings'] },
      { id: 'timeframe', type: 'select', label: 'What timeframe?', options: ['This month', 'This quarter', 'Year over year'] },
      { id: 'insights', type: 'textarea', label: 'Any specific insights or commentary?', placeholder: 'e.g., "Inventory is tight in Stratford right now..."' },
    ],
  },

  'neighbourhood-guide': {
    type: 'neighbourhood-guide',
    name: 'Neighbourhood Guide',
    kind: 'carousel',
    category: 'content',
    frameSize: PORTRAIT,
    frameCount: 7,
    component: NeighbourhoodGuideCarousel,
    contentFields: ['kicker', 'title'],
    frameFields: ['title', 'body'],
    alternatingGrounds: true,
    blurb: 'Spotlight local areas - what makes them special, price ranges, lifestyle.',
    icon: 'Map',
    color: '#f59e0b',
    day: 'wed',
    audience: 'buyers',
    sampleData: SAMPLE_NEIGHBOURHOOD_GUIDE,
    questions: [
      { id: 'neighbourhood', type: 'text', label: 'Which neighbourhood or area?', placeholder: 'e.g., Stratford, Cornwall, North Rustico', required: true },
      { id: 'highlights', type: 'multi-select', label: 'What makes this area special?', options: ['Schools', 'Beaches', 'Restaurants', 'Shopping', 'Parks', 'Golf courses', 'Healthcare', 'Commute to Charlottetown'] },
      { id: 'priceRange', type: 'text', label: 'Typical price range?', placeholder: 'e.g., $350K - $550K' },
      { id: 'bestFor', type: 'textarea', label: 'Who is this area best for?', placeholder: 'e.g., "Young families looking for newer builds..."' },
    ],
  },

  'process-timeline': {
    type: 'process-timeline',
    name: 'Process Timeline',
    kind: 'carousel',
    category: 'content',
    frameSize: PORTRAIT,
    frameCount: 10,
    component: ProcessTimelineCarousel,
    contentFields: ['kicker', 'title'],
    frameFields: ['number', 'title', 'body'],
    alternatingGrounds: true,
    blurb: 'Walk through the buying or selling process step by step.',
    icon: 'Clock',
    color: '#6366f1',
    day: 'tue',
    audience: 'buyers',
    sampleData: SAMPLE_PROCESS_TIMELINE,
    questions: [
      { id: 'process', type: 'select', label: 'Which process are we explaining?', options: ['Buying a home', 'Selling a home', 'First-time buyer journey', 'Investment property purchase'], required: true },
      { id: 'commonQuestions', type: 'textarea', label: 'What questions do clients usually ask about this process?', placeholder: 'e.g., "How long does financing take?"' },
      { id: 'localTips', type: 'textarea', label: 'Any PEI-specific tips or timeline info?', placeholder: 'e.g., "Title searches in PEI typically take..."' },
    ],
  },

  'myth-vs-fact': {
    type: 'myth-vs-fact',
    name: 'Myth vs Fact',
    kind: 'carousel',
    category: 'content',
    frameSize: PORTRAIT,
    frameCount: 6,
    component: MythVsFactCarousel,
    contentFields: ['kicker', 'title'],
    frameFields: ['title', 'body'],
    alternatingGrounds: true,
    blurb: 'Bust common misconceptions with facts.',
    icon: 'Scale',
    color: '#ef4444',
    day: 'tue',
    audience: 'sellers',
    sampleData: SAMPLE_MYTH_VS_FACT,
    questions: [
      { id: 'audience', type: 'select', label: 'Who is this for?', options: ['Sellers', 'Buyers', 'First-time buyers', 'Investors'], required: true },
      { id: 'myths', type: 'textarea', label: 'What myths do you hear most often?', placeholder: 'e.g., "You need 20% down"\n"Spring is the only time to sell"', required: true },
      { id: 'facts', type: 'textarea', label: 'What are the actual facts?', placeholder: 'The truth behind each myth...' },
    ],
  },

  'client-questions': {
    type: 'client-questions',
    name: 'Client Q&A',
    kind: 'carousel',
    category: 'content',
    frameSize: PORTRAIT,
    frameCount: 5,
    component: ClientQuestionsCarousel,
    contentFields: ['kicker', 'title'],
    frameFields: ['title', 'body'],
    alternatingGrounds: true,
    blurb: 'Answer real questions from your clients.',
    icon: 'MessageCircle',
    color: '#8b5cf6',
    day: 'tue',
    audience: 'both',
    sampleData: SAMPLE_CLIENT_QUESTIONS,
    questions: [
      { id: 'theme', type: 'text', label: 'Theme or title for this Q&A?', placeholder: 'e.g., "Questions I Got This Month"' },
      { id: 'questions', type: 'textarea', label: 'What questions do you want to answer? (one per line)', placeholder: 'What\'s a conditional offer?\nHow much deposit do I need?', required: true },
      { id: 'answers', type: 'textarea', label: 'Your answers (one per line, matching order)', placeholder: 'A conditional offer means...\nTypically 5% of purchase price...' },
    ],
  },

  'this-or-that': {
    type: 'this-or-that',
    name: 'This or That',
    kind: 'carousel',
    category: 'content',
    frameSize: PORTRAIT,
    frameCount: 7,
    component: ThisOrThatCarousel,
    contentFields: ['kicker', 'title'],
    frameFields: ['title', 'body'],
    alternatingGrounds: true,
    blurb: 'Compare options - Condo vs House, Rural vs Urban, Build vs Buy.',
    icon: 'GitCompare',
    color: '#f59e0b',
    day: 'wed',
    audience: 'buyers',
    sampleData: SAMPLE_THIS_OR_THAT,
    questions: [
      { id: 'optionA', type: 'text', label: 'Option A', placeholder: 'e.g., Cottage', required: true },
      { id: 'optionB', type: 'text', label: 'Option B', placeholder: 'e.g., Year-round home', required: true },
      { id: 'comparisons', type: 'textarea', label: 'What factors should we compare? (one per line)', placeholder: 'Price range\nMaintenance\nRental potential' },
      { id: 'verdict', type: 'textarea', label: 'Your take - who should choose which?', placeholder: 'e.g., "Cottage if you want a getaway..."' },
    ],
  },
};

// ============ MAIN REGISTRY ============

export const TEMPLATE_REGISTRY: Record<string, TemplateRegistryEntry> = {
  ...SOCIAL_REGISTRY,
  ...LAND_REGISTRY,
  ...OPENHOUSE_REGISTRY,
  ...CONTENT_REGISTRY,
  ...PRINT_REGISTRY,
};

// ============ HELPERS ============

export function getTemplate(id: string): TemplateRegistryEntry | undefined {
  return TEMPLATE_REGISTRY[id];
}

export function getTemplatesByCategory(category: TemplateCategory): TemplateRegistryEntry[] {
  return Object.values(TEMPLATE_REGISTRY).filter(t => t.category === category);
}

export function getAllTemplates(): TemplateRegistryEntry[] {
  return Object.values(TEMPLATE_REGISTRY);
}

export function getTemplateIds(): string[] {
  return Object.keys(TEMPLATE_REGISTRY);
}

export function getListingTemplates(): TemplateRegistryEntry[] {
  return Object.values(TEMPLATE_REGISTRY).filter(t => t.kind === 'listing');
}

export function getContentTemplates(): TemplateRegistryEntry[] {
  return Object.values(TEMPLATE_REGISTRY).filter(t => t.kind === 'content');
}

export function getFieldsForVariant(templateId: string, variant: Variant): TemplateFieldType[] {
  const template = getTemplate(templateId);
  if (!template?.fields) return [];
  return template.fields[variant] || [];
}

// Field metadata for form generation
export const FIELD_METADATA: Record<TemplateFieldType, { label: string; type: 'text' | 'textarea' | 'list' }> = {
  date: { label: 'Date', type: 'text' },
  time: { label: 'Time', type: 'text' },
  badge: { label: 'Badge Text', type: 'text' },
  blurb: { label: 'Description', type: 'textarea' },
  features: { label: 'Features', type: 'list' },
  location: { label: 'Location Details', type: 'text' },
};

export const CONTENT_FIELD_METADATA: Record<
  ContentFieldType,
  { label: string; type: 'text' | 'textarea' | 'points' | 'stats' | 'number'; hint?: string }
> = {
  kicker: { label: 'Eyebrow', type: 'text' },
  title: { label: 'Headline', type: 'text', hint: 'Use | to split into two lines' },
  subtitle: { label: 'Subtitle', type: 'text' },
  period: { label: 'Period', type: 'text', hint: 'e.g. August 2026' },
  points: { label: 'Points', type: 'points', hint: 'Five recommended — four leaves a gap' },
  stats: { label: 'Statistics', type: 'stats', hint: 'First two render large' },
  quote: { label: 'Quote', type: 'textarea' },
  emphasis: { label: 'Emphasise', type: 'text', hint: 'Substring of the quote to accent' },
  attribution: { label: 'Attributed to', type: 'text' },
  attributionMeta: { label: 'Attribution detail', type: 'text' },
  rating: { label: 'Stars', type: 'number' },
  closing: { label: 'Closing line', type: 'textarea' },
  footnote: { label: 'Footnote', type: 'text', hint: 'Data source, legal line' },
};

// ============ CAROUSEL HELPERS ============

export function getCarouselTemplates(): CarouselRegistryEntry[] {
  return Object.values(CAROUSEL_REGISTRY);
}

export function getCarouselTemplate(id: string): CarouselRegistryEntry | undefined {
  return CAROUSEL_REGISTRY[id];
}

// ============ RECURRING CONTENT HELPERS ============

export function getRecurringTemplates(): TemplateRegistryEntry[] {
  return Object.values(TEMPLATE_REGISTRY).filter(t => t.recurring);
}

export function getTemplatesByFrequency(
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
): TemplateRegistryEntry[] {
  return Object.values(TEMPLATE_REGISTRY).filter(
    t => t.recurring?.frequency === frequency
  );
}

// ============ LAYOUT PATTERN HELPERS ============

export function getTemplatesByLayout(layout: LayoutPattern): TemplateRegistryEntry[] {
  return Object.values(TEMPLATE_REGISTRY).filter(t => t.layout === layout);
}

/**
 * Strategy App integration point:
 * Returns metadata about all recurring content for scheduling suggestions.
 */
export function getRecurringContentManifest(): {
  templateId: string;
  name: string;
  frequency: string;
  description: string;
  suggestedDay?: number;
  requiresFreshData?: boolean;
}[] {
  return getRecurringTemplates().map(t => ({
    templateId: t.type,
    name: t.name,
    frequency: t.recurring!.frequency,
    description: t.recurring!.description,
    suggestedDay: t.recurring!.suggestedDay,
    requiresFreshData: t.recurring!.requiresFreshData,
  }));
}
