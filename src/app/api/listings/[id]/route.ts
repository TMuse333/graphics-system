import { NextRequest, NextResponse } from 'next/server';
import { getListing, updateListing, deleteListing } from '@/lib/mongodb/listings';
import { deleteGraphicsByListing } from '@/lib/mongodb/graphics';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const listing = await getListing(id);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }
    return NextResponse.json(listing);
  } catch (error) {
    console.error('[API] GET /api/listings/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const listing = await updateListing(id, body);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }
    return NextResponse.json(listing);
  } catch (error) {
    console.error('[API] PATCH /api/listings/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    // Delete associated graphics first
    await deleteGraphicsByListing(id);
    const deleted = await deleteListing(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] DELETE /api/listings/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }
}
