'use client';

import { Stage } from './Stage';
import {
  Gen1Hero,
  Gen1Scrim,
  Gen1TopBar,
  Gen1Title,
  Gen1StatChip,
  Gen1PriceTag,
  Gen1AddressChip,
  Gen1Band,
  Gen1AgentIdent,
  Gen1ContactLine,
  Gen1Headshot,
  Gen1Logo,
} from './gen1';
import type { TemplateProps, Variant } from '@/lib/types';
import { money } from '@/lib/types';

/**
 * Land & Lots — 1080×1080.
 *
 * The 778/302 split: photo occupies the top three-quarters, the contact
 * band takes the rest. Built for acreage, where the lot is the product and
 * there are no interiors to show.
 */

const VARIANTS: Record<string, { bar: string; l1: string; l2?: string; priceLabel: string }> = {
  'new-listing': { bar: 'New Listing', l1: 'New', l2: 'Listing', priceLabel: 'Priced At' },
  'price-drop': { bar: 'Price Improvement', l1: 'Price', l2: 'Improvement', priceLabel: 'Now Priced At' },
  sold: { bar: 'Sold', l1: 'Just', l2: 'Sold', priceLabel: 'Sold For' },
  'just-sold': { bar: 'Sold', l1: 'Just', l2: 'Sold', priceLabel: 'Sold For' },
  featured: { bar: 'Featured Listing', l1: 'Featured', l2: 'Listing', priceLabel: 'Priced At' },
  'coming-soon': { bar: 'Coming Soon', l1: 'Coming', l2: 'Soon', priceLabel: 'Priced At' },
  'open-house': { bar: 'Open House', l1: 'Open', l2: 'House', priceLabel: 'Priced At' },
};

export function Gen1Square({ agent, listing, variant, overrides, photos }: TemplateProps) {
  const v = VARIANTS[variant as Variant] ?? VARIANTS['new-listing'];

  const headline = overrides.headline?.split('|');
  const line1 = headline?.[0]?.trim() ?? v.l1;
  const line2 = headline?.[1]?.trim() ?? v.l2;

  const isLand = listing.propertyType === 'land';
  const statRows = isLand
    ? [
        { value: String(listing.acres ?? '—'), label: 'Acres', valueSize: 38 },
        { value: 'Vacant Land', label: '', valueSize: 26 },
      ]
    : [
        { value: String(listing.beds ?? '—'), label: 'Bed' },
        { value: String(listing.baths ?? '—'), label: 'Bath' },
      ];

  return (
    <Stage width={1080} height={1080} theme={agent.theme}>
      <Gen1Hero photo={photos.hero} height={778} />
      <Gen1Scrim top={0} height={420} direction="top" />
      <Gen1Scrim top={560} height={218} direction="bottom" />

      <Gen1TopBar
        left={overrides.eyebrow ?? v.bar}
        center={`${agent.name} \u2022 Realty`}
        right={listing.province === 'PE' ? 'PEI' : listing.province}
      />

      <Gen1Title line1={line1} line2={line2} top={102} size={91} gap={82} />

      <Gen1StatChip rows={statRows} width={260} />
      <Gen1PriceTag
        label={overrides.badge ?? v.priceLabel}
        value={money(listing.price)}
        width={240}
      />

      <Gen1AddressChip
        lines={
          <>
            <span style={{ fontSize: 23 }}>
              {listing.address} // {listing.city}, {listing.province}
            </span>
            <span style={{ fontSize: 19 }}>MLS #{listing.mls}</span>
          </>
        }
      />

      <Gen1Band top={778} height={302}>
        <Gen1AgentIdent kicker="Contact Me Today" name={agent.name} role={agent.title} top={830} />
        <Gen1ContactLine glyph="phone" text={agent.phone} left={54} top={970} />
        <Gen1ContactLine glyph="email" text={agent.email} left={380} top={970} />
        <Gen1ContactLine glyph="web" text={agent.website} left={54} top={1018} />
      </Gen1Band>

      <Gen1Headshot url={agent.headshotUrl} left={734} top={410} width={346} height={670} />
      <Gen1Logo url={agent.logoUrl} left={903} top={897} size={140} />
    </Stage>
  );
}
