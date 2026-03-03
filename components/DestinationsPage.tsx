'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users } from 'lucide-react';
import { TourData } from '@/lib/data';
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  Card3D,
  GlowCard,
} from '@/components/animations';

interface DestinationsPageProps {
  data: TourData;
}

const DestinationsPageComponent: React.FC<DestinationsPageProps> = ({ data }) => {
  const [filter, setFilter] = useState<string>('All');
  const regions = ['All', ...new Set(data.destinations.map((d) => d.region))];
  const filtered = filter === 'All' ? data.destinations : data.destinations.filter((d) => d.region === filter);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-8 sm:mb-12 px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-slate-900 dark:text-white">
            Discover <span className="gradient-text">Amazing</span> Destinations
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300">
            Explore breathtaking locations curated for unforgettable adventures
          </p>
        </FadeIn>

        {/* Filter Buttons */}
        <FadeIn delay={0.2} className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-4">
          {regions.map((region: string) => (
            <motion.button
              key={region}
              onClick={() => setFilter(region)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all ${
                filter === region
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {region}
              {filter === region && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-emerald-600 rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </FadeIn>

        {/* Destinations Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4"
          >
            {filtered.map((dest, idx: number) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card3D className="group h-full" intensity={10}>
                  <GlowCard
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden h-full"
                    glowColor="rgba(16, 185, 129, 0.1)"
                  >
                    <div className="relative overflow-hidden h-64">
                      <motion.img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Region Badge */}
                      <motion.div
                        className="absolute top-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {dest.region}
                      </motion.div>
                      
                      {/* Quick Info Overlay */}
                      <motion.div
                        className="absolute bottom-4 left-4 right-4 flex gap-4 text-white text-sm"
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> 5-7 Days
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} /> Small Groups
                        </span>
                      </motion.div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {dest.name}
                        </h3>
                        <MapPin className="text-emerald-500 flex-shrink-0" size={20} />
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                        {dest.description}
                      </p>
                      
                      {/* Activities */}
                      <div className="flex flex-wrap gap-2">
                        {dest.activities.slice(0, 3).map((activity: string, i: number) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * i }}
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-300 rounded-full text-sm font-medium"
                          >
                            {activity}
                          </motion.span>
                        ))}
                        {dest.activities.length > 3 && (
                          <span className="px-3 py-1 text-slate-500 dark:text-slate-400 text-sm">
                            +{dest.activities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </GlowCard>
                </Card3D>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-slate-600 dark:text-slate-400">
              No destinations found in this region.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DestinationsPageComponent;
