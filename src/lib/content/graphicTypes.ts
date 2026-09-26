// Graphic type registry for the orchestration layer.
// Flow: request text + Paragon link -> resolve GraphicType -> check the scraped
// Listing against its requirements -> ask for any missing additionalInputs ->
// pick a template -> render.
//
// Everything here maps to a layout that exists in this project. Templates marked
// `ported: false` are still HTML-only and need converting before the agent can call them.

// ---------- Scraper output (Paragon ingest) ----------

export type ScrapedListing = {
  mls: string;
  address: string;          // "71 Morrison Lane"
  city: string;             // "New London"
  province: string;         // "PE"
  postal?: string;
  price: number | null;
  beds?: number;
  baths?: number;           // 1.5 allowed
  sqft?: number;            // Paragon "TFinSqFt"
  lotSize?: { value: number; unit: 'acres' | 'sqft' };
  description?: string;
  images: string[];         // carousel order, up to 50. [0] is usually the front exterior
};

// ---------- Images ----------

// The scraper returns an unlabelled carousel. The agent tags images with a quick
// vision pass before selection. Without tags, the fallback is carousel order.
export type PhotoRole = 'exterior' | 'aerial' | 'interior' | 'kitchen' | 'living' | 'water-view' | 'land' | 'map';

export type ImageSlot = {
  role: 'hero' | 'secondary';
  prefer: PhotoRole[];      // first match wins; falls back to carousel order
  aspect: number;           // slot width / height, used to warn when the source is too small to fill it
  minSourceWidth: number;   // below this the photo renders soft (Morrison's 374px hero upscaled 2.9x)
};

export type ImageRequirement = {
  min: number;              // render is blocked below this
  max: number;              // template slots available
  slots: ImageSlot[];
};

// ---------- Fields ----------

export type ListingField = keyof Omit<ScrapedListing, 'images'>;

// What happens when a field is empty. These cover every case that came up while building:
// block      - can't render without it (MLS, address)
// placeholder- render a dash, as on 50 Watts spec cells
// omit       - drop the row/chip, as with Leah's website
// ask        - pause and ask the requester
export type MissingPolicy = 'block' | 'placeholder' | 'omit' | 'ask';

export type FieldRule = { field: ListingField; ifMissing: MissingPolicy };

export type AdditionalInput = {
  field: string;
  type: 'date' | 'timeRange' | 'money' | 'string' | 'number' | 'agentIds' | 'image' | 'enum';
  required: boolean;
  options?: string[];
  default?: string;
  prompt: string;           // what the agent asks if the request text doesn't say
  parseHints?: string[];    // phrases to pull it from the request ("sat 19th 2-4")
};

// ---------- Templates ----------

export type TemplateId =
  | 'style-b-square'
  | 'gen1-square'
  | 'gen1-open-house'
  | 'gen1-land'
  | 'tall-flier'
  | 'for-lease-editorial'
  | 'open-house-story'
  | 'open-house-reel';

export type TemplateSpec = {
  id: TemplateId;
  size: [number, number];
  kind: 'static' | 'motion';
  images: ImageRequirement;
  agents: { min: number; max: number };  // dual-agent band = 2
  ported: boolean;                       // exists as a React component
  source: string[];                      // HTML reference files in this project
};

const heroSlot = (aspect: number, prefer: PhotoRole[] = ['exterior', 'aerial']): ImageSlot =>
  ({ role: 'hero', prefer, aspect, minSourceWidth: 1080 });
const secondary = (aspect: number, prefer: PhotoRole[] = ['kitchen', 'living', 'interior']): ImageSlot =>
  ({ role: 'secondary', prefer, aspect, minSourceWidth: 600 });

