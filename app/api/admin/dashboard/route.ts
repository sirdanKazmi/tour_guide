import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
    getAllBookings,
    getPendingBookings,
    getRecentBookings,
    getAllTours,
    getAllCustomers,
    getRevenueSummary,
    getAllInquiries,
} from '@/lib/admin-db';

function verifyAdmin(request: NextRequest): boolean {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    const user = verifyToken(token);
    return user !== null;
}

export async function GET(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch dashboard data in parallel
        const [
            allBookings,
            pendingBookings,
            recentBookings,
            revenue,
            activeTours,
            customers,
            inquiries
        ] = await Promise.all([
            getAllBookings(),
            getPendingBookings(),
            getRecentBookings(5),
            getRevenueSummary(),
            getAllTours({ status: 'active' }),
            getAllCustomers(),
            getAllInquiries()
        ]);

        const recentInquiries = inquiries.slice(0, 5);

        // Calculate booking stats
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const todayBookings = allBookings.filter(b => b.created_at?.startsWith(today)).length;
        const weekBookings = allBookings.filter(b => b.created_at && b.created_at >= weekAgo).length;
        const monthBookings = allBookings.filter(b => b.created_at && b.created_at >= monthAgo).length;

        return NextResponse.json({
            bookings: {
                total: allBookings.length,
                today: todayBookings,
                thisWeek: weekBookings,
                thisMonth: monthBookings,
                pending: pendingBookings.length,
                recent: recentBookings,
            },
            revenue,
            customers: {
                total: customers.length,
            },
            tours: {
                active: activeTours.length,
            },
            inquiries: {
                recent: recentInquiries,
            },
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
}
