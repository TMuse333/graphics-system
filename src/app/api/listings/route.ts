import { NextRequest, NextResponse } from 'next/server';
import { getListings, createListing } from '@/lib/mongodb/listings';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId') || undefined;
    const listings = await getListings(agentId);
    return NextResponse.json(listings);
  } catch (error) {
    console.error('[API] GET /api/listings error:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const listing = await createListing(body);
    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/listings error:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
