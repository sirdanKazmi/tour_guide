'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Star, Crown } from 'lucide-react';
import { BudgetRange } from '@/lib/gb-destinations';

interface BudgetCardProps {
  budget: BudgetRange;
}

const budgetOptions = [
  {
    key: 'economy' as const,
    label: 'Economy',
    icon: Wallet,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-600 dark:text-green-400',
    description: 'Hostels, local transport, street food',
  },
  {
    key: 'midRange' as const,
    label: 'Mid-Range',
    icon: Star,
    color: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-50 dark:bg-sky-900/20',
    textColor: 'text-sky-600 dark:text-sky-400',
    description: '3-star hotels, private transport, restaurants',
  },
  {
    key: 'luxury' as const,
    label: 'Luxury',
    icon: Crown,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    textColor: 'text-amber-600 dark:text-amber-400',
    description: 'Heritage hotels, 4x4 vehicles, fine dining',
  },
];

const BudgetCard: React.FC<BudgetCardProps> = ({ budget }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {budgetOptions.map((option, index) => (
        <motion.div
          key={option.key}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className={`relative ${option.bgColor} rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 overflow-hidden`}
        >
          {/* Background Gradient */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${option.color} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />
          
          {/* Icon */}
          <div className={`relative w-14 h-14 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
            <option.icon className="w-7 h-7 text-white" />
          </div>

          {/* Content */}
          <h3 className={`text-lg font-bold ${option.textColor} mb-2`}>
            {option.label}
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {budget[option.key]}
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {option.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default BudgetCard;
