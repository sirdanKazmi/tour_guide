'use client';

import { useState, useEffect } from 'react';
import { Search, User, Phone, Mail, MapPin, Plus, Edit } from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    city?: string;
    cnic?: string;
    total_bookings: number;
    total_spent: number;
    admin_notes?: string;
    created_at?: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);

            console.log('Fetching customers...');
            const response = await fetch(`/api/admin/customers?${params}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Received customers:', data);
                setCustomers(data);
            } else {
                console.error('Failed to fetch customers:', response.status);
                const error = await response.json();
                console.error('Error:', error);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return `PKR ${amount.toLocaleString()}`;
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
                    <h1 className="text-2xl font-bold text-white">Customers</h1>
                    <p className="text-gray-400 mt-1">{customers.length} total customers</p>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Customer
                </button>
            </div>

            {/* Search */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search customers by name, email, or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer) => (
                    <div key={customer.id} className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-green-500/50 transition-all">
                        {/* Customer Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-500/20 p-3 rounded-full">
                                    <User className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{customer.name}</h3>
                                    {customer.city && (
                                        <p className="text-gray-400 text-sm flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {customer.city}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4">
                            {customer.email && (
                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {customer.email}
                                </p>
                            )}
                            {customer.phone && (
                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    {customer.phone}
                                </p>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-xs">Total Bookings</p>
                                    <p className="text-xl font-bold text-white">{customer.total_bookings}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs">Total Spent</p>
                                    <p className="text-xl font-bold text-green-400">{formatCurrency(customer.total_spent)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Admin Notes */}
                        {customer.admin_notes && (
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                                <p className="text-blue-400 text-xs font-medium mb-1">Admin Notes</p>
                                <p className="text-gray-300 text-sm">{customer.admin_notes}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm">
                                <Edit className="w-4 h-4" />
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
                {customers.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400">
                        No customers found
                    </div>
                )}
            </div>
        </div>
    );
}
