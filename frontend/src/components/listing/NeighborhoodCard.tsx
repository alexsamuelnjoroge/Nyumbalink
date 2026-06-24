import type { ListingDetail } from '@/types/listing';

type Area = ListingDetail['area'];

const WATER_LABELS: Record<string, string> = {
  HOURS_24: '24-hour water',
  RATIONED: 'Rationed (scheduled)',
  BOREHOLE: 'Borehole',
  TANK:     'Storage tank',
  MIXED:    'Mixed sources',
};

const POWER_LABELS: Record<string, string> = {
  RELIABLE:    'Reliable',
  OCCASIONAL:  'Occasional outages',
  FREQUENT:    'Frequent outages',
};

const NOISE_LABELS: Record<string, string> = {
  QUIET:     'Quiet',
  MODERATE:  'Moderate',
  NOISY:     'Noisy',
  VERY_NOISY:'Very noisy',
};

const SECURITY_LABELS: Record<string, string> = {
  EXCELLENT: 'Excellent',
  GOOD:      'Good',
  MODERATE:  'Moderate',
  LOW:       'Low',
};

function dot(level: string | null | undefined): string {
  if (!level) return 'text-gray-400';
  if (['HOURS_24', 'RELIABLE', 'QUIET', 'EXCELLENT', 'GOOD'].includes(level)) return 'text-[#27AE60]';
  if (['RATIONED', 'OCCASIONAL', 'MODERATE'].includes(level)) return 'text-amber-500';
  return 'text-red-500';
}

interface Props {
  area: Area;
  matautuRoutes: ListingDetail['matautuRoutes'];
}

export default function NeighborhoodCard({ area, matautuRoutes }: Props) {
  const hasRealityData =
    area.waterSituation || area.powerReliability ||
    area.noiseLevel || area.securityLevel || area.areaNotes;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Neighborhood Reality</h2>
        <p className="text-xs text-gray-500 mt-0.5">{area.name} — community-sourced data</p>
      </div>

      {hasRealityData ? (
        <div className="px-5 py-4 grid grid-cols-2 gap-4">
          {area.waterSituation && (
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Water</p>
              <p className={`text-sm font-medium ${dot(area.waterSituation)}`}>
                {WATER_LABELS[area.waterSituation] ?? area.waterSituation}
              </p>
              {area.waterNotes && (
                <p className="text-xs text-gray-500 mt-0.5">{area.waterNotes}</p>
              )}
            </div>
          )}

          {area.powerReliability && (
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Power</p>
              <p className={`text-sm font-medium ${dot(area.powerReliability)}`}>
                {POWER_LABELS[area.powerReliability] ?? area.powerReliability}
              </p>
              {area.powerNotes && (
                <p className="text-xs text-gray-500 mt-0.5">{area.powerNotes}</p>
              )}
            </div>
          )}

          {area.noiseLevel && (
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Noise</p>
              <p className={`text-sm font-medium ${dot(area.noiseLevel)}`}>
                {NOISE_LABELS[area.noiseLevel] ?? area.noiseLevel}
              </p>
            </div>
          )}

          {area.securityLevel && (
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Security</p>
              <p className={`text-sm font-medium ${dot(area.securityLevel)}`}>
                {SECURITY_LABELS[area.securityLevel] ?? area.securityLevel}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="px-5 py-4 text-sm text-gray-500 italic">
          Neighborhood data not yet available for {area.name}.
        </p>
      )}

      {area.areaNotes && (
        <div className="px-5 pb-4">
          <p className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">{area.areaNotes}</p>
        </div>
      )}

      {/* Matatu routes */}
      {matautuRoutes.length > 0 && (
        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Matatu Routes</p>
          <div className="space-y-3">
            {matautuRoutes.map((r, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-[#F5A623]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#F5A623]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h4l2 4v3h-6V7z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    Route {r.route.routeNumber} · {r.route.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {r.route.origin && `${r.route.origin} → `}{r.route.destination}
                  </p>
                  <div className="flex gap-3 mt-1">
                    {r.walkMinutes != null && (
                      <span className="text-xs text-gray-600">
                        {r.walkMinutes} min walk
                        {r.nearestStopName ? ` to ${r.nearestStopName}` : ''}
                      </span>
                    )}
                    {r.route.frequencyMinutes != null && (
                      <span className="text-xs text-gray-600">
                        Every {r.route.frequencyMinutes} min
                      </span>
                    )}
                    {r.route.operatingHours && (
                      <span className="text-xs text-gray-600">{r.route.operatingHours}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
