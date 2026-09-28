import { NextRequest, NextResponse } from 'next/server';
import { scrapeParagonListing, isParagonUrl, closeBrowser } from '@/lib/scraper/paragon';
import type { ScrapedListing } from '@/lib/scraper/types';

// Manual override fields that can be passed to fill in missing data
type ManualOverrides = Partial<Pick<ScrapedListing,
  'address' | 'city' | 'province' | 'price' | 'beds' | 'baths' | 'sqft' | 'lotSize' | 'propertyType' | 'description' | 'mlsNumber'
>>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, overrides } = body as { url: string; overrides?: ManualOverrides };

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!isParagonUrl(url)) {
      return NextResponse.json(
        { success: false, error: 'Only Paragon MLS URLs are supported' },
        { status: 400 }
      );
    }

    const result = await scrapeParagonListing(url);

    // Close the browser after scraping to free resources
    await closeBrowser();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Apply manual overrides to fill in missing data
    if (overrides && result.listing) {
      const listing = result.listing;

      // Only override if the scraped value is empty/null/0
      if (overrides.address && !listing.address) listing.address = overrides.address;
      if (overrides.city && !listing.city) listing.city = overrides.city;
      if (overrides.province) listing.province = overrides.province;
      if (overrides.price && !listing.price) listing.price = overrides.price;
      if (overrides.beds !== undefined && listing.beds === null) listing.beds = overrides.beds;
      if (overrides.baths !== undefined && listing.baths === null) listing.baths = overrides.baths;
      if (overrides.sqft !== undefined && listing.sqft === null) listing.sqft = overrides.sqft;
      if (overrides.lotSize && !listing.lotSize) listing.lotSize = overrides.lotSize;
      if (overrides.propertyType && !listing.propertyType) listing.propertyType = overrides.propertyType;
      if (overrides.description && !listing.description) listing.description = overrides.description;
      if (overrides.mlsNumber && !listing.mlsNumber) listing.mlsNumber = overrides.mlsNumber;

      // Remove debug info before returning
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (listing as any)._debug;
    }

    return NextResponse.json(result);
  } catch (error) {
    await closeBrowser();
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { success: false, error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  if (!isParagonUrl(url)) {
    return NextResponse.json(
      { success: false, error: 'Only Paragon MLS URLs are supported' },
      { status: 400 }
    );
  }

  const result = await scrapeParagonListing(url);
  await closeBrowser();

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json(result);
}
