'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, X } from 'lucide-react';

interface Tour {
    id: number;
    tour_name: string;
    destination: string;
    category: string;
    duration: string;
    price_per_person: number;
    max_seats: number;
    available_seats: number;
    departure_city: string;
    status: string;
    cover_image?: string;
    description?: string;
    inclusions?: string;
    exclusions?: string;
    itinerary?: string;
    created_at?: string;
}

export default function ToursPage() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        tour_name: '',
        destination: '',
        category: 'adventure',
        description: '',
        duration: '',
        price_per_person: '',
        max_seats: '',
        available_seats: '',
        departure_city: '',
        status: 'active',
        inclusions: '',
        exclusions: '',
        itinerary: '',
        cover_image: '',
    });

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (search) params.append('destination', search);

            console.log('Fetching tours...');
            const response = await fetch(`/api/admin/tours?${params}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched tours:', data);
                setTours(data);
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (isEditing && selectedTour) {
                // Update existing tour
                const response = await fetch(`/api/admin/tours?id=${selectedTour.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    alert('Tour updated successfully');
                    setShowModal(false);
                    resetForm();
                    fetchTours();
                }
            } else {
                // Create new tour
                const response = await fetch('/api/admin/tours', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    alert('Tour created successfully');
                    setShowModal(false);
                    resetForm();
                    fetchTours();
                }
            }
        } catch (error) {
            console.error('Error saving tour:', error);
            alert('Failed to save tour');
        }
    };

    const handleEdit = (tour: Tour) => {
        setSelectedTour(tour);
        setIsEditing(true);
        setFormData({
            tour_name: tour.tour_name,
            destination: tour.destination,
            category: tour.category,
            description: tour.description || '',
            duration: tour.duration,
            price_per_person: tour.price_per_person.toString(),
            max_seats: tour.max_seats.toString(),
            available_seats: tour.available_seats.toString(),
            departure_city: tour.departure_city,
            status: tour.status,
            inclusions: tour.inclusions || '',
            exclusions: tour.exclusions || '',
            itinerary: tour.itinerary || '',
            cover_image: tour.cover_image || '',
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            tour_name: '',
            destination: '',
            category: 'adventure',
            description: '',
            duration: '',
            price_per_person: '',
            max_seats: '',
            available_seats: '',
            departure_city: '',
            status: 'active',
            inclusions: '',
            exclusions: '',
            itinerary: '',
            cover_image: '',
        });
        setSelectedTour(null);
        setIsEditing(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this tour?')) return;

        try {
            const response = await fetch(`/api/admin/tours?id=${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setTours(tours.filter(t => t.id !== id));
                alert('Tour deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting tour:', error);
            alert('Failed to delete tour');
        }
    };

    const formatCurrency = (amount: number) => {
        return `PKR ${amount.toLocaleString()}`;
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            active: 'bg-green-500/20 text-green-400',
            inactive: 'bg-gray-500/20 text-gray-400',
            coming_soon: 'bg-yellow-500/20 text-yellow-400',
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400';
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            adventure: '🏔️',
            family: '👨‍👩‍👧‍👦',
            honeymoon: '💑',
            group: '👥',
            religious: '🕌',
        };
        return icons[category] || '';
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tour Packages</h1>
                    <p className="text-gray-400 mt-1">{tours.length} total tours</p>
                </div>
                <button 
                    onClick={() => {
                        setSelectedTour(null);
                        setIsEditing(false);
                        setShowModal(true);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add New Tour
                </button>
            </div>

            {/* Filters */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by destination..."
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
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="coming_soon">Coming Soon</option>
                    </select>
                    <button
                        onClick={fetchTours}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
                    >
                        <Filter className="w-4 h-4" />
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Tours Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                    <div key={tour.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-green-500/50 transition-all">
                        {/* Cover Image */}
                        {tour.cover_image ? (
                            <div className="h-48 bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
                                <span className="text-6xl">{getCategoryIcon(tour.category)}</span>
                            </div>
                        ) : (
                            <div className="h-48 bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
                                <span className="text-6xl">{getCategoryIcon(tour.category)}</span>
                            </div>
                        )}
                        
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{tour.tour_name}</h3>
                                    <p className="text-gray-400 text-sm mt-1">{tour.destination}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(tour.status)}`}>
                                    {tour.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Duration:</span>
                                    <span className="text-white">{tour.duration}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Departure:</span>
                                    <span className="text-white">{tour.departure_city}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Seats:</span>
                                    <span className="text-white">{tour.available_seats}/{tour.max_seats}</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-700 pt-4">
                                <p className="text-2xl font-bold text-green-400 mb-3">
                                    {formatCurrency(tour.price_per_person)}
                                    <span className="text-sm text-gray-400 font-normal">/person</span>
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedTour(tour);
                                            setIsEditing(true);
                                            setShowModal(true);
                                        }}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tour.id)}
                                        className="px-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {tours.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400">
                        No tours found. Click "Add New Tour" to create one.
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div 
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
                    onClick={() => {
                        setShowModal(false);
                        resetForm();
                    }}
                >
                    <div 
                        className="bg-slate-800 rounded-xl max-w-3xl w-full my-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {isEditing ? 'Edit Tour' : 'Add New Tour'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Tour Name */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Tour Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.tour_name}
                                            onChange={(e) => setFormData({ ...formData, tour_name: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="e.g., Hunza Valley Adventure"
                                            required
                                        />
                                    </div>

                                    {/* Destination */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Destination *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.destination}
                                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="e.g., Hunza"
                                            required
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        >
                                            <option value="adventure">🏔️ Adventure</option>
                                            <option value="family">👨‍👩‍👧‍👦 Family</option>
                                            <option value="honeymoon">💑 Honeymoon</option>
                                            <option value="group">👥 Group</option>
                                            <option value="religious">🕌 Religious</option>
                                        </select>
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Duration *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="e.g., 5 Days / 4 Nights"
                                            required
                                        />
                                    </div>

                                    {/* Price per person */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Price per Person (PKR) *
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.price_per_person}
                                            onChange={(e) => setFormData({ ...formData, price_per_person: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="e.g., 50000"
                                            required
                                        />
                                    </div>

                                    {/* Max Seats */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Max Seats *
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.max_seats}
                                            onChange={(e) => setFormData({ ...formData, max_seats: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="e.g., 20"
                                            required
                                        />
                                    </div>

                                    {/* Available Seats */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Available Seats
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.available_seats}
                                            onChange={(e) => setFormData({ ...formData, available_seats: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Leave empty to same as max seats"
                                        />
                                    </div>

                                    {/* Departure City */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Departure City *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.departure_city}
                                            onChange={(e) => setFormData({ ...formData, departure_city: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="e.g., Islamabad"
                                            required
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Status *
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="coming_soon">Coming Soon</option>
                                        </select>
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            rows={3}
                                            placeholder="Brief description of the tour"
                                        />
                                    </div>

                                    {/* Inclusions */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Inclusions
                                        </label>
                                        <textarea
                                            value={formData.inclusions}
                                            onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            rows={2}
                                            placeholder="Hotel, Transport, Meals, Guide, etc."
                                        />
                                    </div>

                                    {/* Exclusions */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Exclusions
                                        </label>
                                        <textarea
                                            value={formData.exclusions}
                                            onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            rows={2}
                                            placeholder="Personal expenses, Tips, etc."
                                        />
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex gap-2 pt-4 border-t border-slate-700">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        {isEditing ? 'Update Tour' : 'Create Tour'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
