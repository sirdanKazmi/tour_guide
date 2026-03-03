'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HoverScaleProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  onClick?: () => void;
}

export const HoverScale: React.FC<HoverScaleProps> = ({
  children,
  className = '',
  scale = 1.03,
  onClick,
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
