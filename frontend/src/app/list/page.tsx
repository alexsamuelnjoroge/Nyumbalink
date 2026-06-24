'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import Step1Basic from '@/components/list/Step1Basic';
import Step2Pricing from '@/components/list/Step2Pricing';
import Step3Amenities from '@/components/list/Step3Amenities';
import Step4Photos from '@/components/list/Step4Photos';

export type ListingDraft = {
  // Step 1
  unitType:      string;
  area:          string;
  addressText:   string;
  floorNumber:   string;
  totalFloors:   string;
  selfContained: boolean;
  // Step 2
  monthlyRent:   string;
  depositMonths: string;
  advanceMonths: string;
  furnishing:    string;
  commissionPayer: string;
  commissionAmount: string;
  availableFrom: string;
  estWaterBill:  string;
  estElectricity: string;
  serviceCharge: string;
  garbageFee:    string;
  // Step 3
  parking:       boolean;
  internet:      boolean;
  lift:          boolean;
  balcony:       boolean;
  petsAllowed:   boolean;
  gym:           boolean;
  pool:          boolean;
  water:         string;
  description:   string;
  // Step 4
  title:         string;
  photos:        File[];
};

const EMPTY_DRAFT: ListingDraft = {
  unitType: '', area: '', addressText: '', floorNumber: '', totalFloors: '',
  selfContained: false, monthlyRent: '', depositMonths: '1', advanceMonths: '0',
  furnishing: 'UNFURNISHED', commissionPayer: 'NONE', commissionAmount: '',
  availableFrom: '', estWaterBill: '', estElectricity: '', serviceCharge: '',
  garbageFee: '', parking: false, internet: false, lift: false, balcony: false,
  petsAllowed: false, gym: false, pool: false, water: 'TANK', description: '',
  title: '', photos: [],
};

const STEPS = ['Basics', 'Pricing', 'Amenities', 'Publish'];

export default function ListPage() {
  const { user, isAuthenticated } = useRequireAuth();
  const router   = useRouter();
  const [step,   setStep]   = useState(0);
  const [draft,  setDraft]  = useState<ListingDraft>(EMPTY_DRAFT);
  const [submitting, setSubmitting] = useState(false);

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

  function update(fields: Partial<ListingDraft>) {
    setDraft((d) => ({ ...d, ...fields }));
  }

  function next() { setStep((s) => Math.min(s + 1, STEPS.length - 1)); }
  function back() { setStep((s) => Math.max(s - 1, 0)); }

  async function handleSubmit() {
    setSubmitting(true);
    // Will POST to /api/listings when backend is ready
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    router.replace('/agent');
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FC]">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-10">
        <div className="max-w-2xl mx-auto px-4 pt-6">

          {/* Progress stepper */}
          <div className="flex items-center gap-0 mb-8">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-2 ${i < step ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors flex-shrink-0
                    ${i < step  ? 'bg-[#1B5E3B] text-white'
                    : i === step ? 'bg-[#1B5E3B] text-white ring-4 ring-[#1B5E3B]/20'
                    : 'bg-gray-200 text-gray-500'}`}
                  >
                    {i < step ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-[#1B5E3B]' : i < step ? 'text-gray-700' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-[#1B5E3B]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            {step === 0 && <Step1Basic draft={draft} update={update} onNext={next} />}
            {step === 1 && <Step2Pricing draft={draft} update={update} onNext={next} onBack={back} />}
            {step === 2 && <Step3Amenities draft={draft} update={update} onNext={next} onBack={back} />}
            {step === 3 && (
              <Step4Photos
                draft={draft} update={update} onBack={back}
                onSubmit={handleSubmit} submitting={submitting}
              />
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
