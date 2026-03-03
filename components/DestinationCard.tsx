'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Heart, ArrowRight } from 'lucide-react';
import { Destination } from '@/lib/data';

interface DestinationCardProps {
  destination: Destination;
  onClick?: () => void;
  index?: number;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onClick, index = 0 }) => {
  const { name, region, description, image, activities } = destination;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              // Handle favorite toggle
            }}
            className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all"
          >
            <Heart className="w-5 h-5" />
          </motion.button>

          {/* Region Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold">
              {region}
            </span>
          </div>

          {/* Rating */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1">
            <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-white text-sm font-semibold">4.9</span>
            </div>
            <span className="text-white/80 text-sm">(128 reviews)</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Title & Location */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {name}
              </h3>
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{region}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
            {description}
          </p>

          {/* Activities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {activities.slice(0, 3).map((activity) => (
              <span
                key={activity}
                className="px-2.5 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 text-xs font-medium rounded-full"
              >
                {activity}
              </span>
            ))}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-sm">From</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">$299</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm">/person</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05, x: 4 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
            >
              Explore
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
