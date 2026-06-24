import type { ListingDraft } from '@/app/list/page';

const UNIT_TYPES = [
  { value: 'BEDSITTER',    label: 'Bedsitter'    },
  { value: 'SINGLE_ROOM',  label: 'Single Room'  },
  { value: 'ONE_BED',      label: '1 Bedroom'    },
  { value: 'TWO_BED',      label: '2 Bedrooms'   },
  { value: 'THREE_BED',    label: '3 Bedrooms'   },
  { value: 'STUDIO',       label: 'Studio'       },
  { value: 'SQ',           label: 'SQ'           },
];

interface Props {
  draft:  ListingDraft;
  update: (f: Partial<ListingDraft>) => void;
  onNext: () => void;
}

export default function Step1Basic({ draft, update, onNext }: Props) {
  const valid = !!draft.unitType && !!draft.area;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-0.5">Property basics</h2>
        <p className="text-sm text-gray-500">Tell us about the property type and location.</p>
      </div>

      {/* Unit type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Property type *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {UNIT_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => update({ unitType: t.value })}
              className={`py-2.5 px-3 text-sm font-medium rounded-xl border-2 transition-colors text-center ${
                draft.unitType === t.value
                  ? 'border-[#1B5E3B] bg-green-50 text-[#1B5E3B]'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Area / Neighbourhood *</label>
        <input
          type="text"
          placeholder="e.g. Kilimani, Ruaka, Athi River"
          value={draft.area}
          onChange={(e) => update({ area: e.target.value })}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B]"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Street / Building name</label>
        <input
          type="text"
          placeholder="e.g. Acacia Court, Ngong Road"
          value={draft.addressText}
          onChange={(e) => update({ addressText: e.target.value })}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B]"
        />
      </div>

      {/* Floor */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Floor number</label>
          <input
            type="number"
            placeholder="e.g. 3"
            min={0}
            value={draft.floorNumber}
            onChange={(e) => update({ floorNumber: e.target.value })}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total floors</label>
          <input
            type="number"
            placeholder="e.g. 8"
            min={1}
            value={draft.totalFloors}
            onChange={(e) => update({ totalFloors: e.target.value })}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B]"
          />
        </div>
      </div>

      {/* Self-contained */}
      <div className="flex items-center justify-between py-3 border-y border-gray-100">
        <div>
          <p className="text-sm font-medium text-gray-800">Self-contained</p>
          <p className="text-xs text-gray-500">Has its own bathroom and kitchen</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={draft.selfContained}
          onClick={() => update({ selfContained: !draft.selfContained })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/40 ${
            draft.selfContained ? 'bg-[#1B5E3B]' : 'bg-gray-300'
          }`}
        >
          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
            draft.selfContained ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>

      <button
        onClick={onNext}
        disabled={!valid}
        className="w-full py-3 text-sm font-semibold text-white bg-[#1B5E3B] rounded-xl hover:bg-[#154d30] disabled:opacity-50 transition-colors"
      >
        Next: Pricing
      </button>
    </div>
  );
}
