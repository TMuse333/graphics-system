import { NextRequest, NextResponse } from 'next/server';
import { getPackage, updatePackage } from '@/lib/mongodb/packages';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const pkg = await getPackage(id);
    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    return NextResponse.json(pkg);
  } catch (error) {
    console.error('[API] GET /api/packages/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const pkg = await updatePackage(id, body);
    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    return NextResponse.json(pkg);
  } catch (error) {
    console.error('[API] PATCH /api/packages/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}
