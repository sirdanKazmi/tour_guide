import type { Metadata } from 'next';
import Link from 'next/link';
import { Plane, Clock, ArrowRight, MapPin, MessageCircle, Zap, Star } from 'lucide-react';
import { getActiveByAirPackages, ByAirPackage } from '@/lib/fleet-db';
import { formatPKR } from '@/lib/format';
import { initialData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'By-Air Tour Packages — Fly to Skardu & Gilgit | Smile For Miles',
  description:
    'Fly to Skardu in 50 minutes instead of an 18-hour road trip. By-air tour packages to Skardu, Gilgit and Hunza with flights, hotels and transfers handled for you.',
  keywords: ['Skardu by air', 'fly to Skardu', 'Gilgit flight package', 'Islamabad to Skardu by air', 'by air tour packages Pakistan'],
  openGraph: {
    title: 'By-Air Tour Packages — Fly to the Northern Areas',
    description: 'Skardu in 50 minutes, not 18 hours. Flights, hotels and transfers arranged end-to-end.',
    type: 'website',
  },
};

function ByAirCard({ p }: { p: ByAirPackage }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-52 bg-gradient-to-br from-sky-500 to-indigo-600 overflow-hidden">
        {p.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Plane className="w-16 h-16 text-white/70" />
          </div>
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur text-slate-700 dark:text-slate-200 px-3 py-1 text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5" /> {p.destination}
        </span>
        {p.is_featured && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-sky-600 text-white px-3 py-1 text-xs font-semibold shadow">
            <Star className="w-3.5 h-3.5" /> Featured
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{p.title}</h3>

        {/* Flight vs road comparison */}
        {(p.flight_duration || p.road_duration) && (
          <div className="mt-3 flex items-center gap-3 text-sm">
            {p.flight_duration && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 px-3 py-1 font-semibold">
                <Zap className="w-3.5 h-3.5" /> {p.flight_duration} by air
              </span>
            )}
            {p.road_duration && (
              <span className="inline-flex items-center gap-1.5 text-slate-400 line-through">
                <Clock className="w-3.5 h-3.5" /> {p.road_duration} by road
              </span>
            )}
          </div>
        )}

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {p.duration_days} days / {p.duration_nights} nights
        </p>
        {p.urgency_badge && (
          <span className="mt-2 self-start rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 px-3 py-1 text-xs font-semibold">
            {p.urgency_badge}
          </span>
        )}

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatPKR(p.price_per_person)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">per person</p>
          </div>
          <Link href={`/by-air/${p.slug}`} className="text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 inline-flex items-center gap-1">
            Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <Link
          href={`/booking?type=by_air&byair=${p.slug}`}
          className="mt-4 w-full text-center bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full py-2.5 font-semibold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all"
        >
          Book this package
        </Link>
      </div>
    </div>
  );
}

export default async function ByAirPage() {
  let packages: ByAirPackage[] = [];
  try {
    packages = await getActiveByAirPackages();
  } catch (e) {
    console.error('Failed to load by-air packages:', e);
  }

  const wa = initialData.guide.whatsapp;

  return (
    <div className="bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 pb-16 bg-gradient-to-b from-sky-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">By Air</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white text-balance">
            Skardu in 50 minutes, not 18 hours
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            Skip the long mountain drive. Our by-air packages get you to the northern areas fast — with flights, hotels
            and airport transfers arranged end-to-end, so you spend your time exploring, not travelling.
          </p>
        </div>
      </section>

      {/* Packages grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {packages.length === 0 ? (
          <div className="text-center py-16">
            <Plane className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              By-air packages are being updated. Contact us on WhatsApp for current flight availability.
            </p>
            <a
              href={`https://wa.me/${wa}?text=${encodeURIComponent('Hi! I would like a by-air package to the northern areas.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-3 font-semibold"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((p) => (
              <ByAirCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
