'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ZoomIn, Heart } from 'lucide-react';
import { TourData, GalleryItem } from '@/lib/data';
import { FadeIn, Card3D } from '@/components/animations';

interface GalleryPageProps {
  data: TourData;
}

const GalleryPageComponent: React.FC<GalleryPageProps> = ({ data }) => {
  const [filter, setFilter] = useState<string>('All');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const categories = ['All', ...new Set(data.gallery.map((g) => g.category))];
  const filtered = filter === 'All' ? data.gallery : data.gallery.filter((g) => g.category === filter);

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-8 sm:mb-12 px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-slate-900 dark:text-white">
            Photo <span className="gradient-text">Gallery</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300">
            Captured moments from incredible adventures
          </p>
        </FadeIn>

        {/* Filter Buttons */}
        <FadeIn delay={0.2} className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-4">
          {categories.map((cat: string) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all ${
                filter === cat
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {cat}
              {filter === cat && (
                <motion.div
                  layoutId="galleryFilter"
                  className="absolute inset-0 bg-emerald-600 rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </FadeIn>

        {/* Gallery Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 px-4"
          >
            {filtered.map((item, idx: number) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: idx * 0.05 }}
                className={`relative group cursor-pointer overflow-hidden rounded-xl ${
                  idx === 0 || idx === 5 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                onClick={() => setLightbox(item)}
              >
                <Card3D intensity={5}>
                  <div className="relative h-full min-h-[200px] md:min-h-[250px]">
                    <motion.img
                      src={item.image[0]}
                      alt={`Gallery ${item.id}`}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    
                    {/* Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Icons */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center gap-4"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="bg-white/20 backdrop-blur-sm p-3 rounded-full"
                      >
                        <ZoomIn className="text-white" size={24} />
                      </motion.div>
                    </motion.div>
                    
                    {/* Like Button */}
                    <motion.button
                      onClick={(e) => toggleLike(item.id, e)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart
                        className={liked.has(item.id) ? 'text-red-500 fill-red-500' : 'text-white'}
                        size={20}
                      />
                    </motion.button>
                    
                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-3 py-1 bg-emerald-600/80 backdrop-blur-sm text-white text-xs rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Camera className="mx-auto mb-4 text-slate-400" size={48} />
            <p className="text-xl text-slate-600 dark:text-slate-400">
              No photos found in this category.
            </p>
          </motion.div>
        )}

        {/* 3D Lightbox Modal */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}
            >
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                onClick={() => setLightbox(null)}
                className="absolute top-6 right-6 text-white hover:text-slate-300 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full"
              >
                <X size={32} />
              </motion.button>
              
              {/* Image Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative max-w-5xl w-full perspective-1000"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.img
                  src={lightbox.image[0]}
                  alt="Lightbox"
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
                  style={{ transformStyle: 'preserve-3d' }}
                />
                
                {/* Image Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg"
                >
                  <span className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-full">
                    {lightbox.category}
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GalleryPageComponent;
