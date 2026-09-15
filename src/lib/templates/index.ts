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

export const CAROUSEL_REGISTRY: Record<string, CarouselRegistryEntry> = {
  'buyer-objections': {
    type: 'buyer-objections',
    name: 'Buyer Objections',
    kind: 'carousel',
    category: 'content',
    frameSize: PORTRAIT,
    frameCount: 'variable', // cover + N slides + closing
    component: BuyerObjectionsCarousel,
    contentFields: ['kicker', 'title'],
    frameFields: ['number', 'icon', 'title', 'body'],
    alternatingGrounds: true,
    blurb: 'Swipeable carousel addressing common buyer concerns. 7 frames: cover, 5 objections, closing.',
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
