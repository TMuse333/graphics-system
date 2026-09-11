'use client';

import type { Agent, Listing, Graphic, Photo, Package, PackageType } from './types';
import { PACKAGE_LIMITS } from './types';
import { greg, testAgent } from './theme';

// Storage keys
const STORAGE_KEYS = {
  agents: 'lg-agents',
  listings: 'lg-listings',
  graphics: 'lg-graphics',
  packages: 'lg-packages',
} as const;

// Initial seed data
const INITIAL_AGENTS: Agent[] = [greg, testAgent];

const INITIAL_PACKAGES: Package[] = [
  {
    _id: 'pkg-8',
    agentId: 'greg-caseley',
    type: '8-pack',
    purchasedAt: '2026-04-15',
    status: 'completed',
  },
  {
    _id: 'pkg-16',
    agentId: 'greg-caseley',
    type: '16-pack',
    purchasedAt: '2026-08-04',
    status: 'active',
  },
];

const INITIAL_LISTINGS: Listing[] = [
  // 8-pack listings (Apr-Jul 2026) - COMPLETED
  {
    _id: 'listing-8pack-sold',
    agentId: 'greg-caseley',
    address: 'Sold Property',
    city: 'Charlottetown',
    province: 'PE',
    mls: '202604-01',
    price: null,
    propertyType: 'residential',
    photos: [],
    status: 'delivered',
    submittedAt: '2026-04-28',
    deliveredAt: '2026-04-30',
    requestedVariants: ['just-sold'],
    createdAt: new Date('2026-04-28'),
    updatedAt: new Date('2026-04-30'),
  },
  {
    _id: 'listing-8pack-generic',
    agentId: 'greg-caseley',
    address: 'Greg Caseley Promo',
    city: 'Charlottetown',
    province: 'PE',
    mls: '202605-01',
    price: null,
    propertyType: 'residential',
    photos: [],
    status: 'delivered',
    submittedAt: '2026-05-01',
    deliveredAt: '2026-05-02',
    requestedVariants: ['featured'],
    createdAt: new Date('2026-05-01'),
    updatedAt: new Date('2026-05-02'),
  },
  {
    _id: 'listing-8pack-lot',
    agentId: 'greg-caseley',
    address: 'Lot for Sale',
    city: 'Cornwall',
    province: 'PE',
    mls: '202605-02',
    price: 65000,
    propertyType: 'land',
    acres: 1.5,
    photos: [],
    status: 'delivered',
    submittedAt: '2026-05-12',
    deliveredAt: '2026-05-13',
    requestedVariants: ['new-listing'],
    createdAt: new Date('2026-05-12'),
    updatedAt: new Date('2026-05-13'),
  },
  {
    _id: 'listing-8pack-riverbend',
    agentId: 'greg-caseley',
    address: 'A19 Riverbend Lane',
    city: 'Cornwall',
    province: 'PE',
    mls: '202606-01',
    price: 95000,
    propertyType: 'land',
    acres: 1.2,
    photos: [],
    status: 'delivered',
    submittedAt: '2026-06-08',
    deliveredAt: '2026-06-09',
    requestedVariants: ['price-drop'],
    createdAt: new Date('2026-06-08'),
    updatedAt: new Date('2026-06-09'),
  },
  {
    _id: 'listing-8pack-laura',
    agentId: 'greg-caseley',
    address: '2 Laura Lane',
    city: 'Cornwall',
    province: 'PE',
    mls: '202607-01',
    price: 489000,
    propertyType: 'residential',
    beds: 3,
    baths: 2,
    photos: [],
    status: 'delivered',
    submittedAt: '2026-07-01',
    deliveredAt: '2026-07-29',
    requestedVariants: ['open-house', 'price-drop'],
    createdAt: new Date('2026-07-01'),
    updatedAt: new Date('2026-07-29'),
  },
  // 16-pack listings (Aug 2026 - current)
  {
    _id: 'listing-new-orleans',
    agentId: 'greg-caseley',
    address: '1104 New Orleans Rd',
    city: 'Charlottetown',
    province: 'PE',
    mls: '202608-01',
    price: 389000,
    propertyType: 'residential',
    beds: 3,
    baths: 2,
    photos: [],
    status: 'delivered',
    submittedAt: '2026-08-04',
    deliveredAt: '2026-08-04',
    requestedVariants: ['new-listing'],
    createdAt: new Date('2026-08-04'),
    updatedAt: new Date('2026-08-04'),
  },
  {
    _id: 'listing-thompson',
    agentId: 'greg-caseley',
    address: '11 Thompson Road',
    city: 'Stratford',
    province: 'PE',
    mls: '202608-02',
    price: 449000,
    propertyType: 'residential',
    beds: 4,
    baths: 2,
    photos: [],
    status: 'delivered',
    submittedAt: '2026-08-10',
    deliveredAt: '2026-08-10',
    requestedVariants: ['new-listing'],
    createdAt: new Date('2026-08-10'),
    updatedAt: new Date('2026-08-10'),
  },
  {
    _id: 'listing-morrison',
    agentId: 'greg-caseley',
    address: '71 Morrison Lane',
    city: 'Cornwall',
    province: 'PE',
    mls: '202608-03',
    price: 525000,
    propertyType: 'residential',
    beds: 4,
    baths: 3,
    photos: [],
    status: 'delivered',
    submittedAt: '2026-08-16',
    deliveredAt: '2026-08-25',
    requestedVariants: ['open-house', 'price-drop'],
    createdAt: new Date('2026-08-16'),
    updatedAt: new Date('2026-08-25'),
  },
  {
    _id: 'listing-laura-lane',
    agentId: 'greg-caseley',
    address: '2 Laura Lane',
    city: 'Cornwall',
    province: 'PE',
    mls: '202608-04',
    price: 475000,
    propertyType: 'residential',
    beds: 3,
    baths: 2,
    photos: [],
    status: 'delivered',
    submittedAt: '2026-08-23',
    deliveredAt: '2026-08-25',
    requestedVariants: ['open-house'],
    createdAt: new Date('2026-08-23'),
    updatedAt: new Date('2026-08-25'),
  },
  {
    _id: 'listing-riverbend',
    agentId: 'greg-caseley',
    address: 'A19 Riverbend Lane',
    city: 'Cornwall',
    province: 'PE',
    mls: '202608-05',
    price: 89000,
    propertyType: 'land',
    acres: 1.2,
    photos: [],
    status: 'delivered',
    submittedAt: '2026-08-25',
    deliveredAt: '2026-08-25',
    requestedVariants: ['new-listing'],
    createdAt: new Date('2026-08-25'),
    updatedAt: new Date('2026-08-25'),
  },
  {
    _id: 'listing-salt-wind',
    agentId: 'greg-caseley',
    address: 'Lot 1 & 2 Salt Wind Way',
    city: 'North Rustico',
    province: 'PE',
    mls: '202608-06',
    price: 125000,
    propertyType: 'land',
    acres: 2.5,
    photos: [],
    status: 'delivered',
    submittedAt: '2026-08-30',
    deliveredAt: '2026-09-09',
    requestedVariants: ['new-listing'],
    createdAt: new Date('2026-08-30'),
    updatedAt: new Date('2026-09-09'),
  },
];

