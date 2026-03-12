'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Mountain } from 'lucide-react';
import { Region } from '@/lib/gb-destinations';
import Link from 'next/link';

interface RegionCardProps {
  region: Region;
  index?: number;
}

const RegionCard: React.FC<RegionCardProps> = ({ region, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/destinations/${region.id}`}>
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
          {/* Image */}
          <div className="relative h-56 sm:h-64 overflow-hidden">
            <motion.img
              src={region.heroImage}
              alt={region.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Elevation Badge */}
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold">
                <Mountain className="w-3 h-3" />
                {region.elevation.split(' ')[0]}
              </span>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                {region.name}
              </h3>
              <p className="text-white/80 text-sm line-clamp-1">
                {region.tagline}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 flex-1 flex flex-col">
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
              {region.overview}
            </p>

            {/* Footer */}
            <div className="flex items-center pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{region.attractions.length} Attractions</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RegionCard;
