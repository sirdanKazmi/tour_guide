import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Star, MapPin, Clock, Plane, Bus, ChevronRight, Check, X as XIcon, MessageCircle,
  BedDouble, Utensils, CalendarDays, ShieldCheck, Users, Hotel, Youtube, Sparkles, Tag, Package, CheckCircle2,
} from 'lucide-react';
import {
  getTourBySlug, getApprovedReviews, getPublicTours, getToursByIds, Tour, Review,
} from '@/lib/admin-db';
import { getPackageOptionsByTour, isGridOption, PackageOption, PackageHotel } from '@/lib/packages-db';
import { formatPKR, parseTiers, parseItineraryDays, parseJsonArray, parseJsonObjects, lowestTierPrice } from '@/lib/format';
import TourCard from '@/components/tours/TourCard';
import { initialData } from '@/lib/data';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

function durationLabel(t: Tour): string {
  return t.duration_days ? `${t.duration_days} Days / ${t.duration_nights ?? 0} Nights` : t.duration;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let t: Tour | undefined;
  try { t = await getTourBySlug(slug); } catch { t = undefined; }
  if (!t) return { title: 'Tour not found | Smile For Miles' };
  const startingPrice = lowestTierPrice(parseTiers(t.pricing_tiers)) || Number(t.price_per_person) || 0;
  return {
    title: t.meta_title || `${t.tour_name} — ${durationLabel(t)} | Smile For Miles`,
    description: t.meta_description || t.description || `${t.tour_name}: ${durationLabel(t)} from ${formatPKR(startingPrice)} per person.`,
    keywords: t.meta_keywords ? t.meta_keywords.split(',').map((s) => s.trim()) : undefined,
    openGraph: {
      title: t.tour_name,
      description: t.description || `${t.tour_name} — ${durationLabel(t)}`,
      images: t.cover_image ? [t.cover_image] : undefined,
      type: 'website',
    },
  };
}

function partyBand(o: PackageOption): string {
  if (o.min_persons != null || o.max_persons != null) return `${o.min_persons ?? '?'}–${o.max_persons ?? '?'} pax`;
  return '';
}

