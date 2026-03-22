import { cookies } from 'next/headers';
import {
  SESSION_COOKIE_NAME,
  SESSION_ROLE_COOKIE_NAME,
} from '../constants';
import {
  createServerSession,
  deleteServerSession,
  getServerSessionBySid,
  SessionRole,
} from '../session-store';

export async function getTokenFromCookie(): Promise<string | null> {
  const session = await getServerSession();
  return session?.token ?? null;
}

export async function getServerSession(): Promise<{ sid: string; token: string; role: SessionRole } | null> {
  const cookieStore = await cookies();
  const sid = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sid) {
    return null;
  }

  const session = getServerSessionBySid(sid);
  if (!session) {
    return null;
  }

  return {
    sid: session.sid,
    token: session.token,
    role: session.role,
  };
}

export async function setSessionCookie(sid: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
}

export async function setSessionRoleCookie(role: SessionRole) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_ROLE_COOKIE_NAME, role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
}

export async function createSession(input: { token: string; role: SessionRole }): Promise<string> {
  const session = createServerSession(input);
  await setSessionCookie(session.sid);
  await setSessionRoleCookie(session.role);
  return session.sid;
}

export async function clearSession() {
  const cookieStore = await cookies();
  const sid = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (sid) {
    deleteServerSession(sid);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(SESSION_ROLE_COOKIE_NAME);
}

export async function getRoleFromCookie(): Promise<'user' | 'admin' | null> {
  const session = await getServerSession();
  return session?.role ?? null;
}
