import { NextRequest, NextResponse } from 'next/server';
import { getGraphics, createGraphic } from '@/lib/mongodb/graphics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId') || undefined;
    const graphics = await getGraphics(listingId);
    return NextResponse.json(graphics);
  } catch (error) {
    console.error('[API] GET /api/graphics error:', error);
    return NextResponse.json({ error: 'Failed to fetch graphics' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const graphic = await createGraphic(body);
    return NextResponse.json(graphic, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/graphics error:', error);
    return NextResponse.json({ error: 'Failed to create graphic' }, { status: 500 });
  }
}
