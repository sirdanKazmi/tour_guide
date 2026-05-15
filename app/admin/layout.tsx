'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Video, Image, LogOut, Menu, X, PlaneTakeoff, Compass, Users, Mail, DollarSign, Star, Settings, Shield } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Skip auth check for login and register pages
        if (pathname === '/admin/login' || pathname === '/admin/register') {
            setLoading(false);
            return;
        }

        // Check if user is authenticated
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/admin/videos');
                if (response.status === 401) {
                    router.push('/admin/login');
                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    if (pathname === '/admin/login' || pathname === '/admin/register') {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                <div className="text-xl text-slate-600 dark:text-slate-400">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const navItems = [
        { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/bookings', icon: PlaneTakeoff, label: 'Bookings' },
        { href: '/admin/tours', icon: Compass, label: 'Tour Packages' },
        { href: '/admin/customers', icon: Users, label: 'Customers' },
        { href: '/admin/inquiries', icon: Mail, label: 'Inquiries' },
        { href: '/admin/revenue', icon: DollarSign, label: 'Revenue' },
        { href: '/admin/reviews', icon: Star, label: 'Reviews' },
        { href: '/admin/videos', icon: Video, label: 'Videos' },
        { href: '/admin/gallery', icon: Image, label: 'Gallery' },
        { href: '/admin/settings', icon: Settings, label: 'Settings' },
        { href: '/admin/team', icon: Shield, label: 'Team' },
    ];

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 pt-15">
            {/* Mobile menu button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 shadow-xl transform transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
            >
                <div className="p-6 pt-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                        Admin Panel
                    </h1>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 mt-8 w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="lg:ml-64 p-8 pt-24 lg:pt-8">
                {children}
            </main>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                />
            )}
        </div>
    );
}
