import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_COOKIE_NAME,
  SESSION_ROLE_COOKIE_NAME,
} from '@/lib/constants';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sid = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const role = request.cookies.get(SESSION_ROLE_COOKIE_NAME)?.value;

  if (pathname === '/login' && sid && role) {
    const redirectPath = role === 'admin' ? '/admin' : '/user';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (pathname === '/') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/user') || pathname.startsWith('/admin')) {
    if (!sid || !role) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname.startsWith('/user') && role !== 'user') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/user', request.url));
    }
  }

  return NextResponse.next();
}