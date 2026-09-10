import { NextRequest, NextResponse } from 'next/server';
import { getGraphic, updateGraphic, deleteGraphic } from '@/lib/db';

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    const graphic = await getGraphic(id);
    if (!graphic) {
      return NextResponse.json({ error: 'Graphic not found' }, { status: 404 });
    }
    return NextResponse.json(graphic);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch graphic', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const graphic = await updateGraphic(id, body);
    if (!graphic) {
      return NextResponse.json({ error: 'Graphic not found' }, { status: 404 });
    }
    return NextResponse.json(graphic);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update graphic', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    const success = await deleteGraphic(id);
    if (!success) {
      return NextResponse.json({ error: 'Graphic not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete graphic', details: String(error) },
      { status: 500 }
    );
  }
}
