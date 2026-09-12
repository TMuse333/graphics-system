import type { Agent, Listing, Photo, Theme } from './types';
import { greg, gregTheme, remaxTheme, clayTheme } from './theme';

/**
 * Sample data for showcase - uses real Nova Scotia addresses
 * and realistic MLS numbers for professional appearance.
 */

// ============ SAMPLE AGENTS (for brand comparison demo) ============

// Use Greg's real data as the primary showcase agent
export const SHOWCASE_AGENT_1 = greg;

// RE/MAX branded agent
export const SHOWCASE_AGENT_2: Agent = {
  _id: 'showcase-remax',
  name: 'Sarah Mitchell',
  title: 'Realtor · RE/MAX Nova',
  phone: '902-434-5678',
  email: 'sarah@remaxnova.ca',
  website: 'remaxnova.ca',
  headshotUrl: '/agents/greg/headshot.png', // Reuse for demo
  logoUrl: '',
  theme: remaxTheme,
};

// Boutique branded agent
export const SHOWCASE_AGENT_3: Agent = {
  _id: 'showcase-boutique',
  name: 'James Thornton',
  title: 'Broker · Valley Homes',
  phone: '902-678-9012',
  email: 'james@valleyhomes.ca',
  website: 'valleyhomes.ca',
  headshotUrl: '/agents/greg/headshot.png', // Reuse for demo
  logoUrl: '',
  theme: clayTheme,
};

// ============ SAMPLE LISTINGS (real NS addresses, varied price tiers) ============

// Waterfront property - high end
export const LISTING_WATERFRONT: Listing = {
  _id: 'showcase-waterfront',
  agentId: 'greg-caseley',
  address: '42 Purcells Cove Road',
  city: 'Halifax',
  province: 'NS',
  mls: '202609847',
  price: 1250000,
  propertyType: 'residential',
  beds: 4,
  baths: 3,
  photos: [],
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Suburban family home - mid range
export const LISTING_SUBURBAN: Listing = {
  _id: 'showcase-suburban',
  agentId: 'greg-caseley',
  address: '18 Melody Drive',
  city: 'Bedford',
  province: 'NS',
  mls: '202609523',
  price: 549000,
  propertyType: 'residential',
  beds: 4,
  baths: 2,
  photos: [],
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Entry condo - starter
export const LISTING_CONDO: Listing = {
  _id: 'showcase-condo',
  agentId: 'greg-caseley',
  address: '305-1650 Granville Street',
  city: 'Halifax',
  province: 'NS',
  mls: '202609301',
  price: 389000,
  propertyType: 'residential',
  beds: 2,
  baths: 1,
  photos: [],
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Land/lot
export const LISTING_LAND: Listing = {
  _id: 'showcase-land',
  agentId: 'greg-caseley',
  address: 'Lot 7 Oceanview Lane',
  city: 'Chester',
  province: 'NS',
  mls: '202609156',
  price: 175000,
  propertyType: 'land',
  acres: 2.8,
  photos: [],
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ============ SAMPLE PHOTOS ============

// Primary hero photo (uses Greg's existing image)
export const PHOTO_HERO: Photo = {
  id: 'showcase-hero',
  url: '/agents/greg/hero.png',
  focal: { x: 50, y: 50 },
  sort: 0,
};

// ============ BACKWARD COMPAT (old exports) ============

export const PREVIEW_THEME = remaxTheme;
export const SAMPLE_AGENT = SHOWCASE_AGENT_1;
export const SAMPLE_LISTING_RESIDENTIAL = LISTING_SUBURBAN;
export const SAMPLE_LISTING_LAND = LISTING_LAND;
export const SAMPLE_PHOTO = PHOTO_HERO;

export function getSampleListingForTemplate(templateId: string): Listing {
  if (templateId.includes('land') || templateId.includes('gen1-square')) {
    return LISTING_LAND;
  }
  return LISTING_SUBURBAN;
}
