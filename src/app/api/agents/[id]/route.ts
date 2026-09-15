import { NextRequest, NextResponse } from 'next/server';
import { getAgent, updateAgent, deleteAgent } from '@/lib/mongodb/agents';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const agent = await getAgent(id);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    return NextResponse.json(agent);
  } catch (error) {
    console.error('[API] GET /api/agents/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const agent = await updateAgent(id, body);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    return NextResponse.json(agent);
  } catch (error) {
    console.error('[API] PATCH /api/agents/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteAgent(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] DELETE /api/agents/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 });
  }
}
