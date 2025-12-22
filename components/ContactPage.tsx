'use client';

import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, MapPin, Instagram, Facebook } from 'lucide-react';
import { TourData } from '@/lib/data';

interface ContactPageProps {
  data: TourData;
}

interface FormData {
  name: string;
  email: string;
  message: string;
  tripDates: string;
}

const ContactPageComponent: React.FC<ContactPageProps> = ({ data }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    tripDates: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Get In Touch
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Ready to start your adventure? Let's plan it together!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="animate-fadeIn">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Preferred Trip Dates
                </label>
                <input
                  type="text"
                  value={formData.tripDates}
                  onChange={(e) => setFormData({ ...formData, tripDates: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="e.g., June 15-20, 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="Tell me about your dream adventure..."
                />
              </div>
              <button
                type="submit"
                className="w-full px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Send Message
              </button>
              {submitted && (
                <div className="text-center text-emerald-600 font-semibold">
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="bg-linear-to-br from-emerald-50 to-amber-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="text-emerald-600 mr-4 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Email</p>
                    <a
                      href={`mailto:${data.guide.email}`}
                      className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                    >
                      {data.guide.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="text-emerald-600 mr-4 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Phone</p>
                    <a
                      href={`tel:${data.guide.phone}`}
                      className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                    >
                      {data.guide.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <MessageCircle className="text-emerald-600 mr-4 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">WhatsApp</p>
                    <a
                      href={`https://wa.me/${data.guide.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="text-emerald-600 mr-4 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Address</p>
                    <p className="text-slate-600 dark:text-slate-300">{data.guide.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-300 dark:border-slate-600">
                <h3 className="font-bold mb-4 text-slate-900 dark:text-white">Follow Me</h3>
                <div className="flex gap-4">
                  <a
                    href={data.guide.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                  >
                    <Instagram size={24} />
                  </a>
                  <a
                    href={data.guide.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href={`https://wa.me/${data.guide.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                  >
                    <MessageCircle size={24} />
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-64">
              <iframe
                title="Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093743!2d144.9537353!3d-37.8172139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sau!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPageComponent;
