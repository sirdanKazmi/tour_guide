'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MessageCircle, MapPin, Instagram, Facebook, Send, CheckCircle } from 'lucide-react';
import { TourData } from '@/lib/data';
import { FadeIn, Card3D, MagneticButton } from '@/components/animations';

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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '', tripDates: '' });
    }, 3000);
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none transition-all duration-300";
  const getInputClasses = (fieldName: string) => {
    const baseClasses = inputClasses;
    const isFocused = focusedField === fieldName;
    const hasValue = formData[fieldName as keyof FormData];
    
    if (isFocused || hasValue) {
      return `${baseClasses} border-emerald-500 shadow-lg shadow-emerald-500/20`;
    }
    return `${baseClasses} border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500`;
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: data.guide.email, href: `mailto:${data.guide.email}` },
    { icon: Phone, label: 'Phone', value: data.guide.phone, href: `tel:${data.guide.phone}` },
    { icon: MessageCircle, label: 'WhatsApp', value: 'Chat on WhatsApp', href: `https://wa.me/${data.guide.whatsapp}` },
    { icon: MapPin, label: 'Address', value: data.guide.address, href: null },
  ];

  const socialLinks = [
    { icon: Instagram, href: data.guide.socials.instagram, color: 'from-purple-500 to-pink-500', label: 'Instagram' },
    { icon: Facebook, href: data.guide.socials.facebook, color: 'from-blue-600 to-blue-400', label: 'Facebook' },
    { icon: MessageCircle, href: `https://wa.me/${data.guide.whatsapp}`, color: 'from-green-500 to-emerald-400', label: 'WhatsApp' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-8 sm:mb-12 px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-slate-900 dark:text-white">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300">
            Ready to start your adventure? Let&apos;s plan it together!
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 px-4">
          {/* Contact Form */}
          <FadeIn direction="left">
            <Card3D className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl" intensity={5}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <motion.div
                  initial={false}
                  animate={{ scale: focusedField === 'name' ? 1.02 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={getInputClasses('name')}
                    placeholder="John Doe"
                  />
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={false}
                  animate={{ scale: focusedField === 'email' ? 1.02 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={getInputClasses('email')}
                    placeholder="john@example.com"
                  />
                </motion.div>

                {/* Trip Dates Field */}
                <motion.div
                  initial={false}
                  animate={{ scale: focusedField === 'tripDates' ? 1.02 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Preferred Trip Dates
                  </label>
                  <input
                    type="text"
                    value={formData.tripDates}
                    onChange={(e) => setFormData({ ...formData, tripDates: e.target.value })}
                    onFocus={() => setFocusedField('tripDates')}
                    onBlur={() => setFocusedField(null)}
                    className={getInputClasses('tripDates')}
                    placeholder="e.g., June 15-20, 2025"
                  />
                </motion.div>

                {/* Message Field */}
                <motion.div
                  initial={false}
                  animate={{ scale: focusedField === 'message' ? 1.02 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className={getInputClasses('message')}
                    placeholder="Tell me about your dream adventure..."
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Send Message
                </motion.button>

                {/* Success Message */}
                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center text-emerald-600 font-semibold flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={20} />
                      Message sent successfully! I&apos;ll get back to you soon.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </Card3D>
          </FadeIn>

          {/* Contact Information */}
          <FadeIn direction="right" delay={0.2}>
            <div className="space-y-6">
              {/* Contact Card */}
              <Card3D className="bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl" intensity={5}>
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                  Contact <span className="gradient-text">Information</span>
                </h2>
                <div className="space-y-4">
                  {contactInfo.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="text-emerald-600 mr-4 mt-1"
                      >
                        <item.icon size={24} />
                      </motion.div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.href.startsWith('http') ? '_blank' : undefined}
                            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-slate-600 dark:text-slate-300">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-8 border-t border-slate-300 dark:border-slate-600">
                  <h3 className="font-bold mb-4 text-slate-900 dark:text-white">Follow Me</h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social, idx) => (
                      <motion.a
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.15, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-full flex items-center justify-center text-white shadow-lg`}
                        aria-label={social.label}
                      >
                        <social.icon size={24} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </Card3D>

              {/* Map */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl overflow-hidden shadow-lg h-64"
              >
                <iframe
                  title="Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093743!2d144.9537353!3d-37.8172139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sau!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default ContactPageComponent;