export const TEMPLATES: Record<TemplateId, TemplateSpec> = {
  'style-b-square': {
    id: 'style-b-square', size: [1080, 1080], kind: 'static',
    images: { min: 1, max: 3, slots: [heroSlot(1), secondary(1.42), secondary(1.42)] },
    agents: { min: 1, max: 2 }, ported: false,
    source: ['71 Morrison Lane - New Price Style B.html', '71 Morrison Lane - Price Improvement Style B.html', '278 Basinview Crescent - Open House.html', 'The Avonlea 25 - Open House Style B.html'],
  },
  'gen1-square': {
    id: 'gen1-square', size: [1080, 1080], kind: 'static',
    images: { min: 1, max: 1, slots: [heroSlot(1080 / 778)] },
    agents: { min: 1, max: 1 }, ported: false,
    source: ['New Listing.html', 'Price Adjustment.html', 'Sold and Closed.html', 'Featured Listing.html'],
  },
  'gen1-open-house': {
    id: 'gen1-open-house', size: [1080, 1080], kind: 'static',
    images: { min: 1, max: 3, slots: [heroSlot(1080 / 716), secondary(1.35), secondary(1.35)] },
    agents: { min: 1, max: 2 }, ported: false,
    source: ['71 Morrison Lane - Open House Sept 19 Topbar.html', '11 Thompson Point Road - Open House Sept 26.html', 'The Avonlea 25.html'],
  },
  'gen1-land': {
    id: 'gen1-land', size: [1080, 1080], kind: 'static',
    images: { min: 1, max: 2, slots: [heroSlot(1080 / 778, ['land', 'aerial', 'water-view']), secondary(1, ['map'])] },
    agents: { min: 1, max: 1 }, ported: false,
    source: ['Land Listing Template - Caseley.html', 'Lot 1 Salt Wind Way - New Listing.html', 'Farm Land Graphic.html', 'Woodland For Sale.html'],
  },
  'tall-flier': {
    id: 'tall-flier', size: [1080, 1620], kind: 'static',
    images: { min: 1, max: 4, slots: [heroSlot(1.6), secondary(1.3), secondary(1.3), secondary(1.3)] },
    agents: { min: 1, max: 1 }, ported: false,
    source: ['71 Morrison Lane - Flier Style A.html'],
  },
  'for-lease-editorial': {
    id: 'for-lease-editorial', size: [1080, 1080], kind: 'static',
    images: { min: 1, max: 3, slots: [heroSlot(700 / 496, ['aerial', 'exterior']), secondary(376 / 246), secondary(376 / 246)] },
    agents: { min: 1, max: 2 }, ported: false,
    source: ['50 Watts Ave - For Lease B.html'],
  },
  'open-house-story': {
    id: 'open-house-story', size: [1080, 1920], kind: 'static',
    images: { min: 1, max: 1, slots: [heroSlot(1080 / 1920)] },
    agents: { min: 1, max: 1 }, ported: false,
    source: ['71 Morrison Lane - Open House Story.html'],
  },
  'open-house-reel': {
    id: 'open-house-reel', size: [1080, 1920], kind: 'motion',
    images: { min: 3, max: 3, slots: [heroSlot(1080 / 1920), secondary(300 / 212), secondary(300 / 212)] },
    agents: { min: 1, max: 1 }, ported: false,
    source: ['71 Morrison Lane - Open House Reel.html', 'react/open-house-reel.config.json'],
  },
};

// ---------- Graphic types ----------

export type GraphicTypeId =
  | 'just-listed'
  | 'coming-soon'
  | 'open-house'
  | 'price-improvement'
  | 'just-sold'
  | 'featured'
  | 'land-listing'
  | 'for-lease'
  | 'listing-flier';

export type GraphicType = {
  id: GraphicTypeId;
  name: string;
  intents: string[];                    // request phrases that route here
  appliesTo: ('residential' | 'land' | 'commercial')[];
  fields: FieldRule[];
  additionalInputs: AdditionalInput[];
  templates: TemplateId[];              // first = default
  variant?: string;                     // prop passed to shared templates
};

// Shared across every type: who's on the graphic. Default is the sender of the request.
const agentsInput: AdditionalInput = {
  field: 'agentIds', type: 'agentIds', required: true, default: 'sender',
  prompt: 'Whose contact goes on it?',
  parseHints: ['with Alisha', 'Leah\'s', 'both of us', 'co-listed'],
};

const core: FieldRule[] = [
  { field: 'mls', ifMissing: 'block' },
  { field: 'address', ifMissing: 'block' },
  { field: 'city', ifMissing: 'block' },
  { field: 'province', ifMissing: 'omit' },
];

const homeStats: FieldRule[] = [
  { field: 'beds', ifMissing: 'omit' },
  { field: 'baths', ifMissing: 'omit' },
  { field: 'sqft', ifMissing: 'omit' },
];

