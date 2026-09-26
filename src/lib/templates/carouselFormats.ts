// Syntellic carousel formats: content types + registry entries.
// See CAROUSEL_FORMATS.md for frame-by-frame layout.

export type ImageSlotType = 'landscape' | 'property' | 'map' | 'headshot' | 'community' | 'chart';
export type Tone = 'light' | 'dark' | 'red';

export interface ImageSlot {
  type: ImageSlotType;
  src?: string;
  overlay?: 'none' | 'navy' | 'gradient';
  focal?: { x: number; y: number }; // 0–1, for object-position
}

export interface CarouselAgent {
  name: string;
  phone: string;
  email: string;
  website: string;
  brokerage: string; // "RE/MAX Harbourside"
  headshotUrl?: string; // transparent PNG, render as CSS background
}

export interface Theme { navy: string; paper: string; red: string; }

export interface MarketPulseContent {
  kicker: string;
  hero: ImageSlot;
  headline: { value: string; label: string };
  stats: Array<{ value: string; label: string; delta?: number; series?: number[]; meaning: string; source: string }>; // 3
  close: { buyers: string; sellers: string; cta: string };
}

export interface NeighbourhoodGuideContent {
  place: string;
  region: string;
  cover: ImageSlot;
  map: ImageSlot | { svgOutline: true; pin: { x: number; y: number } };
  driveTimes: Array<{ to: string; minutes: number }>;
  qa: Array<{ q: string; a: string; image: ImageSlot }>; // 4
  priceRange: string;
  cta: string;
}

export interface ProcessTimelineContent {
  title: string;
  totalTimeline: string;
  panorama: ImageSlot; // spans frames 1–3
  steps: Array<{ title: string; q: string; a: string; duration: string; icon?: string }>; // 8
  cta: string;
}

export interface MythVsFactContent {
  title: string;
  items: Array<{ myth: string; fact: string; beforeAfter?: [ImageSlot, ImageSlot] }>; // 4
  cta: string;
}

export interface ClientQuestionsContent {
  title: string;
  questions: Array<{ q: string; a: string }>; // 3
  testimonial: { quote: string; client: string; town: string; image: ImageSlot };
  cta: string;
}

export interface ThisOrThatContent {
  a: { label: string; image: ImageSlot };
  b: { label: string; image: ImageSlot };
  rows: Array<{ criterion: string; a: string; b: string; winner?: 'a' | 'b' | 'tie' }>; // 5
  cta: string;
}

export interface CarouselFormat {
  id: string;
  kind: 'carousel';
  size: '1080x1350';
  frames: number;
  day: 'tue' | 'wed';
  audience: 'buyers' | 'sellers' | 'both';
  imageSlots: ImageSlotType[];
  tones: Tone[]; // per frame
  sampleTopics: string[];
  ported: boolean;
}

export const CAROUSEL_FORMATS: CarouselFormat[] = [
  { id: 'MarketPulseCarousel', kind: 'carousel', size: '1080x1350', frames: 5, day: 'wed', audience: 'both',
    imageSlots: ['landscape', 'chart'], tones: ['dark', 'light', 'dark', 'light', 'dark'],
    sampleTopics: ['PEI Q3 market snapshot', 'Queens County inventory update'], ported: true },
  { id: 'NeighbourhoodGuideCarousel', kind: 'carousel', size: '1080x1350', frames: 7, day: 'wed', audience: 'buyers',
    imageSlots: ['community', 'map'], tones: ['dark', 'light', 'light', 'dark', 'light', 'dark', 'dark'],
    sampleTopics: ['Living in Stratford', 'Living in Cornwall', 'Living in North Rustico'], ported: true },
  { id: 'ProcessTimelineCarousel', kind: 'carousel', size: '1080x1350', frames: 10, day: 'tue', audience: 'buyers',
    imageSlots: ['landscape'], tones: ['dark', 'dark', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'dark'],
    sampleTopics: ['Buying in PEI: offer to keys', 'Selling in PEI: list to close'], ported: true },
  { id: 'MythVsFactCarousel', kind: 'carousel', size: '1080x1350', frames: 6, day: 'tue', audience: 'sellers',
    imageSlots: ['property'], tones: ['red', 'light', 'light', 'light', 'light', 'dark'],
    sampleTopics: ['5 seller myths', 'Pricing myths'], ported: true },
  { id: 'ClientQuestionsCarousel', kind: 'carousel', size: '1080x1350', frames: 5, day: 'tue', audience: 'both',
    imageSlots: ['headshot', 'property'], tones: ['light', 'dark', 'light', 'dark', 'dark'],
    sampleTopics: ['Questions I got this month', 'Non-resident buyer questions'], ported: true },
  { id: 'ThisOrThatCarousel', kind: 'carousel', size: '1080x1350', frames: 7, day: 'wed', audience: 'buyers',
    imageSlots: ['property', 'community'], tones: ['dark', 'light', 'dark', 'light', 'dark', 'light', 'dark'],
    sampleTopics: ['Cottage vs year-round home', 'Charlottetown condo vs Stratford house', 'Build vs buy'], ported: true },
  { id: 'BuyerObjectionsCarousel', kind: 'carousel', size: '1080x1350', frames: 7, day: 'tue', audience: 'buyers',
    imageSlots: ['headshot', 'landscape'], tones: ['light', 'light', 'dark', 'light', 'dark', 'light', 'dark'],
    sampleTopics: ['5 common buyer objections', 'First-time buyer concerns'], ported: true },
];
