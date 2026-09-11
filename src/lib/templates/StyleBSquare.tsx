'use client';

import { Stage } from './Stage';
import {
  Hero,
  Veil,
  Headline,
  Ribbon,
  Price,
  AddressChip,
  PhotoStrip,
  AgentBand,
  metaLine,
} from './primitives';
import type { TemplateProps, Variant } from '@/lib/types';
import { money } from '@/lib/types';

/**
 * Social Square — 1080×1080.
 *
 * One layout, five variants. The variant only changes the headline words,
 * the ribbon kicker, and whether the price is a number or a status word;
 * geometry is identical across all five so the family reads as one system.
 */

type VariantCopy = {
  line1: string;
  line2: string;
  kicker: string;
  /** false = show the badge override instead of the price figure */
  showPrice?: boolean;
};

const VARIANTS: Record<Variant, VariantCopy> = {
  'new-listing': { line1: 'Just', line2: 'Listed!', kicker: 'Offered At', showPrice: true },
  'open-house': { line1: 'Open', line2: 'House!', kicker: 'Offered At', showPrice: true },
  'coming-soon': { line1: 'Coming', line2: 'Soon!', kicker: 'Offered At', showPrice: true },
  'price-drop': { line1: 'Price', line2: 'Improvement!', kicker: 'Now Listed At', showPrice: true },
  'just-sold': { line1: 'Just', line2: 'Sold!', kicker: 'Sold For', showPrice: true },
  sold: { line1: 'Just', line2: 'Sold!', kicker: 'Sold For', showPrice: true },
  featured: { line1: 'Featured', line2: 'Listing', kicker: 'Offered At', showPrice: true },
};

export function StyleBSquare({ agent, listing, variant, overrides, photos }: TemplateProps) {
  const copy = VARIANTS[variant] ?? VARIANTS['new-listing'];

  // Open house swaps the price kicker for the date and time, since the
  // when is the point of the graphic and the price is secondary.
  const isOpenHouse = variant === 'open-house';
  const kicker =
    overrides.eyebrow ??
    (isOpenHouse
      ? [overrides.date, overrides.time].filter(Boolean).join(' \u00b7 ') || copy.kicker
      : copy.kicker);

  const headlineText = overrides.headline?.split('|');
  const line1 = headlineText?.[0]?.trim() ?? copy.line1;
  const line2 = headlineText?.[1]?.trim() ?? copy.line2;

  const figure = overrides.badge ?? money(listing.price);

  return (
    <Stage width={1080} height={1080} theme={agent.theme}>
      <Hero photo={photos.hero} />
      <Veil />
      <Headline line1={line1} line2={line2} />
      <PhotoStrip photos={photos.strip} />
      <Ribbon>{kicker}</Ribbon>
      <Price>{figure}</Price>
      <AddressChip
        address={listing.address}
        locality={`${listing.city}, ${listing.province}`}
        meta={metaLine(listing)}
      />
      <AgentBand
        name={agent.name}
        role={agent.title}
        phone={agent.phone}
        website={agent.website}
        logoUrl={agent.logoUrl}
        headshotUrl={agent.headshotUrl}
      />
    </Stage>
  );
}
