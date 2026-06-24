import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import PhotoGallery from '@/components/listing/PhotoGallery';
import CostBreakdown from '@/components/listing/CostBreakdown';
import NeighborhoodCard from '@/components/listing/NeighborhoodCard';
import AgentTrustPanel from '@/components/listing/AgentTrustPanel';
import { fetchListing } from '@/lib/api';

export async function generateMetadata(props: PageProps<'/listing/[id]'>) {
  const { id } = await props.params;
  try {
    const listing = await fetchListing(id);
    return {
      title:       `${listing.title} — NyumbaLink`,
      description: listing.description ?? `Rental listing in ${listing.area.name}, Nairobi.`,
    };
  } catch {
    return { title: 'Listing — NyumbaLink' };
  }
}

const UNIT_LABELS: Record<string, string> = {
  BEDSITTER: 'Bedsitter', SINGLE_ROOM: 'Single Room', ONE_BED: '1 Bedroom',
  TWO_BED: '2 Bedrooms', THREE_BED: '3 Bedrooms', STUDIO: 'Studio', SQ: 'SQ',
};

function formatKES(n: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency', currency: 'KES', maximumFractionDigits: 0,
  }).format(n);
}

function daysAgo(date: string) {
  const d = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  if (d === 0) return 'today';
  if (d === 1) return 'yesterday';
  return `${d} days ago`;
}

export default async function ListingDetailPage(props: PageProps<'/listing/[id]'>) {
  const { id } = await props.params;

  let listing;
  try {
    listing = await fetchListing(id);
  } catch {
    notFound();
  }

  const amenities = listing.amenities as unknown as Record<string, unknown> | null;

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FC]">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-10">
        <div className="max-w-6xl mx-auto px-4 pt-5">

          {/* Breadcrumb */}
          <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1B5E3B]">Home</Link>
            <span>/</span>
            <Link href="/search" className="hover:text-[#1B5E3B]">Search</Link>
            <span>/</span>
            <Link href={`/search?area=${listing.area.slug}`} className="hover:text-[#1B5E3B]">
              {listing.area.name}
            </Link>
            <span>/</span>
            <span className="text-gray-700 truncate max-w-[160px]">{listing.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Photo gallery */}
              <PhotoGallery photos={listing.photos} title={listing.title} />

              {/* Title + meta */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
                        {UNIT_LABELS[listing.unitType] ?? listing.unitType}
                      </span>
                      {listing.isFeatured && (
                        <span className="px-2.5 py-0.5 text-xs font-semibold bg-[#F5A623] text-white rounded-full">
                          Featured
                        </span>
                      )}
                      {listing.selfContained && (
                        <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                          Self-contained
                        </span>
                      )}
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">{listing.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">
                      {listing.area.name}
                      {listing.addressText && ` · ${listing.addressText}`}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-[#1B5E3B]">{formatKES(listing.monthlyRent)}</p>
                    <p className="text-xs text-gray-500">/month</p>
                  </div>
                </div>

                {/* Quick info row */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600 py-3 border-y border-gray-100">
                  {listing.furnishing !== 'UNFURNISHED' && (
                    <span>{listing.furnishing === 'FURNISHED' ? 'Furnished' : 'Semi-furnished'}</span>
                  )}
                  {listing.floorNumber != null && (
                    <span>Floor {listing.floorNumber}{listing.totalFloors ? `/${listing.totalFloors}` : ''}</span>
                  )}
                  {listing.availableFrom && (
                    <span>Available: {new Date(listing.availableFrom).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  )}
                  {listing.freshnessConfirmedAt && (
                    <span className="text-[#27AE60] font-medium">
                      Availability confirmed {daysAgo(listing.freshnessConfirmedAt)}
                    </span>
                  )}
                  <span className="text-gray-400">Posted {daysAgo(listing.createdAt)}</span>
                </div>

                {/* Description */}
                {listing.description && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1.5">About this property</h3>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {listing.description}
                    </p>
                  </div>
                )}

                {/* Amenities grid */}
                {amenities && (
                  <div className="mt-5">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { key: 'parking',      label: 'Parking'    },
                        { key: 'internet',     label: 'Internet'   },
                        { key: 'lift',         label: 'Elevator'   },
                        { key: 'balcony',      label: 'Balcony'    },
                        { key: 'pets_allowed', label: 'Pets OK'    },
                        { key: 'gym',          label: 'Gym'        },
                        { key: 'swimming_pool',label: 'Pool'       },
                      ]
                        .filter((a) => amenities[a.key])
                        .map((a) => (
                          <div key={a.key} className="flex items-center gap-1.5 text-sm text-gray-700">
                            <svg className="w-4 h-4 text-[#27AE60] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            {a.label}
                          </div>
                        ))}

                      {/* Water supply */}
                      {!!amenities.water && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                          </svg>
                          {(amenities.water as string) === 'HOURS_24' ? '24hr water' : 'Water available'}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cost breakdown */}
              <CostBreakdown listing={listing} />

              {/* Neighborhood */}
              <NeighborhoodCard area={listing.area} matautuRoutes={listing.matautuRoutes} />
            </div>

            {/* Right column — sticky agent panel */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-6 space-y-4">
                <AgentTrustPanel agent={listing.agent} listingId={listing.id} />

                {/* View count */}
                <p className="text-xs text-center text-gray-400">
                  {listing.viewCount} view{listing.viewCount !== 1 ? 's' : ''} ·{' '}
                  {listing.whatsappTapCount} WhatsApp contact{listing.whatsappTapCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
