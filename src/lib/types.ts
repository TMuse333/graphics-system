// Shared data model. One Agent per client, one Listing per property.

import { ObjectId } from 'mongodb';

export type Theme = {
  primary: string;      // band gradient start  (Greg: #141428)
  primaryAlt: string;   // band gradient end    (Greg: #22224a)
  accent: string;       // gold rules, borders  (Greg: #d4af37)
  accentLight: string;  // gold display type    (Greg: #f0dc9a)
  fontDisplay: string;  // headlines            (Greg: Archivo)
  fontNarrow: string;   // eyebrows, labels     (Greg: Archivo Narrow)
  fontScript: string;   // signature            (Greg: Yellowtail)
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
  _id?: ObjectId;
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
  _id?: ObjectId;
  listingId: ObjectId;
  templateId: string;
  variant: Variant;
  overrides: GraphicOverrides;
  photoAssignments: PhotoAssignments;
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
