import { NextRequest, NextResponse } from 'next/server';
import { scrapeParagonListing, isParagonUrl, closeBrowser } from '@/lib/scraper/paragon';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

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
