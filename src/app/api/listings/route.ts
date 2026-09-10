import { NextRequest, NextResponse } from 'next/server';
import { createListing, getListings } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const agentId = searchParams.get('agentId') || undefined;

  try {
    const listings = await getListings(agentId);
    return NextResponse.json(listings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch listings', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const listing = await createListing(body);
    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create listing', details: String(error) },
      { status: 500 }
    );
  }
}
