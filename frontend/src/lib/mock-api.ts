import { MOCK_LISTINGS } from './mock-data';
import type { PaginatedListings, ListingDetail, ListingCard } from '@/types/listing';
import type { SearchParams } from './api';

function toCard(listing: ListingDetail): ListingCard {
  return {
    id:                   listing.id,
    title:                listing.title,
    unitType:             listing.unitType,
    addressText:          listing.addressText,
    monthlyRent:          listing.monthlyRent,
    depositMonths:        listing.depositMonths,
    advanceMonths:        listing.advanceMonths,
    commissionAmount:     listing.commissionAmount,
    commissionPayer:      listing.commissionPayer,
    furnishing:           listing.furnishing,
    selfContained:        listing.selfContained,
    amenities:            listing.amenities,
    isFeatured:           listing.isFeatured,
    freshnessConfirmedAt: listing.freshnessConfirmedAt,
    viewCount:            listing.viewCount,
    whatsappTapCount:     listing.whatsappTapCount,
    saveCount:            listing.saveCount,
    createdAt:            listing.createdAt,
    area: {
      id:   listing.area.id,
      name: listing.area.name,
      slug: listing.area.slug,
    },
    photos:       listing.photos.map((p) => ({ url: p.url, thumbnailUrl: p.thumbnailUrl })),
    agent:        listing.agent,
    matautuRoutes: listing.matautuRoutes,
  };
}

export function mockFetchListings(params: SearchParams): PaginatedListings {
  let results = [...MOCK_LISTINGS];

  // Area filter — match name or slug (case-insensitive substring)
  if (params.area) {
    const q = params.area.toLowerCase();
    results = results.filter(
      (l) => l.area.name.toLowerCase().includes(q) || l.area.slug.includes(q),
    );
  }

  // Unit type filter
  if (params.type) {
    const types = Array.isArray(params.type) ? params.type : [params.type];
    if (types.length > 0) {
      results = results.filter((l) => types.includes(l.unitType));
    }
  }

  // Price range
  if (params.minPrice) results = results.filter((l) => l.monthlyRent >= params.minPrice!);
  if (params.maxPrice) results = results.filter((l) => l.monthlyRent <= params.maxPrice!);

  // Furnishing
  if (params.furnishing) results = results.filter((l) => l.furnishing === params.furnishing);

  // Verified only (tier >= 1)
  if (params.verified) {
    results = results.filter((l) => (l.agent.agentProfile?.verificationTier ?? 0) >= 1);
  }

  // Sort: featured first, then by freshness
  results.sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    const tierA = a.agent.agentProfile?.verificationTier ?? 0;
    const tierB = b.agent.agentProfile?.verificationTier ?? 0;
    if (tierA !== tierB) return tierB - tierA;
    const freshA = a.freshnessConfirmedAt ? new Date(a.freshnessConfirmedAt).getTime() : 0;
    const freshB = b.freshnessConfirmedAt ? new Date(b.freshnessConfirmedAt).getTime() : 0;
    return freshB - freshA;
  });

  const page  = params.page  ?? 1;
  const limit = params.limit ?? 12;
  const total = results.length;
  const slice = results.slice((page - 1) * limit, page * limit);

  return {
    data: slice.map(toCard),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext:    page * limit < total,
      hasPrev:    page > 1,
    },
  };
}

export function mockFetchListing(id: string): ListingDetail | null {
  return MOCK_LISTINGS.find((l) => l.id === id) ?? null;
}
