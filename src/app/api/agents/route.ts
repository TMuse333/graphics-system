import { NextRequest, NextResponse } from 'next/server';
import { getAgents, createAgent } from '@/lib/mongodb/agents';

export async function GET() {
  try {
    const agents = await getAgents();
    return NextResponse.json(agents);
  } catch (error) {
    console.error('[API] GET /api/agents error:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const agent = await createAgent(body);
    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/agents error:', error);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
