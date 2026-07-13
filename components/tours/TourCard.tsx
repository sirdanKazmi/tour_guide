import Link from 'next/link';
import { Star, MapPin, Clock, Plane, Bus, ArrowRight, Flame, Building2 } from 'lucide-react';
import { Tour } from '@/lib/admin-db';
import { formatPKR, parseTiers, lowestTierPrice } from '@/lib/format';

// Reusable tour card — used on /tours, home "Featured", and related-tours strips.
export default function TourCard({ tour }: { tour: Tour }) {
  const tiers = parseTiers(tour.pricing_tiers);
  const startingPrice = lowestTierPrice(tiers) || Number(tour.price_per_person) || 0;
  const isByAir = (tour.travel_mode || '').toLowerCase().includes('air');
  const ModeIcon = isByAir ? Plane : Bus;
  const durationLabel = tour.duration_days
    ? `${tour.duration_days}D / ${tour.duration_nights ?? 0}N`
    : tour.duration;

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <Link href={`/tours/${tour.slug}`} className="relative block h-52 bg-gradient-to-br from-sky-500 to-blue-600 overflow-hidden">
        {tour.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tour.cover_image} alt={tour.tour_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-14 h-14 text-white/70" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {tour.category && (
            <span className="rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur text-slate-700 dark:text-slate-200 px-3 py-1 text-xs font-semibold capitalize">
              {tour.category}
            </span>
          )}
          {tour.is_featured && (
            <span className="rounded-full bg-sky-600 text-white px-3 py-1 text-xs font-semibold">Featured</span>
          )}
        </div>
        {tour.urgency_badge && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-amber-500 text-white px-3 py-1 text-xs font-semibold shadow">
            <Flame className="w-3.5 h-3.5" /> {tour.urgency_badge}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {tour.destination}</span>
          <span className="inline-flex items-center gap-1"><ModeIcon className="w-3.5 h-3.5" /> {tour.travel_mode || 'By Road'}</span>
        </div>

        <Link href={`/tours/${tour.slug}`}>
          <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
            {tour.tour_name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          {typeof tour.rating === 'number' && tour.rating > 0 && (
            <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {tour.rating}
            </span>
          )}
          {durationLabel && <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {durationLabel}</span>}
        </div>

        {tiers.length > 0 && (
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Building2 className="w-3.5 h-3.5" /> {tiers.length} hotel tier{tiers.length > 1 ? 's' : ''} (3★–5★)
          </p>
        )}

        <div className="mt-auto pt-4 flex items-end justify-between border-t border-slate-100 dark:border-slate-700 mt-4">
          <div>
            <p className="text-xs text-slate-400">Starting from</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{formatPKR(startingPrice)}</p>
            <p className="text-[11px] text-slate-400">per person</p>
          </div>
          <Link
            href={`/tours/${tour.slug}`}
            className="inline-flex items-center gap-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full px-4 py-2 text-sm font-semibold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all"
          >
            View <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
