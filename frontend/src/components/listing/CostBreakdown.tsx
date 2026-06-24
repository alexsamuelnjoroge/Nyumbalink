import type { ListingDetail } from '@/types/listing';

function formatKES(n: number | null | undefined) {
  if (n == null) return null;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency', currency: 'KES', maximumFractionDigits: 0,
  }).format(n);
}

interface Props {
  listing: Pick<
    ListingDetail,
    | 'monthlyRent' | 'depositMonths' | 'advanceMonths'
    | 'commissionAmount' | 'commissionPayer'
    | 'estWaterBill' | 'estElectricityBill'
    | 'serviceCharge' | 'garbageFee'
  >;
}

export default function CostBreakdown({ listing }: Props) {
  const deposit = listing.depositMonths
    ? listing.monthlyRent * listing.depositMonths
    : listing.monthlyRent;
  const advance = listing.advanceMonths
    ? listing.monthlyRent * listing.advanceMonths
    : 0;
  const commission =
    listing.commissionPayer === 'TENANT' ? (listing.commissionAmount ?? 0) : 0;

  const moveInTotal = listing.monthlyRent + deposit + advance + commission;

  const monthlyExtras =
    (listing.estWaterBill ?? 0) +
    (listing.estElectricityBill ?? 0) +
    (listing.serviceCharge ?? 0) +
    (listing.garbageFee ?? 0);

  const rows: { label: string; value: string; sub?: boolean; bold?: boolean; muted?: boolean }[] = [
    { label: 'Monthly rent',         value: formatKES(listing.monthlyRent) ?? '' },
    { label: `Deposit (${listing.depositMonths ?? 1} month${(listing.depositMonths ?? 1) > 1 ? 's' : ''})`,
      value: formatKES(deposit) ?? '', sub: true },
    ...(advance > 0
      ? [{ label: `Advance (${listing.advanceMonths} month${(listing.advanceMonths ?? 0) > 1 ? 's' : ''})`,
           value: formatKES(advance) ?? '', sub: true }]
      : []),
    ...(commission > 0
      ? [{ label: 'Agency fee (1-time)',
           value: formatKES(commission) ?? '', sub: true }]
      : []),
    { label: 'Total move-in cost', value: formatKES(moveInTotal) ?? '', bold: true },
  ];

  const extras: { label: string; value: string }[] = [];
  if (listing.estWaterBill)      extras.push({ label: 'Est. water bill',      value: formatKES(listing.estWaterBill)      ?? '' });
  if (listing.estElectricityBill) extras.push({ label: 'Est. electricity bill', value: formatKES(listing.estElectricityBill) ?? '' });
  if (listing.serviceCharge)     extras.push({ label: 'Service charge',       value: formatKES(listing.serviceCharge)     ?? '' });
  if (listing.garbageFee)        extras.push({ label: 'Garbage fee',          value: formatKES(listing.garbageFee)        ?? '' });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 bg-[#1B5E3B]">
        <h2 className="text-base font-semibold text-white">True Cost Breakdown</h2>
        <p className="text-xs text-green-200 mt-0.5">No surprises — all costs shown upfront</p>
      </div>

      <div className="px-5 py-4 space-y-2.5">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex justify-between items-baseline ${row.bold ? 'pt-2 border-t border-gray-100' : ''}`}
          >
            <span className={`text-sm ${row.sub ? 'pl-3 text-gray-500' : row.bold ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
              {row.sub && <span className="mr-1 text-gray-300">└</span>}
              {row.label}
            </span>
            <span className={`text-sm tabular-nums ${row.bold ? 'font-bold text-[#1B5E3B]' : 'text-gray-800'}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {extras.length > 0 && (
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-xs font-medium text-gray-500 mb-2.5 uppercase tracking-wide">
            Monthly utilities (estimates)
          </p>
          <div className="space-y-1.5">
            {extras.map((e) => (
              <div key={e.label} className="flex justify-between">
                <span className="text-sm text-gray-600">{e.label}</span>
                <span className="text-sm text-gray-800 tabular-nums">{e.value}</span>
              </div>
            ))}
            <div className="flex justify-between pt-1.5 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Est. monthly total</span>
              <span className="text-sm font-semibold text-gray-900 tabular-nums">
                {formatKES(listing.monthlyRent + monthlyExtras)}
              </span>
            </div>
          </div>
        </div>
      )}

      {listing.commissionPayer === 'LANDLORD' && (
        <div className="px-5 py-3 bg-green-50 border-t border-green-100">
          <p className="text-xs text-[#27AE60] font-medium">
            No agency fee for tenant — landlord pays commission
          </p>
        </div>
      )}
    </div>
  );
}
