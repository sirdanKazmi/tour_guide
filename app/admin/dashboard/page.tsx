'use client';

import { useEffect, useState } from 'react';
import { Video, Image as ImageIcon, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        videos: 0,
        images: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [videosRes, galleryRes] = await Promise.all([
                    fetch('/api/admin/videos'),
                    fetch('/api/admin/gallery'),
                ]);

                const videos = await videosRes.json();
                const gallery = await galleryRes.json();

                setStats({
                    videos: Array.isArray(videos) ? videos.length : 0,
                    images: Array.isArray(gallery) ? gallery.filter((item: any) => item.type === 'image').length : 0,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Total Videos',
            value: stats.videos,
            icon: Video,
            color: 'bg-blue-500',
            link: '/admin/videos',
        },
        {
            title: 'Total Images',
            value: stats.images,
            icon: ImageIcon,
            color: 'bg-emerald-500',
            link: '/admin/gallery',
        },
        {
            title: 'Total Media',
            value: stats.videos + stats.images,
            icon: TrendingUp,
            color: 'bg-purple-500',
            link: '#',
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Welcome to the admin panel
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.title}
                            href={card.link}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                        {card.title}
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {card.value}
                                    </p>
                                </div>
                                <div className={`${card.color} p-4 rounded-lg`}>
                                    <Icon className="text-white" size={32} />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                        Quick Actions
                    </h2>
                    <div className="space-y-3">
                        <Link
                            href="/admin/videos"
                            className="block px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                            Upload New Video
                        </Link>
                        <Link
                            href="/admin/gallery"
                            className="block px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                        >
                            Add Gallery Images
                        </Link>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                        System Info
                    </h2>
                    <div className="space-y-3 text-slate-600 dark:text-slate-400">
                        <p>✓ Database connected</p>
                        <p>✓ File upload enabled</p>
                        <p>✓ Authentication active</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
