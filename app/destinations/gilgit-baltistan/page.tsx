import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { MapPin, Compass, Mountain, ArrowRight } from 'lucide-react';
import { gilgitBaltistanRegions } from '@/lib/gb-destinations';
import { RegionCard } from '@/components/destinations';
import { ScrollReveal } from '@/components/animations';

export const metadata: Metadata = {
  title: 'Gilgit-Baltistan Destinations | Explore the Roof of the World',
  description: 'Discover the breathtaking beauty of Gilgit-Baltistan. Explore Skardu, Hunza, Gilgit, Khaplu, Astore, Nagar, Ghizer, Shigar, and Ghanche - home to the world\'s highest peaks and pristine valleys.',
  keywords: ['Gilgit-Baltistan', 'Skardu', 'Hunza', 'Pakistan travel', 'Karakoram', 'mountain destinations', 'adventure travel'],
  openGraph: {
    title: 'Gilgit-Baltistan Destinations | Explore the Roof of the World',
    description: 'Discover the breathtaking beauty of Gilgit-Baltistan. Home to the world\'s highest peaks and pristine valleys.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Gilgit-Baltistan Mountains',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

const features = [
  {
    icon: Mountain,
    title: '5 Eight-Thousanders',
    description: 'Including K2, the world\'s second-highest peak',
  },
  {
    icon: Compass,
    title: '3 Mountain Ranges',
    description: 'Karakoram, Himalaya, and Hindu Kush',
  },
  {
    icon: MapPin,
    title: '10 Majestic Valleys',
    description: 'Each with unique landscapes and culture',
  },
];

export default function GilgitBaltistanPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
            alt="Gilgit-Baltistan"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span className="text-white/90 text-sm font-medium">Northern Pakistan</span>
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Gilgit-Baltistan
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-xl sm:text-2xl text-sky-400 font-medium mb-4">
              The Roof of the World
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover a land where three mighty mountain ranges meet, where ancient cultures 
              thrive, and where every turn reveals a view that takes your breath away. 
              Welcome to paradise on Earth.
            </p>
          </ScrollReveal>

          {/* Features */}
          <ScrollReveal delay={0.4}>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-12">
              {features.map((feature, index) => (
                <div key={feature.title} className="flex items-center gap-3 text-white/80">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-sky-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white">{feature.title}</p>
                    <p className="text-sm text-white/60">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal direction="left">
              <span className="inline-block px-4 py-1.5 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full text-sm font-semibold mb-4">
                About the Region
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                  Where Mountains Touch The Sky
                </span>
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                <p>
                  Gilgit-Baltistan is a region of unparalleled natural beauty, home to some of 
                  the world&apos;s highest peaks including K2, the second-highest mountain on Earth. 
                  Here, the Karakoram, Himalaya, and Hindu Kush mountain ranges converge, creating 
                  a landscape of dramatic contrasts.
                </p>
                <p>
                  From the turquoise lakes of Skardu to the ancient forts of Hunza, from the 
                  cold deserts of Shigar to the lush meadows of Astore, every valley tells a 
                  unique story. The region is a melting pot of cultures, with influences from 
                  Central Asia, Tibet, and South Asia creating a rich tapestry of traditions.
                </p>
                <p>
                  Whether you&apos;re seeking adventure on world-class trekking routes, tranquility 
                  in pristine alpine lakes, or cultural immersion in ancient settlements, 
                  Gilgit-Baltistan offers experiences that will stay with you forever.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden h-48">
                      <img
                        src="https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400&q=80"
                        alt="Mountain Lake"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden h-64">
                      <img
                        src="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&q=80"
                        alt="Valley View"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="rounded-2xl overflow-hidden h-64">
                      <img
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"
                        alt="Mountain Peak"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden h-48">
                      <img
                        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80"
                        alt="Alpine Lake"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Regions Grid */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-semibold mb-4">
              Explore Valleys
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Discover Our Regions
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Each valley offers a unique experience, from ancient forts to pristine lakes, 
              from towering peaks to welcoming villages
            </p>
          </ScrollReveal>

          {/* Regions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {gilgitBaltistanRegions.map((region, index) => (
              <RegionCard key={region.id} region={region} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Explore Gilgit-Baltistan?
            </h2>
            <p className="text-white/80 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
              Let us help you plan the adventure of a lifetime. Our expert guides know 
              every trail, every viewpoint, and every hidden gem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-sky-600 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                Plan Your Trip
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/destinations/skardu"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold text-lg border border-white/30 hover:bg-white/20 transition-all"
              >
                Start with Skardu
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
