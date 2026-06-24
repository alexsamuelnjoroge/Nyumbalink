import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import FilterPanel from '@/components/search/FilterPanel';
import ListingGrid from '@/components/search/ListingGrid';
import { fetchListings } from '@/lib/api';
import type { PaginatedListings } from '@/types/listing';

export const metadata = {
  title: 'Search Rentals — NyumbaLink',
  description: 'Find rental properties in Nairobi and its environs.',
};

export default async function SearchPage(props: PageProps<'/search'>) {
  const sp = await props.searchParams;

  const area       = typeof sp.area       === 'string' ? sp.area       : undefined;
  const minPrice   = typeof sp.minPrice   === 'string' ? sp.minPrice   : undefined;
  const maxPrice   = typeof sp.maxPrice   === 'string' ? sp.maxPrice   : undefined;
  const furnishing = typeof sp.furnishing === 'string' ? sp.furnishing : undefined;
  const verified   = sp.verified === 'true';
  const page       = typeof sp.page === 'string' ? parseInt(sp.page, 10) : 1;

  const rawTypes = sp.type;
  const types = rawTypes
    ? Array.isArray(rawTypes) ? rawTypes : [rawTypes]
    : undefined;

  // Build a QS string (without page) for pagination links inside ListingGrid
  const filterQS = new URLSearchParams();
  if (area)       filterQS.set('area', area);
  if (minPrice)   filterQS.set('minPrice', minPrice);
  if (maxPrice)   filterQS.set('maxPrice', maxPrice);
  if (furnishing) filterQS.set('furnishing', furnishing);
  if (verified)   filterQS.set('verified', 'true');
  types?.forEach((t) => filterQS.append('type', t));

  let result: PaginatedListings | null = null;
  let error: string | null = null;

  try {
    result = await fetchListings({ area, type: types, minPrice: minPrice ? +minPrice : undefined,
      maxPrice: maxPrice ? +maxPrice : undefined, furnishing, verified, page, limit: 12 });
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load listings';
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FC]">
      <Navbar />

      <div className="sticky top-0 z-20 shadow-sm">
        <FilterPanel
          initialArea={area ?? ''}
          initialTypes={types ?? []}
          initialMinPrice={minPrice ?? ''}
          initialMaxPrice={maxPrice ?? ''}
          initialFurnishing={furnishing ?? ''}
          initialVerified={verified}
        />
      </div>

      <main className="flex-1 pb-24 md:pb-10">
        <div className="max-w-7xl mx-auto px-4 pt-6">
          {error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 mb-4 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 9v2m0 4h.01M5.07 19H19a2 2 0 001.75-2.9L13.75 4a2 2 0 00-3.5 0L3.25 16.1A2 2 0 005.07 19z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">Could not load listings</h3>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          ) : result ? (
            <ListingGrid result={result} currentPage={page} searchQS={filterQS.toString()} />
          ) : null}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
