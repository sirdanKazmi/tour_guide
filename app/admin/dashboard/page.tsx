'use client';

import { useState, useEffect } from 'react';
import { 
    TrendingUp, 
    Users, 
    Plane, 
    DollarSign, 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle 
} from 'lucide-react';

interface DashboardData {
    bookings: {
        total: number;
        today: number;
        thisWeek: number;
        thisMonth: number;
        pending: number;
        recent: any[];
    };
    revenue: {
        today: number;
        thisWeek: number;
        thisMonth: number;
        total: number;
    };
    customers: {
        total: number;
    };
    tours: {
        active: number;
    };
    inquiries: {
        recent: any[];
    };
}

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/admin/dashboard');
            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return `PKR ${amount.toLocaleString()}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome to Smile For Miles Admin Panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Bookings */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Bookings</p>
                            <p className="text-3xl font-bold text-white mt-2">{data?.bookings.total || 0}</p>
                            <p className="text-green-400 text-sm mt-1">
                                +{data?.bookings.thisMonth || 0} this month
                            </p>
                        </div>
                        <div className="bg-green-500/20 p-3 rounded-lg">
                            <Plane className="w-8 h-8 text-green-400" />
                        </div>
                    </div>
                </div>

                {/* Revenue */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Revenue</p>
                            <p className="text-3xl font-bold text-white mt-2">
                                {formatCurrency(data?.revenue.total || 0)}
                            </p>
                            <p className="text-blue-400 text-sm mt-1">
                                {formatCurrency(data?.revenue.thisMonth || 0)} this month
                            </p>
                        </div>
                        <div className="bg-blue-500/20 p-3 rounded-lg">
                            <DollarSign className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* Customers */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Customers</p>
                            <p className="text-3xl font-bold text-white mt-2">{data?.customers.total || 0}</p>
                            <p className="text-purple-400 text-sm mt-1">Active customers</p>
                        </div>
                        <div className="bg-purple-500/20 p-3 rounded-lg">
                            <Users className="w-8 h-8 text-purple-400" />
                        </div>
                    </div>
                </div>

                {/* Active Tours */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Active Tours</p>
                            <p className="text-3xl font-bold text-white mt-2">{data?.tours.active || 0}</p>
                            <p className="text-yellow-400 text-sm mt-1">Available packages</p>
                        </div>
                        <div className="bg-yellow-500/20 p-3 rounded-lg">
                            <TrendingUp className="w-8 h-8 text-yellow-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-bold text-white mb-4">Revenue Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Today's Revenue</p>
                        <p className="text-2xl font-bold text-green-400 mt-2">
                            {formatCurrency(data?.revenue.today || 0)}
                        </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">This Week</p>
                        <p className="text-2xl font-bold text-blue-400 mt-2">
                            {formatCurrency(data?.revenue.thisWeek || 0)}
                        </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">This Month</p>
                        <p className="text-2xl font-bold text-purple-400 mt-2">
                            {formatCurrency(data?.revenue.thisMonth || 0)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
                    <a href="/admin/bookings" className="text-green-400 hover:text-green-300 text-sm">
                        View All →
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Tour</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.bookings.recent.map((booking: any) => (
                                <tr key={booking.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                                    <td className="py-3 px-4 text-white">{booking.customer_name}</td>
                                    <td className="py-3 px-4 text-gray-300">{booking.tour_name}</td>
                                    <td className="py-3 px-4 text-gray-300">{booking.travel_date}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            booking.booking_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                            booking.booking_status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                                            booking.booking_status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                            'bg-red-500/20 text-red-400'
                                        }`}>
                                            {booking.booking_status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-green-400 font-medium">
                                        {formatCurrency(booking.total_price)}
                                    </td>
                                </tr>
                            ))}
                            {(!data?.bookings.recent || data.bookings.recent.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-400">
                                        No bookings yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/admin/bookings" className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-6 hover:from-green-500 hover:to-green-400 transition-all cursor-pointer">
                    <h3 className="text-white font-bold text-lg">Manage Bookings</h3>
                    <p className="text-white/80 text-sm mt-1">View and manage all bookings</p>
                </a>
                <a href="/admin/tours" className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 hover:from-blue-500 hover:to-blue-400 transition-all cursor-pointer">
                    <h3 className="text-white font-bold text-lg">Tour Packages</h3>
                    <p className="text-white/80 text-sm mt-1">Create and edit tours</p>
                </a>
                <a href="/admin/customers" className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl p-6 hover:from-purple-500 hover:to-purple-400 transition-all cursor-pointer">
                    <h3 className="text-white font-bold text-lg">Customers</h3>
                    <p className="text-white/80 text-sm mt-1">Manage customer database</p>
                </a>
            </div>
        </div>
    );
}
