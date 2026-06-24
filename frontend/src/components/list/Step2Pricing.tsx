import type { ListingDraft } from '@/app/list/page';

interface Props {
  draft:  ListingDraft;
  update: (f: Partial<ListingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

const FURNISHING_OPTIONS = [
  { value: 'UNFURNISHED', label: 'Unfurnished'     },
  { value: 'SEMI',        label: 'Semi-furnished'  },
  { value: 'FURNISHED',   label: 'Furnished'       },
];

const COMMISSION_OPTIONS = [
  { value: 'NONE',     label: 'No commission charged'   },
  { value: 'TENANT',   label: 'Tenant pays agency fee'  },
  { value: 'LANDLORD', label: 'Landlord pays agency fee' },
];

function Field({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {note && <p className="text-xs text-gray-400 mb-1.5">{note}</p>}
      {children}
    </div>
  );
}

export default function Step2Pricing({ draft, update, onNext, onBack }: Props) {
  const valid = !!draft.monthlyRent && parseInt(draft.monthlyRent) > 0;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-0.5">Pricing &amp; terms</h2>
        <p className="text-sm text-gray-500">Be upfront — renters see everything before contacting you.</p>
      </div>

      <Field label="Monthly rent (KES) *">
        <input
          type="number" min={0} placeholder="e.g. 25000"
          value={draft.monthlyRent}
          onChange={(e) => update({ monthlyRent: e.target.value })}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B]"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Deposit (months)" note="Usually 1–2 months">
          <input
            type="number" min={0} max={6}
            value={draft.depositMonths}
            onChange={(e) => update({ depositMonths: e.target.value })}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B]"
          />
        </Field>
        <Field label="Advance (months)" note="Rent paid upfront">
          <input
            type="number" min={0} max={12}
            value={draft.advanceMonths}
            onChange={(e) => update({ advanceMonths: e.target.value })}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B]"
          />
        </Field>
      </div>

      <Field label="Furnishing">
        <div className="grid grid-cols-3 gap-2">
          {FURNISHING_OPTIONS.map((o) => (
            <button key={o.value} type="button"
              onClick={() => update({ furnishing: o.value })}
              className={`py-2.5 text-xs font-medium rounded-xl border-2 transition-colors ${
                draft.furnishing === o.value
                  ? 'border-[#1B5E3B] bg-green-50 text-[#1B5E3B]'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Agency commission">
        <div className="space-y-2">
          {COMMISSION_OPTIONS.map((o) => (
            <label key={o.value}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors ${
                draft.commissionPayer === o.value
                  ? 'border-[#1B5E3B] bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio" name="commission" value={o.value}
                checked={draft.commissionPayer === o.value}
                onChange={() => update({ commissionPayer: o.value })}
                className="accent-[#1B5E3B]"
              />
              <span className="text-sm font-medium text-gray-800">{o.label}</span>
            </label>
          ))}
        </div>
        {draft.commissionPayer === 'TENANT' && (
          <input
            type="number" min={0} placeholder="Agency fee amount (KES)"
            value={draft.commissionAmount}
            onChange={(e) => update({ commissionAmount: e.target.value })}
            className="mt-2 w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B]"
          />
        )}
      </Field>

      <Field label="Available from" note="Leave blank if immediately available">
        <input
          type="date"
          value={draft.availableFrom}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => update({ availableFrom: e.target.value })}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B] bg-white"
        />
      </Field>

      {/* Utility estimates */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-700 mb-1">Utility estimates (optional)</p>
        <p className="text-xs text-gray-400 mb-3">Helps renters calculate the real monthly cost</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'estWaterBill',  label: 'Water bill (KES)'   },
            { key: 'estElectricity',label: 'Electricity (KES)'  },
            { key: 'serviceCharge', label: 'Service charge (KES)'},
            { key: 'garbageFee',    label: 'Garbage fee (KES)'  },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-gray-600 mb-1">{label}</label>
              <input
                type="number" min={0} placeholder="0"
                value={draft[key as keyof ListingDraft] as string}
                onChange={(e) => update({ [key]: e.target.value } as Partial<ListingDraft>)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onBack}
          className="px-5 py-3 text-sm font-medium text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button onClick={onNext} disabled={!valid}
          className="flex-1 py-3 text-sm font-semibold text-white bg-[#1B5E3B] rounded-xl hover:bg-[#154d30] disabled:opacity-50 transition-colors">
          Next: Amenities
        </button>
      </div>
    </div>
  );
}
