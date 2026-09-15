// Shared data model. One Agent per client, one Listing per property.

export type Theme = {
  primary: string;      // band gradient start  (Greg: #141428)
  primaryAlt: string;   // band gradient end    (Greg: #22224a)
  accent: string;       // gold rules, borders  (Greg: #d4af37)
  accentLight: string;  // gold display type    (Greg: #f0dc9a)
  fontDisplay: string;  // headlines            (Greg: Archivo)
  fontNarrow: string;   // eyebrows, labels     (Greg: Archivo Narrow)
  fontScript: string;   // signature            (Greg: Yellowtail)
  // Light ground tokens (for content templates on cream backgrounds)
  surface?: string;      // page ground      (#f6f4ef)
  surfaceAlt?: string;   // cards on surface (#ffffff)
  ink?: string;          // body text on surface
  inkSoft?: string;      // secondary text on surface
  accentText?: string;   // accent-colored TEXT on light grounds
};

export type Agent = {
  _id: string;          // slug like "greg-caseley"
  name: string;
  title: string;        // "Realtor · PEI"
  phone: string;
  email: string;
  website: string;
  headshotUrl: string;
  logoUrl: string;
  theme: Theme;
};

// Package types for billing/tracking
export type PackageType = 'one-off' | '4-pack' | '8-pack' | '12-pack' | '16-pack';

export const PACKAGE_LIMITS: Record<PackageType, number> = {
  'one-off': 1,
  '4-pack': 4,
  '8-pack': 8,
  '12-pack': 12,
  '16-pack': 16,
};

export type Package = {
  _id: string;
  agentId: string;
  type: PackageType;
  purchasedAt: string;  // ISO date
  status: 'active' | 'completed';
};

export type ListingStatus = 'pending' | 'in-progress' | 'delivered';

/**
 * focal is the crop anchor as CSS background-position percentages.
 * Every crop correction in this project has been a background-position
 * tweak — make it a click-on-the-photo control in the UI and store it
 * per photo, and the problem stops reaching the template layer.
 */
export type Photo = {
  id: string;           // unique id within listing
  url: string;
  focal: { x: number; y: number };  // defaults to 50/50
  tag?: 'hero' | 'aerial' | 'interior' | 'plan';
  sort: number;
};

export type Listing = {
  _id?: string;
  agentId: string;
  address: string;      // "278 Basinview Crescent"
  city: string;         // "Darnley"
  province: string;     // "PE"
  postal?: string;
  mls: string;
  price: number | null; // null renders "Contact for price"
  propertyType: 'residential' | 'land';
  beds?: number;
  baths?: number;
  acres?: number;
  photos: Photo[];
  // Client portal fields
  status: ListingStatus;
  submittedAt?: string;   // ISO date - when client submitted
  deliveredAt?: string;   // ISO date - when graphics were delivered
  requestedVariants?: Variant[];  // what variants client requested
  notes?: string;         // client notes
  createdAt: Date;
  updatedAt: Date;
};

export type Variant =
  | 'new-listing'
  | 'open-house'
  | 'coming-soon'
  | 'price-drop'
  | 'just-sold'
  | 'sold'
  | 'featured';

export type GraphicOverrides = {
  headline?: string;
  eyebrow?: string;
  date?: string;
  time?: string;
  badge?: string;
  blurb?: string;
  features?: string[];
  location?: string;
};

export type PhotoAssignments = {
  hero?: string;        // photo id
  strip?: string[];     // photo ids
  sub?: string[];       // photo ids
  row?: string[];       // photo ids
};

export type Graphic = {
  _id?: string;
  listingId: string;
  templateId: string;
  variant: Variant;
  overrides: GraphicOverrides;
  photoAssignments: PhotoAssignments;
  packageId?: string;   // which package/deal this graphic belongs to
  historyUrl?: string;  // for pre-rendered history graphics (static PNG)
  createdAt: Date;
  updatedAt: Date;
};

// Utility functions
export const focalCss = (photo?: Photo) =>
  `${photo?.focal?.x ?? 50}% ${photo?.focal?.y ?? 50}%`;

export const money = (n: number | null) =>
  n === null ? 'Contact for price' : '$' + n.toLocaleString('en-CA');

export const heroOf = (listing: Listing) =>
  listing.photos.find(p => p.tag === 'hero') ?? listing.photos[0];

// Template props - what gets passed to template components
export type TemplateProps = {
  agent: Agent;
  listing: Listing;
  variant: Variant;
  overrides: GraphicOverrides;
  photos: {
    hero?: Photo;
    strip?: Photo[];
    sub?: Photo[];
    row?: Photo[];
  };
  coAgent?: Agent;  // for dual-agent templates
};

// ============ CONTENT TEMPLATES ============
// For templates that have no Listing at all (education, market stats, testimonial, intro)

export type ContentPoint = { title: string; body: string };

export type ContentStat = {
  value: string;
  label: string;
  delta?: string;               // "+2.1% vs last year"
  direction?: 'up' | 'down';
};

export type ContentData = {
  kicker?: string;
  title?: string;               // "|" splits into two display lines
  subtitle?: string;
  period?: string;              // "August 2026"
  points?: ContentPoint[];      // education
  stats?: ContentStat[];        // market stats / stat board
  quote?: string;               // testimonial / type poster
  emphasis?: string;            // substring of quote to accent
  attribution?: string;
  attributionMeta?: string;
  rating?: number;              // 1-5
  closing?: string;
  footnote?: string;
};

export type ContentTemplateProps = {
  agent: Agent;
  content: ContentData;
};

export type ContentFieldType =
  | 'kicker' | 'title' | 'subtitle' | 'period'
  | 'points' | 'stats' | 'quote' | 'emphasis'
  | 'attribution' | 'attributionMeta' | 'rating'
  | 'closing' | 'footnote';

/**
 * Fills light tokens for themes saved before they existed.
 */
export const resolveTheme = (t: Theme): Required<Theme> => ({
  ...t,
  surface: t.surface ?? '#f6f4ef',
  surfaceAlt: t.surfaceAlt ?? '#ffffff',
  ink: t.ink ?? '#16162c',
  inkSoft: t.inkSoft ?? '#4a4a5e',
  accentText: t.accentText ?? t.ink ?? '#16162c',
} as Required<Theme>);

// Bulk generation types
export type GenerationQueueItem = {
  agentId: string;
  agent: Agent;
  listings: {
    listing: Listing;
    selected: boolean;
    variants: Variant[];
  }[];
  templates: string[];
};

export type GenerationJob = {
  id: string;
  agentId: string;
  agentName: string;
  listingId: string;
  listingAddress: string;
  templateId: string;
  variant: Variant;
  status: 'pending' | 'generating' | 'complete' | 'error';
  graphicId?: string;
};

export type GenerationResult = {
  agentId: string;
  agentName: string;
  graphics: Graphic[];
};
