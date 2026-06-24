'use client';

import { useRequireAuth } from '@/hooks/useRequireAuth';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import Link from 'next/link';

interface MockListing {
  id:          string;
  title:       string;
  area:        string;
  rent:        number;
  status:      'ACTIVE' | 'PENDING_REVIEW' | 'TAKEN' | 'EXPIRED';
  views:       number;
  wasTapped:   number;
  saves:       number;
  confirmed:   boolean;
  daysAgo:     number;
}

const STATUS_STYLES: Record<MockListing['status'], { label: string; color: string }> = {
  ACTIVE:         { label: 'Active',         color: 'bg-green-100 text-green-800'   },
  PENDING_REVIEW: { label: 'Under review',   color: 'bg-amber-100 text-amber-800'   },
  TAKEN:          { label: 'Taken',          color: 'bg-gray-100  text-gray-600'    },
  EXPIRED:        { label: 'Expired',        color: 'bg-red-100   text-red-700'     },
};

function formatKES(n: number) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);
}

export default function AgentDashboardPage() {
  const { user, isAuthenticated } = useRequireAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F7F9FC]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#1B5E3B] border-t-transparent rounded-full animate-spin" />
        </div>
        <BottomNav />
      </div>
    );
  }

  // Placeholder listings — replaced with real API data when backend is live
  const listings: MockListing[] = [];

  const totalViews   = listings.reduce((s, l) => s + l.views,     0);
  const totalWA      = listings.reduce((s, l) => s + l.wasTapped, 0);
  const activeCount  = listings.filter((l) => l.status === 'ACTIVE').length;
  const needsConfirm = listings.filter((l) => l.status === 'ACTIVE' && !l.confirmed).length;

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FC]">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-10">
        <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">My listings</h1>
              <p className="text-sm text-gray-500">Hello, {user.fullName || user.phoneNumber}</p>
            </div>
            <Link
              href="/list"
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-[#1B5E3B] rounded-xl hover:bg-[#154d30] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              New listing
            </Link>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Active listings', value: activeCount,   color: 'text-[#1B5E3B]' },
              { label: 'Total views',     value: totalViews,    color: 'text-blue-700'   },
              { label: 'WhatsApp taps',   value: totalWA,       color: 'text-[#25D366]'  },
              { label: 'Needs confirm',   value: needsConfirm,  color: 'text-amber-600'  },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Freshness reminder */}
          {needsConfirm > 0 && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  {needsConfirm} listing{needsConfirm > 1 ? 's' : ''} need freshness confirmation
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Confirm availability so renters know the property is still available.
                  Unconfirmed listings rank lower in search.
                </p>
              </div>
            </div>
          )}

          {/* Listings table */}
          {listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">No listings yet</h3>
              <p className="text-sm text-gray-500 max-w-xs mb-5">
                Post your first listing and start connecting with renters across Nairobi.
              </p>
              <Link
                href="/list"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1B5E3B] rounded-xl hover:bg-[#154d30] transition-colors"
              >
                Post a listing
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((listing) => {
                const statusInfo = STATUS_STYLES[listing.status];
                return (
                  <div key={listing.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                          {listing.status === 'ACTIVE' && !listing.confirmed && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                              Needs confirmation
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{listing.title}</h3>
                        <p className="text-xs text-gray-500">{listing.area} · Posted {listing.daysAgo}d ago</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-base font-bold text-[#1B5E3B]">{formatKES(listing.rent)}</p>
                        <p className="text-xs text-gray-400">/month</p>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex gap-4 text-xs text-gray-500 mb-3">
                      <span>{listing.views} views</span>
                      <span>{listing.wasTapped} WhatsApp</span>
                      <span>{listing.saves} saves</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/listing/${listing.id}`}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        View
                      </Link>
                      {listing.status === 'ACTIVE' && !listing.confirmed && (
                        <button
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1B5E3B] rounded-lg hover:bg-[#154d30] transition-colors">
                          Confirm available
                        </button>
                      )}
                      <button
                        className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors ml-auto">
                        Mark as taken
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
