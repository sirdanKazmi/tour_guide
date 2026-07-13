'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Instagram, Facebook, MessageCircle, ArrowUp, Mail, Phone, MapPin, Send } from 'lucide-react';
import Link from 'next/link';
import { ScrollReveal } from '@/components/animations';
import { usePathname } from 'next/navigation';

const Footer: React.FC = () => {
  const pathname = usePathname();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  
  // Don't render footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubscribe = async () => {
    // Clear previous messages
    setNewsletterMessage('');
    setNewsletterError('');

    // Validate email
    if (!newsletterEmail || !newsletterEmail.trim()) {
      setNewsletterError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterError('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewsletterMessage('Subscribed successfully!');
        setNewsletterEmail('');
        setTimeout(() => setNewsletterMessage(''), 5000);
      } else {
        setNewsletterError(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      setNewsletterError('Failed to subscribe. Please try again.');
    }
  };

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tours', href: '/tours' },
    { name: 'Destinations', href: '/destinations/gilgit-baltistan' },
    { name: 'Car Rental', href: '/car-rental' },
    { name: 'By Air', href: '/by-air' },
    { name: 'Contact', href: '/contact' },
  ];

  const supportLinks = [
    { name: 'Track Booking', href: '/track' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cancellation Policy', href: '/cancellation' },
  ];
  
  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/smilesmiles1234/', label: 'Instagram', color: 'from-purple-500 to-pink-500' },
    { icon: Facebook, href: 'https://www.facebook.com/syedhidayat.hashmi', label: 'Facebook', color: 'from-blue-500 to-blue-600' },
    { icon: MessageCircle, href: 'https://wa.me/921234567890', label: 'WhatsApp', color: 'from-green-500 to-emerald-600' },
  ];

  const contactInfo = {
    phone: '+92 123 456 7890',
    email: 'baltrotraders1234@gmail.com',
    address: 'Main Bazaar, Skardu, Gilgit-Baltistan, Pakistan'
  };

  return (
    <footer className="relative bg-white dark:bg-slate-900 text-slate-800 dark:text-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      {/* Newsletter Section */}
      <div className="relative z-10 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <ScrollReveal direction="left" className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-800 dark:text-white">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-gray-600 dark:text-slate-400">
                Get the latest travel deals and inspiration delivered to your inbox
              </p>
            </ScrollReveal>
            
            <ScrollReveal direction="right" className="w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 lg:w-80">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-400" />
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      setNewsletterError('');
                      setNewsletterMessage('');
                    }}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-full text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNewsletterSubscribe}
                  className="px-6 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all text-white"
                >
                  Subscribe
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              {newsletterMessage && (
                <p className="text-green-600 dark:text-green-400 text-sm mt-2">{newsletterMessage}</p>
              )}
              {newsletterError && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2">{newsletterError}</p>
              )}
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <ScrollReveal direction="up" delay={0} className="sm:col-span-2 lg:col-span-1">
            <div>
              <Link href="/">
                <motion.div
                  className="flex items-center gap-3 mb-6 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Plane className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-slate-800 dark:text-white">Smile For Miles</span>
                    <span className="block text-xs text-sky-500 dark:text-sky-400 tracking-widest uppercase">Travel</span>
                  </div>
                </motion.div>
              </Link>
              <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                Creating unforgettable travel experiences since 2009. 
                Let us help you discover the world&apos;s most amazing destinations.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center hover:bg-gradient-to-br ${social.color} transition-all duration-300`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </motion.a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Quick Links */}
          <ScrollReveal direction="up" delay={0.1}>
            <div>
              <h4 className="font-semibold text-lg mb-6 text-slate-800 dark:text-white">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>
                      <motion.span
                        className="text-gray-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 group cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Support */}
          <ScrollReveal direction="up" delay={0.2}>
            <div>
              <h4 className="font-semibold text-lg mb-6 text-slate-800 dark:text-white">Support</h4>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>
                      <motion.span
                        className="text-gray-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 group cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Contact Info */}
          <ScrollReveal direction="up" delay={0.3}>
            <div>
              <h4 className="font-semibold text-lg mb-6 text-slate-800 dark:text-white">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-slate-400 text-sm">Phone</p>
                    <a 
                      href="tel:+921234567890"
                      className="text-slate-800 dark:text-white hover:text-sky-500 transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-slate-400 text-sm">Email</p>
                    <a 
                      href="mailto:baltrotraders1234@gmail.com"
                      className="text-slate-800 dark:text-white hover:text-sky-500 transition-colors break-all"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-slate-400 text-sm">Address</p>
                    <p className="text-slate-800 dark:text-white text-sm">{contactInfo.address}</p>
                  </div>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-slate-500 text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} Smile For Miles Travel. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <Link href="/privacy">
                <motion.span
                  className="text-gray-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors cursor-pointer"
                  whileHover={{ y: -2 }}
                >
                  Privacy Policy
                </motion.span>
              </Link>
              <Link href="/terms">
                <motion.span
                  className="text-gray-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors cursor-pointer"
                  whileHover={{ y: -2 }}
                >
                  Terms of Service
                </motion.span>
              </Link>
              
              {/* Scroll to Top */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full shadow-lg shadow-sky-500/25 flex items-center justify-center"
              >
                <ArrowUp className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
