import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/utils';
import { getUserData } from '@/lib/api/user';

export async function GET() {
  const session = await getServerSession();

  if (!session || session.role !== 'user') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const data = await getUserData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}