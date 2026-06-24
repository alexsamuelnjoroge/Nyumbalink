'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { UnitType } from '@/types/listing';

const UNIT_TYPES: { value: UnitType; label: string }[] = [
  { value: 'BEDSITTER',   label: 'Bedsitter'  },
  { value: 'SINGLE_ROOM', label: 'Single Room' },
  { value: 'ONE_BED',     label: '1 Bedroom'  },
  { value: 'TWO_BED',     label: '2 Bedrooms' },
  { value: 'THREE_BED',   label: '3 Bedrooms' },
  { value: 'STUDIO',      label: 'Studio'     },
  { value: 'SQ',          label: 'SQ'         },
];

const FURNISHING_OPTIONS = [
  { value: '',           label: 'Any'          },
  { value: 'FURNISHED',  label: 'Furnished'    },
  { value: 'SEMI',       label: 'Semi-Furnished' },
  { value: 'UNFURNISHED',label: 'Unfurnished'  },
];

interface FilterPanelProps {
  initialArea?:       string;
  initialTypes?:      string[];
  initialMinPrice?:   string;
  initialMaxPrice?:   string;
  initialFurnishing?: string;
  initialVerified?:   boolean;
}

export default function FilterPanel({
  initialArea       = '',
  initialTypes      = [],
  initialMinPrice   = '',
  initialMaxPrice   = '',
  initialFurnishing = '',
  initialVerified   = false,
}: FilterPanelProps) {
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [area,       setArea]       = useState(initialArea);
  const [types,      setTypes]      = useState<string[]>(initialTypes);
  const [minPrice,   setMinPrice]   = useState(initialMinPrice);
  const [maxPrice,   setMaxPrice]   = useState(initialMaxPrice);
  const [furnishing, setFurnishing] = useState(initialFurnishing);
  const [verified,   setVerified]   = useState(initialVerified);
  const [open,       setOpen]       = useState(false);

  function toggleType(t: string) {
    setTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  function applyFilters() {
    const qs = new URLSearchParams(searchParams.toString());

    // Reset page on filter change
    qs.delete('page');

    if (area)       qs.set('area', area);       else qs.delete('area');
    if (minPrice)   qs.set('minPrice', minPrice); else qs.delete('minPrice');
    if (maxPrice)   qs.set('maxPrice', maxPrice); else qs.delete('maxPrice');
    if (furnishing) qs.set('furnishing', furnishing); else qs.delete('furnishing');
    if (verified)   qs.set('verified', 'true');  else qs.delete('verified');

    qs.delete('type');
    types.forEach((t) => qs.append('type', t));

    startTransition(() => {
      router.push(`/search?${qs.toString()}`);
      setOpen(false);
    });
  }

  function clearFilters() {
    setArea('');
    setTypes([]);
    setMinPrice('');
    setMaxPrice('');
    setFurnishing('');
    setVerified(false);
    startTransition(() => {
      router.push('/search');
    });
  }

  const hasFilters =
    !!area || types.length > 0 || !!minPrice || !!maxPrice ||
    !!furnishing || verified;

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters
          {hasFilters && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#1B5E3B] rounded-full">
              {types.length + (area ? 1 : 0) + (minPrice || maxPrice ? 1 : 0) +
               (furnishing ? 1 : 0) + (verified ? 1 : 0)}
            </span>
          )}
        </button>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-gray-500 underline">
            Clear all
          </button>
        )}
      </div>

      {/* Filter body — always visible on desktop, collapsible on mobile */}
      <div className={`bg-white border-b border-gray-200 ${open ? 'block' : 'hidden'} md:block`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-end gap-4">

          {/* Area */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Area</label>
            <input
              type="text"
              placeholder="e.g. Ruaka, Kilimani"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/40"
            />
          </div>

          {/* Unit types */}
          <div className="flex-[2]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
            <div className="flex flex-wrap gap-2">
              {UNIT_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => toggleType(t.value)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                    types.includes(t.value)
                      ? 'bg-[#1B5E3B] text-white border-[#1B5E3B]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B5E3B]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="flex gap-2 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Min (KES)</label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                min={0}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/40"
              />
            </div>
            <span className="pb-2 text-gray-400">–</span>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Max (KES)</label>
              <input
                type="number"
                placeholder="Any"
                value={maxPrice}
                min={0}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/40"
              />
            </div>
          </div>

          {/* Furnishing */}
          <div className="min-w-[140px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Furnishing</label>
            <select
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/40 bg-white"
            >
              {FURNISHING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Verified toggle */}
          <div className="flex items-center gap-2 pb-0.5">
            <button
              role="switch"
              aria-checked={verified}
              onClick={() => setVerified((v) => !v)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/40 ${
                verified ? 'bg-[#1B5E3B]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                  verified ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}
              />
            </button>
            <label className="text-xs text-gray-700 whitespace-nowrap cursor-pointer select-none"
              onClick={() => setVerified((v) => !v)}>
              Verified only
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              disabled={isPending}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#1B5E3B] rounded-lg hover:bg-[#154d30] disabled:opacity-60 transition-colors"
            >
              {isPending ? 'Loading…' : 'Apply'}
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="hidden md:block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
