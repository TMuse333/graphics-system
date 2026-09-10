import { NextRequest, NextResponse } from 'next/server';
import { getListing, updateListing, deleteListing } from '@/lib/db';

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    const listing = await getListing(id);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }
    return NextResponse.json(listing);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch listing', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const listing = await updateListing(id, body);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }
    return NextResponse.json(listing);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update listing', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    const success = await deleteListing(id);
    if (!success) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete listing', details: String(error) },
      { status: 500 }
    );
  }
}
