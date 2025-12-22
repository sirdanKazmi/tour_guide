'use client';

import React from 'react';
import { Award } from 'lucide-react';
import { TourData } from '@/lib/data';

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

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            About {data.guide.name}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">{data.guide.title}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="animate-fadeIn">
            <img
              src={data.guide.profilePhoto}
              alt={data.guide.name}
              className="rounded-2xl shadow-2xl w-full h-125 object-cover"
            />
          </div>
          <div className="space-y-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">My Story</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {data.guide.bio}
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Every adventure is more than just a trip—it's a chance to create lasting memories, 
              discover new perspectives, and connect with the incredible diversity of our planet. 
              My approach combines safety, sustainability, and authentic experiences that go beyond 
              the typical tourist path.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <p className="text-3xl font-bold text-emerald-600">500+</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Tours Led</p>
              </div>
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <p className="text-3xl font-bold text-amber-600">10+</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Years Experience</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">50+</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Destinations</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Journey Timeline
          </h2>
          <div className="space-y-8">
            {timeline.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center animate-fadeIn"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-32 text-right pr-8">
                  <span className="text-2xl font-bold text-emerald-600">{item.year}</span>
                </div>
                <div className="relative">
                  <div className="w-4 h-4 bg-emerald-600 rounded-full" />
                  {idx < timeline.length - 1 && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-slate-300 dark:bg-slate-600" />
                  )}
                </div>
                <div className="pl-8 flex-1">
                  <p className="text-lg text-slate-700 dark:text-slate-300">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-linear-to-br from-emerald-50 to-amber-50 dark:from-slate-800 dark:to-slate-700 p-12 rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
            Certifications & Expertise
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {['Wilderness First Responder', 'Professional Mountain Guide', 'Leave No Trace Trainer'].map((cert, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg">
                <Award className="text-emerald-600 mx-auto mb-3" size={40} />
                <p className="font-semibold text-slate-900 dark:text-white">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPageComponent;
