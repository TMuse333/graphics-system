import { NextRequest, NextResponse } from 'next/server';
import { updatePhoto, deletePhoto } from '@/lib/mongodb/listings';

type RouteContext = { params: Promise<{ id: string; photoId: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id, photoId } = await context.params;
    const updates = await request.json();
    const listing = await updatePhoto(id, photoId, updates);
    if (!listing) {
      return NextResponse.json({ error: 'Listing or photo not found' }, { status: 404 });
    }
    return NextResponse.json(listing);
  } catch (error) {
    console.error('[API] PATCH /api/listings/[id]/photos/[photoId] error:', error);
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id, photoId } = await context.params;
    const listing = await deletePhoto(id, photoId);
    if (!listing) {
      return NextResponse.json({ error: 'Listing or photo not found' }, { status: 404 });
    }
    return NextResponse.json(listing);
  } catch (error) {
    console.error('[API] DELETE /api/listings/[id]/photos/[photoId] error:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
