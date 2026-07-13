'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, PackageSearch, Loader2, CheckCircle2, Clock, XCircle, Plane, Car, MapPin } from 'lucide-react';

type TrackResult = {
  reference: string;
  booking_type: 'tour' | 'vehicle' | 'by_air' | 'custom';
  item_name: string;
  travel_date: string;
  people_count: number;
  duration_days?: number;
  total_price: number;
  payment_status: 'unpaid' | 'partial' | 'paid';
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at?: string;
  customer_name: string;
};

const STAGES: { key: string; label: string }[] = [
  { key: 'pending', label: 'Received' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
];

function formatPKR(n: number) {
  return `PKR ${(Number(n) || 0).toLocaleString('en-PK')}`;
}

const typeIcon = { tour: MapPin, vehicle: Car, by_air: Plane, custom: MapPin } as const;

export default function TrackClient() {
  const searchParams = useSearchParams();
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TrackResult | null>(null);

  const lookup = useCallback(async (ref: string) => {
    const trimmed = ref.trim();
    if (!trimmed) {
      setError('Please enter your booking reference.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`/api/bookings/track?reference=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No booking found with that reference.');
        return;
      }
      setResult(data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Prefill + auto-lookup from ?ref=
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReference(ref);
      lookup(ref);
    }
  }, [searchParams, lookup]);

  const isCancelled = result?.booking_status === 'cancelled';
  const activeStageIndex = result ? STAGES.findIndex((s) => s.key === result.booking_status) : -1;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Lookup form */}
      <form
        onSubmit={(e) => { e.preventDefault(); lookup(reference); }}
        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm"
      >
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Booking reference</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value.toUpperCase())}
              placeholder="e.g. SFM-ABC1234"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white uppercase tracking-widest focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl px-6 py-3 font-semibold shadow-lg shadow-sky-500/25 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PackageSearch className="w-5 h-5" />}
            Track
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
      </form>

      {/* Result */}
      {result && (
        <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Reference</p>
                <p className="text-xl font-bold tracking-widest text-sky-600 dark:text-sky-400">{result.reference}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                isCancelled ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                  : result.booking_status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : result.booking_status === 'confirmed' ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {result.booking_status}
              </span>
            </div>
          </div>

          {/* Progress timeline */}
          <div className="p-6">
            {isCancelled ? (
              <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                <XCircle className="w-6 h-6" />
                <p className="font-medium">This booking was cancelled. Contact us if you think this is a mistake.</p>
              </div>
            ) : (
              <div className="flex items-center">
                {STAGES.map((stage, i) => {
                  const done = i <= activeStageIndex;
                  return (
                    <div key={stage.key} className="flex-1 flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${done ? 'bg-sky-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                          {done ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <span className={`mt-2 text-xs font-medium ${done ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{stage.label}</span>
                      </div>
                      {i < STAGES.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 ${i < activeStageIndex ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="px-6 pb-6 grid grid-cols-2 gap-4 text-sm">
            <Detail label="Booking">{(() => { const Icon = typeIcon[result.booking_type] || MapPin; return <span className="inline-flex items-center gap-1.5"><Icon className="w-4 h-4 text-sky-500" />{result.item_name}</span>; })()}</Detail>
            <Detail label="Travel date">{result.travel_date || '—'}</Detail>
            <Detail label={result.booking_type === 'vehicle' ? 'Passengers' : 'Travellers'}>{result.people_count}</Detail>
            {result.duration_days ? <Detail label="Days">{result.duration_days}</Detail> : <Detail label="Name">{result.customer_name}</Detail>}
            <Detail label="Estimated total">{formatPKR(result.total_price)}</Detail>
            <Detail label="Payment">
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                result.payment_status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : result.payment_status === 'partial' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}>{result.payment_status}</span>
            </Detail>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-1 font-medium text-slate-900 dark:text-white">{children}</div>
    </div>
  );
}
