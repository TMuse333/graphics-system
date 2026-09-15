import { NextRequest, NextResponse } from 'next/server';
import { getPackages, getActivePackage, createPackage } from '@/lib/mongodb/packages';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const active = searchParams.get('active') === 'true';

    if (agentId && active) {
      const pkg = await getActivePackage(agentId);
      return NextResponse.json(pkg);
    }

    const packages = await getPackages(agentId || undefined);
    return NextResponse.json(packages);
  } catch (error) {
    console.error('[API] GET /api/packages error:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pkg = await createPackage(body);
    return NextResponse.json(pkg, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/packages error:', error);
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}
