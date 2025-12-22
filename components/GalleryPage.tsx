'use client';

import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { TourData, GalleryItem } from '@/lib/data';

interface GalleryPageProps {
  data: TourData;
}

const GalleryPageComponent: React.FC<GalleryPageProps> = ({ data }) => {
  const [filter, setFilter] = useState<string>('All');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const categories = ['All', ...new Set(data.gallery.map((g) => g.category))];
  const filtered = filter === 'All' ? data.gallery : data.gallery.filter((g) => g.category === filter);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Photo Gallery
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Captured moments from incredible adventures
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                filter === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((item, idx: number) => (
            <div
              key={item.id}
              onClick={() => setLightbox(item)}
              className="relative group cursor-pointer overflow-hidden rounded-xl animate-fadeIn"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <img
                src={item.image}
                alt={`Gallery ${item.id}`}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={40} />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightbox && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-white hover:text-slate-300"
            >
              <X size={32} />
            </button>
            <img
              src={lightbox.image}
              alt="Lightbox"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPageComponent;