const INITIAL_GRAPHICS: Graphic[] = [
  // ========== 8-PACK (Apr-Jul 2026) - COMPLETED ==========
  // Sold Property
  {
    _id: 'g-8pack-sold',
    listingId: 'listing-8pack-sold',
    templateId: 'style-b-square',
    variant: 'just-sold',
    overrides: {},
    photoAssignments: {},
    packageId: 'pkg-8',
    historyUrl: '/history/greg-8pack/sold and closed.png',
    createdAt: new Date('2026-04-30'),
    updatedAt: new Date('2026-04-30'),
  },
  // Greg Promo
  {
    _id: 'g-8pack-promo',
    listingId: 'listing-8pack-generic',
    templateId: 'style-b-square',
    variant: 'featured',
    overrides: {},
    photoAssignments: {},
    packageId: 'pkg-8',
    historyUrl: '/history/greg-8pack/greg-graphic.png',
    createdAt: new Date('2026-05-02'),
    updatedAt: new Date('2026-05-02'),
  },
  // Lot for Sale
  {
    _id: 'g-8pack-lot',
    listingId: 'listing-8pack-lot',
    templateId: 'style-b-square',
    variant: 'new-listing',
    overrides: {},
    photoAssignments: {},
    packageId: 'pkg-8',
    historyUrl: '/history/greg-8pack/graphic.png',
    createdAt: new Date('2026-05-13'),
    updatedAt: new Date('2026-05-13'),
  },
  // A19 Riverbend - Price Adjustment
  {
    _id: 'g-8pack-riverbend',
    listingId: 'listing-8pack-riverbend',
    templateId: 'style-b-square',
    variant: 'price-drop',
    overrides: {},
    photoAssignments: {},
    packageId: 'pkg-8',
    historyUrl: '/history/greg-8pack/new-price.png',
    createdAt: new Date('2026-06-09'),
    updatedAt: new Date('2026-06-09'),
  },
  // 2 Laura Lane - 3 graphics
  {
    _id: 'g-8pack-laura-1',
    listingId: 'listing-8pack-laura',
    templateId: 'style-b-square',
    variant: 'open-house',
    overrides: {},
    photoAssignments: {},
    packageId: 'pkg-8',
    historyUrl: '/history/greg-8pack/laura-lane-open-house.png',
    createdAt: new Date('2026-07-18'),
    updatedAt: new Date('2026-07-18'),
  },
  {
    _id: 'g-8pack-laura-2',
    listingId: 'listing-8pack-laura',
    templateId: 'style-b-square',
    variant: 'price-drop',
    overrides: {},
    photoAssignments: {},
    packageId: 'pkg-8',
    historyUrl: '/history/greg-8pack/laura-lane-price-adjust.png',
    createdAt: new Date('2026-07-22'),
    updatedAt: new Date('2026-07-22'),
  },
  {
    _id: 'g-8pack-laura-3',
    listingId: 'listing-8pack-laura',
    templateId: 'style-b-square',
    variant: 'price-drop',
    overrides: {},
    photoAssignments: {},
    packageId: 'pkg-8',
    historyUrl: '/history/greg-8pack/laura-lane-price-improvement.png',
    createdAt: new Date('2026-07-29'),
    updatedAt: new Date('2026-07-29'),
  },
  // ========== 16-PACK (Aug 2026 - current) - ACTIVE ==========
  // 1104 New Orleans Rd
  {
    _id: 'g-new-orleans-1',
    listingId: 'listing-new-orleans',
    templateId: 'style-b-square',
    variant: 'new-listing',
    overrides: {},
    photoAssignments: {},
    packageId: 'pkg-16',
    historyUrl: '/history/greg-16pack/new-orleans-road.png',
    createdAt: new Date('2026-08-04'),
    updatedAt: new Date('2026-08-04'),
  },
  // 11 Thompson Road
  {
    _id: 'g-thompson-1',
    listingId: 'listing-thompson',
    templateId: 'style-b-square',
    variant: 'new-listing',
    overrides: {},
    photoAssignments: {},
    packageId: 'pkg-16',
    historyUrl: '/history/greg-16pack/11-thompson-road.png',
    createdAt: new Date('2026-08-10'),
    updatedAt: new Date('2026-08-10'),
  },
  // 71 Morrison Lane - 4 graphics
  {
    _id: 'g-morrison-1',
    listingId: 'listing-morrison',
    templateId: 'style-b-square',
    variant: 'open-house',
    overrides: { date: 'August 22', time: '2:00 - 4:00 PM' },
    photoAssignments: {},
    packageId: 'pkg-16',
    historyUrl: '/history/greg-16pack/thompson-point-open-house-aug-22.png',
    createdAt: new Date('2026-08-16'),
    updatedAt: new Date('2026-08-16'),
  },
  {
    _id: 'g-morrison-2',
    listingId: 'listing-morrison',
    templateId: 'style-b-square',
    variant: 'price-drop',
    overrides: {},
    photoAssignments: {},
    packageId: 'pkg-16',
    historyUrl: '/history/greg-16pack/morrison-lane-improvement.png',
    createdAt: new Date('2026-08-20'),
    updatedAt: new Date('2026-08-20'),
  },
  {
    _id: 'g-morrison-3',
    listingId: 'listing-morrison',
    templateId: 'style-b-square',
    variant: 'open-house',
    overrides: { date: 'August 23' },
    photoAssignments: {},
    packageId: 'pkg-16',
    historyUrl: '/history/greg-16pack/morrison-lane-open-house.png',
    createdAt: new Date('2026-08-23'),
    updatedAt: new Date('2026-08-23'),
  },
  {
    _id: 'g-morrison-4',
    listingId: 'listing-morrison',
    templateId: 'style-b-square',
    variant: 'open-house',
    overrides: { date: 'August 25' },
    photoAssignments: {},
    packageId: 'pkg-16',
    historyUrl: '/history/greg-16pack/unnamed-agent-morrison-lane.png',
    createdAt: new Date('2026-08-25'),
    updatedAt: new Date('2026-08-25'),
  },
  // 2 Laura Lane - 2 graphics
  {
    _id: 'g-laura-1',
    listingId: 'listing-laura-lane',
    templateId: 'style-b-square',
    variant: 'open-house',
    overrides: { date: 'August 30', time: '1:00 - 3:00 PM' },
    photoAssignments: {},
    packageId: 'pkg-16',
    historyUrl: '/history/greg-16pack/laura-lane-open-house-aug-30.png',
    createdAt: new Date('2026-08-23'),
    updatedAt: new Date('2026-08-23'),
  },
  {
    _id: 'g-laura-2',
    listingId: 'listing-laura-lane',
    templateId: 'style-b-square',
    variant: 'open-house',
    overrides: {},
    photoAssignments: {},
    packageId: 'pkg-16',
    historyUrl: '/history/greg-16pack/leah-sadicon.png',
    createdAt: new Date('2026-08-25'),
    updatedAt: new Date('2026-08-25'),
  },
  // A19 Riverbend Lane
  {
    _id: 'g-riverbend-1',
    listingId: 'listing-riverbend',
    templateId: 'style-b-square',
    variant: 'new-listing',
    overrides: {},
    photoAssignments: {},
    packageId: 'pkg-16',
    historyUrl: '/history/greg-16pack/a19-riverbend.png',
    createdAt: new Date('2026-08-25'),
    updatedAt: new Date('2026-08-25'),
  },
  // Salt Wind Way - 2 graphics
  {
    _id: 'g-saltwind-1',
    listingId: 'listing-salt-wind',
    templateId: 'style-b-square',
    variant: 'new-listing',
    overrides: {},
    photoAssignments: {},
    packageId: 'pkg-16',
    historyUrl: '/history/greg-16pack/salt-wind-way-lot-1.png',
    createdAt: new Date('2026-08-30'),
    updatedAt: new Date('2026-08-30'),
  },
  {
    _id: 'g-saltwind-2',
    listingId: 'listing-salt-wind',
    templateId: 'style-b-square',
    variant: 'new-listing',
    overrides: {},
    photoAssignments: {},
    packageId: 'pkg-16',
    historyUrl: '/history/greg-16pack/salt-wind-way-new-listing.png',
    createdAt: new Date('2026-09-09'),
    updatedAt: new Date('2026-09-09'),
  },
];

