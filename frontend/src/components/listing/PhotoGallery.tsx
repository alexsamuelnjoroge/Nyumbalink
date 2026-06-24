'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ListingPhoto } from '@/types/listing';

interface Props {
  photos: ListingPhoto[];
  title:  string;
}

export default function PhotoGallery({ photos, title }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (photos.length === 0) {
    return (
      <div className="relative h-72 md:h-96 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      </div>
    );
  }

  const current = photos[active];

  return (
    <div>
      {/* Main photo */}
      <div
        className="relative h-72 md:h-[420px] rounded-2xl overflow-hidden cursor-pointer bg-gray-100"
        onClick={() => setLightbox(true)}
      >
        <Image
          src={current.url}
          alt={`${title} — photo ${active + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
          priority={active === 0}
        />
        {/* Photo count badge */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 text-white text-xs rounded-full">
          {active + 1} / {photos.length}
        </div>
        {/* Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setActive((i) => (i - 1 + photos.length) % photos.length); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActive((i) => (i + 1) % photos.length); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {photos.map((p, i) => (
            <button
              key={p.id ?? i}
              onClick={() => setActive(i)}
              className={`relative flex-shrink-0 w-16 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                i === active ? 'border-[#1B5E3B]' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={p.thumbnailUrl ?? p.url}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full"
            onClick={() => setLightbox(false)}
          >
            ×
          </button>
          <div
            className="relative w-full max-w-4xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.url}
              alt={`${title} — photo ${active + 1}`}
              width={1200}
              height={800}
              className="object-contain w-full h-full max-h-[85vh] rounded-lg"
            />
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setActive((i) => (i - 1 + photos.length) % photos.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xl"
                >
                  ‹
                </button>
                <button
                  onClick={() => setActive((i) => (i + 1) % photos.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xl"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
