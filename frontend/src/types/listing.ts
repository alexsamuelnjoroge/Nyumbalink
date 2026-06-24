export type UnitType =
  | 'BEDSITTER' | 'SINGLE_ROOM' | 'ONE_BED'
  | 'TWO_BED'   | 'THREE_BED'  | 'SQ' | 'STUDIO';

export type ListingStatus  = 'DRAFT' | 'PENDING_REVIEW' | 'ACTIVE' | 'TAKEN' | 'EXPIRED' | 'SUSPENDED';
export type CommissionPayer = 'TENANT' | 'LANDLORD' | 'NONE';
export type Furnishing      = 'FURNISHED' | 'SEMI' | 'UNFURNISHED';

export interface Amenities {
  water:        'HOURS_24' | 'RATIONED' | 'BOREHOLE' | 'TANK' | 'MIXED';
  power_backup: 'GENERATOR' | 'SOLAR' | 'NONE';
  security:     string[];
  parking:      boolean;
  internet:     boolean;
  lift:         boolean;
  balcony:      boolean;
  pets_allowed: boolean;
  gym:          boolean;
  swimming_pool: boolean;
}

export interface AgentProfile {
  verificationTier:  number;
  avgRating:         number;
  agentType:         string;
  chargesCommission: boolean;
  commissionMonths:  number | null;
  isSuspended:       boolean;
}

export interface ListingAgent {
  id:           string;
  fullName:     string;
  phoneNumber?: string;
  agentProfile: AgentProfile | null;
}

export interface ListingArea {
  id:   string;
  name: string;
  slug: string;
}

export interface ListingPhoto {
  id?:          string;
  url:          string;
  thumbnailUrl: string | null;
  roomType?:    string | null;
  isPrimary?:   boolean;
  isVideo?:     boolean;
}

export interface MatutuRoute {
  walkMinutes:     number | null;
  distanceMeters:  number | null;
  nearestStopName: string | null;
  route: {
    routeNumber:      string;
    name:             string;
    destination:      string;
    origin?:          string;
    frequencyMinutes?: number | null;
    operatingHours?:  string | null;
  };
}

// Shape returned by GET /api/listings (search card)
export interface ListingCard {
  id:                   string;
  title:                string;
  unitType:             UnitType;
  addressText:          string | null;
  monthlyRent:          number;
  depositMonths:        number | null;
  advanceMonths:        number | null;
  commissionAmount:     number | null;
  commissionPayer:      CommissionPayer;
  furnishing:           Furnishing;
  selfContained:        boolean;
  amenities:            Amenities;
  isFeatured:           boolean;
  freshnessConfirmedAt: string | null;
  viewCount:            number;
  whatsappTapCount:     number;
  saveCount:            number;
  createdAt:            string;
  area:                 ListingArea;
  photos:               Pick<ListingPhoto, 'url' | 'thumbnailUrl'>[];
  agent:                ListingAgent;
  matautuRoutes:        MatutuRoute[];
}

// Shape returned by GET /api/listings/:id (full detail)
export interface ListingDetail extends ListingCard {
  description:         string | null;
  lat:                 number | null;
  lng:                 number | null;
  floorNumber:         number | null;
  totalFloors:         number | null;
  availableFrom:       string | null;
  estWaterBill:        number | null;
  estElectricityBill:  number | null;
  serviceCharge:       number | null;
  garbageFee:          number | null;
  reportCount:         number;
  updatedAt:           string;
  expiresAt:           string | null;
  photos:              ListingPhoto[];
  area: ListingArea & {
    waterSituation?:   string | null;
    waterNotes?:       string | null;
    powerReliability?: string | null;
    powerNotes?:       string | null;
    noiseLevel?:       string | null;
    securityLevel?:    string | null;
    areaNotes?:        string | null;
  };
  agent: ListingAgent & {
    agentProfile: (AgentProfile & {
      agencyName?:       string | null;
      earbVerified?:     boolean;
      totalLettings?:    number;
      responseRate?:     number | null;
      avgResponseHours?: number | null;
      createdAt?:        string;
    }) | null;
  };
}

export interface PaginatedListings {
  data: ListingCard[];
  pagination: {
    total:      number;
    page:       number;
    limit:      number;
    totalPages: number;
    hasNext:    boolean;
    hasPrev:    boolean;
  };
}
