'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { TourData } from '@/lib/data';
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  Card3D,
  Floating,
} from '@/components/animations';

interface AboutPageProps {
  data: TourData;
}

const AboutPageComponent: React.FC<AboutPageProps> = ({ data }) => {
  const timeline = [
    { year: "2014", event: "Started guiding local mountain tours" },
    { year: "2017", event: "Certified Adventure Travel Guide" },
    { year: "2019", event: "Led first international expedition" },
    { year: "2022", event: "500+ successful tours completed" },
    { year: "2024", event: "Expanded to coastal adventures" }
  ];

  const stats = [
    { value: "500+", label: "Tours Led", color: "emerald" },
    { value: "10+", label: "Years Experience", color: "amber" },
    { value: "50+", label: "Destinations", color: "blue" },
  ];

  const certifications = [
    'Wilderness First Responder',
    'Professional Mountain Guide',
    'Leave No Trace Trainer'
  ];

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-slate-900 dark:text-white">
            About <span className="gradient-text">{data.guide.name}</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300">{data.guide.title}</p>
        </FadeIn>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-20 items-center">
          <FadeIn direction="left">
            <Card3D className="relative" intensity={6}>
              <motion.img
                src={data.guide.profilePhoto}
                alt={data.guide.name}
                className="rounded-2xl shadow-2xl w-full h-64 sm:h-80 md:h-[500px] object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                className="absolute -bottom-3 sm:-bottom-4 -right-2 sm:-right-4 bg-emerald-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="font-bold text-sm sm:text-base">Certified Guide</p>
              </motion.div>
            </Card3D>
          </FadeIn>
          
          <FadeIn direction="right" delay={0.2}>
            <div className="space-y-4 sm:space-y-6 mt-6 md:mt-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                My <span className="gradient-text">Story</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {data.guide.bio}
              </p>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Every adventure is more than just a trip—it&apos;s a chance to create lasting memories, 
                discover new perspectives, and connect with the incredible diversity of our planet. 
                My approach combines safety, sustainability, and authentic experiences that go beyond 
                the typical tourist path.
              </p>
              
              {/* Stats */}
              <StaggerContainer className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6" staggerDelay={0.1}>
                {stats.map((stat, idx) => (
                  <StaggerItem key={idx}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`text-center p-2 sm:p-4 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 rounded-lg sm:rounded-xl`}
                    >
                      <p className={`text-xl sm:text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeIn>
        </div>

        {/* Timeline */}
        <div className="mb-12 sm:mb-20">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-slate-900 dark:text-white px-4">
              Journey <span className="gradient-text">Timeline</span>
            </h2>
          </FadeIn>
          
          <div className="space-y-6 sm:space-y-8 relative px-2 sm:px-0">
            {/* Timeline Line - Hidden on mobile, shown on sm+ */}
            <motion.div
              className="absolute left-4 sm:left-[128px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-amber-500"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              style={{ originY: 0 }}
            />
            
            {timeline.map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} direction="left">
                <motion.div
                  className="flex items-center group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 sm:w-32 text-right pr-4 sm:pr-8 flex-shrink-0">
                    <span className="text-lg sm:text-2xl font-bold text-emerald-600">{item.year}</span>
                  </div>
                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-600 rounded-full"
                      whileHover={{ scale: 1.5 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <div className="pl-4 sm:pl-8 flex-1 min-w-0">
                    <motion.p
                      className="text-sm sm:text-lg text-slate-700 dark:text-slate-300"
                      whileHover={{ color: '#10b981' }}
                    >
                      {item.event}
                    </motion.p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <FadeIn>
          <div className="bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-slate-800 dark:to-slate-700 p-6 sm:p-12 rounded-xl sm:rounded-2xl text-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                background: [
                  'radial-gradient(circle at 0% 0%, rgba(16,185,129,0.5) 0%, transparent 50%)',
                  'radial-gradient(circle at 100% 100%, rgba(245,158,11,0.5) 0%, transparent 50%)',
                  'radial-gradient(circle at 0% 0%, rgba(16,185,129,0.5) 0%, transparent 50%)',
                ],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-white relative z-10 px-4">
              Certifications & <span className="gradient-text">Expertise</span>
            </h2>
            
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 relative z-10" staggerDelay={0.15}>
              {certifications.map((cert, idx) => (
                <StaggerItem key={idx}>
                  <Card3D className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl shadow-lg h-full" intensity={4}>
                    <Floating duration={4 + idx} distance={5}>
                      <Award className="text-emerald-600 mx-auto mb-3 w-8 h-8 sm:w-10 sm:h-10" />
                    </Floating>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">{cert}</p>
                  </Card3D>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default AboutPageComponent;
