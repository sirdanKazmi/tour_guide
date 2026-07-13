import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Plane, Clock, ChevronRight, MessageCircle, Check, X as XIcon, MapPin, Zap, Calendar,
} from 'lucide-react';
import { getByAirBySlug, ByAirPackage } from '@/lib/fleet-db';
import { formatPKR, parseJsonArray } from '@/lib/format';
import { initialData } from '@/lib/data';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

type ItineraryDay = { day_no?: number; day?: number; title?: string; description?: string };

function parseItinerary(value?: string): ItineraryDay[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === 'object') return parsed as ItineraryDay[];
  } catch {
    // not JSON — ignore
  }
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let p: ByAirPackage | undefined;
  try {
    p = await getByAirBySlug(slug);
  } catch {
    p = undefined;
  }
  if (!p) return { title: 'Package not found | Smile For Miles' };
  return {
    title: p.meta_title || `${p.title} — By Air | Smile For Miles`,
    description:
      p.meta_description ||
      p.description ||
      `Fly to ${p.destination} — ${p.duration_days} days / ${p.duration_nights} nights from ${formatPKR(p.price_per_person)} per person.`,
    openGraph: {
      title: p.title,
      description: p.description || `By-air package to ${p.destination}.`,
      images: p.cover_image ? [p.cover_image] : undefined,
      type: 'website',
    },
  };
}

export default async function ByAirDetailPage({ params }: Props) {
  const { slug } = await params;
  let p: ByAirPackage | undefined;
  try {
    p = await getByAirBySlug(slug);
  } catch (e) {
    console.error('Failed to load by-air package:', e);
  }
  if (!p || p.status === 'inactive') notFound();

  const highlights = parseJsonArray(p.highlights);
  const inclusions = parseJsonArray(p.inclusions);
  const exclusions = parseJsonArray(p.exclusions);
  const itinerary = parseItinerary(p.itinerary);
  const wa = initialData.guide.whatsapp;
  const waMessage = encodeURIComponent(`Hi! I'm interested in the "${p.title}" by-air package (${formatPKR(p.price_per_person)}/person). Can you share more details?`);

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      {/* Hero image */}
      <div className="relative h-72 sm:h-96 bg-gradient-to-br from-sky-500 to-indigo-600">
        {p.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 text-slate-800 px-3 py-1 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" /> {p.destination}
            </span>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold text-white text-balance drop-shadow">{p.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-8">
          <Link href="/" className="hover:text-sky-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/by-air" className="hover:text-sky-600">By Air</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-700 dark:text-slate-200 font-medium truncate">{p.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Quick facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {p.flight_duration && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <Zap className="w-5 h-5 text-sky-500" />
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">By air</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{p.flight_duration}</p>
                </div>
              )}
              {p.road_duration && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">By road</p>
                  <p className="text-sm font-semibold text-slate-400 line-through">{p.road_duration}</p>
                </div>
              )}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <Calendar className="w-5 h-5 text-sky-500" />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Duration</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{p.duration_days}D / {p.duration_nights}N</p>
              </div>
              {p.airline && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <Plane className="w-5 h-5 text-sky-500" />
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Airline</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{p.airline}</p>
                </div>
              )}
            </div>

            {p.description && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Overview</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{p.description}</p>
              </div>
            )}

            {highlights.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Check className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" /> {h}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Day-by-day itinerary</h2>
                <div className="space-y-4">
                  {itinerary.map((d, i) => (
                    <div key={i} className="relative pl-8">
                      <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-white text-xs font-bold">
                        {d.day_no || d.day || i + 1}
                      </span>
                      {i < itinerary.length - 1 && <span className="absolute left-3 top-6 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />}
                      {d.title && <p className="font-semibold text-slate-900 dark:text-white">{d.title}</p>}
                      {d.description && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{d.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions / Exclusions */}
            {(inclusions.length > 0 || exclusions.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {inclusions.length > 0 && (
                  <div className="rounded-2xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-900/10 p-5">
                    <h3 className="font-bold text-green-700 dark:text-green-400 mb-3">What&apos;s included</h3>
                    <ul className="space-y-2">
                      {inclusions.map((it, i) => (
                        <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {exclusions.length > 0 && (
                  <div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-900/10 p-5">
                    <h3 className="font-bold text-rose-700 dark:text-rose-400 mb-3">Not included</h3>
                    <ul className="space-y-2">
                      {exclusions.map((it, i) => (
                        <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <XIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" /> {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky booking card */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">Starting from</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {formatPKR(p.price_per_person)} <span className="text-base font-normal text-slate-500 dark:text-slate-400">/ person</span>
              </p>
              {p.urgency_badge && (
                <span className="mt-3 inline-block rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 px-3 py-1 text-xs font-semibold">
                  {p.urgency_badge}
                </span>
              )}
              <Link
                href={`/booking?type=by_air&byair=${p.slug}`}
                className="mt-6 block w-full text-center bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full py-3 font-semibold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
              >
                Book this package
              </Link>
              <a
                href={`https://wa.me/${wa}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-green-500 text-green-600 dark:text-green-400 py-3 font-semibold hover:bg-green-50 dark:hover:bg-green-500/10 transition-all"
              >
                <MessageCircle className="w-5 h-5" /> Ask on WhatsApp
              </a>
              <p className="mt-4 text-xs text-center text-slate-400">Instant confirmation on WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