// Helpers
function getStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    return JSON.parse(stored, (k, v) => {
      // Revive dates
      if (k === 'createdAt' || k === 'updatedAt') return new Date(v);
      return v;
    });
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============ AGENTS ============

export function getAgents(): Agent[] {
  return getStorage(STORAGE_KEYS.agents, INITIAL_AGENTS);
}

export function getAgent(id: string): Agent | null {
  const agents = getAgents();
  return agents.find(a => a._id === id) || null;
}

export function createAgent(agent: Omit<Agent, '_id'> & { _id?: string }): Agent {
  const agents = getAgents();
  const newAgent: Agent = {
    ...agent,
    _id: agent._id || generateId(),
  };
  setStorage(STORAGE_KEYS.agents, [...agents, newAgent]);
  return newAgent;
}

export function updateAgent(id: string, updates: Partial<Agent>): Agent | null {
  const agents = getAgents();
  const index = agents.findIndex(a => a._id === id);
  if (index === -1) return null;

  const updated = { ...agents[index], ...updates };
  agents[index] = updated;
  setStorage(STORAGE_KEYS.agents, agents);
  return updated;
}

export function deleteAgent(id: string): boolean {
  const agents = getAgents();
  const filtered = agents.filter(a => a._id !== id);
  if (filtered.length === agents.length) return false;
  setStorage(STORAGE_KEYS.agents, filtered);
  return true;
}