// Renders one PackageOption (tier or price-grid row) as a card with its own
// vehicle, hotels and inclusions — the "as per need" detail differs per option.
function OptionCard({ option, slug }: { option: PackageOption; slug: string }) {
  const grid = isGridOption(option);
  const hotels = parseJsonObjects<PackageHotel>(option.hotels);
  const inc = parseJsonArray(option.included);
  const exc = parseJsonArray(option.not_included);
  const extras = parseJsonArray(option.extras);
  const unitLabel = option.price_unit === 'per_group' ? 'per group' : 'per person';
  const popular = (option.tier || '').toLowerCase() === 'standard';

  return (
    <div className={`relative flex flex-col rounded-2xl border p-5 ${popular && !grid ? 'border-sky-500 ring-2 ring-sky-500/30' : 'border-slate-200 dark:border-slate-700'}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {option.tier && <h3 className="font-bold text-slate-900 dark:text-white">{option.tier}</h3>}
            {option.code && <span className="rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 text-[11px] font-mono">{option.code}</span>}
          </div>
          <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            {grid && partyBand(option) && <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" /> {partyBand(option)}</span>}
            {option.rooms != null && <span>{option.rooms} room{option.rooms === 1 ? '' : 's'}</span>}
            {option.transport_mode && <span>{option.transport_mode}</span>}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatPKR(option.price)}</p>
        <p className="text-xs text-slate-400">{unitLabel}</p>
      </div>

      {option.vehicle_text && (
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-300"><span className="font-semibold">Vehicle:</span> {option.vehicle_text}</p>
      )}

      {hotels.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 mb-1"><Hotel className="w-3.5 h-3.5 text-sky-500" /> Hotels</p>
          <ul className="space-y-0.5">
            {hotels.map((h, i) => (
              <li key={i} className="text-[11px] text-slate-500 dark:text-slate-400">
                {h.area}{h.nights ? ` · ${h.nights}N` : ''} — {h.hotel}{h.room_type ? ` (${h.room_type})` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(inc.length > 0 || exc.length > 0) && (
        <div className="mt-3 grid grid-cols-1 gap-1">
          {inc.map((it, i) => <p key={`i${i}`} className="text-[11px] text-slate-600 dark:text-slate-300 flex gap-1"><Check className="w-3 h-3 text-green-500 shrink-0 mt-0.5" /> {it}</p>)}
          {exc.map((it, i) => <p key={`e${i}`} className="text-[11px] text-slate-400 flex gap-1"><XIcon className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" /> {it}</p>)}
        </div>
      )}

      {extras.length > 0 && (
        <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1"><Sparkles className="w-3 h-3" /> {extras.join(' · ')}</p>
      )}

      <a
        href={`/booking?tour=${slug}&option=${option.id}`}
        className={`mt-4 text-center rounded-full py-2 text-sm font-semibold transition-all ${popular && !grid ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20' : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-sky-500'}`}
      >
        Book this {grid ? 'package' : 'tier'}
      </a>
    </div>
  );
}

const TOUR_FAQS = (t: Tour, startingPrice: number) => [
  { q: `How much does the ${t.tour_name} cost?`, a: `Pricing starts from ${formatPKR(startingPrice)} per person for the Standard tier. Executive (4★) and Luxury (5★) tiers are available at checkout. The final total is the selected tier price × number of travellers.` },
  { q: 'Is a driver included?', a: 'Yes — every tour includes an experienced local driver familiar with mountain routes. Fuel and tolls are discussed and agreed before departure.' },
  { q: 'Can I change my travel dates?', a: 'Yes, free date changes are available up to 7 days before travel. Just message us on WhatsApp with your booking reference.' },
  { q: 'How do I confirm my booking?', a: 'Submit a booking request and you\'ll receive a reference instantly. We confirm details and availability with you on WhatsApp, usually within a few hours.' },
];

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  let tour: Tour | undefined;
  try { tour = await getTourBySlug(slug); } catch (e) { console.error('Failed to load tour:', e); }
  if (!tour || tour.status === 'inactive') notFound();

  const tiers = parseTiers(tour.pricing_tiers);
  const itinerary = parseItineraryDays(tour.itinerary_json, tour.itinerary);
  const included = parseJsonArray(tour.inclusions);
  const notIncluded = parseJsonArray(tour.exclusions);
  const gallery = parseJsonArray(tour.gallery);
  const images = [tour.cover_image, ...gallery].filter(Boolean) as string[];
  const highlights = parseJsonArray(tour.highlights);
  const videos = parseJsonObjects<{ title?: string; youtube_id?: string }>(tour.videos);
  const tags = parseJsonArray(tour.tags);

  // Flexible package options (Apricot-style). Two shapes: tier vs price-grid.
  let options: PackageOption[] = [];
  try { options = await getPackageOptionsByTour(tour.id!, true); } catch { options = []; }
  const tierOptions = options.filter((o) => !isGridOption(o));
  const gridOptions = options.filter((o) => isGridOption(o));
  const hasOptions = options.length > 0;

  const perPersonMin = tierOptions.length ? Math.min(...tierOptions.map((o) => Number(o.price) || 0).filter((p) => p > 0)) : 0;
  const gridMin = gridOptions.length ? Math.min(...gridOptions.map((o) => Number(o.price) || 0).filter((p) => p > 0)) : 0;
  const startingPrice = perPersonMin || lowestTierPrice(tiers) || Number(tour.price_per_person) || gridMin || 0;
  const isByAir = (tour.travel_mode || '').toLowerCase().includes('air');
  const ModeIcon = isByAir ? Plane : Bus;
  const wa = initialData.guide.whatsapp;
  const waMessage = encodeURIComponent(`Hi! I'm interested in the "${tour.tour_name}" (${durationLabel(tour)}) tour. Can you share availability and pricing?`);
  const faqs = TOUR_FAQS(tour, startingPrice);

  // Reviews for this tour (fall back to featured)
  let reviews: Review[] = [];
  try {
    const approved = await getApprovedReviews();
    const forTour = approved.filter((r) => r.tour_name === tour!.tour_name);
    reviews = (forTour.length ? forTour : approved).slice(0, 3);
  } catch { reviews = []; }

  // Related tours
  let related: Tour[] = [];
  try {
    const relIds = parseJsonArray(tour.related_tour_ids).map((x) => parseInt(String(x))).filter((n) => !isNaN(n));
    related = relIds.length ? await getToursByIds(relIds) : await getPublicTours({ destination: tour.destination });
    related = related.filter((t) => t.id !== tour!.id).slice(0, 3);
  } catch { related = []; }

  const quickFacts = [
    { icon: BedDouble, label: 'Accommodation', value: tour.accommodation_summary || '3★–5★ hotels' },
    { icon: Utensils, label: 'Meals', value: tour.meals_summary || 'As per itinerary' },
    { icon: CalendarDays, label: 'Duration', value: durationLabel(tour) },
    { icon: ModeIcon, label: 'Travel mode', value: tour.travel_mode || 'By Road' },
  ];

  // JSON-LD
  const productLd = {
    '@context': 'https://schema.org', '@type': 'Product', name: tour.tour_name,
    description: tour.description || undefined, image: images[0] || undefined,
    offers: { '@type': 'Offer', price: startingPrice, priceCurrency: 'PKR', availability: 'https://schema.org/InStock' },
    ...(tour.rating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: tour.rating, reviewCount: Math.max(reviews.length, 1) } } : {}),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Tours', item: '/tours' },
      { '@type': 'ListItem', position: 3, name: tour.tour_name, item: `/tours/${tour.slug}` },
    ],
  };
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <div className="relative h-72 sm:h-[26rem] bg-gradient-to-br from-sky-500 to-blue-600">
        {images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[0]} alt={tour.tour_name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="rounded-full bg-white/90 text-slate-800 px-3 py-1 text-xs font-semibold capitalize">{tour.category}</span>
              <span className="rounded-full bg-sky-600 text-white px-3 py-1 text-xs font-semibold inline-flex items-center gap-1"><ModeIcon className="w-3.5 h-3.5" /> {tour.travel_mode || 'By Road'}</span>
              {tour.urgency_badge && <span className="rounded-full bg-amber-500 text-white px-3 py-1 text-xs font-semibold">{tour.urgency_badge}</span>}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white text-balance drop-shadow">{tour.tour_name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" /> {tour.destination}</span>
              <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" /> {durationLabel(tour)}</span>
              {tour.rating ? <span className="inline-flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {tour.rating}</span> : null}
              {tour.itinerary_code && <span className="inline-flex items-center gap-1 font-mono text-white/80">Code {tour.itinerary_code}</span>}
              {tour.transport_label && <span className="inline-flex items-center gap-1">{tour.transport_label}</span>}
              {tour.availability && <span className="inline-flex items-center gap-1 rounded-full bg-green-500/90 text-white px-2 py-0.5 text-xs font-semibold">{tour.availability}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-8">
          <Link href="/" className="hover:text-sky-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/tours" className="hover:text-sky-600">Tours</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-700 dark:text-slate-200 font-medium truncate">{tour.tour_name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            {tour.description && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Trip Overview</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{tour.description}</p>
                {tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tg) => (
                      <span key={tg} className="inline-flex items-center gap-1 rounded-full bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 px-3 py-1 text-xs font-medium">
                        <Tag className="w-3 h-3" /> {tg}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Highlights */}
            {highlights.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Sparkles className="w-6 h-6 text-sky-500" /> Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" /> {h}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Quick facts */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickFacts.map((f) => (
                <div key={f.label} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <f.icon className="w-5 h-5 text-sky-500" />
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{f.label}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{f.value}</p>
                </div>
              ))}
            </section>

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">Day-by-Day Itinerary</h2>
                <div className="space-y-5">
                  {itinerary.map((d, i) => (
                    <div key={i} className="relative pl-10">
                      <span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white text-xs font-bold">
                        {d.day_no || d.day || i + 1}
                      </span>
                      {i < itinerary.length - 1 && <span className="absolute left-3.5 top-7 bottom-[-1.25rem] w-px bg-slate-200 dark:bg-slate-700" />}
                      {d.title && <p className="font-semibold text-slate-900 dark:text-white">{d.title}</p>}
                      {Array.isArray(d.activities) && d.activities.length > 0 ? (
                        <ul className="mt-1 space-y-0.5">
                          {d.activities.map((a, ai) => (
                            <li key={ai} className="text-sm text-slate-600 dark:text-slate-400 flex gap-1.5"><span className="text-sky-400 mt-0.5">•</span> {a}</li>
                          ))}
                        </ul>
                      ) : d.description ? (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{d.description}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Packages / Pricing */}
            {hasOptions ? (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2"><Package className="w-6 h-6 text-sky-500" /> Choose your package</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Per-person tiers are priced per traveller; private &amp; family packages are a fixed price for the whole group.</p>

                {tierOptions.length > 0 && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-3">Per-person tiers</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {tierOptions.map((o) => <OptionCard key={o.id} option={o} slug={tour!.slug!} />)}
                    </div>
                  </>
                )}

                {gridOptions.length > 0 && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 mt-8 mb-3">Private &amp; family packages (by group size)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {gridOptions.map((o) => <OptionCard key={o.id} option={o} slug={tour!.slug!} />)}
                    </div>
                  </>
                )}
              </section>
            ) : tiers.length > 0 ? (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Hotel Tiers &amp; Pricing</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Per person. Final total = tier price × travellers (+ optional vehicle).</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {tiers.map((tier) => (
                    <div key={tier.name} className={`relative rounded-2xl border p-5 flex flex-col ${tier.is_popular ? 'border-sky-500 ring-2 ring-sky-500/30' : 'border-slate-200 dark:border-slate-700'}`}>
                      {tier.is_popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sky-500 text-white px-3 py-0.5 text-xs font-semibold">Most popular</span>}
                      <h3 className="font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                      {tier.blurb && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex-1">{tier.blurb}</p>}
                      <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{formatPKR(tier.price)}</p>
                      <p className="text-xs text-slate-400">per person</p>
                      <Link
                        href={`/booking?tour=${tour!.slug}&tier=${encodeURIComponent(tier.name)}`}
                        className={`mt-4 text-center rounded-full py-2 text-sm font-semibold transition-all ${tier.is_popular ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20' : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-sky-500'}`}
                      >
                        Choose {tier.name.split(' ')[0]}
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Included / Not included */}
            {(included.length > 0 || notIncluded.length > 0) && (
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {included.length > 0 && (
                  <div className="rounded-2xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-900/10 p-5">
                    <h3 className="font-bold text-green-700 dark:text-green-400 mb-3">What&apos;s included</h3>
                    <ul className="space-y-2">
                      {included.map((it, i) => <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {it}</li>)}
                    </ul>
                  </div>
                )}
                {notIncluded.length > 0 && (
                  <div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-900/10 p-5">
                    <h3 className="font-bold text-rose-700 dark:text-rose-400 mb-3">Not included</h3>
                    <ul className="space-y-2">
                      {notIncluded.map((it, i) => <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300"><XIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" /> {it}</li>)}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Videos */}
            {videos.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Youtube className="w-6 h-6 text-red-500" /> Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {videos.filter((v) => v.youtube_id).map((v, i) => (
                    <div key={i}>
                      <div className="relative w-full overflow-hidden rounded-xl" style={{ paddingTop: '56.25%' }}>
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${v.youtube_id}`}
                          title={v.title || `Video ${i + 1}`}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      {v.title && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{v.title}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Map */}
            {(tour.map_embed_url || (tour.map_lat != null && tour.map_lng != null)) && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">On the map</h2>
                <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700" style={{ paddingTop: '45%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={tour.map_embed_url || `https://www.google.com/maps?q=${tour.map_lat},${tour.map_lng}&output=embed`}
                    title={`Map of ${tour.destination}`}
                    loading="lazy"
                  />
                </div>
              </section>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">What travellers say</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {reviews.map((r) => {
                    const dims: [string, number | undefined][] = [
                      ['Stay', r.score_accommodation], ['Transport', r.score_transport], ['Meals', r.score_meals],
                      ['Guide', r.score_guide], ['Value', r.score_value], ['Accuracy', r.score_accuracy],
                    ];
                    const shown = dims.filter(([, v]) => v != null);
                    return (
                      <div key={r.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                        <div className="flex items-center gap-1 text-amber-400 mb-2">
                          {Array.from({ length: Math.round(r.rating) }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                        </div>
                        {r.review_title && <p className="font-semibold text-slate-900 dark:text-white text-sm">{r.review_title}</p>}
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">&ldquo;{r.review_text}&rdquo;</p>
                        {shown.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {shown.map(([label, v]) => (
                              <span key={label} className="rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 px-2 py-0.5 text-[11px]">
                                {label} <span className="font-semibold text-slate-900 dark:text-white">{v}</span>
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{r.customer_name}</p>
                        {(r.trip_type || r.city || r.country) && (
                          <p className="text-xs text-slate-400">{[r.trip_type, [r.city, r.country].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* FAQs — native accordion, no JS */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">Tour FAQs</h2>
              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <details key={i} className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                    <summary className="cursor-pointer list-none flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                      {f.q}
                      <ChevronRight className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-6">
              {tour.rating ? (
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{tour.rating}</span>
                  <span className="text-xs text-slate-400">rated by travellers</span>
                </div>
              ) : null}
              <p className="text-sm text-slate-500 dark:text-slate-400">Starting from</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatPKR(startingPrice)} <span className="text-base font-normal text-slate-500 dark:text-slate-400">/ person</span></p>

              <Link
                href={`/booking?tour=${tour.slug}`}
                className="mt-6 block w-full text-center bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full py-3 font-semibold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
              >
                Book This Tour
              </Link>
              <a
                href={`https://wa.me/${wa}?text=${waMessage}`}
                target="_blank" rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-green-500 text-green-600 dark:text-green-400 py-3 font-semibold hover:bg-green-50 dark:hover:bg-green-500/10 transition-all"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp
              </a>

              <ul className="mt-6 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex gap-2"><MessageCircle className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" /> Instant confirmation on WhatsApp</li>
                <li className="flex gap-2"><CalendarDays className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" /> Free date changes up to 7 days prior</li>
                <li className="flex gap-2"><ShieldCheck className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" /> PTDC-registered &amp; fully insured</li>
                <li className="flex gap-2"><Users className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" /> 24/7 on-trip support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related tours */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">More {tour.destination} tours</h2>
              <Link href="/tours" className="text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700">View all tours →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((t) => <TourCard key={t.id} tour={t} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
