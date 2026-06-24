'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export function useRequireAuth() {
  const { user } = useAuthStore();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.replace(`/auth?next=${encodeURIComponent(pathname)}`);
    }
  }, [user, router, pathname]);

  return { user, isAuthenticated: !!user };
}