// ============ LISTINGS ============

export function getListings(agentId?: string): Listing[] {
  const listings = getStorage(STORAGE_KEYS.listings, INITIAL_LISTINGS);
  if (agentId) return listings.filter(l => l.agentId === agentId);
  return listings;
}

export function getListing(id: string): Listing | null {
  const listings = getListings();
  return listings.find(l => l._id === id) || null;
}

export function createListing(listing: Omit<Listing, '_id' | 'createdAt' | 'updatedAt'>): Listing {
  const listings = getListings();
  const now = new Date();
  const newListing: Listing = {
    ...listing,
    _id: generateId(),
    photos: listing.photos || [],
    createdAt: now,
    updatedAt: now,
  };
  setStorage(STORAGE_KEYS.listings, [...listings, newListing]);
  return newListing;
}

export function updateListing(id: string, updates: Partial<Listing>): Listing | null {
  const listings = getListings();
  const index = listings.findIndex(l => l._id === id);
  if (index === -1) return null;

  const updated: Listing = {
    ...listings[index],
    ...updates,
    updatedAt: new Date(),
  };
  listings[index] = updated;
  setStorage(STORAGE_KEYS.listings, listings);
  return updated;
}

export function deleteListing(id: string): boolean {
  const listings = getListings();
  const filtered = listings.filter(l => l._id !== id);
  if (filtered.length === listings.length) return false;
  setStorage(STORAGE_KEYS.listings, filtered);

  // Also delete associated graphics
  const graphics = getGraphics();
  setStorage(STORAGE_KEYS.graphics, graphics.filter(g => g.listingId !== id));
  return true;
}

