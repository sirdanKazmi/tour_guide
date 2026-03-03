'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Film, Clock, Eye } from 'lucide-react';
import { FadeIn, Card3D, GlowCard } from '@/components/animations';

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
                {/* Header */}
                <FadeIn className="text-center mb-8 sm:mb-12 px-4">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-slate-900 dark:text-white">
                        Video <span className="gradient-text">Gallery</span>
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300">
                        Watch our amazing tour adventures
                    </p>
                </FadeIn>

                {/* Category Filter */}
                <FadeIn delay={0.2} className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-4">
                    {categories.map((cat) => (
                        <motion.button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all ${
                                filter === cat
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                            }`}
                        >
                            {cat}
                            {filter === cat && (
                                <motion.div
                                    layoutId="videoFilter"
                                    className="absolute inset-0 bg-emerald-600 rounded-full -z-10"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    ))}
                </FadeIn>

                {/* Video Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <Film className="text-emerald-600" size={48} />
                            </motion.div>
                            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading videos...</p>
                        </motion.div>
                    ) : filteredVideos.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20"
                        >
                            <Film className="mx-auto mb-4 text-slate-400" size={48} />
                            <p className="text-slate-600 dark:text-slate-400">No videos available</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={filter}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4"
                        >
                            {filteredVideos.map((video, idx) => (
                                <motion.div
                                    key={video.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Card3D className="h-full" intensity={8}>
                                        <GlowCard
                                            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden cursor-pointer h-full"
                                            glowColor="rgba(16, 185, 129, 0.1)"
                                        >
                                            <motion.div
                                                onClick={() => setSelectedVideo(video)}
                                                className="relative aspect-video bg-slate-200 dark:bg-slate-700 overflow-hidden"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                {video.thumbnail_url ? (
                                                    <motion.img
                                                        src={video.thumbnail_url}
                                                        alt={video.title}
                                                        className="w-full h-full object-cover"
                                                        whileHover={{ scale: 1.1 }}
                                                        transition={{ duration: 0.6 }}
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <Play className="text-slate-400" size={64} />
                                                    </div>
                                                )}
                                                
                                                {/* Overlay */}
                                                <motion.div
                                                    className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center"
                                                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                                                >
                                                    <motion.div
                                                        className="bg-emerald-600 rounded-full p-4"
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        whileHover={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Play className="text-white" size={32} />
                                                    </motion.div>
                                                </motion.div>
                                                
                                                {/* Duration Badge */}
                                                {video.duration && (
                                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                                    </div>
                                                )}
                                            </motion.div>
                                            
                                            <div className="p-4">
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1">
                                                    {video.title}
                                                </h3>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                                        {video.category}
                                                    </span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                        <Eye size={14} /> Watch Now
                                                    </span>
                                                </div>
                                                {video.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-2">
                                                        {video.description}
                                                    </p>
                                                )}
                                            </div>
                                        </GlowCard>
                                    </Card3D>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Video Player Modal */}
                <AnimatePresence>
                    {selectedVideo && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="max-w-5xl w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <motion.h2
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-2xl font-bold text-white mb-2"
                                        >
                                            {selectedVideo.title}
                                        </motion.h2>
                                        {selectedVideo.description && (
                                            <motion.p
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-slate-300"
                                            >
                                                {selectedVideo.description}
                                            </motion.p>
                                        )}
                                    </div>
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        onClick={() => setSelectedVideo(null)}
                                        className="text-white hover:text-slate-300 p-2 bg-white/10 backdrop-blur-sm rounded-full"
                                    >
                                        <X size={32} />
                                    </motion.button>
                                </div>
                                
                                {/* Video Player */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="relative rounded-xl overflow-hidden shadow-2xl"
                                >
                                    <video
                                        src={selectedVideo.video_url}
                                        controls
                                        autoPlay
                                        className="w-full"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default VideoGallery;
