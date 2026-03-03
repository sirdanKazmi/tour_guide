'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Plane, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
    } else if (savedDarkMode === 'false') {
      setDarkMode(false);
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove('light');
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', label: 'Home', href: '/' },
    { name: 'About', label: 'About', href: '/about' },
    { name: 'Gallery', label: 'Gallery', href: '/gallery' },
    { name: 'Videos', label: 'Videos', href: '/videos' },
    { name: 'Contact', label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isDestinationsActive = pathname.startsWith('/destinations');

  const gbRegions = [
    { name: 'Skardu', href: '/destinations/skardu' },
    { name: 'Hunza', href: '/destinations/hunza' },
    { name: 'Gilgit', href: '/destinations/gilgit' },
    { name: 'Khaplu', href: '/destinations/khaplu' },
    { name: 'Astore', href: '/destinations/astore' },
    { name: 'Nagar', href: '/destinations/nagar' },
    { name: 'Ghizer', href: '/destinations/ghizer' },
    { name: 'Shigar', href: '/destinations/shigar' },
    { name: 'Ghanche', href: '/destinations/ghanche' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <motion.div
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center ${
                scrolled 
                  ? 'bg-gradient-to-br from-sky-500 to-blue-600' 
                  : 'bg-white/20 backdrop-blur-sm'
              }`}
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Plane className={`w-5 h-5 ${scrolled ? 'text-white' : 'text-white'}`} />
            </motion.div>
            <div className="flex flex-col">
              <span className={`text-lg sm:text-xl font-bold tracking-tight ${
                scrolled ? 'text-slate-900 dark:text-white' : 'text-white'
              }`}>
                Wanderlust
              </span>
              <span className={`text-[10px] sm:text-xs tracking-widest uppercase ${
                scrolled ? 'text-sky-600 dark:text-sky-400' : 'text-white/80'
              }`}>
                Travel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Home Link */}
            <Link href="/">
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full cursor-pointer ${
                  isActive('/')
                    ? scrolled 
                      ? 'text-sky-600 dark:text-sky-400' 
                      : 'text-white'
                    : scrolled
                      ? 'text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400'
                      : 'text-white/80 hover:text-white'
                }`}
              >
                Home
                {isActive('/') && (
                  <motion.div
                    layoutId="activeNav"
                    className={`absolute inset-0 rounded-full -z-10 ${
                      scrolled 
                        ? 'bg-sky-50 dark:bg-sky-900/20' 
                        : 'bg-white/20'
                    }`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.span>
            </Link>

            {/* Destinations Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setDestinationsOpen(true)}
              onMouseLeave={() => setDestinationsOpen(false)}
            >
              <Link href="/destinations/gilgit-baltistan">
                <motion.span
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full flex items-center gap-1 cursor-pointer ${
                    isDestinationsActive
                      ? scrolled 
                        ? 'text-sky-600 dark:text-sky-400' 
                        : 'text-white'
                      : scrolled
                        ? 'text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400'
                        : 'text-white/80 hover:text-white'
                  }`}
                >
                  Destinations
                  <ChevronDown className={`w-4 h-4 transition-transform ${destinationsOpen ? 'rotate-180' : ''}`} />
                  {isDestinationsActive && (
                    <motion.div
                      layoutId="activeNav"
                      className={`absolute inset-0 rounded-full -z-10 ${
                        scrolled 
                          ? 'bg-sky-50 dark:bg-sky-900/20' 
                          : 'bg-white/20'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.span>
              </Link>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {destinationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden py-2"
                  >
                    <Link
                      href="/destinations/gilgit-baltistan"
                      className="block px-4 py-3 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 border-b border-slate-200 dark:border-slate-700"
                    >
                      All Regions Overview
                    </Link>
                    {gbRegions.map((region) => (
                      <Link
                        key={region.name}
                        href={region.href}
                        className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                      >
                        {region.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Remaining Nav Links */}
            {navLinks.slice(1).map((link, index) => (
              <Link key={link.name} href={link.href}>
                <motion.span
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 2) * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full cursor-pointer ${
                    isActive(link.href)
                      ? scrolled 
                        ? 'text-sky-600 dark:text-sky-400' 
                        : 'text-white'
                      : scrolled
                        ? 'text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400'
                        : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="activeNav"
                      className={`absolute inset-0 rounded-full -z-10 ${
                        scrolled 
                          ? 'bg-sky-50 dark:bg-sky-900/20' 
                          : 'bg-white/20'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`p-2.5 rounded-full transition-colors ${
                scrolled 
                  ? 'hover:bg-slate-100 dark:hover:bg-slate-800' 
                  : 'hover:bg-white/20'
              }`}
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className={`w-5 h-5 ${scrolled ? 'text-amber-500' : 'text-white'}`} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className={`w-5 h-5 ${scrolled ? 'text-slate-600' : 'text-white'}`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* CTA Button - Desktop */}
            <Link href="/contact">
              <motion.span
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all cursor-pointer ${
                  scrolled
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40'
                    : 'bg-white text-sky-600 shadow-lg hover:shadow-xl'
                }`}
              >
                Book Now
              </motion.span>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`lg:hidden p-2.5 rounded-full transition-colors ${
                scrolled 
                  ? 'hover:bg-slate-100 dark:hover:bg-slate-800' 
                  : 'hover:bg-white/20'
              }`}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className={`w-6 h-6 ${scrolled ? 'text-slate-900 dark:text-white' : 'text-white'}`} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className={`w-6 h-6 ${scrolled ? 'text-slate-900 dark:text-white' : 'text-white'}`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:hidden overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800"
          >
            <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              {/* Home Link */}
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0 }}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Home
                </motion.div>
              </Link>

              {/* Destinations Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Link
                  href="/destinations/gilgit-baltistan"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isDestinationsActive
                      ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Destinations Overview
                </Link>
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 pl-4">
                  {gbRegions.slice(0, 6).map((region) => (
                    <Link
                      key={region.name}
                      href={region.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                    >
                      {region.name}
                    </Link>
                  ))}
                  <Link
                    href="/destinations/gilgit-baltistan"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-sky-600 dark:text-sky-400 font-medium"
                  >
                    View All Regions →
                  </Link>
                </div>
              </motion.div>

              {/* Other Nav Links */}
              {navLinks.slice(1).map((link, index) => (
                <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 2) * 0.05 }}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.label}
                  </motion.div>
                </Link>
              ))}
              
              {/* Mobile CTA */}
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-sky-500/25 text-center"
                >
                  Book Your Trip
                </motion.div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
