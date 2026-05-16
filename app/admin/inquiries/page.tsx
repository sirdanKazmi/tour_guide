'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Phone, Mail, Trash2, RefreshCw, Search, Filter, CheckCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirmModal } from '@/hooks/useConfirmModal';

interface Inquiry {
    id: number;
    name: string;
    email: string;
    phone?: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    replied_at?: string;
    created_at?: string;
}

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [lastRefresh, setLastRefresh] = useState(Date.now());
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const { show, ConfirmModalComponent } = useConfirmModal();

    useEffect(() => {
        fetchInquiries();
    }, [lastRefresh, statusFilter]);

    const fetchInquiries = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);

            console.log('Fetching inquiries with filter:', statusFilter);
            const response = await fetch(`/api/admin/inquiries?${params}`);
            
            if (response.status === 401) {
                toast.error('Session expired. Please log in again.');
                window.location.href = '/admin/login';
                return;
            }

            if (response.ok) {
                const data = await response.json();
                console.log('Fetched inquiries:', data);
                setInquiries(data);
            }
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: number, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'replied' ? 'replied' : 'read';
            const response = await fetch(`/api/admin/inquiries?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setInquiries(inquiries.map(i => 
                    i.id === id ? { ...i, status: newStatus } : i
                ));
            }
        } catch (error) {
            console.error('Error marking inquiry as read:', error);
            toast.error('Failed to update inquiry status');
        }
    };

    const handleMarkAsReplied = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/inquiries?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'replied' }),
            });

            if (response.ok) {
                setInquiries(inquiries.map(i => 
                    i.id === id ? { ...i, status: 'replied' } : i
                ));
                toast.success('Inquiry marked as replied');
            }
        } catch (error) {
            console.error('Error marking inquiry as replied:', error);
            toast.error('Failed to update inquiry status');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/inquiries?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setInquiries(inquiries.filter(i => i.id !== id));
                if (selectedInquiry?.id === id) {
                    setShowDetailModal(false);
                    setSelectedInquiry(null);
                }
                alert('Inquiry deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting inquiry:', error);
            alert('Failed to delete inquiry');
        }
    };

    const handleWhatsApp = (phone?: string, name?: string) => {
        if (!phone) {
            alert('No phone number available for this inquiry');
            return;
        }
        // Remove any non-digit characters except +
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        // If doesn't start with +, add +92 (Pakistan code)
        const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone.substring(1) : `92${cleanPhone}`;
        const message = name ? `Hello ${name}, thank you for contacting Smile For Miles!` : 'Hello! Thank you for contacting Smile For Miles!';
        const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const filteredInquiries = inquiries.filter(inquiry => {
        if (!search) return true;
        const searchTerm = search.toLowerCase();
        return (
            inquiry.name.toLowerCase().includes(searchTerm) ||
            inquiry.email.toLowerCase().includes(searchTerm) ||
            inquiry.phone?.toLowerCase().includes(searchTerm) ||
            inquiry.message.toLowerCase().includes(searchTerm)
        );
    });

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            new: 'bg-blue-500/20 text-blue-400',
            read: 'bg-yellow-500/20 text-yellow-400',
            replied: 'bg-green-500/20 text-green-400',
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400';
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Contact Inquiries</h1>
                    <p className="text-gray-400 mt-1">{inquiries.length} total inquiries</p>
                </div>
                <button 
                    onClick={() => setLastRefresh(Date.now())}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <p className="text-gray-400 text-sm">New Inquiries</p>
                    <p className="text-2xl font-bold text-blue-400 mt-2">
                        {inquiries.filter(i => i.status === 'new').length}
                    </p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <p className="text-gray-400 text-sm">Read</p>
                    <p className="text-2xl font-bold text-yellow-400 mt-2">
                        {inquiries.filter(i => i.status === 'read').length}
                    </p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <p className="text-gray-400 text-sm">Replied</p>
                    <p className="text-2xl font-bold text-green-400 mt-2">
                        {inquiries.filter(i => i.status === 'replied').length}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, or message..."
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
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                    </select>
                </div>
            </div>

            {/* Inquiries List */}
            <div className="space-y-4">
                {filteredInquiries.map((inquiry) => (
                    <div 
                        key={inquiry.id} 
                        className={`bg-slate-800 rounded-xl border p-6 transition-all hover:shadow-lg ${
                            inquiry.status === 'new' 
                                ? 'border-blue-500/50 hover:border-blue-500' 
                                : 'border-slate-700 hover:border-green-500/50'
                        }`}
                    >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-white">{inquiry.name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                                        {inquiry.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <a href={`mailto:${inquiry.email}`} className="hover:text-green-400 transition-colors">
                                            {inquiry.email}
                                        </a>
                                    </div>
                                    {inquiry.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            <a href={`tel:${inquiry.phone}`} className="hover:text-green-400 transition-colors">
                                                {inquiry.phone}
                                            </a>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        <span>{formatDate(inquiry.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Message Preview */}
                        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                                {inquiry.message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    setSelectedInquiry(inquiry);
                                    setShowDetailModal(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                View Details
                            </button>
                            {inquiry.status !== 'replied' && (
                                <>
                                    <button
                                        onClick={() => handleMarkAsRead(inquiry.id, inquiry.status)}
                                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Mark as Read
                                    </button>
                                    <button
                                        onClick={() => handleMarkAsReplied(inquiry.id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Mark as Replied
                                    </button>
                                </>
                            )}
                            {inquiry.phone && (
                                <button
                                    onClick={() => handleWhatsApp(inquiry.phone, inquiry.name)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    WhatsApp Reply
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(inquiry.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {filteredInquiries.length === 0 && (
                    <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
                        <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">
                            {search || statusFilter !== 'all' 
                                ? 'No inquiries found matching your filters' 
                                : 'No inquiries yet'}
                        </p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedInquiry && (
                <div 
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowDetailModal(false)}
                >
                    <div 
                        className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Inquiry Details</h2>
                                    <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(selectedInquiry.status)}`}>
                                        {selectedInquiry.status}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Contact Info */}
                            <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                                <h3 className="text-lg font-bold text-white mb-3">Contact Information</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 w-20">Name:</span>
                                        <span className="text-white font-medium">{selectedInquiry.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 w-20">Email:</span>
                                        <a href={`mailto:${selectedInquiry.email}`} className="text-green-400 hover:underline">
                                            {selectedInquiry.email}
                                        </a>
                                    </div>
                                    {selectedInquiry.phone && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-400 w-20">Phone:</span>
                                            <a href={`tel:${selectedInquiry.phone}`} className="text-green-400 hover:underline">
                                                {selectedInquiry.phone}
                                            </a>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 w-20">Received:</span>
                                        <span className="text-gray-300">{formatDate(selectedInquiry.created_at)}</span>
                                    </div>
                                    {selectedInquiry.replied_at && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-400 w-20">Replied:</span>
                                            <span className="text-gray-300">{formatDate(selectedInquiry.replied_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Message */}
                            <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                                <h3 className="text-lg font-bold text-white mb-3">Message</h3>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {selectedInquiry.message}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                                {selectedInquiry.phone && (
                                    <button
                                        onClick={() => handleWhatsApp(selectedInquiry.phone, selectedInquiry.name)}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Reply via WhatsApp
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(selectedInquiry.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Inquiry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ConfirmModalComponent />
        </div>
    );
}
