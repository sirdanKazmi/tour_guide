'use client';

import React from 'react';
import { ChevronRight, Star, Award, Mountain, Users, Compass, Camera } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';
import { TourData } from '@/lib/data';

interface HomePageProps {
  data: TourData;
  setCurrentPage: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ data, setCurrentPage }) => {
  const iconMap: Record<string, React.ReactNode> = {
    Mountain: <Mountain className="text-emerald-600" size={32} />,
    Users: <Users className="text-emerald-600" size={32} />,
    Compass: <Compass className="text-emerald-600" size={32} />,
    Camera: <Camera className="text-emerald-600" size={32} />
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <HeroSlider />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fadeIn">
          <img
            src={data.guide.profilePhoto}
            alt={data.guide.name}
            className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-2xl object-cover"
          />
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-slideUp">
            Your Local Adventure Expert
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-200 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            Discover breathtaking destinations with an experienced guide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => setCurrentPage('Contact')}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 rounded-full font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-2xl"
            >
              Book Now
            </button>
            <button
              onClick={() => setCurrentPage('Destinations')}
              className="px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full font-semibold text-lg transition-all transform hover:scale-105"
            >
              View Itineraries
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="rotate-90 text-white" size={32} />
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 px-4 bg-linear-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeIn">
              <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
                Meet Your Guide
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {data.guide.bio}
              </p>
              <button
                onClick={() => setCurrentPage('About')}
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all transform hover:scale-105"
              >
                Learn More <ChevronRight className="ml-2" size={20} />
              </button>
            </div>
            <div className="relative animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <img
                src={data.guide.profilePhoto}
                alt={data.guide.name}
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-amber-500 text-white p-6 rounded-xl shadow-xl">
                <Award size={32} />
                <p className="font-bold mt-2">10+ Years</p>
                <p className="text-sm">Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Featured Destinations
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.destinations.map((dest, idx) => (
              <div
                key={dest.id}
                className="group cursor-pointer animate-fadeIn"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => setCurrentPage('Destinations')}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{dest.name}</h3>
                    <p className="text-sm text-slate-200">{dest.region}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Our Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.services.map((service, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-xl bg-linear-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 animate-fadeIn"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  {iconMap[service.icon]}
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-linear-to-br from-emerald-50 to-amber-50 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            What Travelers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {data.testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl animate-fadeIn"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{testimonial.name}</h4>
                    <div className="flex text-amber-500">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for Your Next Adventure?</h2>
          <p className="text-xl mb-8">Let's plan an unforgettable journey together</p>
          <button
            onClick={() => setCurrentPage('Contact')}
            className="px-8 py-4 bg-white text-emerald-600 rounded-full font-semibold text-lg hover:bg-slate-100 transition-all transform hover:scale-105 hover:shadow-2xl"
          >
            Get In Touch
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
