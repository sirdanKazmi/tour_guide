'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ExternalLink, Film, Clock, Eye, MonitorPlay } from 'lucide-react';
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

    // Extract YouTube thumbnail from URL
    const getYouTubeThumbnail = (url: string): string | null => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
    };

    // Extract Facebook video thumbnail
    const getFacebookThumbnail = (url: string): string | null => {
        // Facebook doesn't provide easy thumbnail extraction, return null
        return null;
    };

    // Get thumbnail for any video URL
    const getVideoThumbnail = (video: Video): string | null => {
        // Priority 1: Uploaded thumbnail
        if (video.thumbnail_url) return video.thumbnail_url;
        
        // Priority 2: YouTube auto-thumbnail
        const youtubeThumb = getYouTubeThumbnail(video.video_url);
        if (youtubeThumb) return youtubeThumb;
        
        // Priority 3: Uploaded video file - try to get first frame
        if (video.video_url.includes('/uploads/videos/')) {
            // For uploaded videos, we'll use a default thumbnail or the thumbnail if provided
            return null;
        }
        
        return null;
    };

    const categories = ['All', ...new Set(videos.map((v) => v.category))];
    const filteredVideos = filter === 'All' ? videos : videos.filter((v) => v.category === filter);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 pt-24 pb-20 px-4">
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
                            {filteredVideos.map((video, idx) => {
                                // Get thumbnail using the helper function
                                const thumbnailSrc = getVideoThumbnail(video);
                                const hasThumbnail = !!thumbnailSrc;
                                
                                return (
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
                                            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden h-full"
                                            glowColor="rgba(16, 185, 129, 0.1)"
                                        >
                                            {/* Video Player Section - Always visible */}
                                            <div className="relative aspect-video bg-slate-900">
                                                {/* Uploaded video file - play directly */}
                                                {video.video_url.includes('/uploads/videos/') || 
                                                 video.video_url.match(/\.(mp4|webm|ogg)$/i) ? (
                                                    <video
                                                        src={video.video_url}
                                                        controls
                                                        preload="metadata"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be') ? (
                                                    // YouTube embed
                                                    <iframe
                                                        src={video.video_url.replace('/watch?v=', '/embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                                        title={video.title}
                                                        className="w-full h-full"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                ) : video.video_url.includes('tiktok.com') ? (
                                                    // TikTok embed
                                                    <iframe
                                                        src={`https://www.tiktok.com/embed/v2/${video.video_url.split('/video/')[1]?.split('?')[0]}`}
                                                        title={video.title}
                                                        className="w-full h-full"
                                                        allow="encrypted-media"
                                                    />
                                                ) : video.video_url.includes('facebook.com') || video.video_url.includes('fb.watch') ? (
                                                    // Facebook - show thumbnail with watch button
                                                    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-600 to-blue-800 text-white p-4">
                                                        <MonitorPlay size={48} className="mb-3" />
                                                        <p className="text-sm font-semibold mb-3 text-center">Facebook Video</p>
                                                        <a
                                                            href={video.video_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-blue-50 transition-colors"
                                                        >
                                                            <ExternalLink size={16} />
                                                            Watch on Facebook
                                                        </a>
                                                    </div>
                                                ) : video.video_url.includes('instagram.com') ? (
                                                    // Instagram embed
                                                    <iframe
                                                        src={`${video.video_url}/embed`}
                                                        title={video.title}
                                                        className="w-full h-full"
                                                        allow="encrypted-media"
                                                    />
                                                ) : hasThumbnail ? (
                                                    // Show thumbnail for other URLs
                                                    <motion.img
                                                        src={thumbnailSrc!}
                                                        alt={video.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-emerald-500 to-teal-600">
                                                        <Play className="text-white" size={48} />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Video Info & Action Buttons */}
                                            <div className="p-4 space-y-3">
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 line-clamp-1">
                                                        {video.title}
                                                    </h3>
                                                    <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                                        {video.category}
                                                    </span>
                                                </div>
                                                
                                                {video.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                                        {video.description}
                                                    </p>
                                                )}
                                                
                                                {/* Action Buttons for URL-based videos */}
                                                {!video.video_url.includes('/uploads/videos/') && 
                                                 !video.video_url.match(/\.(mp4|webm|ogg)$/i) && (
                                                    <div className="flex gap-2 pt-2">
                                                        <button
                                                            onClick={() => setSelectedVideo(video)}
                                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                                                        >
                                                            <MonitorPlay size={16} />
                                                            Watch Here
                                                        </button>
                                                        <a
                                                            href={video.video_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white px-3 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                                                        >
                                                            <ExternalLink size={16} />
                                                            Visit Original
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </GlowCard>
                                    </Card3D>
                                </motion.div>
                            );})}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Video Modal */}
                <AnimatePresence>
                    {selectedVideo && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white dark:bg-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {selectedVideo.title}
                                        </h2>
                                        <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                                            {selectedVideo.category}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedVideo(null)}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    >
                                        <ExternalLink size={24} />
                                    </button>
                                </div>

                                {/* Video Container */}
                                <div className="aspect-video bg-slate-900 relative">
                                    {/* Check if it's an uploaded video file */}
                                    {selectedVideo.video_url.includes('/uploads/videos/') || 
                                     selectedVideo.video_url.match(/\.(mp4|webm|ogg)$/i) ? (
                                        // Play uploaded video file directly
                                        <video
                                            src={selectedVideo.video_url}
                                            controls
                                            autoPlay
                                            className="w-full h-full"
                                        />
                                    ) : selectedVideo.video_url.includes('youtube.com') || selectedVideo.video_url.includes('youtu.be') ? (
                                        // YouTube - try to embed, fallback to link
                                        <>
                                            <iframe
                                                src={selectedVideo.video_url.replace('/watch?v=', '/embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                                title={selectedVideo.title}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                            <div className="absolute top-4 right-4">
                                                <a
                                                    href={selectedVideo.video_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-white/90 hover:bg-white text-slate-900 px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-all shadow-lg"
                                                >
                                                    <ExternalLink size={16} />
                                                    Watch on YouTube
                                                </a>
                                            </div>
                                        </>
                                    ) : selectedVideo.video_url.includes('tiktok.com') ? (
                                        // TikTok - embed
                                        <>
                                            <iframe
                                                src={`https://www.tiktok.com/embed/v2/${selectedVideo.video_url.split('/video/')[1]?.split('?')[0]}`}
                                                title={selectedVideo.title}
                                                className="w-full h-full"
                                                allow="encrypted-media"
                                            />
                                            <div className="absolute top-4 right-4">
                                                <a
                                                    href={selectedVideo.video_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-white/90 hover:bg-white text-slate-900 px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-all shadow-lg"
                                                >
                                                    <ExternalLink size={16} />
                                                    Watch on TikTok
                                                </a>
                                            </div>
                                        </>
                                    ) : selectedVideo.video_url.includes('facebook.com') || selectedVideo.video_url.includes('fb.watch') ? (
                                        // Facebook - show button to visit (embedding often fails due to permissions)
                                        <div className="flex flex-col items-center justify-center h-full text-white p-8">
                                            <MonitorPlay size={64} className="mb-4 text-emerald-400" />
                                            <h3 className="text-xl font-bold mb-2">Watch on Facebook</h3>
                                            <p className="text-slate-300 mb-6 text-center text-sm">
                                                This Facebook video requires you to visit Facebook to watch
                                            </p>
                                            <a
                                                href={selectedVideo.video_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-3 transition-all hover:scale-105 shadow-lg"
                                            >
                                                <ExternalLink size={20} />
                                                Watch on Facebook
                                            </a>
                                        </div>
                                    ) : selectedVideo.video_url.includes('instagram.com') ? (
                                        // Instagram - embed
                                        <>
                                            <iframe
                                                src={`${selectedVideo.video_url}/embed`}
                                                title={selectedVideo.title}
                                                className="w-full h-full"
                                                allow="encrypted-media"
                                            />
                                            <div className="absolute top-4 right-4">
                                                <a
                                                    href={selectedVideo.video_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-white/90 hover:bg-white text-slate-900 px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-all shadow-lg"
                                                >
                                                    <ExternalLink size={16} />
                                                    Watch on Instagram
                                                </a>
                                            </div>
                                        </>
                                    ) : (
                                        // Unknown external URL - show button to visit
                                        <div className="flex flex-col items-center justify-center h-full text-white p-8">
                                            <MonitorPlay size={64} className="mb-4 text-emerald-400" />
                                            <h3 className="text-xl font-bold mb-2">Watch on Platform</h3>
                                            <p className="text-slate-300 mb-6 text-center text-sm">
                                                This video is hosted externally. Click below to watch.
                                            </p>
                                            <a
                                                href={selectedVideo.video_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-3 transition-all hover:scale-105 shadow-lg"
                                            >
                                                <ExternalLink size={20} />
                                                Watch Video Now
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer */}
                                {selectedVideo.description && (
                                    <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                                        <p className="text-slate-600 dark:text-slate-300">
                                            {selectedVideo.description}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default VideoGallery;
