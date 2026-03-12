'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Sparkles, Shield, Clock, Headphones } from 'lucide-react';
import Link from 'next/link';
import { TourData } from '@/lib/data';
import HeroSection from '@/components/HeroSection';
import DestinationCard from '@/components/DestinationCard';
import StatsSection from '@/components/StatsSection';
import TestimonialCard from '@/components/TestimonialCard';
import { ScrollReveal, MagneticButton } from '@/components/animations';

interface HomePageProps {
  data: TourData;
  setCurrentPage: (page: string) => void;
}

const features = [
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Your payments and personal data are always protected',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Our travel experts are available around the clock',
  },
  {
    icon: Headphones,
    title: 'Expert Guides',
    description: 'Professional local guides with years of experience',
  },
  {
    icon: Sparkles,
    title: 'Best Price Guarantee',
    description: 'Find a lower price? We will match it',
  },
];

const HomePage: React.FC<HomePageProps> = ({ data, setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <HeroSection setCurrentPage={setCurrentPage} />

      {/* Featured Destinations Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-4 py-1.5 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full text-sm font-semibold mb-4">
              Popular Destinations
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Discover Your Next{' '}
              <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                Adventure
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              From breathtaking mountains to pristine beaches, explore our handpicked destinations
            </p>
          </ScrollReveal>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {data.destinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                index={index}
                onClick={() => setCurrentPage('Destinations')}
              />
            ))}
          </div>

          {/* View All Button */}
          <ScrollReveal className="text-center mt-12" delay={0.3}>
            <Link href="/destinations/gilgit-baltistan">
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Explore Gilgit-Baltistan
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Why Choose Us Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <ScrollReveal direction="left">
              <span className="inline-block px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-semibold mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                We Make Your Travel{' '}
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Dreams Real
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
                With over 15 years of experience, we have helped thousands of travelers 
                discover the world is most incredible destinations. Our commitment to 
                excellence ensures every journey is unforgettable.
              </p>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            {/* Right Image */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
                    alt="Travel Experience"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                </div>
                
                {/* Floating Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">98%</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Customer</p>
                      <p className="text-slate-600 dark:text-slate-400">Satisfaction Rate</p>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full opacity-20 blur-2xl" />
                <div className="absolute -bottom-4 right-1/4 w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20 blur-2xl" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Temporarily disabled due to empty testimonials data */}
      {/* <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              What Our Travelers{' '}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Say
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Real stories from real travelers who have experienced unforgettable journeys with us
            </p>
          </ScrollReveal>

          <div className="mb-8 sm:mb-12">
            <TestimonialCard 
              testimonial={data.testimonials[0]} 
              featured 
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {data.testimonials.slice(1).map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        {/* Animated Blobs */}
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-white/80 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of happy travelers and create memories that will last a lifetime. 
              Your next great adventure is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton
                onClick={() => setCurrentPage('Contact')}
                className="px-8 py-4 bg-white text-sky-600 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Book Your Trip Now
              </MagneticButton>
              <motion.button
                onClick={() => setCurrentPage('Destinations')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold text-lg border border-white/30 hover:bg-white/20 transition-all"
              >
                Explore Destinations
              </motion.button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
