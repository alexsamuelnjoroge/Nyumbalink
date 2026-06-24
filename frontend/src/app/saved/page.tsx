'use client';

import { useRequireAuth } from '@/hooks/useRequireAuth';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import Link from 'next/link';

export default function SavedPage() {
  const { user, isAuthenticated } = useRequireAuth();

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

  // Placeholder — will be populated from API when backend is up
  const savedListings: never[] = [];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FC]">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-10">
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Saved listings</h1>
          <p className="text-sm text-gray-500 mb-6">
            Properties you've bookmarked for later.
          </p>

          {savedListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">No saved listings yet</h3>
              <p className="text-sm text-gray-500 max-w-xs mb-5">
                Tap the bookmark icon on any listing to save it here for easy access.
              </p>
              <Link
                href="/search"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1B5E3B] rounded-xl hover:bg-[#154d30] transition-colors"
              >
                Browse listings
              </Link>
            </div>
          ) : null}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
