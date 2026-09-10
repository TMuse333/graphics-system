import { NextRequest, NextResponse } from 'next/server';
import { getAgent, updateAgent } from '@/lib/db';

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    const agent = await getAgent(id);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    return NextResponse.json(agent);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch agent', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const agent = await updateAgent(id, body);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    return NextResponse.json(agent);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update agent', details: String(error) },
      { status: 500 }
    );
  }
}
