import { NextRequest, NextResponse } from 'next/server';
import { getBookingByReference } from '@/lib/admin-db';

// Public "Track Booking" lookup. Returns a safe subset of a booking by its reference.
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const reference = searchParams.get('reference');

        if (!reference || !reference.trim()) {
            return NextResponse.json({ error: 'Please provide a booking reference' }, { status: 400 });
        }

        const booking = await getBookingByReference(reference);

        if (!booking) {
            return NextResponse.json({ error: 'No booking found with that reference' }, { status: 404 });
        }

        // Only expose non-sensitive fields to the public tracker.
        return NextResponse.json({
            reference: booking.reference,
            booking_type: booking.booking_type,
            item_name: booking.tour_name,
            travel_date: booking.travel_date,
            people_count: booking.people_count,
            duration_days: booking.duration_days,
            total_price: booking.total_price,
            payment_status: booking.payment_status,
            booking_status: booking.booking_status,
            created_at: booking.created_at,
            customer_name: booking.customer_name,
        });
    } catch (error: any) {
        console.error('Error tracking booking:', error);
        return NextResponse.json({ error: 'Failed to look up booking' }, { status: 500 });
    }
}
