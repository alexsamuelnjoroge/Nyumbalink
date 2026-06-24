import { Prisma } from '@prisma/client';
import { prisma } from '../database/postgres';
import { PaginationParams } from '../utils/pagination';

export interface ListingSearchFilters {
  area?:       string;   // area slug or id
  types?:      string[]; // unit types
  minPrice?:   number;
  maxPrice?:   number;
  water?:      string;
  power?:      string;
  furnishing?: string;
  verifiedOnly?: boolean;
  featuredFirst?: boolean;
}

// Fields included in search result cards
const listingCardSelect = {
  id:                   true,
  title:                true,
  unitType:             true,
  addressText:          true,
  monthlyRent:          true,
  depositMonths:        true,
  advanceMonths:        true,
  commissionAmount:     true,
  commissionPayer:      true,
  furnishing:           true,
  selfContained:        true,
  amenities:            true,
  isFeatured:           true,
  freshnessConfirmedAt: true,
  viewCount:            true,
  whatsappTapCount:     true,
  saveCount:            true,
  createdAt:            true,
  area: {
    select: { id: true, name: true, slug: true },
  },
  photos: {
    where:   { isPrimary: true },
    select:  { url: true, thumbnailUrl: true },
    take:    1,
  },
  agent: {
    select: {
      id:       true,
      fullName: true,
      agentProfile: {
        select: {
          verificationTier: true,
          avgRating:        true,
          agentType:        true,
          chargesCommission: true,
          commissionMonths:  true,
          isSuspended:       true,
        },
      },
    },
  },
  matautuRoutes: {
    take: 2,
    select: {
      walkMinutes:     true,
      distanceMeters:  true,
      nearestStopName: true,
      route: {
        select: { routeNumber: true, name: true, destination: true },
      },
    },
  },
} satisfies Prisma.ListingSelect;

// Full detail for single listing page
const listingDetailSelect = {
  ...listingCardSelect,
  description:         true,
  lat:                 true,
  lng:                 true,
  floorNumber:         true,
  totalFloors:         true,
  availableFrom:       true,
  estWaterBill:        true,
  estElectricityBill:  true,
  serviceCharge:       true,
  garbageFee:          true,
  reportCount:         true,
  updatedAt:           true,
  expiresAt:           true,
  area: {
    select: {
      id:              true,
      name:            true,
      slug:            true,
      waterSituation:  true,
      waterNotes:      true,
      powerReliability: true,
      powerNotes:      true,
      noiseLevel:      true,
      securityLevel:   true,
      areaNotes:       true,
    },
  },
  photos: {
    orderBy: { sortOrder: 'asc' as const },
    select:  { id: true, url: true, thumbnailUrl: true, roomType: true, isPrimary: true, isVideo: true },
  },
  agent: {
    select: {
      id:       true,
      fullName: true,
      phoneNumber: true,
      agentProfile: {
        select: {
          agentType:          true,
          agencyName:         true,
          earbVerified:       true,
          verificationTier:   true,
          avgRating:          true,
          totalLettings:      true,
          responseRate:       true,
          avgResponseHours:   true,
          chargesCommission:  true,
          commissionMonths:   true,
          isSuspended:        true,
          createdAt:          true,
        },
      },
    },
  },
  matautuRoutes: {
    select: {
      walkMinutes:     true,
      distanceMeters:  true,
      nearestStopName: true,
      route: {
        select: {
          routeNumber:     true,
          name:            true,
          origin:          true,
          destination:     true,
          frequencyMinutes: true,
          operatingHours:  true,
        },
      },
    },
  },
} satisfies Prisma.ListingSelect;

export async function searchListings(
  filters: ListingSearchFilters,
  pagination: PaginationParams,
) {
  const where: Prisma.ListingWhereInput = {
    status: 'ACTIVE',
  };

  if (filters.area) {
    where.area = {
      OR: [{ slug: filters.area }, { id: filters.area }],
    };
  }

  if (filters.types?.length) {
    where.unitType = { in: filters.types as Prisma.EnumUnitTypeFilter['in'] };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.monthlyRent = {};
    if (filters.minPrice !== undefined) where.monthlyRent.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.monthlyRent.lte = filters.maxPrice;
  }

  if (filters.furnishing) {
    where.furnishing = filters.furnishing as Prisma.EnumFurnishingFilter['equals'];
  }

  if (filters.verifiedOnly) {
    where.agent = {
      agentProfile: { verificationTier: { gte: 1 } },
    };
  }

  const orderBy: Prisma.ListingOrderByWithRelationInput[] = [];
  if (filters.featuredFirst) orderBy.push({ isFeatured: 'desc' });
  orderBy.push(
    { agent: { agentProfile: { verificationTier: 'desc' } } },
    { freshnessConfirmedAt: 'desc' },
    { createdAt: 'desc' },
  );

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      select:  listingCardSelect,
      orderBy,
      skip:    pagination.skip,
      take:    pagination.limit,
    }),
    prisma.listing.count({ where }),
  ]);

  return { listings, total };
}

export async function getListingById(id: string) {
  return prisma.listing.findUnique({
    where:  { id, status: 'ACTIVE' },
    select: listingDetailSelect,
  });
}

export async function incrementViewCount(id: string) {
  await prisma.listing.update({
    where: { id },
    data:  { viewCount: { increment: 1 } },
  });
}

export async function incrementWhatsappTapCount(id: string) {
  await prisma.listing.update({
    where: { id },
    data:  { whatsappTapCount: { increment: 1 } },
  });
}

export async function confirmListingAvailability(id: string, agentId: string) {
  return prisma.listing.updateMany({
    where: { id, agentId },
    data:  { freshnessConfirmedAt: new Date() },
  });
}

export async function createListing(
  agentId: string,
  data: Omit<Prisma.ListingCreateInput, 'agent' | 'area'> & { areaId: string },
) {
  const { areaId, ...rest } = data;
  return prisma.listing.create({
    data: {
      ...rest,
      agent: { connect: { id: agentId } },
      area:  { connect: { id: areaId } },
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
}
