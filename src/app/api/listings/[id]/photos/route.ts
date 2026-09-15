import { NextRequest, NextResponse } from 'next/server';
import { addPhoto, reorderPhotos } from '@/lib/mongodb/listings';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const photo = await request.json();
    const listing = await addPhoto(id, photo);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }
    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/listings/[id]/photos error:', error);
    return NextResponse.json({ error: 'Failed to add photo' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { photoIds } = await request.json();
    const listing = await reorderPhotos(id, photoIds);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }
    return NextResponse.json(listing);
  } catch (error) {
    console.error('[API] PUT /api/listings/[id]/photos error:', error);
    return NextResponse.json({ error: 'Failed to reorder photos' }, { status: 500 });
  }
}