export const GRAPHIC_TYPES: GraphicType[] = [
  {
    id: 'just-listed', name: 'Just Listed', variant: 'new-listing',
    intents: ['just listed', 'new listing', 'new to market', 'just hit the market'],
    appliesTo: ['residential'],
    fields: [...core, { field: 'price', ifMissing: 'ask' }, ...homeStats, { field: 'lotSize', ifMissing: 'omit' }],
    additionalInputs: [agentsInput],
    templates: ['style-b-square', 'gen1-square'],
  },
  {
    id: 'coming-soon', name: 'Coming Soon', variant: 'coming-soon',
    intents: ['coming soon', 'sneak peek', 'pre-market'],
    appliesTo: ['residential', 'land'],
    // Price is often not public yet; don't block on it.
    fields: [...core, { field: 'price', ifMissing: 'omit' }, ...homeStats],
    additionalInputs: [
      agentsInput,
      { field: 'launchDate', type: 'date', required: false, prompt: 'When does it go live?', parseHints: ['hits the market', 'live on'] },
    ],
    templates: ['style-b-square'],
  },
  {
    id: 'open-house', name: 'Open House', variant: 'open-house',
    intents: ['open house', 'oh', 'showing saturday', 'open sat', 'open sun'],
    appliesTo: ['residential'],
    fields: [...core, { field: 'price', ifMissing: 'omit' }, ...homeStats],
    additionalInputs: [
      agentsInput,
      { field: 'date', type: 'date', required: true, prompt: 'What day is the open house?', parseHints: ['sat', 'sun', 'saturday', 'the 19th', 'sept 26'] },
      { field: 'time', type: 'timeRange', required: true, prompt: 'What time?', parseHints: ['2-4', '1-3pm', '2 to 4'] },
      { field: 'format', type: 'enum', required: false, options: ['square', 'story', 'reel'], default: 'square', prompt: 'Post, story, or reel?' },
    ],
    // format picks the template: square -> gen1-open-house | style-b-square, story -> open-house-story, reel -> open-house-reel
    templates: ['gen1-open-house', 'style-b-square', 'open-house-story', 'open-house-reel'],
  },
  {
    id: 'price-improvement', name: 'Price Improvement', variant: 'price-drop',
    intents: ['price drop', 'price reduced', 'reduced', 'new price', 'price improvement', 'price adjustment'],
    appliesTo: ['residential', 'land'],
    fields: [...core, { field: 'price', ifMissing: 'block' }, ...homeStats, { field: 'lotSize', ifMissing: 'omit' }],
    additionalInputs: [
      agentsInput,
      // Paragon shows the current price only. The old price comes from your own
      // listing history if you've scraped this MLS before, otherwise ask.
      { field: 'previousPrice', type: 'money', required: false, prompt: 'What was it listed at before? (optional, shown struck through)', parseHints: ['was', 'down from', 'from $'] },
      { field: 'label', type: 'enum', required: false, options: ['New Price', 'Price Improvement', 'Price Adjustment'], default: 'New Price', prompt: 'Which wording?' },
    ],
    templates: ['style-b-square', 'gen1-square'],
  },
  {
    id: 'just-sold', name: 'Just Sold', variant: 'just-sold',
    intents: ['sold', 'just sold', 'closed', 'under contract', 'sold over asking'],
    appliesTo: ['residential', 'land'],
    // Sale price is often private. Never print the list price as if it were the sale price.
    fields: [...core, { field: 'price', ifMissing: 'omit' }, ...homeStats],
    additionalInputs: [
      agentsInput,
      { field: 'showPrice', type: 'enum', required: true, options: ['hide', 'list-price', 'sale-price'], default: 'hide', prompt: 'Show a price on the sold graphic?' },
      { field: 'salePrice', type: 'money', required: false, prompt: 'What did it sell for?' },
      { field: 'label', type: 'enum', required: false, options: ['Sold', 'Sold & Closed', 'Under Contract'], default: 'Sold', prompt: 'Which label?' },
    ],
    templates: ['gen1-square', 'style-b-square'],
  },
  {
    id: 'featured', name: 'Featured Listing', variant: 'featured',
    intents: ['featured', 'feature this', 'spotlight', 'still available'],
    appliesTo: ['residential'],
    fields: [...core, { field: 'price', ifMissing: 'ask' }, ...homeStats],
    additionalInputs: [agentsInput],
    templates: ['gen1-square', 'style-b-square'],
  },
  {
    id: 'land-listing', name: 'Land / Vacant Lot', variant: 'new-listing',
    intents: ['lot', 'land', 'acreage', 'vacant', 'building lot', 'woodland', 'farm land'],
    appliesTo: ['land'],
    // Acreage is the headline stat on land. The Lot 1 Salt Wind Way graphic went out
    // with an empty Acres label, so ask rather than omit.
    fields: [...core, { field: 'price', ifMissing: 'ask' }, { field: 'lotSize', ifMissing: 'ask' }],
    additionalInputs: [
      agentsInput,
      { field: 'mapImage', type: 'image', required: false, prompt: 'Got a plot map or aerial boundary?' },
      { field: 'badge', type: 'enum', required: false, options: ['New Listing', 'Vacant Land', 'Price Improvement', 'Just Sold'], default: 'New Listing', prompt: 'Which banner?' },
    ],
    templates: ['gen1-land'],
  },
  {
    id: 'for-lease', name: 'For Lease', variant: 'for-lease',
    intents: ['for lease', 'lease', 'for rent', 'commercial space', 'office space'],
    appliesTo: ['commercial'],
    // Paragon rarely carries lease terms. These four came from the requester on 50 Watts.
    fields: [...core, { field: 'sqft', ifMissing: 'placeholder' }],
    additionalInputs: [
      agentsInput,
      { field: 'availableArea', type: 'string', required: false, prompt: 'How much space is available?', parseHints: ['sq ft available', 'sf'] },
      { field: 'leaseRate', type: 'string', required: false, prompt: 'Lease rate?', parseHints: ['/sqft', 'per sf', 'psf', 'net'] },
      { field: 'parking', type: 'string', required: false, prompt: 'Parking?', parseHints: ['spaces', 'stalls'] },
      { field: 'occupancy', type: 'string', required: false, prompt: 'When is it available?', parseHints: ['immediate', 'available'] },
      { field: 'buildingType', type: 'string', required: false, default: 'Commercial Office Building', prompt: 'What kind of building?' },
    ],
    // Spec cells missing a value render a dash rather than blocking.
    templates: ['for-lease-editorial'],
  },
  {
    id: 'listing-flier', name: 'Listing Flier (print)', variant: 'new-listing',
    intents: ['flier', 'flyer', 'feature sheet', 'print', 'handout'],
    appliesTo: ['residential'],
    fields: [...core, { field: 'price', ifMissing: 'ask' }, ...homeStats, { field: 'lotSize', ifMissing: 'omit' }, { field: 'description', ifMissing: 'ask' }],
    additionalInputs: [
      agentsInput,
      // The flier's checklist and location list are written copy, not raw fields.
      // Generate them from description, then show them to the requester before rendering.
      { field: 'features', type: 'string', required: false, prompt: 'Confirm the feature list pulled from the description' },
      { field: 'nearby', type: 'string', required: false, prompt: 'Any nearby spots to list (beach, school, town)?' },
    ],
    templates: ['tall-flier'],
  },
];

