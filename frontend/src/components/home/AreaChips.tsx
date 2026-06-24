'use client';

import { useRouter } from 'next/navigation';

const POPULAR_AREAS = [
  'Ruaka', 'Rongai', 'South B/C', 'Kasarani',
  'Kilimani', 'Westlands', 'Athi River', 'Kitengela',
  'Ngong', 'Kileleshwa', 'Embakasi', 'Buruburu',
];

export default function AreaChips() {
  const router = useRouter();

  return (
    <div className="px-4 py-5 max-w-2xl mx-auto w-full">
      <p className="text-xs font-semibold text-[#A0AEC0] uppercase tracking-wide mb-3">
        Popular areas
      </p>
      <div className="flex flex-wrap gap-2">
        {POPULAR_AREAS.map((area) => (
          <button
            key={area}
            onClick={() => router.push(`/search?area=${encodeURIComponent(area)}`)}
            className="px-3.5 py-1.5 rounded-full text-sm font-medium bg-white border border-[#E2E8F0] text-[#4A5568] hover:border-[#1B5E3B] hover:text-[#1B5E3B] hover:bg-[#E8F5EE] transition-colors"
          >
            {area}
          </button>
        ))}
      </div>
    </div>
  );
}
