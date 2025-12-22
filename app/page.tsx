'use client';

import React, { useState, useEffect } from 'react';
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
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);


  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        h1, h2, h3 {
          font-family: 'Playfair Display', serif;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 1s ease-out forwards;
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
        {currentPage === 'Home' && <HomePage data={data} setCurrentPage={setCurrentPage} />}
        {currentPage === 'About' && <AboutPageComponent data={data} />}
        {currentPage === 'Destinations' && <DestinationsPageComponent data={data} />}
        {currentPage === 'Videos' && <VideoGallery setCurrentPage={setCurrentPage} />}
        {currentPage === 'Gallery' && <GalleryPageComponent data={data} />}
        {currentPage === 'Contact' && <ContactPageComponent data={data} />}
      </main>

      <Footer data={data} setCurrentPage={setCurrentPage} />
    </div>
  );
}