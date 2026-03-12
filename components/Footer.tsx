'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Instagram, Facebook, MessageCircle, ArrowUp, Mail, Phone, MapPin, Send } from 'lucide-react';
import Link from 'next/link';
import { ScrollReveal } from '@/components/animations';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Destinations', href: '/destinations/gilgit-baltistan' },
    { name: 'About Us', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  const supportLinks = [
    { name: 'FAQ', href: '/contact' },
    { name: 'Terms of Service', href: '/contact' },
    { name: 'Privacy Policy', href: '/contact' },
    { name: 'Cancellation Policy', href: '/contact' },
  ];
  
  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'from-purple-500 to-pink-500' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'from-blue-500 to-blue-600' },
    { icon: MessageCircle, href: 'https://wa.me/1234567890', label: 'WhatsApp', color: 'from-green-500 to-emerald-600' },
  ];

  const contactInfo = {
    phone: '+92 123 456 7890',
    email: 'SmileforMiles@gmail.com',
    address: 'Main Bazaar, Skardu, Gilgit-Baltistan, Pakistan'
  };

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      {/* Newsletter Section */}
      <div className="relative z-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <ScrollReveal direction="left" className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-slate-400">
                Get the latest travel deals and inspiration delivered to your inbox
              </p>
            </ScrollReveal>
            
            <ScrollReveal direction="right" className="w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 lg:w-80">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
                >
                  Subscribe
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
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
                    <span className="text-xl font-bold">Smile For Miles</span>
                    <span className="block text-xs text-sky-400 tracking-widest uppercase">Travel</span>
                  </div>
                </motion.div>
              </Link>
              <p className="text-slate-400 mb-6 leading-relaxed">
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
                    className={`w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-br ${social.color} transition-all duration-300`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Quick Links */}
          <ScrollReveal direction="up" delay={0.1}>
            <div>
              <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>
                      <motion.span
                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer"
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
              <h4 className="font-semibold text-lg mb-6">Support</h4>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>
                      <motion.span
                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer"
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
              <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Phone</p>
                    <p className="text-white">{contactInfo.phone}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Email</p>
                    <p className="text-white">{contactInfo.email}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Address</p>
                    <p className="text-white text-sm">{contactInfo.address}</p>
                  </div>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} Smile For Miles Travel. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <Link href="/contact">
                <motion.span
                  className="text-slate-400 hover:text-white text-sm transition-colors cursor-pointer"
                  whileHover={{ y: -2 }}
                >
                  Privacy Policy
                </motion.span>
              </Link>
              <Link href="/contact">
                <motion.span
                  className="text-slate-400 hover:text-white text-sm transition-colors cursor-pointer"
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
