'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { Attraction } from '@/lib/gb-destinations';

interface AttractionCardProps {
  attraction: Attraction;
  index?: number;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Image */}
        <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden">
          <motion.img
            src={attraction.image}
            alt={attraction.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Highlight Badge */}
          {attraction.highlight && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-500/90 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                <Star className="w-3 h-3" />
                {attraction.highlight}
              </span>
            </div>
          )}

          {/* Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
              {attraction.name}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {attraction.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AttractionCard;
