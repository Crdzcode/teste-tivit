import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/utils';
import { getAdminData } from '@/lib/api/admin';

export async function GET() {
  const session = await getServerSession();

  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const data = await getAdminData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}