'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import SurfaceCard from '@/components/common/SurfaceCard';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { RootState } from '@/lib/store';
import { cn } from '@/lib/utils/cn';

export default function Header() {
  const pathname = usePathname();
  const userState = useSelector((state: RootState) => state.user);
  const adminState = useSelector((state: RootState) => state.admin);
  const [sessionRole, setSessionRole] = useState<'user' | 'admin' | null>(null);

  const user = userState.data;
  const admin = adminState.data;

  const authenticated = !!(user || admin);
  const role = user ? 'user' : admin ? 'admin' : null;
  const name = user ? user.data.name : admin ? admin.data.name : '';

  const effectiveRole = role ?? sessionRole;

  const navigation = useMemo(
    () => [
      { href: '/user', label: 'User', visible: effectiveRole === 'user' },
      { href: '/admin', label: 'Admin', visible: effectiveRole === 'admin' },
    ],
    [effectiveRole]
  );

  useEffect(() => {
    if (role) {
      setSessionRole(role);
      return;
    }

    let active = true;

    const resolveSessionRole = async () => {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' });
        const payload = await response.json().catch(() => null);

        if (!active) {
          return;
        }

        setSessionRole(payload?.authenticated ? payload.role ?? null : null);
      } catch {
        if (active) {
          setSessionRole(null);
        }
      }
    };

    resolveSessionRole();

    return () => {
      active = false;
    };
  }, [role, pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <header className="top-4 z-50 px-[var(--space-shell)] pt-4">
      <SurfaceCard className="mx-auto flex w-full max-w-7xl animate-[fade-up_0.5s_ease-out] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-tivit-red to-tivit-red-deep text-lg font-bold text-white shadow-glow transition-transform duration-300 group-hover:scale-105">
              T
            </div>
            <div>
              <p className="font-display text-2xl font-semibold tracking-[0.25em] text-tivit-red">
                TIVIT
              </p>
              <p className="text-xs uppercase tracking-[0.32em] text-app-muted">
                Secure access experience
              </p>
            </div>
          </Link>
        </div>

        <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
          {effectiveRole && (
            <span className="inline-flex items-center rounded-full bg-surface-soft px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-app-muted shadow-neo-inset">
              Role · {effectiveRole}
            </span>
          )}

          <ThemeToggle />

          {authenticated ? (
            <button
              onClick={handleLogout}
              className="tivit-button-motion inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-tivit-red to-tivit-red-deep px-6 font-semibold text-white shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tivit-red/40"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="tivit-button-motion inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-tivit-red to-tivit-red-deep px-6 font-semibold text-white shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tivit-red/40"
            >
              Ir para login
            </Link>
          )}
        </div>
      </SurfaceCard>
    </header>
  );
}