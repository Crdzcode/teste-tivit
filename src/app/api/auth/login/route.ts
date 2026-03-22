import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/api/auth';
import { createSession } from '@/lib/utils';
import { LoginRequest } from '@/lib/types';
import { getUserData } from '@/lib/api/user';
import { getAdminData } from '@/lib/api/admin';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const authResponse = await loginUser(body);

    await createSession({
      token: authResponse.token,
      role: authResponse.role,
      expiresAt: authResponse.expiresAt,
    });

    let userData = null;
    let adminData = null;
    if (authResponse.role === 'user') {
      userData = await getUserData();
    } else if (authResponse.role === 'admin') {
      adminData = await getAdminData();
    }

    return NextResponse.json({
      success: true,
      role: authResponse.role,
      userData,
      adminData,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}