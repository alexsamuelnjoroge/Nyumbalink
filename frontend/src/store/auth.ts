'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/lib/auth-api';

interface AuthState {
  user:        AuthUser | null;
  accessToken: string | null;
  setAuth:     (user: AuthUser, accessToken: string) => void;
  clearAuth:   () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:        null,
      accessToken: null,
      setAuth:     (user, accessToken) => set({ user, accessToken }),
      clearAuth:   () => set({ user: null, accessToken: null }),
    }),
    {
      name:        'nyumba-auth',
      // Don't persist the access token — keep it in memory only across tabs.
      // User stays logged in (via httpOnly refresh cookie) but gets a fresh
      // access token on next page load.
      partialize:  (state) => ({ user: state.user, accessToken: null }),
    },
  ),
);
