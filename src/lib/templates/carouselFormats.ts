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

export interface FormatQuestion {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'multi-select';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
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
  // Questions for agent to ask client
  questions?: FormatQuestion[];
}

export const CAROUSEL_FORMATS: CarouselFormat[] = [
  {
    id: 'MarketPulseCarousel', kind: 'carousel', size: '1080x1350', frames: 5, day: 'wed', audience: 'both',
    imageSlots: ['landscape', 'chart'], tones: ['dark', 'light', 'dark', 'light', 'dark'],
    sampleTopics: ['PEI Q3 market snapshot', 'Queens County inventory update'], ported: true,
    questions: [
      { id: 'areas', type: 'multi-select', label: 'Which areas should we cover?', options: ['Charlottetown', 'Stratford', 'Cornwall', 'Summerside', 'North Shore', 'South Shore', 'Western PEI'] },
      { id: 'metrics', type: 'multi-select', label: 'What metrics matter most to your audience?', options: ['Average price', 'Days on market', 'Inventory levels', 'Price trends', 'Sales volume', 'New listings'] },
      { id: 'timeframe', type: 'select', label: 'What timeframe?', options: ['This month', 'This quarter', 'Year over year'] },
      { id: 'insights', type: 'textarea', label: 'Any specific insights or commentary you want to include?', placeholder: 'e.g., "Inventory is tight in Stratford right now..."' }
    ]
  },
  {
    id: 'NeighbourhoodGuideCarousel', kind: 'carousel', size: '1080x1350', frames: 7, day: 'wed', audience: 'buyers',
    imageSlots: ['community', 'map'], tones: ['dark', 'light', 'light', 'dark', 'light', 'dark', 'dark'],
    sampleTopics: ['Living in Stratford', 'Living in Cornwall', 'Living in North Rustico'], ported: true,
    questions: [
      { id: 'neighbourhood', type: 'text', label: 'Which neighbourhood or area?', placeholder: 'e.g., Stratford, Cornwall, North Rustico', required: true },
      { id: 'highlights', type: 'multi-select', label: 'What makes this area special?', options: ['Schools', 'Beaches', 'Restaurants', 'Shopping', 'Parks', 'Golf courses', 'Healthcare', 'Commute to Charlottetown'] },
      { id: 'priceRange', type: 'text', label: 'Typical price range?', placeholder: 'e.g., $350K - $550K' },
      { id: 'bestFor', type: 'textarea', label: 'Who is this area best for?', placeholder: 'e.g., "Young families looking for newer builds with good schools nearby"' }
    ]
  },
  {
    id: 'ProcessTimelineCarousel', kind: 'carousel', size: '1080x1350', frames: 10, day: 'tue', audience: 'buyers',
    imageSlots: ['landscape'], tones: ['dark', 'dark', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'dark'],
    sampleTopics: ['Buying in PEI: offer to keys', 'Selling in PEI: list to close'], ported: true,
    questions: [
      { id: 'process', type: 'select', label: 'Which process are we explaining?', options: ['Buying a home', 'Selling a home', 'First-time buyer journey', 'Investment property purchase'], required: true },
      { id: 'commonQuestions', type: 'textarea', label: 'What questions do clients usually ask about this process?', placeholder: 'e.g., "How long does financing take?" "When do I get the keys?"' },
      { id: 'localTips', type: 'textarea', label: 'Any PEI-specific tips or timeline info?', placeholder: 'e.g., "Title searches in PEI typically take..."' }
    ]
  },
  {
    id: 'MythVsFactCarousel', kind: 'carousel', size: '1080x1350', frames: 6, day: 'tue', audience: 'sellers',
    imageSlots: ['property'], tones: ['red', 'light', 'light', 'light', 'light', 'dark'],
    sampleTopics: ['5 seller myths', 'Pricing myths'], ported: true,
    questions: [
      { id: 'audience', type: 'select', label: 'Who is this for?', options: ['Sellers', 'Buyers', 'First-time buyers', 'Investors'], required: true },
      { id: 'myths', type: 'textarea', label: 'What myths or misconceptions do you hear most often?', placeholder: 'e.g., "You need 20% down", "Spring is the only time to sell"', required: true },
      { id: 'facts', type: 'textarea', label: 'What are the actual facts you want to share?', placeholder: 'The truth behind each myth...' }
    ]
  },
  {
    id: 'ClientQuestionsCarousel', kind: 'carousel', size: '1080x1350', frames: 5, day: 'tue', audience: 'both',
    imageSlots: ['headshot', 'property'], tones: ['light', 'dark', 'light', 'dark', 'dark'],
    sampleTopics: ['Questions I got this month', 'Non-resident buyer questions'], ported: true,
    questions: [
      { id: 'theme', type: 'text', label: 'Theme or title for this Q&A?', placeholder: 'e.g., "Questions I Got This Month", "First-Time Buyer FAQs"' },
      { id: 'questions', type: 'textarea', label: 'What questions do you want to answer? (one per line)', placeholder: 'What\'s a conditional offer?\nHow much deposit do I need?\nShould I get an inspection?', required: true },
      { id: 'answers', type: 'textarea', label: 'Your answers to each question (one per line, matching order above)', placeholder: 'A conditional offer means...\nTypically 5% of purchase price...\nYes, always recommend...' }
    ]
  },
  {
    id: 'ThisOrThatCarousel', kind: 'carousel', size: '1080x1350', frames: 7, day: 'wed', audience: 'buyers',
    imageSlots: ['property', 'community'], tones: ['dark', 'light', 'dark', 'light', 'dark', 'light', 'dark'],
    sampleTopics: ['Cottage vs year-round home', 'Charlottetown condo vs Stratford house', 'Build vs buy'], ported: true,
    questions: [
      { id: 'optionA', type: 'text', label: 'Option A', placeholder: 'e.g., Cottage', required: true },
      { id: 'optionB', type: 'text', label: 'Option B', placeholder: 'e.g., Year-round home', required: true },
      { id: 'comparisons', type: 'textarea', label: 'What factors should we compare? (one per line)', placeholder: 'Price range\nMaintenance\nRental potential\nLifestyle fit' },
      { id: 'verdict', type: 'textarea', label: 'Your take - who should choose which?', placeholder: 'e.g., "Cottage if you want a getaway, year-round if you\'re relocating"' }
    ]
  },
  {
    id: 'BuyerObjectionsCarousel', kind: 'carousel', size: '1080x1350', frames: 7, day: 'tue', audience: 'buyers',
    imageSlots: ['headshot', 'landscape'], tones: ['light', 'light', 'dark', 'light', 'dark', 'light', 'dark'],
    sampleTopics: ['5 common buyer objections', 'First-time buyer concerns'], ported: true,
    questions: [
      { id: 'topic', type: 'text', label: 'What topic or objection type?', placeholder: 'e.g., "Conditional Offers", "Financing Concerns"', required: true },
      { id: 'objections', type: 'textarea', label: 'What objections or concerns do buyers have? (one per line)', placeholder: 'What if my financing falls through?\nWhat if the inspection finds problems?\nDo conditions hurt my offer?', required: true },
      { id: 'responses', type: 'textarea', label: 'How do you respond to each? (one per line, matching order above)', placeholder: 'A financing condition protects you...\nAn inspection condition lets you...\nIn a hot market, fewer conditions means...' }
    ]
  },
];
