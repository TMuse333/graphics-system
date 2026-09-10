import { NextRequest, NextResponse } from 'next/server';
import { createGraphic, getGraphics } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const listingId = searchParams.get('listingId') || undefined;

  try {
    const graphics = await getGraphics(listingId);
    return NextResponse.json(graphics);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch graphics', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const graphic = await createGraphic({
      ...body,
      listingId: new ObjectId(body.listingId),
    });
    return NextResponse.json(graphic, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create graphic', details: String(error) },
      { status: 500 }
    );
  }
}
