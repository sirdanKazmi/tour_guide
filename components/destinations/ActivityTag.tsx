'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Camera, 
  Tent, 
  Fish, 
  Mountain, 
  Bike, 
  Binoculars,
  Trees,
  Waves,
  Snowflake,
  Sun,
  Star
} from 'lucide-react';

interface ActivityTagProps {
  activity: string;
  index?: number;
}

const getActivityIcon = (activity: string) => {
  const lowercase = activity.toLowerCase();
  if (lowercase.includes('trek')) return Mountain;
  if (lowercase.includes('camp')) return Tent;
  if (lowercase.includes('fish')) return Fish;
  if (lowercase.includes('photo')) return Camera;
  if (lowercase.includes('bike') || lowercase.includes('cycle')) return Bike;
  if (lowercase.includes('wildlife') || lowercase.includes('bird')) return Binoculars;
  if (lowercase.includes('forest') || lowercase.includes('tree')) return Trees;
  if (lowercase.includes('boat') || lowercase.includes('kayak')) return Waves;
  if (lowercase.includes('ski') || lowercase.includes('snow')) return Snowflake;
  if (lowercase.includes('sun') || lowercase.includes('star')) return Sun;
  if (lowercase.includes('climb')) return Mountain;
  if (lowercase.includes('explore') || lowercase.includes('safari')) return Compass;
  return Star;
};

const getActivityColor = (activity: string) => {
  const colors = [
    'from-sky-500 to-blue-600',
    'from-emerald-500 to-green-600',
    'from-amber-500 to-orange-600',
    'from-purple-500 to-pink-600',
    'from-rose-500 to-red-600',
    'from-cyan-500 to-teal-600',
  ];
  return colors[activity.length % colors.length];
};

const ActivityTag: React.FC<ActivityTagProps> = ({ activity, index = 0 }) => {
  const Icon = getActivityIcon(activity);
  const colorClass = getActivityColor(activity);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-all border border-slate-200 dark:border-slate-700"
    >
      <div className={`w-8 h-8 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">
        {activity}
      </span>
    </motion.div>
  );
};

export default ActivityTag;
