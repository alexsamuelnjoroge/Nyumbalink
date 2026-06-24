'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchHero() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?area=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="bg-[#1B5E3B] px-4 pt-10 pb-12">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-2">
          Find your next home in Nairobi
        </h1>
        <p className="text-[#a8d5be] text-base mb-8">
          Verified listings. Real costs. Matatu routes included.
        </p>

        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="pl-4 text-[#A0AEC0]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search area or estate — e.g. Ruaka, Rongai, Kilimani"
              className="flex-1 px-3 py-4 text-[#1A202C] placeholder-[#A0AEC0] text-base outline-none bg-transparent"
            />
            <button
              type="submit"
              className="m-1.5 bg-[#1B5E3B] text-white font-semibold px-5 py-3 rounded-xl hover:bg-[#154d30] transition-colors text-sm whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
