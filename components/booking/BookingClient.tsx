'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Minus, Plus, Calendar, Users, BedDouble, Clock, CheckCircle2, Copy, MessageCircle, MapPin, Car, Plane,
} from 'lucide-react';

export type BookingTier = { name: string; price: number; is_popular?: boolean };

export type BookingItem = {
  type: 'tour' | 'vehicle' | 'by_air' | 'custom';
  name: string;
  unitPrice: number;
  unitLabel: string;
  priceUnit?: 'per_person' | 'per_group' | 'per_day';
  image?: string;
  meta?: string;
  vehicleId?: number;
  byAirId?: number;
  tourId?: number;
  optionId?: number;
  optionCode?: string;
  tiers?: BookingTier[];
  selectedTier?: string;
};

const typeIcon = {
  tour: MapPin,
  vehicle: Car,
  by_air: Plane,
  custom: MapPin,
} as const;

function formatPKR(n: number) {
  return `PKR ${(Number(n) || 0).toLocaleString('en-PK')}`;
}

function Stepper({ label, icon: Icon, value, min, onChange }: {
  label: string; icon: React.ElementType; value: number; min: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 overflow-hidden">
        <span className="pl-3 text-slate-400"><Icon className="w-4 h-4" /></span>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="ml-auto px-3 py-2.5 text-slate-500 hover:text-sky-600 disabled:opacity-40"
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-10 text-center font-semibold text-slate-900 dark:text-white">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="px-3 py-2.5 text-slate-500 hover:text-sky-600"
          aria-label={`Increase ${label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function BookingClient({ item, whatsapp }: { item: BookingItem; whatsapp: string }) {
  const today = new Date().toISOString().split('T')[0];
  const isVehicle = item.type === 'vehicle';
  const isCustom = item.type === 'custom';

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_cnic: '',
    travel_date: '',
    special_requests: '',
  });
  const tiers = item.tiers || [];
  const defaultTier = item.selectedTier || tiers.find((t) => t.is_popular)?.name || tiers[0]?.name || '';
  const [people, setPeople] = useState(isVehicle ? 1 : 2);
  const [rooms, setRooms] = useState(1);
  const [days, setDays] = useState(isVehicle ? 3 : 1);
  const [tier, setTier] = useState(defaultTier);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ reference: string } | null>(null);

  const activeTier = tiers.find((t) => t.name === tier);
  const effectiveUnit = activeTier ? activeTier.price : item.unitPrice;

  const isPerGroup = item.priceUnit === 'per_group';
  const total = useMemo(() => {
    if (isCustom || !effectiveUnit) return 0;
    if (isPerGroup) return effectiveUnit;
    return isVehicle ? effectiveUnit * days : effectiveUnit * people;
  }, [isCustom, isPerGroup, isVehicle, effectiveUnit, days, people]);

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_email || !form.customer_phone) {
      toast.error('Please fill in your name, email and phone.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        booking_type: item.type,
        item_name: item.name,
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        customer_cnic: form.customer_cnic || undefined,
        travel_date: form.travel_date || today,
        people_count: people,
        rooms: isVehicle ? undefined : rooms,
        duration_days: isVehicle ? days : undefined,
        selected_tier: tier || item.optionCode || undefined,
        price_per_person: effectiveUnit,
        total_price: total,
        vehicle_id: item.vehicleId,
        by_air_id: item.byAirId,
        tour_id: item.tourId,
        package_option_id: item.optionId,
        option_code: item.optionCode,
        special_requests: form.special_requests || undefined,
      };
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setResult({ reference: data.reference });
      toast.success('Booking request submitted!');
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Success state ----
  if (result) {
    const waMsg = encodeURIComponent(
      `Hi! I just submitted a booking request. My reference is ${result.reference} for "${item.name}".`
    );
    return (
      <div className="max-w-xl mx-auto text-center py-8">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
        </motion.div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Request received!</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          We&apos;ll confirm the details with you shortly. Save your booking reference to track its status.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-6">
          <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Your reference</p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="text-2xl font-bold tracking-widest text-sky-600 dark:text-sky-400">{result.reference}</span>
            <button
              onClick={() => { navigator.clipboard?.writeText(result.reference); toast.success('Reference copied'); }}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
              aria-label="Copy reference"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/track?ref=${result.reference}`}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full px-6 py-3 font-semibold shadow-lg shadow-sky-500/25"
          >
            Track my booking
          </Link>
          <a
            href={`https://wa.me/${whatsapp}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-green-500 text-green-600 dark:text-green-400 rounded-full px-6 py-3 font-semibold hover:bg-green-50 dark:hover:bg-green-500/10"
          >
            <MessageCircle className="w-5 h-5" /> Confirm on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const ItemIcon = typeIcon[item.type];

  // ---- Form state ----
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Your details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full name *</label>
              <input value={form.customer_name} onChange={(e) => update('customer_name', e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email *</label>
              <input type="email" value={form.customer_email} onChange={(e) => update('customer_email', e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone / WhatsApp *</label>
              <input type="tel" value={form.customer_phone} onChange={(e) => update('customer_phone', e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent" placeholder="03XXXXXXXXX" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">CNIC / Passport (optional)</label>
              <input value={form.customer_cnic} onChange={(e) => update('customer_cnic', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent" placeholder="For confirmed bookings" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Trip details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {isVehicle ? 'Pickup date' : 'Preferred travel date'}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="date" min={today} value={form.travel_date} onChange={(e) => update('travel_date', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
              </div>
            </div>

            {tiers.length > 0 && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hotel tier</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  {tiers.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} — {formatPKR(t.price)}/person{t.is_popular ? ' (Most popular)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {isVehicle ? (
              <Stepper label="Number of days" icon={Clock} value={days} min={1} onChange={setDays} />
            ) : (
              <Stepper label="Travellers" icon={Users} value={people} min={1} onChange={setPeople} />
            )}

            {!isVehicle && !isCustom && (
              <Stepper label="Rooms" icon={BedDouble} value={rooms} min={1} onChange={setRooms} />
            )}
            {isVehicle && (
              <Stepper label="Passengers" icon={Users} value={people} min={1} onChange={setPeople} />
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {isCustom ? 'Tell us about your dream trip *' : 'Special requests / notes'}
            </label>
            <textarea rows={isCustom ? 5 : 3} value={form.special_requests} onChange={(e) => update('special_requests', e.target.value)} required={isCustom}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder={isCustom ? 'Destinations, dates, group size, budget, hotel preferences…' : 'Dietary needs, pickup point, celebrations…'} />
          </div>
        </div>
      </form>

      {/* Summary */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-28 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />
          ) : (
            <div className="w-full h-32 bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <ItemIcon className="w-10 h-10 text-white/80" />
            </div>
          )}
          <div className="p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-3 py-1 text-xs font-semibold capitalize">
              <ItemIcon className="w-3.5 h-3.5" /> {item.type.replace('_', ' ')}
            </span>
            <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{item.name}</h3>
            {item.meta && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.meta}</p>}

            {!isCustom && effectiveUnit > 0 && (
              <div className="mt-5 space-y-2 text-sm border-t border-slate-100 dark:border-slate-700 pt-4">
                {activeTier && <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Tier</span><span className="font-medium text-slate-700 dark:text-slate-200">{activeTier.name}</span></div>}
                {item.optionCode && <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Package</span><span className="font-mono text-slate-700 dark:text-slate-200">{item.optionCode}</span></div>}
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  {isPerGroup ? (
                    <span>{formatPKR(effectiveUnit)} · whole group</span>
                  ) : (
                    <span>{formatPKR(effectiveUnit)} × {isVehicle ? `${days} day${days > 1 ? 's' : ''}` : `${people} person${people > 1 ? 's' : ''}`}</span>
                  )}
                  <span>{formatPKR(total)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-700">
                  <span>Estimated total</span>
                  <span>{formatPKR(total)}</span>
                </div>
                <p className="text-xs text-slate-400">Indicative only — final quote confirmed on WhatsApp. No hidden fees.</p>
              </div>
            )}
            {isCustom && (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">We&apos;ll prepare a tailor-made quote based on your request.</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-6 w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full py-3 font-semibold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : isCustom ? 'Request custom quote' : 'Confirm booking request'}
            </button>
            <p className="mt-3 text-xs text-center text-slate-400">Free to enquire · Instant confirmation on WhatsApp</p>
          </div>
        </div>
      </div>
    </div>
  );
}
