'use client';

import { useEffect, useState } from 'react';
import { Upload, Trash2, Edit2, Play } from 'lucide-react';

interface Video {
    id: number;
    title: string;
    description?: string;
    category: string;
    video_url: string;
    thumbnail_url?: string;
    duration?: number;
    created_at?: string;
}

export default function VideosManagementPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingVideo, setEditingVideo] = useState<Video | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Adventure',
        video_url: '',
        thumbnail_url: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

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

    const handleFileUpload = async (file: File, type: 'video' | 'image'): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data.url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let videoUrl = formData.video_url;
            let thumbnailUrl = formData.thumbnail_url;

            // Upload video file if selected
            if (selectedFile) {
                videoUrl = await handleFileUpload(selectedFile, 'video');
            }

            // Upload thumbnail if selected
            if (thumbnailFile) {
                thumbnailUrl = await handleFileUpload(thumbnailFile, 'image');
            }

            // Determine if we're creating or updating
            const method = editingVideo ? 'PUT' : 'POST';
            const url = editingVideo ? `/api/admin/videos?id=${editingVideo.id}` : '/api/admin/videos';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    video_url: videoUrl,
                    thumbnail_url: thumbnailUrl,
                }),
            });

            if (response.ok) {
                setFormData({
                    title: '',
                    description: '',
                    category: 'Adventure',
                    video_url: '',
                    thumbnail_url: '',
                });
                setSelectedFile(null);
                setThumbnailFile(null);
                setEditingVideo(null);
                setShowForm(false);
                fetchVideos();
            }
        } catch (error) {
            console.error('Error saving video:', error);
            alert('Failed to save video');
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (video: Video) => {
        setEditingVideo(video);
        setFormData({
            title: video.title,
            description: video.description || '',
            category: video.category,
            video_url: video.video_url,
            thumbnail_url: video.thumbnail_url || '',
        });
        setSelectedFile(null);
        setThumbnailFile(null);
        setShowForm(true);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingVideo(null);
        setFormData({
            title: '',
            description: '',
            category: 'Adventure',
            video_url: '',
            thumbnail_url: '',
        });
        setSelectedFile(null);
        setThumbnailFile(null);
        setShowForm(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this video?')) return;

        try {
            const response = await fetch(`/api/admin/videos?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchVideos();
            }
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    };

    const categories = ['Adventure', 'Nature', 'Culture', 'Beach', 'Mountain', 'City', 'Wildlife'];

    return (
        <div className="mt-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Video Management
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Upload and manage tour videos
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors whitespace-nowrap shadow-lg"
                >
                    <Upload size={20} />
                    {showForm ? 'Cancel' : 'Upload Video'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {editingVideo ? 'Edit Video' : 'Upload New Video'}
                        </h2>
                        {editingVideo && (
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Video URL {selectedFile ? '(Optional)' : '*'}
                            </label>
                            <input
                                type="url"
                                value={formData.video_url}
                                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                placeholder="https://www.youtube.com/watch?v=... or https://www.tiktok.com/@user/video/..."
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                                required={!selectedFile}
                            />
                            <p className="text-sm text-slate-500 mt-1">
                                {selectedFile 
                                    ? 'Optional - Leave empty to use uploaded file' 
                                    : 'Required - Or upload a video file below'}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Video File {formData.video_url ? '(Optional)' : '*'}
                            </label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                                required={!formData.video_url}
                            />
                            <p className="text-sm text-slate-500 mt-1">
                                {formData.video_url 
                                    ? 'Optional - Upload if you want to host the video yourself' 
                                    : 'Required - Or provide a video URL above'}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Thumbnail Image (Optional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Upload Video'}
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-slate-600 dark:text-slate-400">Loading videos...</p>
                </div>
            ) : videos.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl">
                    <p className="text-slate-600 dark:text-slate-400">No videos uploaded yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
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
                                        <Play className="text-slate-400" size={48} />
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                                    {video.title}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    {video.category}
                                </p>
                                {video.description && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                                        {video.description}
                                    </p>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(video)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(video.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
