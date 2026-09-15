import { NextRequest, NextResponse } from 'next/server';
import { getGraphic, updateGraphic, deleteGraphic } from '@/lib/mongodb/graphics';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const graphic = await getGraphic(id);
    if (!graphic) {
      return NextResponse.json({ error: 'Graphic not found' }, { status: 404 });
    }
    return NextResponse.json(graphic);
  } catch (error) {
    console.error('[API] GET /api/graphics/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch graphic' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const graphic = await updateGraphic(id, body);
    if (!graphic) {
      return NextResponse.json({ error: 'Graphic not found' }, { status: 404 });
    }
    return NextResponse.json(graphic);
  } catch (error) {
    console.error('[API] PATCH /api/graphics/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update graphic' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteGraphic(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Graphic not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] DELETE /api/graphics/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete graphic' }, { status: 500 });
  }
}
