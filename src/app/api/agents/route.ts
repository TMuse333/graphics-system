import { NextRequest, NextResponse } from 'next/server';
import { createAgent, getAgents } from '@/lib/db';

export async function GET() {
  try {
    const agents = await getAgents();
    return NextResponse.json(agents);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch agents', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const agent = await createAgent(body);
    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create agent', details: String(error) },
      { status: 500 }
    );
  }
}
