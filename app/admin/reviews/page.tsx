'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2, Search, Filter, RefreshCw, StarOff, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirmModal } from '@/hooks/useConfirmModal';

interface Review {
    id: number;
    customer_name: string;
    tour_name: string;
    rating: number;
    review_text?: string;
    review_title?: string;
    trip_type?: string;
    country?: string;
    city?: string;
    score_accommodation?: number;
    score_transport?: number;
    score_meals?: number;
    score_guide?: number;
    score_value?: number;
    score_accuracy?: number;
    status: 'pending' | 'approved' | 'rejected';
    is_featured: boolean;
    created_at?: string;
    updated_at?: string;
}

const DIMENSIONS = [
    { key: 'score_accommodation', label: 'Accommodation' },
    { key: 'score_transport', label: 'Transport' },
    { key: 'score_meals', label: 'Meals' },
    { key: 'score_guide', label: 'Guide' },
    { key: 'score_value', label: 'Value' },
    { key: 'score_accuracy', label: 'Accuracy' },
] as const;

const emptyReview = {
    customer_name: '', tour_name: '', rating: '5', review_title: '', review_text: '',
    trip_type: '', country: '', city: '', status: 'approved', is_featured: false,
    score_accommodation: '', score_transport: '', score_meals: '', score_guide: '', score_value: '', score_accuracy: '',
};

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [lastRefresh, setLastRefresh] = useState(Date.now());
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ ...emptyReview });
    const { show, ConfirmModalComponent } = useConfirmModal();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.customer_name || !form.tour_name) {
            toast.error('Customer name and tour name are required');
            return;
        }
        setSubmitting(true);
        try {
            const response = await fetch('/api/admin/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Review added');
                setShowModal(false);
                setForm({ ...emptyReview });
                setLastRefresh(Date.now());
            } else {
                toast.error(data.error || 'Failed to add review');
            }
        } catch (error) {
            console.error('Error creating review:', error);
            toast.error('Failed to add review');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [lastRefresh, statusFilter]);

    const fetchReviews = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);

            console.log('Fetching reviews with filter:', statusFilter);
            const response = await fetch(`/api/admin/reviews?${params}`);
            
            if (response.status === 401) {
                toast.error('Session expired. Please log in again.');
                window.location.href = '/admin/login';
                return;
            }

            if (response.ok) {
                const data = await response.json();
                console.log('Fetched reviews:', data);
                setReviews(data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/reviews?id=${id}&action=status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setReviews(reviews.map(r => 
                    r.id === id ? { ...r, status: newStatus as any } : r
                ));
                toast.success(`Review ${newStatus} successfully`);
            }
        } catch (error) {
            console.error('Error updating review status:', error);
            toast.error('Failed to update review status');
        }
    };

    const handleToggleFeatured = async (id: number, isFeatured: boolean) => {
        try {
            const response = await fetch(`/api/admin/reviews?id=${id}&action=featured`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_featured: isFeatured }),
            });

            if (response.ok) {
                setReviews(reviews.map(r => 
                    r.id === id ? { ...r, is_featured: isFeatured } : r
                ));
                toast.success(isFeatured ? 'Review marked as featured' : 'Review unmarked as featured');
            }
        } catch (error) {
            console.error('Error toggling featured status:', error);
            toast.error('Failed to update featured status');
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = await show({
            title: 'Delete Review',
            message: 'Are you sure you want to delete this review? This action cannot be undone.',
            type: 'delete'
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/admin/reviews?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setReviews(reviews.filter(r => r.id !== id));
                toast.success('Review deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review');
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                        }`}
                    />
                ))}
                <span className="ml-2 text-sm text-gray-400">({rating}/5)</span>
            </div>
        );
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-500/20 text-yellow-400',
            approved: 'bg-green-500/20 text-green-400',
            rejected: 'bg-red-500/20 text-red-400',
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400';
    };

    const filteredReviews = reviews.filter(review => {
        if (!search) return true;
        const searchTerm = search.toLowerCase();
        return (
            review.customer_name.toLowerCase().includes(searchTerm) ||
            review.tour_name.toLowerCase().includes(searchTerm) ||
            review.review_text?.toLowerCase().includes(searchTerm)
        );
    });

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
                    <h1 className="text-2xl font-bold text-white">Reviews & Testimonials</h1>
                    <p className="text-gray-400 mt-1">{reviews.length} total reviews</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setLastRefresh(Date.now())}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={() => { setForm({ ...emptyReview }); setShowModal(true); }}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Review
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by customer or tour..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <p className="text-gray-400 text-sm">Pending Reviews</p>
                    <p className="text-2xl font-bold text-yellow-400 mt-2">
                        {reviews.filter(r => r.status === 'pending').length}
                    </p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <p className="text-gray-400 text-sm">Approved Reviews</p>
                    <p className="text-2xl font-bold text-green-400 mt-2">
                        {reviews.filter(r => r.status === 'approved').length}
                    </p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <p className="text-gray-400 text-sm">Featured Reviews</p>
                    <p className="text-2xl font-bold text-blue-400 mt-2">
                        {reviews.filter(r => r.is_featured).length}
                    </p>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.map((review) => (
                    <div key={review.id} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-white">{review.customer_name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(review.status)}`}>
                                        {review.status}
                                    </span>
                                    {review.is_featured && (
                                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                                            ⭐ Featured
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-400 mb-2">Tour: {review.tour_name}</p>
                                {renderStars(review.rating)}
                            </div>
                            <div className="text-sm text-gray-400">
                                {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                            </div>
                        </div>

                        {/* Review Text */}
                        {review.review_text && (
                            <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                                {review.review_title && <p className="text-white font-semibold text-sm mb-1">{review.review_title}</p>}
                                <p className="text-gray-300 text-sm leading-relaxed">{review.review_text}</p>
                            </div>
                        )}

                        {/* Dimension scores + trip context */}
                        {(DIMENSIONS.some((d) => (review as any)[d.key] != null) || review.trip_type || review.country || review.city) && (
                            <div className="flex flex-wrap items-center gap-1.5 mb-4">
                                {DIMENSIONS.filter((d) => (review as any)[d.key] != null).map((d) => (
                                    <span key={d.key} className="rounded-md bg-slate-700/60 text-gray-300 px-2 py-0.5 text-xs">{d.label} <span className="text-white font-semibold">{(review as any)[d.key]}</span></span>
                                ))}
                                {(review.trip_type || review.city || review.country) && (
                                    <span className="text-xs text-gray-500 ml-1">{[review.trip_type, [review.city, review.country].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}</span>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                            {review.status !== 'approved' && (
                                <button
                                    onClick={() => handleStatusUpdate(review.id, 'approved')}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Approve
                                </button>
                            )}
                            {review.status !== 'rejected' && (
                                <button
                                    onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Reject
                                </button>
                            )}
                            <button
                                onClick={() => handleToggleFeatured(review.id, !review.is_featured)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    review.is_featured
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                                }`}
                            >
                                {review.is_featured ? (
                                    <>
                                        <Star className="w-4 h-4" />
                                        Unfeature
                                    </>
                                ) : (
                                    <>
                                        <StarOff className="w-4 h-4" />
                                        Feature
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => handleDelete(review.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {filteredReviews.length === 0 && (
                    <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
                        <p className="text-gray-400">
                            {search || statusFilter !== 'all' 
                                ? 'No reviews found matching your filters' 
                                : 'No reviews yet'}
                        </p>
                    </div>
                )}
            </div>
            {/* Add Review Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowModal(false)}>
                    <div className="bg-slate-800 rounded-xl max-w-2xl w-full my-8" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-white">Add Review</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Customer name *</label>
                                        <input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} required className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Tour name *</label>
                                        <input value={form.tour_name} onChange={(e) => setForm({ ...form, tour_name: e.target.value })} required className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Exact tour name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Overall rating</label>
                                        <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                                            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Trip type</label>
                                        <input value={form.trip_type} onChange={(e) => setForm({ ...form, trip_type: e.target.value })} className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Honeymoon / Family" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                                        <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                                        <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Review title</label>
                                        <input value={form.review_title} onChange={(e) => setForm({ ...form, review_title: e.target.value })} className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Review text</label>
                                        <textarea rows={3} value={form.review_text} onChange={(e) => setForm({ ...form, review_text: e.target.value })} className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                    </div>
                                </div>

                                {/* Dimension scores */}
                                <div>
                                    <label className="block text-sm font-medium text-sky-400 uppercase tracking-wide mb-2">Dimension scores (0–5, optional)</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {DIMENSIONS.map((d) => (
                                            <div key={d.key}>
                                                <label className="block text-xs text-gray-400 mb-1">{d.label}</label>
                                                <input type="number" min="0" max="5" step="0.5" value={(form as any)[d.key]} onChange={(e) => setForm({ ...form, [d.key]: e.target.value })} className="w-full bg-slate-700 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                                        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                                            <option value="approved">Approved</option>
                                            <option value="pending">Pending</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <label className="flex items-center gap-2 text-gray-300 mt-6">
                                        <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-green-500" />
                                        Featured
                                    </label>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-slate-700">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg">Cancel</button>
                                    <button type="submit" disabled={submitting} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60">
                                        <Plus className="w-4 h-4" /> {submitting ? 'Saving…' : 'Add Review'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModalComponent />
        </div>
    );
}