'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuthStore } from '@/store/auth';
import { logout } from '@/lib/auth-api';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import Link from 'next/link';

const ROLE_LABELS: Record<string, string> = {
  RENTER:   'Renter',
  AGENT:    'Agent',
  LANDLORD: 'Landlord',
  ADMIN:    'Admin',
};

export default function ProfilePage() {
  const { user, isAuthenticated } = useRequireAuth();
  const { accessToken, clearAuth } = useAuthStore();
  const router   = useRouter();
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F7F9FC]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#1B5E3B] border-t-transparent rounded-full animate-spin" />
        </div>
        <BottomNav />
      </div>
    );
  }

  async function handleLogout() {
    setLoading(true);
    try {
      await logout(accessToken ?? undefined);
    } catch {
      // Best-effort logout — clear locally regardless
    } finally {
      clearAuth();
      router.replace('/');
    }
  }

  const isAgent = user.role === 'AGENT' || user.role === 'LANDLORD';
  const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : user.phoneNumber.slice(-2);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FC]">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-10">
        <div className="max-w-xl mx-auto px-4 pt-6 space-y-5">

          {/* Avatar + name */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1B5E3B] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {initial}
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{user.fullName || 'NyumbaLink User'}</h1>
              <p className="text-sm text-gray-500">{user.phoneNumber}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </div>
          </div>

          {/* Menu items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {isAgent && (
              <Link
                href="/agent"
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1B5E3B]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#1B5E3B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-800">My listings</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            )}

            <Link
              href="/saved"
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-800">Saved listings</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </Link>

            <Link
              href="/alerts"
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-800">Search alerts</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* About */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-gray-600">Version</span>
              <span className="text-sm text-gray-400">1.0.0 beta</span>
            </div>
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-800">Help &amp; support</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full py-3.5 text-sm font-semibold text-red-600 bg-white border border-red-200 rounded-2xl hover:bg-red-50 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
