'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchUserData, clearUser } from '@/lib/store/slices/userSlice';
import { fetchAdminData, clearAdmin } from '@/lib/store/slices/adminSlice';

export default function GlobalSessionHydrator() {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const router = useRouter();

  const userState = useSelector((state: RootState) => state.user);
  const adminState = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    const hydrateFromSession = async () => {
      if (userState.loading || adminState.loading) {
        return;
      }

      if (userState.data || adminState.data) {
        return;
      }

      try {
        const res = await fetch('/api/auth/session', { cache: 'no-store' });
        const sessionData = await res.json().catch(() => null);

        if (!res.ok || !sessionData?.authenticated) {
          const hasSessionCookies = Boolean(
            sessionData?.hasSidCookie || sessionData?.hasSidRoleCookie
          );

          if (hasSessionCookies) {
            await fetch('/api/auth/logout', {
              method: 'POST',
              cache: 'no-store',
            }).catch(() => undefined);
          }

          dispatch(clearUser());
          dispatch(clearAdmin());

          const isProtectedRoute =
            pathname.startsWith('/user') || pathname.startsWith('/admin');
          if (isProtectedRoute) {
            router.replace('/login');
          }

          return;
        }

        if (!sessionData?.authenticated || !sessionData?.role) {
          return;
        }

        if (sessionData.role === 'user') {
          if (!userState.error) {
            dispatch(clearAdmin());
            dispatch(fetchUserData());
          }
          return;
        }

        if (sessionData.role === 'admin') {
          if (!adminState.error) {
            dispatch(clearUser());
            dispatch(fetchAdminData());
          }
        }
      } catch {
        return;
      }
    };

    hydrateFromSession();
  }, [pathname, dispatch, userState, adminState, router]);

  return null;
}
