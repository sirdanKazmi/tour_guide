'use client';

import React, { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';

interface VideoGalleryProps {
    setCurrentPage: (page: string) => void;
}

interface Video {
    id: number;
    title: string;
    description?: string;
    category: string;
    video_url: string;
    thumbnail_url?: string;
    duration?: number;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ setCurrentPage }) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const response = await fetch('/api/admin/videos');
            const data = await response.json();
            setVideos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(videos.map((v) => v.category))];
    const filteredVideos = filter === 'All' ? videos : videos.filter((v) => v.category === filter);

    return (
        <div className="min-h-screen pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fadeIn">
                    <h1 className="text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                        Video Gallery
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300">
                        Watch our amazing tour adventures
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all ${filter === cat
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Video Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-slate-600 dark:text-slate-400">Loading videos...</p>
                    </div>
                ) : filteredVideos.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-600 dark:text-slate-400">No videos available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVideos.map((video, idx) => (
                            <div
                                key={video.id}
                                onClick={() => setSelectedVideo(video)}
                                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden cursor-pointer group animate-fadeIn hover:shadow-2xl transition-shadow"
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                <div className="relative aspect-video bg-slate-200 dark:bg-slate-700">
                                    {video.thumbnail_url ? (
                                        <img
                                            src={video.thumbnail_url}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <Play className="text-slate-400" size={64} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                        <div className="bg-emerald-600 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="text-white" size={32} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                                        {video.title}
                                    </h3>
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-2">
                                        {video.category}
                                    </p>
                                    {video.description && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                            {video.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Video Player Modal */}
                {selectedVideo && (
                    <div
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        {selectedVideo.title}
                                    </h2>
                                    {selectedVideo.description && (
                                        <p className="text-slate-300">{selectedVideo.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="text-white hover:text-slate-300 p-2"
                                >
                                    <X size={32} />
                                </button>
                            </div>
                            <video
                                src={selectedVideo.video_url}
                                controls
                                autoPlay
                                className="w-full rounded-lg shadow-2xl"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoGallery;
