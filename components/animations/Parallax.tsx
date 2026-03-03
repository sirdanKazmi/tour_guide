'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  className = '',
  speed = 0.5,
  direction = 'up',
}) => {
  const { scrollYProgress } = useScroll();
  const yValue = direction === 'up' ? -100 * speed : 100 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [0, yValue]);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

export default Parallax;
