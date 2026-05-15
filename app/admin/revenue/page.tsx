'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, RefreshCw } from 'lucide-react';

interface RevenueData {
    summary: {
        today: number;
        thisWeek: number;
        thisMonth: number;
        total: number;
    };
    dailyRevenue: {
        date: string;
        revenue: number;
    }[];
}

export default function RevenuePage() {
    const [data, setData] = useState<RevenueData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(Date.now());

    useEffect(() => {
        fetchRevenueData();
    }, [lastRefresh]);

    const fetchRevenueData = async () => {
        try {
            console.log('Fetching revenue data...');
            const response = await fetch('/api/admin/revenue?days=30');
            
            if (response.status === 401) {
                alert('Session expired. Please log in again.');
                window.location.href = '/admin/login';
                return;
            }

            if (response.ok) {
                const result = await response.json();
                console.log('Revenue data:', result);
                setData(result);
            }
        } catch (error) {
            console.error('Error fetching revenue data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return `PKR ${amount.toLocaleString()}`;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    const maxRevenue = Math.max(...(data?.dailyRevenue.map(d => d.revenue) || [0]), 1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Payments & Revenue</h1>
                    <p className="text-gray-400 mt-1">Track your business revenue and earnings</p>
                </div>
                <button 
                    onClick={() => setLastRefresh(Date.now())}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Today */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-500/20 p-3 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-400" />
                        </div>
                        <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Today's Revenue</p>
                    <p className="text-2xl font-bold text-green-400">
                        {formatCurrency(data?.summary.today || 0)}
                    </p>
                </div>

                {/* This Week */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-500/20 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-blue-400" />
                        </div>
                        <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm mb-1">This Week</p>
                    <p className="text-2xl font-bold text-blue-400">
                        {formatCurrency(data?.summary.thisWeek || 0)}
                    </p>
                </div>

                {/* This Month */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-500/20 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                        </div>
                        <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm mb-1">This Month</p>
                    <p className="text-2xl font-bold text-purple-400">
                        {formatCurrency(data?.summary.thisMonth || 0)}
                    </p>
                </div>

                {/* Total */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-yellow-500/20 p-3 rounded-lg">
                            <DollarSign className="w-6 h-6 text-yellow-400" />
                        </div>
                        <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-yellow-400">
                        {formatCurrency(data?.summary.total || 0)}
                    </p>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Daily Revenue (Last 30 Days)</h2>
                </div>

                {data?.dailyRevenue && data.dailyRevenue.length > 0 ? (
                    <div className="space-y-4">
                        {/* Chart */}
                        <div className="flex items-end gap-1 h-64 border-l border-b border-slate-700 p-4">
                            {data.dailyRevenue.map((day, index) => {
                                const height = (day.revenue / maxRevenue) * 100;
                                return (
                                    <div
                                        key={index}
                                        className="flex-1 flex flex-col items-center justify-end group relative"
                                        style={{ height: '100%' }}
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                                            <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                                                <p className="font-semibold">{formatDate(day.date)}</p>
                                                <p className="text-green-400">{formatCurrency(day.revenue)}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Bar */}
                                        <div
                                            className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all hover:from-green-500 hover:to-green-300 cursor-pointer"
                                            style={{ height: `${height}%` }}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* X-axis labels */}
                        <div className="flex gap-1 px-4">
                            {data.dailyRevenue.map((day, index) => (
                                <div
                                    key={index}
                                    className="flex-1 text-center"
                                >
                                    <p className="text-xs text-gray-500 transform -rotate-45 origin-top-left truncate">
                                        {formatDate(day.date)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gradient-to-r from-green-600 to-green-400 rounded"></div>
                                <span className="text-sm text-gray-400">Daily Revenue</span>
                            </div>
                            <div className="text-sm text-gray-400">
                                Peak: {formatCurrency(maxRevenue)}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No revenue data available yet</p>
                        <p className="text-gray-500 text-sm mt-2">Completed bookings will appear here</p>
                    </div>
                )}
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Revenue Breakdown</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <div>
                            <p className="text-white font-medium">Today</p>
                            <p className="text-gray-400 text-sm">{new Date().toLocaleDateString()}</p>
                        </div>
                        <p className="text-xl font-bold text-green-400">
                            {formatCurrency(data?.summary.today || 0)}
                        </p>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <div>
                            <p className="text-white font-medium">This Week</p>
                            <p className="text-gray-400 text-sm">Last 7 days</p>
                        </div>
                        <p className="text-xl font-bold text-blue-400">
                            {formatCurrency(data?.summary.thisWeek || 0)}
                        </p>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <div>
                            <p className="text-white font-medium">This Month</p>
                            <p className="text-gray-400 text-sm">Last 30 days</p>
                        </div>
                        <p className="text-xl font-bold text-purple-400">
                            {formatCurrency(data?.summary.thisMonth || 0)}
                        </p>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div>
                            <p className="text-white font-medium">All Time</p>
                            <p className="text-gray-400 text-sm">Total revenue</p>
                        </div>
                        <p className="text-2xl font-bold text-yellow-400">
                            {formatCurrency(data?.summary.total || 0)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
