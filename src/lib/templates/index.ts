import type { ComponentType } from 'react';
import type { TemplateProps, Variant } from '@/lib/types';

import { StyleBSquare } from './StyleBSquare';
import { Gen1Square } from './Gen1Square';
import { Gen1OpenHouse } from './Gen1OpenHouse';
import { ListingFlier } from './ListingFlier';

// ============ REGISTRY TYPES ============

export type TemplateFieldType = 'date' | 'time' | 'badge' | 'blurb' | 'features' | 'location';

export type PhotoSlots = {
  hero?: number;            // exactly N required
  strip?: [number, number]; // [min, max] optional range
  sub?: [number, number];
  row?: [number, number];
};

export type TemplateRegistryEntry = {
  type: string;
  name: string;
  category: TemplateCategory;
  size: [number, number];
  component: ComponentType<TemplateProps>;
  variants: Variant[];
  photos: PhotoSlots;
  fields?: Partial<Record<Variant, TemplateFieldType[]>>;
  requires?: ('acres' | 'beds' | 'baths')[];
  agents?: [number, number]; // [min, max] agent count, for co-listing
};

export type TemplateCategory = 'social' | 'land' | 'openhouse' | 'print';

// ============ CATEGORY METADATA ============

export const TEMPLATE_CATEGORIES: Record<TemplateCategory, { label: string; order: number }> = {
  social: { label: 'Social Square', order: 1 },
  land: { label: 'Land & Lots', order: 2 },
  openhouse: { label: 'Open House (Classic)', order: 3 },
  print: { label: 'Print Flier', order: 4 },
};

// ============ SUB-REGISTRIES ============

const SOCIAL_REGISTRY = {
  'style-b-square': {
    type: 'style-b-square',
    name: 'Social Square',
    category: 'social' as TemplateCategory,
    size: [1080, 1080] as [number, number],
    component: StyleBSquare,
    variants: ['new-listing', 'open-house', 'coming-soon', 'price-drop', 'just-sold'] as Variant[],
    photos: { hero: 1, strip: [0, 2] as [number, number] },
    fields: {
      'open-house': ['date', 'time'] as TemplateFieldType[],
      'just-sold': ['badge'] as TemplateFieldType[],
    },
  },
};

const LAND_REGISTRY = {
  'gen1-square': {
    type: 'gen1-square',
    name: 'Land & Lots',
    category: 'land' as TemplateCategory,
    size: [1080, 1080] as [number, number],
    component: Gen1Square,
    variants: ['new-listing', 'price-drop', 'sold', 'featured'] as Variant[],
    photos: { hero: 1 },
    requires: ['acres'] as ('acres' | 'beds' | 'baths')[],
  },
};

const OPENHOUSE_REGISTRY = {
  'gen1-open-house': {
    type: 'gen1-open-house',
    name: 'Open House (Classic)',
    category: 'openhouse' as TemplateCategory,
    size: [1080, 1080] as [number, number],
    component: Gen1OpenHouse,
    variants: ['open-house'] as Variant[],
    photos: { hero: 1, sub: [0, 2] as [number, number] },
    fields: {
      'open-house': ['date', 'time'] as TemplateFieldType[],
    },
    agents: [1, 2] as [number, number],
  },
};

const PRINT_REGISTRY = {
  'listing-flier': {
    type: 'listing-flier',
    name: 'Print Flier',
    category: 'print' as TemplateCategory,
    size: [1080, 1620] as [number, number],
    component: ListingFlier,
    variants: ['new-listing'] as Variant[],
    photos: { hero: 1, row: [2, 3] as [number, number] },
    fields: {
      'new-listing': ['blurb', 'features', 'location'] as TemplateFieldType[],
    },
  },
};

// ============ MAIN REGISTRY ============

export const TEMPLATE_REGISTRY: Record<string, TemplateRegistryEntry> = {
  ...SOCIAL_REGISTRY,
  ...LAND_REGISTRY,
  ...OPENHOUSE_REGISTRY,
  ...PRINT_REGISTRY,
};

// ============ HELPERS ============

export function getTemplate(id: string): TemplateRegistryEntry | undefined {
  return TEMPLATE_REGISTRY[id];
}

export function getTemplatesByCategory(category: TemplateCategory): TemplateRegistryEntry[] {
  return Object.values(TEMPLATE_REGISTRY).filter(t => t.category === category);
}

export function getAllTemplates(): TemplateRegistryEntry[] {
  return Object.values(TEMPLATE_REGISTRY);
}

export function getTemplateIds(): string[] {
  return Object.keys(TEMPLATE_REGISTRY);
}

export function getFieldsForVariant(templateId: string, variant: Variant): TemplateFieldType[] {
  const template = getTemplate(templateId);
  if (!template?.fields) return [];
  return template.fields[variant] || [];
}

// Field metadata for form generation
export const FIELD_METADATA: Record<TemplateFieldType, { label: string; type: 'text' | 'textarea' | 'list' }> = {
  date: { label: 'Date', type: 'text' },
  time: { label: 'Time', type: 'text' },
  badge: { label: 'Badge Text', type: 'text' },
  blurb: { label: 'Description', type: 'textarea' },
  features: { label: 'Features', type: 'list' },
  location: { label: 'Location Details', type: 'text' },
};
