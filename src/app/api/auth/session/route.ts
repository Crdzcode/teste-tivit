import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession } from '@/lib/utils';
import { SESSION_COOKIE_NAME, SESSION_ROLE_COOKIE_NAME } from '@/lib/constants';

export async function GET() {
  const cookieStore = await cookies();
  const hasSidCookie = Boolean(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  const hasSidRoleCookie = Boolean(cookieStore.get(SESSION_ROLE_COOKIE_NAME)?.value);

  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      {
        authenticated: false,
        hasSidCookie,
        hasSidRoleCookie,
      }
    );
  }
  return NextResponse.json({ authenticated: true, role: session.role });
}