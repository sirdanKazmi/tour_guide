import type { Metadata } from 'next';
import { Suspense } from 'react';
import TrackClient from '@/components/TrackClient';

export const metadata: Metadata = {
  title: 'Track Your Booking | Smile For Miles',
  description: 'Enter your booking reference to check the status of your tour, car rental or by-air booking.',
};

export default function TrackPage() {
  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">Track Booking</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Where&apos;s my trip?</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Enter the reference from your booking confirmation to see its current status.
          </p>
        </div>
        <Suspense fallback={<div className="text-center text-slate-400">Loading…</div>}>
          <TrackClient />
        </Suspense>
      </div>
    </div>
  );
}
