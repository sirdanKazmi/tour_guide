import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, Snowflake, Fuel, Car, ShieldCheck, Clock, MessageCircle, ArrowRight, Flame } from 'lucide-react';
import { getActiveVehicles, Vehicle } from '@/lib/fleet-db';
import { formatPKR } from '@/lib/format';
import { initialData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Car Rental in Gilgit-Baltistan — With Driver | Smile For Miles',
  description:
    'Rent a Land Cruiser, Prado, Hiace or sedan with an experienced driver for your Skardu, Hunza and Gilgit-Baltistan trip. Transparent per-day pricing, no hidden fees.',
  keywords: ['car rental Gilgit Baltistan', 'Land Cruiser rental Skardu', 'Hiace rental Hunza', 'rent a car with driver Pakistan'],
  openGraph: {
    title: 'Car Rental in Gilgit-Baltistan — With Driver',
    description: 'Premium fleet with experienced drivers for the northern areas. Transparent per-day pricing.',
    type: 'website',
  },
};

function SpecPill({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 px-3 py-1 text-xs font-medium">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

function VehicleCard({ v }: { v: Vehicle }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-sky-500 to-blue-600 overflow-hidden">
        {v.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={v.cover_image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-16 h-16 text-white/70" />
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur text-slate-700 dark:text-slate-200 px-3 py-1 text-xs font-semibold">
          {v.type}
        </span>
        {v.urgency_badge && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-amber-500 text-white px-3 py-1 text-xs font-semibold shadow">
            <Flame className="w-3.5 h-3.5" />
            {v.urgency_badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{v.name}</h3>
        {v.description && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{v.description}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <SpecPill icon={Users} label={`${v.seats} seats`} />
          {v.has_ac && <SpecPill icon={Snowflake} label="AC" />}
          <SpecPill icon={Fuel} label={v.fuel} />
          {v.with_driver && <SpecPill icon={ShieldCheck} label="With driver" />}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatPKR(v.price_per_day)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">per day</p>
          </div>
          <Link
            href={`/car-rental/${v.slug}`}
            className="text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 inline-flex items-center gap-1"
          >
            Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <Link
          href={`/booking?type=vehicle&vehicle=${v.slug}`}
          className="mt-4 w-full text-center bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full py-2.5 font-semibold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all"
        >
          Book this vehicle
        </Link>
      </div>
    </div>
  );
}

export default async function CarRentalPage() {
  let vehicles: Vehicle[] = [];
  try {
    vehicles = await getActiveVehicles();
  } catch (e) {
    console.error('Failed to load vehicles:', e);
  }

  const wa = initialData.guide.whatsapp;

  return (
    <div className="bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 pb-16 bg-gradient-to-b from-sky-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">Premium Fleet</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white text-balance">
            Rent a car with an experienced driver
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            Safe, comfortable vehicles built for the mountain roads of Gilgit-Baltistan — from rugged Land Cruisers to
            spacious Hiace vans. Transparent per-day pricing, no hidden fees.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-sky-500" /> Vetted, local drivers</span>
            <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4 text-sky-500" /> 24/7 on-trip support</span>
            <span className="inline-flex items-center gap-2"><Car className="w-4 h-4 text-sky-500" /> Well-maintained fleet</span>
          </div>
        </div>
      </section>

      {/* Fleet grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {vehicles.length === 0 ? (
          <div className="text-center py-16">
            <Car className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              Our fleet is being updated. Please contact us on WhatsApp for available vehicles.
            </p>
            <a
              href={`https://wa.me/${wa}?text=${encodeURIComponent('Hi! I would like to rent a car for my trip.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-3 font-semibold"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} v={v} />
            ))}
          </div>
        )}
      </section>

      {/* Trust strip */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">No hidden fees</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fuel &amp; driver terms agreed up front</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">Free date changes</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Up to 7 days before travel</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">Instant confirmation</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">On WhatsApp, 7 days a week</p>
          </div>
        </div>
      </section>
    </div>
  );
}
