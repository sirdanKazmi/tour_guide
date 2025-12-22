'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Compass } from 'lucide-react';

interface NavigationProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ darkMode, setDarkMode, currentPage, setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'About', 'Destinations', 'Videos', 'Gallery', 'Contact'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('Home')}>
            <Compass className={`w-8 h-8 ${scrolled ? 'text-emerald-600' : 'text-white'}`} />
            <span className={`text-xl font-bold ${scrolled ? 'text-slate-900 dark:text-white' : 'text-white'}`}>
              AdventureGuide
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => setCurrentPage(link)}
                className={`font-medium transition-colors ${currentPage === link
                    ? 'text-emerald-600'
                    : scrolled
                      ? 'text-slate-700 dark:text-slate-300 hover:text-emerald-600'
                      : 'text-white hover:text-emerald-400'
                  }`}
              >
                {link}
              </button>
            ))}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-colors ${scrolled ? 'hover:bg-slate-200 dark:hover:bg-slate-800' : 'hover:bg-white/20'
                }`}
            >
              {darkMode ? (
                <Sun className={scrolled ? 'text-slate-700 dark:text-slate-300' : 'text-white'} size={20} />
              ) : (
                <Moon className={scrolled ? 'text-slate-700' : 'text-white'} size={20} />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <X className={scrolled ? 'text-slate-900 dark:text-white' : 'text-white'} size={24} />
            ) : (
              <Menu className={scrolled ? 'text-slate-900 dark:text-white' : 'text-white'} size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => {
                  setCurrentPage(link);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 ${currentPage === link
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                {link}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navigation;