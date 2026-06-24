'use client';

import { useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';

interface Props {
  value:    string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

const LEN = 6;

export default function OtpInput({ value, onChange, disabled }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length: LEN }, (_, i) => value[i] ?? '');

  function focus(i: number) {
    refs.current[i]?.focus();
  }

  function handleChange(i: number, e: ChangeEvent<HTMLInputElement>) {
    const ch = e.target.value.replace(/\D/g, '').slice(-1);
    const next = digits.map((d, idx) => (idx === i ? ch : d)).join('').slice(0, LEN);
    onChange(next.trimEnd());
    if (ch && i < LEN - 1) focus(i + 1);
  }

  function handleKey(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        const next = digits.map((d, idx) => (idx === i ? '' : d)).join('');
        onChange(next.trimEnd());
      } else if (i > 0) {
        focus(i - 1);
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      focus(i - 1);
    } else if (e.key === 'ArrowRight' && i < LEN - 1) {
      focus(i + 1);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LEN);
    onChange(pasted);
    focus(Math.min(pasted.length, LEN - 1));
  }

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: LEN }, (_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] ?? ''}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-colors disabled:opacity-50
            ${digits[i]
              ? 'border-[#1B5E3B] bg-green-50 text-[#1B5E3B]'
              : 'border-gray-300 bg-white text-gray-900'
            }
            focus:border-[#1B5E3B] focus:ring-2 focus:ring-[#1B5E3B]/20`}
        />
      ))}
    </div>
  );
}
