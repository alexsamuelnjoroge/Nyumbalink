import Link from 'next/link';
import type { PaginatedListings } from '@/types/listing';
import ListingCard from './ListingCard';

interface Props {
  result: PaginatedListings;
  currentPage: number;
  searchQS: string;
}

export default function ListingGrid({ result, currentPage, searchQS }: Props) {
  const { data: listings, pagination } = result;

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">No listings found</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Try adjusting your filters — widen the price range or remove some criteria.
        </p>
        <Link
          href="/search"
          className="mt-4 px-4 py-2 text-sm font-medium text-[#1B5E3B] border border-[#1B5E3B] rounded-lg hover:bg-green-50 transition-colors"
        >
          Clear all filters
        </Link>
      </div>
    );
  }

  function pageLink(page: number) {
    const qs = new URLSearchParams(searchQS);
    qs.set('page', String(page));
    return `/search?${qs.toString()}`;
  }

  return (
    <div>
      {/* Count */}
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-medium text-gray-800">{pagination.total}</span> listing
        {pagination.total !== 1 ? 's' : ''} found
        {pagination.totalPages > 1 && (
          <> · Page {currentPage} of {pagination.totalPages}</>
        )}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {pagination.hasPrev && (
            <Link
              href={pageLink(currentPage - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Previous
            </Link>
          )}

          {/* Page numbers (show at most 5 around current) */}
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - currentPage) <= 2)
            .map((p) => (
              <Link
                key={p}
                href={pageLink(p)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  p === currentPage
                    ? 'bg-[#1B5E3B] text-white'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {p}
              </Link>
            ))}

          {pagination.hasNext && (
            <Link
              href={pageLink(currentPage + 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
