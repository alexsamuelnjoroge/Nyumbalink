import Link from 'next/link';

const FEATURED_AREAS = [
  {
    name: 'Ruaka',
    slug: 'ruaka',
    fromPrice: 9000,
    listingCount: 142,
    routes: ['CBD', 'Westlands'],
    tag: 'Popular with young professionals',
  },
  {
    name: 'Rongai',
    slug: 'rongai',
    fromPrice: 8000,
    listingCount: 118,
    routes: ['CBD', 'City Stadium'],
    tag: 'Affordable & spacious',
  },
  {
    name: 'Kasarani',
    slug: 'kasarani',
    fromPrice: 10000,
    listingCount: 97,
    routes: ['CBD', 'Thika Road'],
    tag: 'Growing mid-tier suburb',
  },
  {
    name: 'Kilimani',
    slug: 'kilimani',
    fromPrice: 30000,
    listingCount: 63,
    routes: ['CBD', 'Westlands', 'Ngong Rd'],
    tag: 'Upmarket & central',
  },
];

function formatPrice(price: number) {
  return `KES ${price.toLocaleString()}`;
}

export default function FeaturedAreas() {
  return (
    <section className="px-4 py-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-[#1A202C]">Featured Areas</h2>
        <Link href="/areas" className="text-sm font-medium text-[#1B5E3B] hover:underline">
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {FEATURED_AREAS.map((area) => (
          <Link
            key={area.slug}
            href={`/search?area=${area.slug}`}
            className="flex items-center justify-between bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4 hover:border-[#1B5E3B] hover:shadow-sm transition-all group"
          >
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold text-[#1A202C] group-hover:text-[#1B5E3B] transition-colors">
                  {area.name}
                </span>
                <span className="text-[10px] bg-[#E8F5EE] text-[#1B5E3B] font-medium px-2 py-0.5 rounded-full">
                  {area.tag}
                </span>
              </div>
              <p className="text-sm text-[#4A5568]">
                From {formatPrice(area.fromPrice)}/mo · {area.listingCount} listings
              </p>
              <div className="flex items-center gap-1 mt-1">
                <svg className="w-3.5 h-3.5 text-[#A0AEC0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span className="text-xs text-[#A0AEC0]">
                  Matatu: {area.routes.join(', ')}
                </span>
              </div>
            </div>
            <svg className="w-5 h-5 text-[#A0AEC0] group-hover:text-[#1B5E3B] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
}
