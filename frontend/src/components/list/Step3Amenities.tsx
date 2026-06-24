import type { ListingDraft } from '@/app/list/page';

interface Props {
  draft:  ListingDraft;
  update: (f: Partial<ListingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

const AMENITY_ITEMS: { key: keyof ListingDraft; label: string; icon: string }[] = [
  { key: 'parking',    label: 'Parking',         icon: '🚗' },
  { key: 'internet',   label: 'Internet/WiFi',   icon: '📶' },
  { key: 'lift',       label: 'Elevator',        icon: '🛗' },
  { key: 'balcony',    label: 'Balcony',         icon: '🏗️' },
  { key: 'petsAllowed',label: 'Pets allowed',    icon: '🐾' },
  { key: 'gym',        label: 'Gym',             icon: '🏋️' },
  { key: 'pool',       label: 'Swimming pool',   icon: '🏊' },
];

const WATER_OPTIONS = [
  { value: 'HOURS_24', label: '24-hour water'       },
  { value: 'RATIONED', label: 'Rationed (scheduled)'},
  { value: 'BOREHOLE', label: 'Borehole'            },
  { value: 'TANK',     label: 'Storage tank'        },
  { value: 'MIXED',    label: 'Mixed sources'       },
];

export default function Step3Amenities({ draft, update, onNext, onBack }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-0.5">Amenities &amp; details</h2>
        <p className="text-sm text-gray-500">Accurate details build trust and save everyone time.</p>
      </div>

      {/* Amenities checkboxes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
        <div className="grid grid-cols-2 gap-2">
          {AMENITY_ITEMS.map(({ key, label, icon }) => {
            const checked = !!draft[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => update({ [key]: !checked } as Partial<ListingDraft>)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-left transition-colors ${
                  checked
                    ? 'border-[#1B5E3B] bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-base">{icon}</span>
                <span className={`text-sm font-medium ${checked ? 'text-[#1B5E3B]' : 'text-gray-700'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Water supply */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Water supply</label>
        <div className="space-y-1.5">
          {WATER_OPTIONS.map((o) => (
            <label key={o.value}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                draft.water === o.value
                  ? 'border-[#1B5E3B] bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio" name="water" value={o.value}
                checked={draft.water === o.value}
                onChange={() => update({ water: o.value })}
                className="accent-[#1B5E3B]"
              />
              <span className="text-sm text-gray-800">{o.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <p className="text-xs text-gray-400 mb-1.5">
          Mention nearby landmarks, security situation, noise level, etc.
        </p>
        <textarea
          rows={5}
          placeholder="e.g. 2-bedroom apartment on 3rd floor with a great view. Quiet neighbourhood, 5 mins walk to matatu stage..."
          value={draft.description}
          onChange={(e) => update({ description: e.target.value })}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B] resize-none"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{draft.description.length} chars</p>
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onBack}
          className="px-5 py-3 text-sm font-medium text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button onClick={onNext}
          className="flex-1 py-3 text-sm font-semibold text-white bg-[#1B5E3B] rounded-xl hover:bg-[#154d30] transition-colors">
          Next: Publish
        </button>
      </div>
    </div>
  );
}
