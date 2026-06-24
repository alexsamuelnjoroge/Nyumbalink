'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import OtpInput from '@/components/auth/OtpInput';
import { useAuthStore } from '@/store/auth';
import { requestOTP, verifyOTP } from '@/lib/auth-api';

type Step = 'phone' | 'otp';

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('254') && digits.length === 12) return `+${digits}`;
  if (digits.startsWith('0') && digits.length === 10) return `+254${digits.slice(1)}`;
  if (digits.length === 9 && (digits[0] === '7' || digits[0] === '1')) return `+254${digits}`;
  return '';
}

export default function AuthPage() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const nextPath    = searchParams.get('next') ?? '/';
  const { user, setAuth } = useAuthStore();

  const [step,    setStep]    = useState<Step>('phone');
  const [phone,   setPhone]   = useState('');
  const [otp,     setOtp]     = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // If already logged in, redirect
  useEffect(() => {
    if (user) router.replace(nextPath);
  }, [user, nextPath, router]);

  // Cooldown countdown for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendOTP = useCallback(async () => {
    const normalized = normalizePhone(phone);
    if (!normalized) {
      setError('Enter a valid Kenyan number — e.g. 0712 345 678');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await requestOTP(normalized);
      setPhone(normalized);
      setStep('otp');
      setCooldown(60);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  }, [phone]);

  async function handleVerify() {
    if (otp.length < 6) {
      setError('Enter the full 6-digit code');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { user: u, accessToken } = await verifyOTP(phone, otp);
      setAuth(u, accessToken);
      router.replace(nextPath);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Incorrect code. Try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setOtp('');
    setError('');
    await sendOTP();
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      {/* Header */}
      <header className="px-5 pt-8 pb-4">
        <Link href="/" className="inline-flex items-center gap-1 text-2xl font-extrabold tracking-tight">
          <span className="text-[#1B5E3B]">Nyumba</span>
          <span className="text-[#F5A623]">Link</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="w-full max-w-sm">
          {step === 'phone' ? (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome</h1>
              <p className="text-sm text-gray-500 mb-8">
                Enter your Kenyan phone number to get started — no password needed.
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone number
              </label>
              <div className="flex gap-2 mb-4">
                <div className="flex items-center px-3 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 select-none">
                  🇰🇪 +254
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="712 345 678"
                  value={phone.replace(/^\+254/, '').replace(/^254/, '')}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && sendOTP()}
                  autoFocus
                  className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1B5E3B]/30 focus:border-[#1B5E3B] bg-white"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 mb-3 flex items-center gap-1.5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                  {error}
                </p>
              )}

              <button
                onClick={sendOTP}
                disabled={loading}
                className="w-full py-3.5 text-base font-semibold text-white bg-[#1B5E3B] rounded-xl hover:bg-[#154d30] disabled:opacity-60 transition-colors"
              >
                {loading ? 'Sending…' : 'Send OTP'}
              </button>

              <p className="text-xs text-gray-400 text-center mt-5">
                We'll send a 6-digit code via SMS. Standard rates may apply.
              </p>
            </div>
          ) : (
            <div>
              <button
                onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
                Change number
              </button>

              <h1 className="text-2xl font-bold text-gray-900 mb-1">Enter the code</h1>
              <p className="text-sm text-gray-500 mb-8">
                Sent to{' '}
                <span className="font-medium text-gray-800">{phone}</span>
              </p>

              <div className="mb-6">
                <OtpInput value={otp} onChange={setOtp} disabled={loading} />
              </div>

              {error && (
                <p className="text-sm text-red-600 mb-4 text-center flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                  {error}
                </p>
              )}

              <button
                onClick={handleVerify}
                disabled={loading || otp.length < 6}
                className="w-full py-3.5 text-base font-semibold text-white bg-[#1B5E3B] rounded-xl hover:bg-[#154d30] disabled:opacity-60 transition-colors mb-4"
              >
                {loading ? 'Verifying…' : 'Verify'}
              </button>

              <button
                onClick={handleResend}
                disabled={cooldown > 0}
                className="w-full py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
              >
                {cooldown > 0
                  ? `Resend code in ${cooldown}s`
                  : "Didn't receive it? Resend"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
