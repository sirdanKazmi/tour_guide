'use client';

import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  Thermometer, 
  Globe, 
  Wallet,
  Sparkles,
  ArrowRight,
  Hotel
} from 'lucide-react';
import { Region } from '@/lib/gb-destinations';
import { 
  RegionHero, 
  AttractionCard, 
  DestinationGallery,
  BudgetCard,
  ActivityTag 
} from '@/components/destinations';
import { ScrollReveal } from '@/components/animations';

interface RegionPageClientProps {
  region: Region;
}

export default function RegionPageClient({ region }: RegionPageClientProps) {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <RegionHero region={region} />

      {/* Sticky CTA Button - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 lg:hidden">
        <a
          href={`/hotels/${region.id}`}
          className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full font-semibold shadow-lg shadow-sky-500/25"
        >
          <Hotel className="w-5 h-5" />
          Explore Hotels in {region.name}
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Desktop Sticky CTA */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-40">
        <a
          href={`/hotels/${region.id}`}
          className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full font-semibold shadow-xl shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-105 transition-all"
        >
          <Hotel className="w-5 h-5" />
          Explore Hotels in {region.name}
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Quick Info Bar */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <ScrollReveal>
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Best Time</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{region.bestTimeToVisit.months}</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <Thermometer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Climate</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{region.climate.split(' ')[0]} {region.climate.split(' ')[1]}</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Language</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{region.languages[0]}</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Currency</p>
                  <p className="font-semibold text-slate-900 dark:text-white">PKR</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why Visit Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal direction="left">
              <span className="inline-block px-4 py-1.5 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full text-sm font-semibold mb-4">
                Why Visit
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                What Makes{' '}
                <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                  {region.name}
                </span>{' '}
                Special
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                {region.whyVisit}
              </p>

              {/* Best Time Details */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Best Time to Visit</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">{region.bestTimeToVisit.months}</span>
                  {' — '}{region.bestTimeToVisit.description}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <DestinationGallery images={region.gallery} regionName={region.name} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Attractions Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold mb-4">
              Must-See Places
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Top Attractions in{' '}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {region.name}
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Discover the most breathtaking sights and experiences this region has to offer
            </p>
          </ScrollReveal>

          {/* Attractions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {region.attractions.map((attraction, index) => (
              <AttractionCard 
                key={attraction.id} 
                attraction={attraction} 
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-semibold mb-4">
              Adventures Await
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Popular{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Activities
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              From thrilling adventures to peaceful retreats, find your perfect experience
            </p>
          </ScrollReveal>

          {/* Activities Tags */}
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {region.activities.map((activity, index) => (
                <ActivityTag key={activity} activity={activity} index={index} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Budget Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-sm font-semibold mb-4">
              Plan Your Budget
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Estimated Daily{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Budget
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Plan your trip according to your budget. Costs are per person per day.
            </p>
          </ScrollReveal>

          {/* Budget Cards */}
          <BudgetCard budget={region.budget} />
        </div>
      </section>

      {/* Practical Info Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center mb-4">
                  <MapPin className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Location</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Coordinates: {region.coordinates.lat}°N, {region.coordinates.lng}°E
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-4">
                  <Thermometer className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Elevation</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{region.elevation}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-4">
                  <Globe className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Languages</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{region.languages.join(', ')}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4">
                  <Wallet className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Currency</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{region.currency}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Visit {region.name}?
            </h2>
            <p className="text-white/80 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
              Let our expert guides help you plan the perfect trip to this magical destination. 
              From accommodations to guided tours, we have got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-sky-600 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                Plan Your Trip
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/destinations/gilgit-baltistan"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold text-lg border border-white/30 hover:bg-white/20 transition-all"
              >
                Explore Other Regions
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
