import type { PaginatedListings, ListingDetail } from '@/types/listing';
import { mockFetchListings, mockFetchListing } from './mock-api';

const IS_MOCK  = process.env.NEXT_PUBLIC_MOCK === 'true';
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `Request failed: ${res.status}`);
  }

  const json = (await res.json()) as { success: boolean; data: T };
  return json.data;
}

export interface SearchParams {
  area?:       string;
  type?:       string | string[];
  minPrice?:   number;
  maxPrice?:   number;
  furnishing?: string;
  verified?:   boolean;
  page?:       number;
  limit?:      number;
}

function buildSearchQS(params: SearchParams): string {
  const qs = new URLSearchParams();

  if (params.area)       qs.set('area', params.area);
  if (params.minPrice)   qs.set('minPrice', String(params.minPrice));
  if (params.maxPrice)   qs.set('maxPrice', String(params.maxPrice));
  if (params.furnishing) qs.set('furnishing', params.furnishing);
  if (params.verified)   qs.set('verified', 'true');
  if (params.page)       qs.set('page', String(params.page));
  if (params.limit)      qs.set('limit', String(params.limit));

  if (params.type) {
    const types = Array.isArray(params.type) ? params.type : [params.type];
    types.forEach((t) => qs.append('type', t));
  }

  return qs.toString();
}

export async function fetchListings(params: SearchParams): Promise<PaginatedListings> {
  if (IS_MOCK) return mockFetchListings(params);
  const qs = buildSearchQS(params);
  return apiFetch<PaginatedListings>(`/listings?${qs}`, { cache: 'no-store' });
}

export async function fetchListing(id: string): Promise<ListingDetail> {
  if (IS_MOCK) {
    const listing = mockFetchListing(id);
    if (!listing) throw new Error('Listing not found');
    return listing;
  }
  return apiFetch<ListingDetail>(`/listings/${id}`, { next: { revalidate: 60 } });
}

export async function recordWhatsappTap(id: string): Promise<void> {
  if (IS_MOCK) return;
  await apiFetch<unknown>(`/listings/${id}/whatsapp-tap`, { method: 'POST' });
}
