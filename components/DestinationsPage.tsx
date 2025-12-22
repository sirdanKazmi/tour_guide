'use client';

import React, { useState } from 'react';
import { TourData } from '@/lib/data';

interface DestinationsPageProps {
  data: TourData;
}

const DestinationsPageComponent: React.FC<DestinationsPageProps> = ({ data }) => {
  const [filter, setFilter] = useState<string>('All');
  const regions = ['All', ...new Set(data.destinations.map((d) => d.region))];
  const filtered = filter === 'All' ? data.destinations : data.destinations.filter((d) => d.region === filter);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Discover Amazing Destinations
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Explore breathtaking locations curated for unforgettable adventures
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {regions.map((region: string) => (
            <button
              key={region}
              onClick={() => setFilter(region)}
              className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                filter === region
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((dest, idx: number) => (
            <div
              key={dest.id}
              className="group animate-fadeIn"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="relative overflow-hidden h-64">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {dest.region}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                    {dest.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    {dest.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dest.activities.map((activity: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-sm"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationsPageComponent;
