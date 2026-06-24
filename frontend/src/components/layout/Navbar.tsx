'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const initial = user?.fullName?.charAt(0).toUpperCase() ?? user?.phoneNumber?.slice(-2) ?? null;

  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#1B5E3B] font-bold text-xl tracking-tight">
            Nyumba<span className="text-[#F5A623]">Link</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4A5568]">
          <Link href="/search" className="hover:text-[#1B5E3B] transition-colors">
            Browse Listings
          </Link>
          <Link href="/how-it-works" className="hover:text-[#1B5E3B] transition-colors">
            How It Works
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/list"
                className="text-sm font-medium bg-[#1B5E3B] text-white px-4 py-2 rounded-full hover:bg-[#154d30] transition-colors"
              >
                List a Property
              </Link>
              <Link
                href="/profile"
                className="w-8 h-8 rounded-full bg-[#1B5E3B] text-white flex items-center justify-center text-sm font-bold hover:bg-[#154d30] transition-colors"
                aria-label="Profile"
              >
                {initial}
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth" className="text-sm font-medium text-[#1B5E3B] hover:underline">
                Sign In
              </Link>
              <Link
                href="/list"
                className="text-sm font-medium bg-[#1B5E3B] text-white px-4 py-2 rounded-full hover:bg-[#154d30] transition-colors"
              >
                List a Property
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[#4A5568]"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E2E8F0] px-4 pb-4 space-y-3">
          <Link href="/search" className="block py-2 text-sm font-medium text-[#4A5568]"
            onClick={() => setMenuOpen(false)}>
            Browse Listings
          </Link>
          <Link href="/how-it-works" className="block py-2 text-sm font-medium text-[#4A5568]"
            onClick={() => setMenuOpen(false)}>
            How It Works
          </Link>
          <hr className="border-[#E2E8F0]" />
          {user ? (
            <>
              <Link href="/profile" className="block py-2 text-sm font-medium text-gray-700"
                onClick={() => setMenuOpen(false)}>
                My Profile
              </Link>
              <Link href="/agent" className="block py-2 text-sm font-medium text-gray-700"
                onClick={() => setMenuOpen(false)}>
                My Listings
              </Link>
            </>
          ) : (
            <Link href="/auth" className="block py-2 text-sm font-medium text-[#1B5E3B]"
              onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
          )}
          <Link
            href="/list"
            className="block w-full text-center text-sm font-medium bg-[#1B5E3B] text-white px-4 py-2.5 rounded-full"
            onClick={() => setMenuOpen(false)}
          >
            List a Property
          </Link>
        </div>
      )}
    </header>
  );
}
