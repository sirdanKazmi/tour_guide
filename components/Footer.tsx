'use client';

import React from 'react';
import { Compass, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { TourData } from '@/lib/data';

interface FooterProps {
  data: TourData;
  setCurrentPage: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ data, setCurrentPage }) => {
  return (
    <footer className="bg-slate-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Compass className="text-emerald-500" size={32} />
              <span className="text-xl font-bold">AdventureGuide</span>
            </div>
            <p className="text-slate-400">
              Creating unforgettable journeys since 2014
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {['Home', 'About', 'Destinations', 'Gallery', 'Contact'].map((link) => (
                <button
                  key={link}
                  onClick={() => setCurrentPage(link)}
                  className="block text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <div className="space-y-2 text-slate-400">
              <p>{data.guide.phone}</p>
              <p>{data.guide.email}</p>
              <p>{data.guide.address}</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href={data.guide.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href={data.guide.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href={`https://wa.me/${data.guide.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
          <p>&copy; 2024 AdventureGuide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;