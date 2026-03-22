import { NextResponse } from 'next/server';
import { getHealth } from '@/lib/api/health';

export async function GET() {
  try {
    const data = await getHealth();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Health check failed' }, { status: 500 });
  }
}