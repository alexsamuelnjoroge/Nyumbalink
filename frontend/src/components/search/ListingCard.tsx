import Link from 'next/link';
import Image from 'next/image';
import type { ListingCard as ListingCardType } from '@/types/listing';

const UNIT_LABELS: Record<string, string> = {
  BEDSITTER:   'Bedsitter',
  SINGLE_ROOM: 'Single Room',
  ONE_BED:     '1 Bed',
  TWO_BED:     '2 Bed',
  THREE_BED:   '3 Bed',
  STUDIO:      'Studio',
  SQ:          'SQ',
};

function formatKES(amount: number) {
  return new Intl.NumberFormat('en-KE', {
    style:    'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount);
}

function freshnessBadge(confirmedAt: string | null): { label: string; color: string } | null {
  if (!confirmedAt) return null;
  const days = Math.floor(
    (Date.now() - new Date(confirmedAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days <= 1) return { label: 'Confirmed today', color: 'text-[#27AE60] bg-green-50 border-green-200' };
  if (days <= 3) return { label: `Confirmed ${days}d ago`, color: 'text-[#27AE60] bg-green-50 border-green-200' };
  if (days <= 7) return { label: `Confirmed ${days}d ago`, color: 'text-amber-600 bg-amber-50 border-amber-200' };
  return null;
}

function tierBadge(tier: number) {
  if (tier >= 2) return { label: 'Licensed Agent', icon: '✓', color: 'text-[#1B5E3B] bg-green-50' };
  if (tier >= 1) return { label: 'Verified Landlord', icon: '✓', color: 'text-blue-700 bg-blue-50' };
  return null;
}

interface Props {
  listing: ListingCardType;
}

export default function ListingCard({ listing }: Props) {
  const photo = listing.photos[0];
  const freshness = freshnessBadge(listing.freshnessConfirmedAt);
  const tier = listing.agent.agentProfile?.verificationTier ?? 0;
  const badge = tierBadge(tier);

  const totalMoveIn =
    listing.monthlyRent *
    (1 + (listing.depositMonths ?? 1) + (listing.advanceMonths ?? 0));

  const mainRoute = listing.matautuRoutes[0];

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-shadow"
    >
      {/* Photo */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {photo ? (
          <Image
            src={photo.thumbnailUrl ?? photo.url}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className="px-2 py-0.5 text-xs font-semibold bg-white/90 text-gray-800 rounded-full shadow-sm">
            {UNIT_LABELS[listing.unitType] ?? listing.unitType}
          </span>
          {listing.isFeatured && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-[#F5A623] text-white rounded-full shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Freshness badge */}
        {freshness && (
          <div className={`absolute bottom-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full border ${freshness.color}`}>
            {freshness.label}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Area + title */}
        <p className="text-xs text-gray-500 mb-0.5">{listing.area.name}</p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-2">
          {listing.title}
        </h3>

        {/* Rent */}
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-xl font-bold text-[#1B5E3B]">
            {formatKES(listing.monthlyRent)}
          </span>
          <span className="text-xs text-gray-500">/mo</span>
        </div>

        {/* Move-in estimate */}
        <p className="text-xs text-gray-500 mb-3">
          Est. move-in:{' '}
          <span className="font-medium text-gray-700">{formatKES(totalMoveIn)}</span>
          {listing.commissionPayer === 'TENANT' && listing.commissionAmount && (
            <> + {formatKES(listing.commissionAmount)} agency fee</>
          )}
        </p>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {listing.selfContained && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
              Self-contained
            </span>
          )}
          {listing.furnishing !== 'UNFURNISHED' && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
              {listing.furnishing === 'FURNISHED' ? 'Furnished' : 'Semi-furnished'}
            </span>
          )}
          {listing.amenities?.parking && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">Parking</span>
          )}
          {listing.amenities?.internet && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">Internet</span>
          )}
        </div>

        {/* Matatu route */}
        {mainRoute && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
            <svg className="w-3.5 h-3.5 text-[#F5A623] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h4l2 4v3h-6V7z"/>
            </svg>
            <span>
              Route {mainRoute.route.routeNumber} → {mainRoute.route.destination}
              {mainRoute.walkMinutes != null && ` (${mainRoute.walkMinutes} min walk)`}
            </span>
          </div>
        )}

        {/* Agent */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            {badge ? (
              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium rounded-full ${badge.color}`}>
                {badge.icon} {badge.label}
              </span>
            ) : (
              <span className="text-xs text-gray-500">{listing.agent.fullName}</span>
            )}
          </div>
          {listing.agent.agentProfile?.avgRating != null &&
           listing.agent.agentProfile.avgRating > 0 && (
            <div className="flex items-center gap-0.5 text-xs text-gray-600">
              <svg className="w-3 h-3 text-[#F5A623]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {listing.agent.agentProfile.avgRating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
