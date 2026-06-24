import * as ListingRepo from '../repositories/listing.repository';
import { getPagination } from '../utils/pagination';

export interface SearchQuery {
  area?:      string;
  type?:      string | string[];
  minPrice?:  string;
  maxPrice?:  string;
  water?:     string;
  power?:     string;
  furnishing?: string;
  verified?:  string;
  page?:      string;
  limit?:     string;
}

export async function searchListings(query: SearchQuery) {
  const pagination = getPagination({ page: query.page, limit: query.limit });

  const types = query.type
    ? (Array.isArray(query.type) ? query.type : [query.type])
    : undefined;

  const filters: ListingRepo.ListingSearchFilters = {
    area:         query.area,
    types,
    minPrice:     query.minPrice  ? parseInt(query.minPrice,  10) : undefined,
    maxPrice:     query.maxPrice  ? parseInt(query.maxPrice,  10) : undefined,
    water:        query.water,
    power:        query.power,
    furnishing:   query.furnishing,
    verifiedOnly: query.verified === 'true',
    featuredFirst: true,
  };

  const { listings, total } = await ListingRepo.searchListings(filters, pagination);

  return {
    data: listings,
    pagination: {
      total,
      page:       pagination.page,
      limit:      pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
      hasNext:    pagination.page * pagination.limit < total,
      hasPrev:    pagination.page > 1,
    },
  };
}

export async function getListingById(id: string) {
  const listing = await ListingRepo.getListingById(id);
  if (!listing) return null;

  // Increment view count without blocking the response
  ListingRepo.incrementViewCount(id).catch(() => {});

  return listing;
}

export async function recordWhatsappTap(id: string) {
  await ListingRepo.incrementWhatsappTapCount(id);
}

export async function confirmAvailability(listingId: string, agentId: string) {
  const result = await ListingRepo.confirmListingAvailability(listingId, agentId);
  return result.count > 0;
}