// ============ PHOTOS ============

export function addPhoto(listingId: string, photo: Photo): Listing | null {
  const listing = getListing(listingId);
  if (!listing) return null;

  const photos = [...listing.photos, photo];
  return updateListing(listingId, { photos });
}

export function updatePhoto(listingId: string, photoId: string, updates: Partial<Photo>): Listing | null {
  const listing = getListing(listingId);
  if (!listing) return null;

  const photos = listing.photos.map(p =>
    p.id === photoId ? { ...p, ...updates } : p
  );
  return updateListing(listingId, { photos });
}

export function updatePhotoFocal(listingId: string, photoId: string, focal: { x: number; y: number }): Listing | null {
  return updatePhoto(listingId, photoId, { focal });
}

export function deletePhoto(listingId: string, photoId: string): Listing | null {
  const listing = getListing(listingId);
  if (!listing) return null;

  const photos = listing.photos.filter(p => p.id !== photoId);
  return updateListing(listingId, { photos });
}

export function reorderPhotos(listingId: string, photoIds: string[]): Listing | null {
  const listing = getListing(listingId);
  if (!listing) return null;

  const photoMap = new Map(listing.photos.map(p => [p.id, p]));
  const reorderedPhotos = photoIds
    .map((id, index) => {
      const photo = photoMap.get(id);
      return photo ? { ...photo, sort: index } : null;
    })
    .filter((p): p is Photo => p !== null);

  return updateListing(listingId, { photos: reorderedPhotos });
}

// ============ GRAPHICS ============

export function getGraphics(listingId?: string): Graphic[] {
  const graphics = getStorage(STORAGE_KEYS.graphics, INITIAL_GRAPHICS);
  if (listingId) return graphics.filter(g => g.listingId === listingId);
  return graphics;
}

export function getGraphicsByAgent(agentId: string): Graphic[] {
  const listings = getListings(agentId);
  const listingIds = new Set(listings.map(l => l._id));
  return getGraphics().filter(g => listingIds.has(g.listingId));
}

export function getGraphic(id: string): Graphic | null {
  const graphics = getGraphics();
  return graphics.find(g => g._id === id) || null;
}

