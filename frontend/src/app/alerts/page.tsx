'use client';

import { useState } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';

const UNIT_OPTIONS = [
  { value: 'BEDSITTER',   label: 'Bedsitter'  },
  { value: 'ONE_BED',     label: '1 Bedroom'  },
  { value: 'TWO_BED',     label: '2 Bedrooms' },
  { value: 'THREE_BED',   label: '3 Bedrooms' },
  { value: 'STUDIO',      label: 'Studio'     },
  { value: 'SQ',          label: 'SQ'         },
];

interface Alert {
  id:       string;
  area:     string;
  types:    string[];
  maxPrice: number;
  label:    string;
}

export default function AlertsPage() {
  const { user, isAuthenticated } = useRequireAuth();
  const [showForm, setShowForm] = useState(false);
  const [area,     setArea]     = useState('');
  const [types,    setTypes]    = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState('');
  const [alerts,   setAlerts]   = useState<Alert[]>([]);

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

  function toggleType(t: string) {
    setTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  }

  function handleCreate() {
    if (!area && types.length === 0) return;
    const parts: string[] = [];
    if (area) parts.push(area);
    if (types.length) parts.push(types.map((t) => UNIT_OPTIONS.find((o) => o.value === t)?.label ?? t).join(', '));
    if (maxPrice) parts.push(`≤ KES ${parseInt(maxPrice).toLocaleString()}`);
    const newAlert: Alert = {
      id:       Date.now().toString(),
      area, types,
      maxPrice: maxPrice ? parseInt(maxPrice) : 0,
      label:    parts.join(' · '),
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setArea(''); setTypes([]); setMaxPrice('');
    setShowForm(false);
  }

  function removeAlert(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FC]">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-10">
        <div className="max-w-2xl mx-auto px-4 pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Search alerts</h1>
              <p className="text-sm text-gray-500">Get notified when new listings match your criteria.</p>
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#1B5E3B] rounded-xl hover:bg-[#154d30] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              New alert
            </button>
          </div>

          {/* Create alert form */}
          {showForm && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Create alert</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Kilimani, Ruaka"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property type</label>
                  <div className="flex flex-wrap gap-2">
                    {UNIT_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => toggleType(o.value)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                          types.includes(o.value)
                            ? 'bg-[#1B5E3B] text-white border-[#1B5E3B]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B5E3B]'
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max rent (KES)</label>
                  <input
                    type="number"
                    placeholder="e.g. 30000"
                    value={maxPrice}
                    min={0}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B]"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleCreate}
                    disabled={!area && types.length === 0}
                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#1B5E3B] rounded-xl hover:bg-[#154d30] disabled:opacity-50 transition-colors"
                  >
                    Create alert
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Alert list */}
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">No alerts yet</h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Create an alert and we'll notify you when new matching listings go live.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#1B5E3B]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#1B5E3B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{alert.label}</p>
                      <p className="text-xs text-gray-400">Active · notifying via SMS</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label="Remove alert"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
