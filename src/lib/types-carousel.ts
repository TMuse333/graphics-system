/**
 * Carousel & Multi-Frame Extensions
 *
 * Extends the template system to support:
 * 1. Carousels (multiple frames rendered from one template)
 * 2. Recurring content metadata (for Strategy App consumption)
 * 3. Layout patterns (sandwich, overlay, split)
 */

import type { Agent, ContentData, ContentFieldType } from './types';

// ============ CAROUSEL TYPES ============

/**
 * A carousel is a sequence of frames that share a visual system.
 * Each frame can have its own content but inherits shared styling.
 */
export type CarouselFrame = {
  id: string;                    // 'cover' | 'slide-1' | 'closing' etc.
  role: 'cover' | 'slide' | 'closing';
  content: CarouselFrameContent;
};

export type CarouselFrameContent = {
  // For slides with numbered objections/tips
  number?: number;
  icon?: string;                 // Lucide icon name
  title?: string;
  body?: string;

  // For cover/closing
  headline?: string;
  subhead?: string;
};

export type CarouselData = {
  // Shared across all frames
  kicker?: string;
  title?: string;
  subtitle?: string;

  // Frame-specific content
  frames: CarouselFrame[];

  // Optional shared elements
  backgroundImage?: string;      // e.g., city skyline
  accentColor?: string;          // override theme accent
};

export type CarouselTemplateProps = {
  agent: Agent;
  carousel: CarouselData;
  frameIndex: number;            // which frame to render (0-based)
  totalFrames: number;
};

// ============ RECURRING CONTENT ============

/**
 * Metadata for Strategy App to consume.
 * Listing-graphics doesn't schedule - it just declares "this is monthly content"
 */
export type RecurringConfig = {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  description: string;           // "Monthly market snapshot"
  suggestedDay?: number;         // 1 = 1st of month, 15 = mid-month
  requiresFreshData?: boolean;   // true = needs new stats each time
};

// ============ LAYOUT PATTERNS ============

/**
 * Layout patterns encode design rules.
 *
 * 'sandwich': Header → Photo (never overlaid) → Specs → Footer
 * 'overlay':  Content floats over photo
 * 'split':    50/50 divide between photo and content
 * 'card':     Content in a card over darkened photo
 * 'full':     Photo fills canvas, minimal text overlay
 */
export type LayoutPattern = 'sandwich' | 'overlay' | 'split' | 'card' | 'full';

// ============ EXTENDED REGISTRY ENTRY ============

export type CarouselRegistryEntry = {
  type: string;
  name: string;
  kind: 'carousel';
  category: 'content';           // carousels are always content (for now)
  frameSize: [number, number];   // size of each frame
  frameCount: number | 'variable'; // fixed count or determined by content
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;

  // Content fields for the carousel editor
  contentFields: ContentFieldType[];
  frameFields: (keyof CarouselFrameContent)[];

  // Design system
  layout?: LayoutPattern;
  alternatingGrounds?: boolean;  // light/dark/light rhythm

  // Strategy App hints
  recurring?: RecurringConfig;

  blurb?: string;
};

// ============ CONTENT GRAPHIC (for MongoDB) ============

/**
 * ContentGraphic is like Graphic but for content templates.
 * No listingId - instead has contentData.
 */
export type ContentGraphic = {
  _id?: string;
  agentId: string;
  templateId: string;
  content: ContentData;

  // For carousels
  isCarousel?: boolean;
  carouselData?: CarouselData;

  // Strategy App placeholders
  scheduledFor?: string;         // ISO date - Strategy App manages this
  recurring?: {
    frequency: 'monthly' | 'weekly';
    lastGenerated?: string;      // ISO date
  };

  createdAt: Date;
  updatedAt: Date;
};

// ============ CAROUSEL DATA BUILDERS ============

/**
 * Helper to create a Buyer Objections carousel structure
 */
export function createBuyerObjectionsCarousel(objections: {
  title: string;
  handling: string;
  icon?: string;
}[]): CarouselData {
  return {
    kicker: 'BUYER OBJECTIONS',
    title: 'How I Handle Common Concerns',
    frames: [
      {
        id: 'cover',
        role: 'cover',
        content: {
          headline: 'Buyer Objections',
          subhead: 'How I handle the most common concerns',
        },
      },
      ...objections.map((obj, i) => ({
        id: `slide-${i + 1}`,
        role: 'slide' as const,
        content: {
          number: i + 1,
          icon: obj.icon,
          title: obj.title,
          body: obj.handling,
        },
      })),
      {
        id: 'closing',
        role: 'closing',
        content: {
          headline: 'Ready to buy?',
          subhead: "Let's talk through your concerns",
        },
      },
    ],
  };
}

/**
 * Helper to create a Market Snapshot (recurring monthly)
 */
export function createMarketSnapshot(data: {
  period: string;
  stats: { label: string; value: string; delta?: string }[];
}): ContentData {
  return {
    kicker: 'MARKET UPDATE',
    title: data.period,
    period: data.period,
    stats: data.stats.map(s => ({
      value: s.value,
      label: s.label,
      delta: s.delta,
    })),
  };
}