// ---------- Routing helpers ----------

// Paragon doesn't flag property type cleanly. Infer it, and let the intent override.
export const inferPropertyType = (l: ScrapedListing, requestText: string): 'residential' | 'land' | 'commercial' => {
  const t = requestText.toLowerCase();
  if (/lease|commercial|office/.test(t)) return 'commercial';
  if (/^lot\b/i.test(l.address) || (!l.beds && !l.baths && l.lotSize)) return 'land';
  return 'residential';
};

// Explicit intent wins. "just listed" on a land listing reroutes to land-listing.
export const resolveType = (requestText: string, propertyType: 'residential' | 'land' | 'commercial'): GraphicType | undefined => {
  const t = requestText.toLowerCase();
  const hit = GRAPHIC_TYPES
    .filter(g => g.intents.some(i => t.includes(i)))
    .sort((a, b) => Math.max(...b.intents.filter(i => t.includes(i)).map(i => i.length))
                  - Math.max(...a.intents.filter(i => t.includes(i)).map(i => i.length)))[0];
  if (hit && hit.appliesTo.includes(propertyType)) return hit;
  if (propertyType === 'land' && (!hit || hit.id === 'just-listed')) return GRAPHIC_TYPES.find(g => g.id === 'land-listing');
  if (propertyType === 'commercial') return GRAPHIC_TYPES.find(g => g.id === 'for-lease');
  return hit;
};

export type Gap = { field: string; policy: MissingPolicy; prompt?: string };

// Returns what's blocking or needs asking. Empty array means ready to render.
export const checkReady = (g: GraphicType, l: ScrapedListing, inputs: Record<string, unknown>): Gap[] => {
  const gaps: Gap[] = [];
  for (const r of g.fields) {
    const v = l[r.field];
    if ((v === undefined || v === null || v === '') && (r.ifMissing === 'block' || r.ifMissing === 'ask'))
      gaps.push({ field: r.field, policy: r.ifMissing });
  }
  for (const a of g.additionalInputs)
    if (a.required && inputs[a.field] === undefined && a.default === undefined)
      gaps.push({ field: a.field, policy: 'ask', prompt: a.prompt });
  const tpl = TEMPLATES[g.templates[0]];
  if (l.images.length < tpl.images.min)
    gaps.push({ field: 'images', policy: 'block', prompt: `${tpl.id} needs at least ${tpl.images.min} photo(s)` });
  return gaps;
};