export function createGraphic(graphic: Omit<Graphic, '_id' | 'createdAt' | 'updatedAt'>): Graphic {
  const graphics = getGraphics();
  const now = new Date();
  const newGraphic: Graphic = {
    ...graphic,
    _id: generateId(),
    overrides: graphic.overrides || {},
    photoAssignments: graphic.photoAssignments || {},
    createdAt: now,
    updatedAt: now,
  };
  setStorage(STORAGE_KEYS.graphics, [...graphics, newGraphic]);
  return newGraphic;
}

export function updateGraphic(id: string, updates: Partial<Graphic>): Graphic | null {
  const graphics = getGraphics();
  const index = graphics.findIndex(g => g._id === id);
  if (index === -1) return null;

  const updated: Graphic = {
    ...graphics[index],
    ...updates,
    updatedAt: new Date(),
  };
  graphics[index] = updated;
  setStorage(STORAGE_KEYS.graphics, graphics);
  return updated;
}

export function deleteGraphic(id: string): boolean {
  const graphics = getGraphics();
  const filtered = graphics.filter(g => g._id !== id);
  if (filtered.length === graphics.length) return false;
  setStorage(STORAGE_KEYS.graphics, filtered);
  return true;
}

// ============ PACKAGES ============

export function getPackages(agentId?: string): Package[] {
  const packages = getStorage(STORAGE_KEYS.packages, INITIAL_PACKAGES);
  if (agentId) return packages.filter(p => p.agentId === agentId);
  return packages;
}

export function getPackage(id: string): Package | null {
  const packages = getPackages();
  return packages.find(p => p._id === id) || null;
}

export function getActivePackage(agentId: string): Package | null {
  const packages = getPackages(agentId);
  return packages.find(p => p.status === 'active') || null;
}

export function createPackage(pkg: Omit<Package, '_id'>): Package {
  const packages = getPackages();
  const newPackage: Package = {
    ...pkg,
    _id: generateId(),
  };
  setStorage(STORAGE_KEYS.packages, [...packages, newPackage]);
  return newPackage;
}

export function updatePackage(id: string, updates: Partial<Package>): Package | null {
  const packages = getPackages();
  const index = packages.findIndex(p => p._id === id);
  if (index === -1) return null;

  const updated = { ...packages[index], ...updates };
  packages[index] = updated;
  setStorage(STORAGE_KEYS.packages, packages);
  return updated;
}

export function getPackageUsage(packageId: string): { used: number; limit: number } {
  const pkg = getPackage(packageId);
  if (!pkg) return { used: 0, limit: 0 };

  const graphics = getGraphics().filter(g => g.packageId === packageId);
  return {
    used: graphics.length,
    limit: PACKAGE_LIMITS[pkg.type],
  };
}

// ============ AGGREGATIONS ============

export function getAgentStats(agentId: string): { listings: number; graphics: number; packageUsage?: { used: number; limit: number } } {
  const listings = getListings(agentId);
  const graphics = getGraphicsByAgent(agentId);
  const activePackage = getActivePackage(agentId);

  const result: { listings: number; graphics: number; packageUsage?: { used: number; limit: number } } = {
    listings: listings.length,
    graphics: graphics.length,
  };

  if (activePackage) {
    result.packageUsage = getPackageUsage(activePackage._id);
  }

  return result;
}

// ============ FULL GRAPHIC DATA ============

export type FullGraphicData = {
  graphic: Graphic;
  listing: Listing;
  agent: Agent;
  coAgent?: Agent;
};

export function getFullGraphicData(graphicId: string): FullGraphicData | null {
  const graphic = getGraphic(graphicId);
  if (!graphic) return null;

  const listing = getListing(graphic.listingId);
  if (!listing) return null;

  const agent = getAgent(listing.agentId);
  if (!agent) return null;

  return { graphic, listing, agent };
}

// ============ RESET ============

export function resetToInitial(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.agents);
  localStorage.removeItem(STORAGE_KEYS.listings);
  localStorage.removeItem(STORAGE_KEYS.graphics);
  localStorage.removeItem(STORAGE_KEYS.packages);
}
