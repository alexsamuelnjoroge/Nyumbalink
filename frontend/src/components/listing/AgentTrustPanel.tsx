'use client';

import { useState } from 'react';
import type { ListingDetail } from '@/types/listing';
import { recordWhatsappTap } from '@/lib/api';

type Agent = ListingDetail['agent'];

const TIER_INFO: Record<number, { label: string; description: string; color: string }> = {
  0: { label: 'Unverified',        description: 'Phone verified only',
       color: 'bg-gray-100 text-gray-600' },
  1: { label: 'Verified Landlord', description: 'Title deed or utility bill verified',
       color: 'bg-blue-50 text-blue-700' },
  2: { label: 'Licensed Agent',    description: 'EARB registered + KRA PIN verified',
       color: 'bg-green-50 text-[#1B5E3B]' },
  3: { label: 'Top Agent',         description: 'Licensed + strong community reviews',
       color: 'bg-[#1B5E3B] text-white' },
};

interface Props {
  agent:     Agent;
  listingId: string;
}

export default function AgentTrustPanel({ agent, listingId }: Props) {
  const [tapped, setTapped] = useState(false);
  const profile = agent.agentProfile;
  const tier    = profile?.verificationTier ?? 0;
  const info    = TIER_INFO[tier] ?? TIER_INFO[0];

  async function handleWhatsApp() {
    if (tapped) return;
    setTapped(true);
    recordWhatsappTap(listingId).catch(() => {});
    const phone = agent.phoneNumber?.replace(/\D/g, '') ?? '';
    const msg   = encodeURIComponent(
      `Hi, I saw your listing on NyumbaLink (ID: ${listingId}) and I am interested. Is it still available?`,
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank', 'noopener');
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Contact Agent</h2>
      </div>

      <div className="px-5 py-4">
        {/* Agent identity */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#1B5E3B]/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-[#1B5E3B]">
              {agent.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{agent.fullName}</p>
            {profile?.agencyName && (
              <p className="text-xs text-gray-500">{profile.agencyName}</p>
            )}
          </div>
        </div>

        {/* Trust tier badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 ${info.color}`}>
          {tier >= 1 && (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          )}
          {info.label}
        </div>
        <p className="text-xs text-gray-500 mb-4">{info.description}</p>

        {/* Stats */}
        {profile && (
          <div className="grid grid-cols-3 gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
            {profile.avgRating > 0 && (
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{profile.avgRating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
            )}
            {(profile.totalLettings ?? 0) > 0 && (
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{profile.totalLettings}</p>
                <p className="text-xs text-gray-500">Lettings</p>
              </div>
            )}
            {profile.responseRate != null && (
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{Math.round(profile.responseRate)}%</p>
                <p className="text-xs text-gray-500">Response</p>
              </div>
            )}
            {profile.avgResponseHours != null && (
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{profile.avgResponseHours.toFixed(1)}h</p>
                <p className="text-xs text-gray-500">Avg reply</p>
              </div>
            )}
          </div>
        )}

        {/* Commission notice */}
        {profile?.chargesCommission ? (
          <div className="flex items-start gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <p className="text-xs text-amber-700">
              This agent charges{' '}
              {profile.commissionMonths
                ? `${profile.commissionMonths} month${profile.commissionMonths > 1 ? 's' : ''} agency fee`
                : 'an agency fee'}{' '}
              — confirm the exact amount before committing.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <svg className="w-4 h-4 text-[#27AE60] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <p className="text-xs text-[#27AE60] font-medium">No agency fee for tenants</p>
          </div>
        )}

        {/* WhatsApp CTA */}
        {agent.phoneNumber ? (
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.117 1.529 5.845L.057 23.25a.75.75 0 00.916.916l5.405-1.472A11.928 11.928 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.525-5.174-1.438l-.371-.224-3.843 1.046 1.046-3.843-.224-.371A9.946 9.946 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp Agent
          </button>
        ) : (
          <p className="text-xs text-center text-gray-500 italic">
            Contact details visible after logging in.
          </p>
        )}
      </div>
    </div>
  );
}
