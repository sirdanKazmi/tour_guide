'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Award, Globe } from 'lucide-react';
import { Counter } from '@/components/animations';

const stats = [
  {
    icon: Users,
    value: 50000,
    suffix: '+',
    label: 'Happy Travelers',
    description: 'Joined our adventures',
  },
  {
    icon: MapPin,
    value: 1000,
    suffix: '+',
    label: 'Destinations',
    description: 'Across 50+ countries',
  },
  {
    icon: Award,
    value: 15,
    suffix: '+',
    label: 'Years Experience',
    description: 'Professional guiding',
  },
  {
    icon: Globe,
    value: 98,
    suffix: '%',
    label: 'Satisfaction Rate',
    description: 'From verified reviews',
  },
];

const StatsSection: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      
      {/* Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm font-medium mb-4">
            Trusted by Travelers Worldwide
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Numbers That Speak
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied travelers who have explored the world with us
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 hover:bg-white/15 transition-all duration-300">
                {/* Icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-sky-500/25">
                  <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                {/* Counter */}
                <div className="mb-2">
                  <Counter
                    end={stat.value}
                    suffix={stat.suffix}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
                    duration={2.5}
                  />
                </div>

                {/* Label */}
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                  {stat.label}
                </h3>
                <p className="text-white/60 text-sm">
                  {stat.description}
                </p>

                {/* Decorative Element */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 sm:mt-16 flex flex-wrap justify-center items-center gap-6 sm:gap-10"
        >
          {['Verified Reviews', 'Secure Booking', '24/7 Support', 'Best Price Guarantee'].map((badge, index) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-2 text-white/70"
            >
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm font-medium">{badge}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
