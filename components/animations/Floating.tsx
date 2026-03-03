'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
}

export const Floating: React.FC<FloatingProps> = ({
  children,
  className = '',
  duration = 3,
  distance = 10,
}) => {
  return (
    <motion.div
      animate={{
        y: [-distance, distance, -distance],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Floating;
