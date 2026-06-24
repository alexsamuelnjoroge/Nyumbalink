'use client';

import { useRouter } from 'next/navigation';

const UNIT_TYPES = [
  { label: 'Bedsitter',  value: 'bedsitter' },
  { label: '1 Bedroom',  value: 'one_bed' },
  { label: '2 Bedroom',  value: 'two_bed' },
  { label: '3 Bedroom',  value: 'three_bed' },
  { label: 'SQ',         value: 'sq' },
  { label: 'Studio',     value: 'studio' },
];

export default function UnitTypeSelector() {
  const router = useRouter();

  return (
    <div className="px-4 pb-6 max-w-2xl mx-auto w-full">
      <p className="text-xs font-semibold text-[#A0AEC0] uppercase tracking-wide mb-3">
        Browse by type
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {UNIT_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => router.push(`/search?type=${type.value}`)}
            className="flex flex-col items-center justify-center bg-white border border-[#E2E8F0] rounded-xl py-3 px-2 text-sm font-medium text-[#4A5568] hover:border-[#1B5E3B] hover:text-[#1B5E3B] hover:bg-[#E8F5EE] transition-colors"
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
