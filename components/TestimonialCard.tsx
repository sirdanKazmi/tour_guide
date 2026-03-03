'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/lib/data';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index?: number;
  featured?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial, 
  index = 0,
  featured = false 
}) => {
  const { name, rating, text, image } = testimonial;

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        {/* Quote Icon */}
        <div className="absolute -top-4 left-8 w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <Quote className="w-5 h-5 text-white" />
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Image */}
          <div className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-sky-100 dark:ring-sky-900/30">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <Star 
                    className={`w-5 h-5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} 
                  />
                </motion.div>
              ))}
              <span className="ml-2 text-slate-500 dark:text-slate-400 text-sm">
                Verified Traveler
              </span>
            </div>

            {/* Quote */}
            <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
              &ldquo;{text}&rdquo;
            </p>

            {/* Author */}
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {name}
              </h4>
              <p className="text-sky-600 dark:text-sky-400 text-sm">
                Adventurer & Travel Enthusiast
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="relative bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500"
    >
      {/* Quote Icon */}
      <div className="absolute -top-3 left-6 w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
        <Quote className="w-4 h-4 text-white" />
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} 
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-4">
        &ldquo;{text}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-sky-100 dark:ring-sky-900/30"
        >
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white">
            {name}
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Verified Traveler
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
