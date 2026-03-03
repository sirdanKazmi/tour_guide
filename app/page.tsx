'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import AboutPageComponent from '@/components/AboutPage';
import DestinationsPageComponent from '@/components/DestinationsPage';
import GalleryPageComponent from '@/components/GalleryPage';
import ContactPageComponent from '@/components/ContactPage';
import Footer from '@/components/Footer';
import { initialData } from '@/lib/data';
import HomePage from '@/components/HomePage';
import VideoGallery from '@/components/VideoGallery';

export default function TouristGuideWebsite() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('Home');
  const [data] = useState(initialData);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode and save to localStorage
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove('light');
      html.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.98 },
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <HomePage data={data} setCurrentPage={setCurrentPage} />;
      case 'About':
        return <AboutPageComponent data={data} />;
      case 'Destinations':
        return <DestinationsPageComponent data={data} />;
      case 'Videos':
        return <VideoGallery setCurrentPage={setCurrentPage} />;
      case 'Gallery':
        return <GalleryPageComponent data={data} />;
      case 'Contact':
        return <ContactPageComponent data={data} />;
      default:
        return <HomePage data={data} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        h1, h2, h3 {
          font-family: 'Playfair Display', serif;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <Navigation
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <main className="bg-white dark:bg-slate-900 transition-colors duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer data={data} setCurrentPage={setCurrentPage} />
    </div>
  );
}