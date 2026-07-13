import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import BookingClient, { BookingItem } from '@/components/booking/BookingClient';
import { getVehicleBySlug, getByAirBySlug } from '@/lib/fleet-db';
import { getTourById, getTourBySlug } from '@/lib/admin-db';
import { getPackageOptionById, isGridOption } from '@/lib/packages-db';
import { formatPKR, parseTiers, lowestTierPrice } from '@/lib/format';
import { initialData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Book Your Trip | Smile For Miles',
  description: 'Request a booking or a tailor-made quote for tours, car rental and by-air packages in Gilgit-Baltistan.',
  robots: { index: false },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

async function resolveItem(sp: Record<string, string | string[] | undefined>): Promise<BookingItem> {
  const type = first(sp.type);
  const vehicleSlug = first(sp.vehicle);
  const byAirSlug = first(sp.byair);
  const tourId = first(sp.tour);
  const optionParam = first(sp.option);

  try {
    // A specific package option was chosen (tier or price-grid row)
    if (optionParam) {
      const opt = await getPackageOptionById(parseInt(optionParam));
      if (opt) {
        const t = await getTourById(opt.tour_id);
        const band = isGridOption(opt) ? `${opt.min_persons ?? '?'}–${opt.max_persons ?? '?'} pax` : '';
        const label = opt.code || opt.tier || 'Package';
        return {
          type: 'tour',
          name: `${t?.tour_name || 'Tour'} — ${label}`,
          unitPrice: Number(opt.price) || 0,
          unitLabel: opt.price_unit === 'per_group' ? 'per group' : 'per person',
          priceUnit: opt.price_unit === 'per_group' ? 'per_group' : 'per_person',
          image: t?.cover_image,
          meta: [opt.tier, band, opt.transport_mode].filter(Boolean).join(' · '),
          tourId: opt.tour_id,
          optionId: opt.id,
          optionCode: opt.code || undefined,
        };
      }
    }

    if (type === 'vehicle' && vehicleSlug) {
      const v = await getVehicleBySlug(vehicleSlug);
      if (v) {
        return {
          type: 'vehicle',
          name: v.name,
          unitPrice: Number(v.price_per_day) || 0,
          unitLabel: 'per day',
          image: v.cover_image,
          meta: `${v.type} · ${v.seats} seats · ${v.fuel}${v.with_driver ? ' · With driver' : ''}`,
          vehicleId: v.id,
        };
      }
    }

    if (type === 'by_air' && byAirSlug) {
      const p = await getByAirBySlug(byAirSlug);
      if (p) {
        return {
          type: 'by_air',
          name: p.title,
          unitPrice: Number(p.price_per_person) || 0,
          unitLabel: 'per person',
          image: p.cover_image,
          meta: `${p.destination} · ${p.duration_days}D / ${p.duration_nights}N`,
          byAirId: p.id,
        };
      }
    }

    if (tourId) {
      const t = /^\d+$/.test(tourId) ? await getTourById(parseInt(tourId)) : await getTourBySlug(tourId);
      if (t) {
        const tierParam = first(sp.tier);
        const tiers = parseTiers(t.pricing_tiers).map((x) => ({ name: x.name, price: x.price, is_popular: x.is_popular }));
        const selectedTier =
          tierParam && tiers.some((x) => x.name === tierParam)
            ? tierParam
            : tiers.find((x) => x.is_popular)?.name || tiers[0]?.name;
        const unit =
          (selectedTier && tiers.find((x) => x.name === selectedTier)?.price) ||
          lowestTierPrice(tiers) ||
          Number(t.price_per_person) ||
          0;
        return {
          type: 'tour',
          name: t.tour_name,
          unitPrice: unit,
          unitLabel: 'per person',
          image: t.cover_image,
          meta: `${t.destination} · ${t.duration}`,
          tourId: t.id,
          tiers,
          selectedTier,
        };
      }
    }
  } catch (e) {
    console.error('Failed to resolve booking item:', e);
  }

  // Fallback: custom / tailor-made request
  return {
    type: 'custom',
    name: 'Custom trip request',
    unitPrice: 0,
    unitLabel: 'per person',
    meta: 'Tell us what you have in mind and we’ll build it for you',
  };
}

export default async function BookingPage({ searchParams }: Props) {
  const sp = await searchParams;
  const item = await resolveItem(sp);
  const whatsapp = initialData.guide.whatsapp;

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16">
        <nav className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-sky-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-700 dark:text-slate-200 font-medium">Booking</span>
        </nav>

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            {item.type === 'custom' ? 'Tailor-made' : 'Almost there'}
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {item.type === 'custom' ? 'Plan a custom trip' : 'Complete your booking request'}
          </h1>
          {item.type !== 'custom' && item.unitPrice > 0 && (
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {item.name} — from <span className="font-semibold text-slate-900 dark:text-white">{formatPKR(item.unitPrice)}</span> {item.unitLabel}.
            </p>
          )}
        </div>

        <BookingClient item={item} whatsapp={whatsapp} />
      </div>
    </div>
  );
}
