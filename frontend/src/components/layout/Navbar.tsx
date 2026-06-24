'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Link href="/areas" className="hover:text-[#1B5E3B] transition-colors">
            Areas
          </Link>
          <Link href="/how-it-works" className="hover:text-[#1B5E3B] transition-colors">
            How It Works
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-[#1B5E3B] hover:underline"
          >
            Sign In
          </Link>
          <Link
            href="/list-property"
            className="text-sm font-medium bg-[#1B5E3B] text-white px-4 py-2 rounded-full hover:bg-[#154d30] transition-colors"
          >
            List a Property
          </Link>
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
          <Link href="/search" className="block py-2 text-sm font-medium text-[#4A5568]">
            Browse Listings
          </Link>
          <Link href="/areas" className="block py-2 text-sm font-medium text-[#4A5568]">
            Areas
          </Link>
          <Link href="/how-it-works" className="block py-2 text-sm font-medium text-[#4A5568]">
            How It Works
          </Link>
          <hr className="border-[#E2E8F0]" />
          <Link href="/login" className="block py-2 text-sm font-medium text-[#1B5E3B]">
            Sign In
          </Link>
          <Link
            href="/list-property"
            className="block w-full text-center text-sm font-medium bg-[#1B5E3B] text-white px-4 py-2.5 rounded-full"
          >
            List a Property
          </Link>
        </div>
      )}
    </header>
  );
}
