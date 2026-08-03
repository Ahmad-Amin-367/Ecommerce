'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * ProtectedRoute Component
 * - Client-side route guard using Zustand state + /me verification
 * - Waits for isAuthChecked
 * - Redirects to /login if unauthenticated
 * - Redirects non-admins away from admin routes
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isAuthChecked } = useAuthStore();

  useEffect(() => {
    if (!isAuthChecked) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (requireAdmin && user?.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [isAuthChecked, isAuthenticated, user, requireAdmin, router, pathname]);

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-text-muted">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (requireAdmin && user?.role !== 'ADMIN')) {
    return null;
  }

  return <>{children}</>;
}
