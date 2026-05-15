'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2, Search, Filter, RefreshCw, StarOff } from 'lucide-react';

interface Review {
    id: number;
    customer_name: string;
    tour_name: string;
    rating: number;
    review_text?: string;
    status: 'pending' | 'approved' | 'rejected';
    is_featured: boolean;
    created_at?: string;
    updated_at?: string;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [lastRefresh, setLastRefresh] = useState(Date.now());

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
                alert('Session expired. Please log in again.');
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
                alert(`Review ${newStatus} successfully`);
            }
        } catch (error) {
            console.error('Error updating review status:', error);
            alert('Failed to update review status');
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
                alert(isFeatured ? 'Review marked as featured' : 'Review unmarked as featured');
            }
        } catch (error) {
            console.error('Error toggling featured status:', error);
            alert('Failed to update featured status');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/reviews?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setReviews(reviews.filter(r => r.id !== id));
                alert('Review deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Failed to delete review');
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
                <button 
                    onClick={() => setLastRefresh(Date.now())}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
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
                                <p className="text-gray-300 text-sm leading-relaxed">{review.review_text}</p>
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
        </div>
    );
}