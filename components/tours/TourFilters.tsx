'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

const DURATIONS = [
  { key: '', label: 'Any length' },
  { key: '1-3', label: '1–3 days' },
  { key: '4-6', label: '4–6 days' },
  { key: '7-', label: '7+ days' },
];

const SORTS = [
  { key: 'popular', label: 'Most popular' },
  { key: 'price_asc', label: 'Price: low to high' },
  { key: 'price_desc', label: 'Price: high to low' },
  { key: 'rating', label: 'Top rated' },
];

export default function TourFilters({ categories, destinations }: { categories: string[]; destinations: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = {
    cat: searchParams.get('cat') || '',
    destination: searchParams.get('destination') || '',
    mode: searchParams.get('mode') || '',
    dur: searchParams.get('dur') || '',
    sort: searchParams.get('sort') || 'popular',
  };

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const hasFilters = current.cat || current.destination || current.mode || current.dur;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <SlidersHorizontal className="w-4 h-4 text-sky-500" /> Filter tours
        </h2>
        {hasFilters && (
          <button onClick={() => router.push(pathname, { scroll: false })} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-500">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Category chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setParam('cat', '')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${!current.cat ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setParam('cat', current.cat.toLowerCase() === c.toLowerCase() ? '' : c)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${current.cat.toLowerCase() === c.toLowerCase() ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select label="Destination" value={current.destination} onChange={(v) => setParam('destination', v)} options={[{ key: '', label: 'All destinations' }, ...destinations.map((d) => ({ key: d, label: d }))]} />
        <Select label="Travel mode" value={current.mode} onChange={(v) => setParam('mode', v)} options={[{ key: '', label: 'Any mode' }, { key: 'By Road', label: 'By Road' }, { key: 'By Air', label: 'By Air' }]} />
        <Select label="Duration" value={current.dur} onChange={(v) => setParam('dur', v)} options={DURATIONS} />
        <Select label="Sort by" value={current.sort} onChange={(v) => setParam('sort', v)} options={SORTS} />
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { key: string; label: string }[] }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
      >
        {options.map((o) => (
          <option key={o.key} value={o.key}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
