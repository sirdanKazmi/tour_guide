'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw, Building, Phone, Mail, MapPin, Link, Globe, Share2, Search } from 'lucide-react';

interface Settings {
    business_name: string;
    business_phone: string;
    business_whatsapp: string;
    business_email: string;
    business_address: string;
    facebook_url: string;
    instagram_url: string;
    tiktok_url: string;
    youtube_url: string;
    homepage_banner_text: string;
    meta_title: string;
    meta_description: string;
}

const defaultSettings: Settings = {
    business_name: 'Smile For Miles',
    business_phone: '',
    business_whatsapp: '',
    business_email: '',
    business_address: '',
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
    youtube_url: '',
    homepage_banner_text: '',
    meta_title: '',
    meta_description: '',
};

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(Date.now());

    useEffect(() => {
        fetchSettings();
    }, [lastRefresh]);

    const fetchSettings = async () => {
        try {
            console.log('Fetching settings...');
            const response = await fetch('/api/admin/settings');
            
            if (response.status === 401) {
                alert('Session expired. Please log in again.');
                window.location.href = '/admin/login';
                return;
            }

            if (response.ok) {
                const data = await response.json();
                console.log('Loaded settings:', data);
                
                // Merge with defaults to ensure all fields exist
                setSettings({
                    ...defaultSettings,
                    ...data,
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            alert('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                alert('Settings saved successfully!');
                console.log('Settings saved successfully');
            } else {
                const error = await response.json();
                alert(`Failed to save settings: ${error.error}`);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: keyof Settings, value: string) => {
        setSettings(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Website Settings</h1>
                    <p className="text-gray-400 mt-1">Manage your business information and website configuration</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setLastRefresh(Date.now())}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reload
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>

            {/* Business Information */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Building className="w-6 h-6 text-green-400" />
                    <h2 className="text-xl font-bold text-white">Business Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Business Name *
                        </label>
                        <input
                            type="text"
                            value={settings.business_name}
                            onChange={(e) => handleChange('business_name', e.target.value)}
                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Smile For Miles"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Business Email *
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={settings.business_email}
                                onChange={(e) => handleChange('business_email', e.target.value)}
                                className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="baltrotraders1234@gmail.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="tel"
                                value={settings.business_phone}
                                onChange={(e) => handleChange('business_phone', e.target.value)}
                                className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="+92 300 1234567"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            WhatsApp Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="tel"
                                value={settings.business_whatsapp}
                                onChange={(e) => handleChange('business_whatsapp', e.target.value)}
                                className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="+92 300 1234567"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Include country code (e.g., +92 for Pakistan)</p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Business Address
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <textarea
                                value={settings.business_address}
                                onChange={(e) => handleChange('business_address', e.target.value)}
                                className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                rows={3}
                                placeholder="Enter your business address"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Share2 className="w-6 h-6 text-blue-400" />
                    <h2 className="text-xl font-bold text-white">Social Media Links</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Facebook URL
                        </label>
                        <div className="relative">
                            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="url"
                                value={settings.facebook_url}
                                onChange={(e) => handleChange('facebook_url', e.target.value)}
                                className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="https://facebook.com/yourpage"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Instagram URL
                        </label>
                        <div className="relative">
                            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="url"
                                value={settings.instagram_url}
                                onChange={(e) => handleChange('instagram_url', e.target.value)}
                                className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="https://instagram.com/yourprofile"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            TikTok URL
                        </label>
                        <div className="relative">
                            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="url"
                                value={settings.tiktok_url}
                                onChange={(e) => handleChange('tiktok_url', e.target.value)}
                                className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="https://tiktok.com/@yourprofile"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            YouTube URL
                        </label>
                        <div className="relative">
                            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="url"
                                value={settings.youtube_url}
                                onChange={(e) => handleChange('youtube_url', e.target.value)}
                                className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="https://youtube.com/@yourchannel"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Homepage Settings */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Globe className="w-6 h-6 text-purple-400" />
                    <h2 className="text-xl font-bold text-white">Homepage Settings</h2>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Homepage Banner Text
                    </label>
                    <textarea
                        value={settings.homepage_banner_text}
                        onChange={(e) => handleChange('homepage_banner_text', e.target.value)}
                        className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={3}
                        placeholder="Enter the main banner text for your homepage"
                    />
                    <p className="text-xs text-gray-400 mt-1">This text appears on the main hero section of your website</p>
                </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Search className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-xl font-bold text-white">SEO Settings</h2>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Meta Title
                        </label>
                        <input
                            type="text"
                            value={settings.meta_title}
                            onChange={(e) => handleChange('meta_title', e.target.value)}
                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Smile For Miles - Best Tour Packages in Pakistan"
                        />
                        <p className="text-xs text-gray-400 mt-1">Recommended: 50-60 characters</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Meta Description
                        </label>
                        <textarea
                            value={settings.meta_description}
                            onChange={(e) => handleChange('meta_description', e.target.value)}
                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows={3}
                            placeholder="Discover the best tour packages in Pakistan. Explore Hunza, Skardu, and more with Smile For Miles."
                        />
                        <p className="text-xs text-gray-400 mt-1">Recommended: 150-160 characters</p>
                    </div>
                </div>
            </div>

            {/* Save Button (Sticky Bottom) */}
            <div className="sticky bottom-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700 p-4 -mx-8">
                <div className="flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg flex items-center gap-2 font-semibold"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save All Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}
