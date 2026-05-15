'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Download, Eye, Phone, MessageSquare, RefreshCw, CheckCircle, XCircle, Clock, MoreVertical, X, User, Calendar, Users, DollarSign, MapPin } from 'lucide-react';

interface Booking {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_cnic?: string;
    tour_name: string;
    travel_date: string;
    people_count: number;
    price_per_person: number;
    total_price: number;
    payment_status: 'unpaid' | 'partial' | 'paid';
    booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    special_requests?: string;
    admin_notes?: string;
    created_at?: string;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(Date.now());
    const [openStatusMenu, setOpenStatusMenu] = useState<number | null>(null);

    useEffect(() => {
        fetchBookings();
    }, [lastRefresh, search, statusFilter]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenStatusMenu(null);
        if (openStatusMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openStatusMenu]);

    const fetchBookings = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (statusFilter !== 'all') params.append('status', statusFilter);

            console.log('Fetching bookings with filters:', { search, statusFilter });
            const response = await fetch(`/api/admin/bookings?${params}`);
            
            if (response.status === 401) {
                console.error('Unauthorized - Please log in again');
                alert('Session expired. Please log in again.');
                window.location.href = '/admin/login';
                return;
            }
            
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched bookings:', data);
                setBookings(data);
            } else {
                console.error('Failed to fetch bookings:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setLoading(true);
        fetchBookings();
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/bookings?id=${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setBookings(bookings.filter(b => b.id !== id));
                setShowDeleteConfirm(false);
                setSelectedBooking(null);
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/bookings?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_status: newStatus }),
            });
            if (response.ok) {
                // Update the booking in the list
                setBookings(bookings.map(b => 
                    b.id === id ? { ...b, booking_status: newStatus as any } : b
                ));
                setOpenStatusMenu(null);
                
                // If the new status doesn't match the current filter, reset filter to "all"
                if (statusFilter !== 'all' && statusFilter !== newStatus) {
                    setStatusFilter('all');
                    alert(`Booking status updated to ${newStatus}. Filter reset to show all bookings.`);
                } else {
                    alert(`Booking status updated to ${newStatus}`);
                }
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Failed to update booking status');
        }
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Customer Name', 'Email', 'Phone', 'Tour', 'Travel Date', 'People', 'Amount', 'Booking Status', 'Payment Status', 'Created At'];
        const csvData = bookings.map(b => [
            b.id,
            b.customer_name,
            b.customer_email,
            b.customer_phone,
            b.tour_name,
            b.travel_date,
            b.people_count,
            b.total_price,
            b.booking_status,
            b.payment_status,
            b.created_at
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const formatCurrency = (amount: number) => {
        return `PKR ${amount.toLocaleString()}`;
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-500/20 text-yellow-400',
            confirmed: 'bg-blue-500/20 text-blue-400',
            completed: 'bg-green-500/20 text-green-400',
            cancelled: 'bg-red-500/20 text-red-400',
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400';
    };

    const getPaymentColor = (status: string) => {
        const colors: Record<string, string> = {
            unpaid: 'bg-red-500/20 text-red-400',
            partial: 'bg-yellow-500/20 text-yellow-400',
            paid: 'bg-green-500/20 text-green-400',
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400';
    };

    const openWhatsApp = (phone: string, name: string) => {
        const message = encodeURIComponent(`Hello ${name}! This is Smile For Miles regarding your booking.`);
        window.open(`https://wa.me/92${phone.replace(/^0+/, '')}?text=${message}`, '_blank');
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Bookings Management</h1>
                    <p className="text-gray-400 mt-1">{bookings.length} total bookings</p>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <button 
                        onClick={() => {
                            setLastRefresh(Date.now());
                        }}
                        className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 transition-all text-sm sm:text-base"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                    <button 
                        onClick={handleExportCSV}
                        className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export CSV</span>
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
                            placeholder="Search by name or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        <Filter className="w-4 h-4" />
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="text-left py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">ID</th>
                                <th className="text-left py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">Customer</th>
                                <th className="text-left py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm hidden md:table-cell">Tour</th>
                                <th className="text-left py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm hidden lg:table-cell">Date</th>
                                <th className="text-left py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm hidden lg:table-cell">People</th>
                                <th className="text-left py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">Amount</th>
                                <th className="text-left py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm hidden sm:table-cell">Booking Status</th>
                                <th className="text-left py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm hidden xl:table-cell">Payment</th>
                                <th className="text-left py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="border-t border-slate-700/50 hover:bg-slate-700/30">
                                    <td className="py-3 px-2 sm:px-4 text-gray-400 text-xs sm:text-sm">#{booking.id}</td>
                                    <td className="py-3 px-2 sm:px-4">
                                        <div>
                                            <p className="text-white font-medium text-xs sm:text-sm">{booking.customer_name}</p>
                                            <p className="text-gray-400 text-xs hidden sm:block">{booking.customer_email}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-2 sm:px-4 text-gray-300 text-xs sm:text-sm hidden md:table-cell">{booking.tour_name}</td>
                                    <td className="py-3 px-2 sm:px-4 text-gray-300 text-xs sm:text-sm hidden lg:table-cell">{booking.travel_date}</td>
                                    <td className="py-3 px-2 sm:px-4 text-white text-xs sm:text-sm hidden lg:table-cell">{booking.people_count}</td>
                                    <td className="py-3 px-2 sm:px-4 text-green-400 font-medium text-xs sm:text-sm">
                                        {formatCurrency(booking.total_price)}
                                    </td>
                                    <td className="py-3 px-2 sm:px-4 hidden sm:table-cell">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.booking_status)}`}>
                                            {booking.booking_status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-2 sm:px-4 hidden xl:table-cell">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentColor(booking.payment_status)}`}>
                                            {booking.payment_status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-2 sm:px-4">
                                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                            <button
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setShowModal(true);
                                                }}
                                                className="text-blue-400 hover:text-blue-300 p-1.5 hover:bg-blue-400/10 rounded-lg transition-all"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                            <button
                                                onClick={() => openWhatsApp(booking.customer_phone, booking.customer_name)}
                                                className="text-green-400 hover:text-green-300 p-1.5 hover:bg-green-400/10 rounded-lg transition-all"
                                                title="WhatsApp"
                                            >
                                                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                            
                                            {/* Status Update Dropdown */}
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenStatusMenu(openStatusMenu === booking.id ? null : booking.id);
                                                    }}
                                                    className="text-yellow-400 hover:text-yellow-300 p-1.5 hover:bg-yellow-400/10 rounded-lg transition-all"
                                                    title="Update Status"
                                                >
                                                    <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </button>
                                                
                                                {openStatusMenu === booking.id && (
                                                    <div 
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10"
                                                    >
                                                        <div className="p-2 space-y-1">
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:bg-slate-700 rounded transition-colors"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking.id, 'completed')}
                                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-400 hover:bg-slate-700 rounded transition-colors"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Complete
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-700 rounded transition-colors"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking.id, 'pending')}
                                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-yellow-400 hover:bg-slate-700 rounded transition-colors"
                                                            >
                                                                <Clock className="w-4 h-4" />
                                                                Set Pending
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <button
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setShowDeleteConfirm(true);
                                                }}
                                                className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-400/10 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="py-12 text-center text-gray-400">
                                        No bookings found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Booking Detail Modal */}
            {showModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-white">Booking #{selectedBooking.id}</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div className="bg-slate-700/50 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-400" />
                                    Customer Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-400 text-sm">Name</p>
                                        <p className="text-white font-medium">{selectedBooking.customer_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Email</p>
                                        <p className="text-white font-medium">{selectedBooking.customer_email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Phone</p>
                                        <p className="text-white font-medium">{selectedBooking.customer_phone}</p>
                                    </div>
                                    {selectedBooking.customer_cnic && (
                                        <div>
                                            <p className="text-gray-400 text-sm">CNIC</p>
                                            <p className="text-white font-medium">{selectedBooking.customer_cnic}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tour Details */}
                            <div className="bg-slate-700/50 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-green-400" />
                                    Tour Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-400 text-sm">Tour Name</p>
                                        <p className="text-white font-medium">{selectedBooking.tour_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Travel Date</p>
                                        <p className="text-white font-medium flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {selectedBooking.travel_date}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Number of People</p>
                                        <p className="text-white font-medium flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            {selectedBooking.people_count}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-slate-700/50 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-yellow-400" />
                                    Payment Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-400 text-sm">Price Per Person</p>
                                        <p className="text-white font-medium">{formatCurrency(selectedBooking.price_per_person)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Total Amount</p>
                                        <p className="text-green-400 font-bold text-lg">{formatCurrency(selectedBooking.total_price)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Payment Status</p>
                                        <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getPaymentColor(selectedBooking.payment_status)}`}>
                                            {selectedBooking.payment_status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Booking Status</p>
                                        <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getStatusColor(selectedBooking.booking_status)}`}>
                                            {selectedBooking.booking_status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Special Requests */}
                            {selectedBooking.special_requests && (
                                <div className="bg-slate-700/50 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-white mb-2">Special Requests</h4>
                                    <p className="text-gray-300">{selectedBooking.special_requests}</p>
                                </div>
                            )}

                            {/* Admin Notes */}
                            {selectedBooking.admin_notes && (
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-blue-400 mb-2">Admin Notes</h4>
                                    <p className="text-gray-300">{selectedBooking.admin_notes}</p>
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="text-xs text-gray-500">
                                <p>Created: {selectedBooking.created_at}</p>
                                <p>Last Updated: {selectedBooking.updated_at}</p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6 flex gap-3">
                            <button
                                onClick={() => openWhatsApp(selectedBooking.customer_phone, selectedBooking.customer_name)}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-5 h-5" />
                                WhatsApp
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-white mb-4">Delete Booking?</h3>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete booking #{selectedBooking.id}? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(selectedBooking.id)}
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
