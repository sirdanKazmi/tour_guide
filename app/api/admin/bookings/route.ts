import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
} from '@/lib/admin-db';

function verifyAdmin(request: NextRequest): boolean {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    const user = verifyToken(token);
    return user !== null;
}

// GET all bookings
export async function GET(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || undefined;
        const dateFrom = searchParams.get('dateFrom') || undefined;
        const dateTo = searchParams.get('dateTo') || undefined;
        const search = searchParams.get('search') || undefined;

        const bookings = await getAllBookings({ status, dateFrom, dateTo, search });
        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}

// POST create new booking
export async function POST(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            customer_name,
            customer_email,
            customer_phone,
            customer_cnic,
            tour_name,
            tour_id,
            travel_date,
            people_count,
            price_per_person,
            total_price,
            payment_status,
            booking_status,
            special_requests,
            admin_notes,
        } = body;

        if (!customer_name || !customer_email || !customer_phone || !tour_name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const id = await createBooking({
            customer_name,
            customer_email,
            customer_phone,
            customer_cnic,
            tour_name,
            tour_id,
            travel_date: travel_date || new Date().toISOString().split('T')[0],
            people_count: parseInt(people_count) || 1,
            price_per_person: parseFloat(price_per_person) || 0,
            total_price: parseFloat(total_price) || 0,
            payment_status: payment_status || 'unpaid',
            booking_status: booking_status || 'pending',
            special_requests,
            admin_notes,
        });

        return NextResponse.json({ success: true, id }, { status: 201 });
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}

// PUT update booking
export async function PUT(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
        }

        const body = await request.json();
        await updateBooking(parseInt(id), body);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
}

// DELETE booking
export async function DELETE(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
        }

        await deleteBooking(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting booking:', error);
        return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
    }
}
