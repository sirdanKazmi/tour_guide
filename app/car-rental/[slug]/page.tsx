import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Users, Snowflake, Fuel, Car, ShieldCheck, ChevronRight, MessageCircle, Check, Clock,
} from 'lucide-react';
import { getVehicleBySlug, Vehicle } from '@/lib/fleet-db';
import { formatPKR, parseJsonArray } from '@/lib/format';
import { initialData } from '@/lib/data';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let v: Vehicle | undefined;
  try {
    v = await getVehicleBySlug(slug);
  } catch {
    v = undefined;
  }
  if (!v) return { title: 'Vehicle not found | Smile For Miles' };
  return {
    title: v.meta_title || `${v.name} Rental — ${formatPKR(v.price_per_day)}/day | Smile For Miles`,
    description:
      v.meta_description ||
      v.description ||
      `Rent the ${v.name} (${v.seats} seats, ${v.fuel}${v.with_driver ? ', with driver' : ''}) for your Gilgit-Baltistan trip.`,
    openGraph: {
      title: `${v.name} — Car Rental`,
      description: v.description || `Rent the ${v.name} with an experienced driver.`,
      images: v.cover_image ? [v.cover_image] : undefined,
      type: 'website',
    },
  };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params;
  let v: Vehicle | undefined;
  try {
    v = await getVehicleBySlug(slug);
  } catch (e) {
    console.error('Failed to load vehicle:', e);
  }
  if (!v || v.status !== 'active') notFound();

  const gallery = parseJsonArray(v.gallery);
  const images = [v.cover_image, ...gallery].filter(Boolean) as string[];
  const wa = initialData.guide.whatsapp;
  const waMessage = encodeURIComponent(
    `Hi! I'm interested in renting the ${v.name} (${formatPKR(v.price_per_day)}/day). Is it available?`
  );

  const specs: { label: string; value: string; icon: React.ElementType }[] = [
    { label: 'Type', value: v.type, icon: Car },
    { label: 'Seats', value: `${v.seats}`, icon: Users },
    { label: 'Air conditioning', value: v.has_ac ? 'Yes' : 'No', icon: Snowflake },
    { label: 'Fuel', value: v.fuel, icon: Fuel },
    { label: 'Driver', value: v.with_driver ? 'Included' : 'Self-drive', icon: ShieldCheck },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-sky-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/car-rental" className="hover:text-sky-600">Car Rental</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-700 dark:text-slate-200 font-medium truncate">{v.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: gallery + details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main image */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 h-72 sm:h-96">
              {images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[0]} alt={v.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car className="w-20 h-20 text-white/70" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(1, 5).map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={img} alt={`${v!.name} ${i + 2}`} className="w-full h-20 sm:h-24 object-cover rounded-xl" />
                ))}
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-3 py-1 text-xs font-semibold">{v.type}</span>
                {v.urgency_badge && (
                  <span className="rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 px-3 py-1 text-xs font-semibold">{v.urgency_badge}</span>
                )}
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">{v.name}</h1>
              {v.description && <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">{v.description}</p>}
            </div>

            {/* Specs */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {specs.map((s) => (
                  <div key={s.label} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <s.icon className="w-5 h-5 text-sky-500" />
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Good to know */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Good to know</h2>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Experienced local driver familiar with mountain routes</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Fuel and inter-city tolls discussed and agreed before departure</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Free date changes up to 7 days before travel</li>
                <li className="flex gap-2"><Clock className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" /> 24/7 on-trip support on WhatsApp</li>
              </ul>
            </div>
          </div>

          {/* Right: sticky booking card */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">Starting from</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {formatPKR(v.price_per_day)} <span className="text-base font-normal text-slate-500 dark:text-slate-400">/ day</span>
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 px-3 py-1 text-xs font-medium"><Users className="w-3.5 h-3.5" /> {v.seats} seats</span>
                {v.has_ac && <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 px-3 py-1 text-xs font-medium"><Snowflake className="w-3.5 h-3.5" /> AC</span>}
                {v.with_driver && <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 px-3 py-1 text-xs font-medium"><ShieldCheck className="w-3.5 h-3.5" /> Driver</span>}
              </div>

              <Link
                href={`/booking?type=vehicle&vehicle=${v.slug}`}
                className="mt-6 block w-full text-center bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full py-3 font-semibold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
              >
                Book this vehicle
              </Link>
              <a
                href={`https://wa.me/${wa}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-green-500 text-green-600 dark:text-green-400 py-3 font-semibold hover:bg-green-50 dark:hover:bg-green-500/10 transition-all"
              >
                <MessageCircle className="w-5 h-5" /> Ask on WhatsApp
              </a>
              <p className="mt-4 text-xs text-center text-slate-400">No payment required to enquire</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
