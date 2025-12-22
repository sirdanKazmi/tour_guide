'use client';

import { useEffect, useState } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';

interface GalleryItem {
    id: number;
    type: 'image' | 'video';
    category: string;
    title?: string;
    description?: string;
    media_url: string;
    thumbnail_url?: string;
    created_at?: string;
}

export default function GalleryManagementPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Mountains',
    });
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    useEffect(() => {
        fetchGalleryItems();
    }, []);

    const fetchGalleryItems = async () => {
        try {
            const response = await fetch('/api/admin/gallery');
            const data = await response.json();
            setItems(Array.isArray(data) ? data.filter(item => item.type === 'image') : []);
        } catch (error) {
            console.error('Error fetching gallery items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file: File): Promise<string> => {
        const formDataObj = new FormData();
        formDataObj.append('file', file);
        formDataObj.append('type', 'image');

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formDataObj,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data.url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFiles || selectedFiles.length === 0) {
            alert('Please select at least one image');
            return;
        }

        setUploading(true);

        try {
            // Upload all selected files
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const mediaUrl = await handleFileUpload(file);

                await fetch('/api/admin/gallery', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'image',
                        category: formData.category,
                        title: formData.title || file.name,
                        description: formData.description,
                        media_url: mediaUrl,
                    }),
                });
            }

            setFormData({
                title: '',
                description: '',
                category: 'Mountains',
            });
            setSelectedFiles(null);
            setShowForm(false);
            fetchGalleryItems();
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const response = await fetch(`/api/admin/gallery?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchGalleryItems();
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const categories = ['Mountains', 'Coast', 'Forest', 'Desert', 'City', 'Culture', 'Wildlife'];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Gallery Management
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Upload and manage gallery images
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                    <Upload size={20} />
                    {showForm ? 'Cancel' : 'Upload Images'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                        Upload New Images
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Title (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                                    placeholder="Leave empty to use filename"
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
                                Description (Optional)
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                                rows={3}
                                placeholder="Add a description for these images"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Image Files * (Multiple selection allowed)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => setSelectedFiles(e.target.files)}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                                required
                            />
                            {selectedFiles && (
                                <p className="text-sm text-slate-500 mt-2">
                                    {selectedFiles.length} file(s) selected
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Upload Images'}
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-slate-600 dark:text-slate-400">Loading gallery...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl">
                    <p className="text-slate-600 dark:text-slate-400">No images uploaded yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden group"
                        >
                            <div className="relative aspect-square bg-slate-200 dark:bg-slate-700">
                                <img
                                    src={item.media_url}
                                    alt={item.title || 'Gallery image'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1 truncate">
                                    {item.title || 'Untitled'}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                    {item.category}
                                </p>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
