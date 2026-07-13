import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass, MessageCircle } from 'lucide-react';
import { getPublicTours, getActiveTours, TourFilters as TF, Tour } from '@/lib/admin-db';
import TourCard from '@/components/tours/TourCard';
import TourFilters from '@/components/tours/TourFilters';
import { initialData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gilgit-Baltistan Tour Packages | Smile For Miles',
  description:
    'Browse handpicked tour packages to Skardu, Hunza, Gilgit and beyond — by road or by air, with 3★/4★/5★ hotel tiers, private drivers and transparent per-person pricing.',
  keywords: ['Gilgit Baltistan tours', 'Skardu tour packages', 'Hunza tour packages', 'Pakistan northern areas tours'],
  openGraph: {
    title: 'Gilgit-Baltistan Tour Packages',
    description: 'Handpicked tours with 3★–5★ hotel tiers, private drivers and transparent pricing.',
    type: 'website',
  },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function buildFilters(sp: Record<string, string | string[] | undefined>): TF {
  const filters: TF = {};
  const cat = first(sp.cat);
  const destination = first(sp.destination);
  const mode = first(sp.mode);
  const dur = first(sp.dur);
  const sort = first(sp.sort) as TF['sort'];
  const min = first(sp.min);
  const max = first(sp.max);

  if (cat) filters.category = cat;
  if (destination) filters.destination = destination;
  if (mode) filters.travel_mode = mode;
  if (sort) filters.sort = sort;
  if (min) filters.minPrice = parseInt(min);
  if (max) filters.maxPrice = parseInt(max);
  if (dur) {
    const [lo, hi] = dur.split('-');
    if (lo) filters.minDays = parseInt(lo);
    if (hi) filters.maxDays = parseInt(hi);
  }
  return filters;
}

export default async function ToursPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filters = buildFilters(sp);

  let tours: Tour[] = [];
  let allActive: Tour[] = [];
  try {
    [tours, allActive] = await Promise.all([getPublicTours(filters), getActiveTours()]);
  } catch (e) {
    console.error('Failed to load tours:', e);
  }

  // Facets from the full active set
  const categories = Array.from(new Set(allActive.map((t) => t.category).filter(Boolean))) as string[];
  const destinations = Array.from(new Set(allActive.map((t) => t.destination).filter(Boolean))) as string[];
  const wa = initialData.guide.whatsapp;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: tours.slice(0, 20).map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `/tours/${t.slug}`,
      name: t.tour_name,
    })),
  };

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header band */}
      <section className="pt-28 sm:pt-32 pb-10 bg-gradient-to-b from-sky-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">Handpicked</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">Tour Packages</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            {tours.length} tour{tours.length === 1 ? '' : 's'} across Gilgit-Baltistan — by road or by air, with 3★–5★ hotel tiers.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <TourFilters categories={categories} destinations={destinations} />

        {tours.length === 0 ? (
          <div className="text-center py-16">
            <Compass className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              No tours match your filters yet. Try clearing them, or tell us what you have in mind.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/tours" className="rounded-full border border-slate-300 dark:border-slate-600 px-5 py-2.5 font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-500">
                Clear filters
              </Link>
              <a
                href={`https://wa.me/${wa}?text=${encodeURIComponent('Hi! I am looking for a tour package.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full px-5 py-2.5 font-semibold"
              >
                <MessageCircle className="w-5 h-5" /> Ask on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
