import type { Agent, Listing, Photo, Theme } from './types';

/**
 * Sample data for template previews.
 * Uses neutral branding so templates aren't tied to any specific agent.
 */

// RE/MAX Nova preview theme - blue, red, white
export const PREVIEW_THEME: Theme = {
  primary: '#003da5',
  primaryAlt: '#002868',
  accent: '#dc1c2e',
  accentLight: '#f5a5ad',
  fontDisplay: 'Archivo, sans-serif',
  fontNarrow: '"Archivo Narrow", sans-serif',
  fontScript: 'Yellowtail, cursive',
};

// Generic agent for previews - RE/MAX Nova branding
export const SAMPLE_AGENT: Agent = {
  _id: 'sample-agent',
  name: 'Your Name',
  title: 'Realtor · RE/MAX Nova',
  phone: '902-555-0100',
  email: 'agent@remaxnova.ca',
  website: 'remaxnova.ca',
  headshotUrl: '',
  logoUrl: '',
  theme: PREVIEW_THEME,
};

// Generic residential listing
export const SAMPLE_LISTING_RESIDENTIAL: Listing = {
  _id: 'sample-residential',
  agentId: 'sample-agent',
  address: '123 Oceanview Drive',
  city: 'Halifax',
  province: 'NS',
  mls: '000000',
  price: 549000,
  propertyType: 'residential',
  beds: 4,
  baths: 3,
  photos: [],
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Generic land listing
export const SAMPLE_LISTING_LAND: Listing = {
  _id: 'sample-land',
  agentId: 'sample-agent',
  address: 'Lot 1 Maple Ridge',
  city: 'Bedford',
  province: 'NS',
  mls: '000001',
  price: 125000,
  propertyType: 'land',
  acres: 2.5,
  photos: [],
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Use an actual listing photo for realistic previews
export const SAMPLE_PHOTO: Photo = {
  id: 'sample-photo',
  url: '/agents/greg/hero.png',
  focal: { x: 50, y: 50 },
  sort: 0,
};

// Helper to get appropriate sample listing for a template
export function getSampleListingForTemplate(templateId: string): Listing {
  // Land templates need acres
  if (templateId.includes('land') || templateId.includes('gen1-square')) {
    return SAMPLE_LISTING_LAND;
  }
  return SAMPLE_LISTING_RESIDENTIAL;
}
