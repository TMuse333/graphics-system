import type { Agent, Listing, Graphic } from './types';
import { gregTheme } from './theme';

export const mockAgents: Agent[] = [
  {
    _id: 'greg-caseley',
    name: 'Greg Caseley',
    title: 'Realtor · PEI',
    phone: '902-888-9232',
    email: 'gcaseleyrealty@gmail.com',
    website: 'peislandrealty.ca',
    headshotUrl: '',
    logoUrl: '',
    theme: gregTheme,
  },
  {
    _id: 'sarah-miller',
    name: 'Sarah Miller',
    title: 'RE/MAX · Halifax',
    phone: '902-555-1234',
    email: 'sarah@remax.ca',
    website: 'sarahmiller.ca',
    headshotUrl: '',
    logoUrl: '',
    theme: {
      primary: '#1a1a2e',
      primaryAlt: '#16213e',
      accent: '#e94560',
      accentLight: '#ff6b6b',
      fontDisplay: 'Montserrat, sans-serif',
      fontNarrow: 'Roboto Condensed, sans-serif',
      fontScript: 'Dancing Script, cursive',
    },
  },
];

export const mockListings: Listing[] = [
  {
    _id: 'mock-listing-1' as any,
    agentId: 'greg-caseley',
    address: '278 Basinview Crescent',
    city: 'Darnley',
    province: 'PE',
    postal: 'C0B 1M0',
    mls: '202401',
    price: 425000,
    propertyType: 'residential',
    beds: 3,
    baths: 2,
    photos: [
      { id: 'p1', url: '/sample/hero.jpg', focal: { x: 50, y: 40 }, tag: 'hero', sort: 0 },
      { id: 'p2', url: '/sample/interior1.jpg', focal: { x: 50, y: 50 }, tag: 'interior', sort: 1 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'mock-listing-2' as any,
    agentId: 'greg-caseley',
    address: '45 Acres Route 2',
    city: 'Hunter River',
    province: 'PE',
    postal: 'C0A 1N0',
    mls: '202402',
    price: 89000,
    propertyType: 'land',
    acres: 45,
    photos: [
      { id: 'p3', url: '/sample/land.jpg', focal: { x: 50, y: 50 }, tag: 'hero', sort: 0 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockGraphics: Graphic[] = [
  {
    _id: 'mock-graphic-1' as any,
    listingId: 'mock-listing-1' as any,
    templateId: 'style-b-square',
    variant: 'new-listing',
    overrides: {},
    photoAssignments: { hero: 'p1' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'mock-graphic-2' as any,
    listingId: 'mock-listing-1' as any,
    templateId: 'style-b-square',
    variant: 'open-house',
    overrides: { date: 'Saturday, June 14', time: '2:00 - 4:00 PM' },
    photoAssignments: { hero: 'p1' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockAgentStats: Record<string, { listings: number; graphics: number }> = {
  'greg-caseley': { listings: 2, graphics: 2 },
  'sarah-miller': { listings: 1, graphics: 0 },
};
