'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import type { ListingDraft } from '@/app/list/page';

interface Props {
  draft:      ListingDraft;
  update:     (f: Partial<ListingDraft>) => void;
  onBack:     () => void;
  onSubmit:   () => void;
  submitting: boolean;
}

const UNIT_LABELS: Record<string, string> = {
  BEDSITTER: 'Bedsitter', SINGLE_ROOM: 'Single Room', ONE_BED: '1 Bedroom',
  TWO_BED: '2 Bedrooms', THREE_BED: '3 Bedrooms', STUDIO: 'Studio', SQ: 'SQ',
};

function formatKES(n: number) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);
}

export default function Step4Photos({ draft, update, onBack, onSubmit, submitting }: Props) {
  const fileRef  = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/')).slice(0, 10);
    update({ photos: [...draft.photos, ...arr].slice(0, 10) });
    arr.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setPreviews((prev) => [...prev, e.target!.result as string]);
      };
      reader.readAsDataURL(f);
    });
  }

  function removePhoto(i: number) {
    update({ photos: draft.photos.filter((_, idx) => idx !== i) });
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  }

  const rent    = parseInt(draft.monthlyRent)   || 0;
  const deposit = (parseInt(draft.depositMonths) || 1) * rent;
  const advance = (parseInt(draft.advanceMonths) || 0) * rent;
  const commission = draft.commissionPayer === 'TENANT' ? (parseInt(draft.commissionAmount) || 0) : 0;
  const valid = !!draft.title;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-0.5">Title &amp; photos</h2>
        <p className="text-sm text-gray-500">Good photos get 3× more enquiries. Be honest.</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Listing title *</label>
        <input
          type="text"
          placeholder={`e.g. Spacious ${UNIT_LABELS[draft.unitType] ?? '2 Bed'} in ${draft.area || 'Kilimani'}`}
          value={draft.title}
          onChange={(e) => update({ title: e.target.value })}
          maxLength={120}
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B]"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{draft.title.length}/120</p>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos ({draft.photos.length}/10)
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#1B5E3B] transition-colors"
        >
          <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p className="text-sm text-gray-600">Drop photos here or <span className="text-[#1B5E3B] font-medium">browse</span></p>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG · max 10 photos</p>
        </div>
        <input
          ref={fileRef} type="file" accept="image/*" multiple hidden
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Preview grid */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                <Image src={src} alt={`Photo ${i + 1}`} fill className="object-cover" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 text-xs font-semibold bg-[#1B5E3B] text-white rounded">
                    Cover
                  </span>
                )}
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review summary */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
        <p className="font-semibold text-gray-800 mb-2">Listing summary</p>
        <div className="flex justify-between"><span className="text-gray-600">Type</span><span>{UNIT_LABELS[draft.unitType] ?? '—'}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">Area</span><span>{draft.area || '—'}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">Monthly rent</span><span className="font-medium text-[#1B5E3B]">{rent ? formatKES(rent) : '—'}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">Deposit</span><span>{deposit ? formatKES(deposit) : '—'}</span></div>
        {advance > 0 && <div className="flex justify-between"><span className="text-gray-600">Advance</span><span>{formatKES(advance)}</span></div>}
        {commission > 0 && <div className="flex justify-between"><span className="text-gray-600">Agency fee</span><span>{formatKES(commission)}</span></div>}
        <div className="flex justify-between pt-1.5 border-t border-gray-200 font-semibold">
          <span>Est. move-in</span>
          <span>{rent ? formatKES(rent + deposit + advance + commission) : '—'}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack}
          className="px-5 py-3 text-sm font-medium text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!valid || submitting}
          className="flex-1 py-3 text-sm font-semibold text-white bg-[#1B5E3B] rounded-xl hover:bg-[#154d30] disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Publishing…' : 'Publish listing'}
        </button>
      </div>
    </div>
  );
}
