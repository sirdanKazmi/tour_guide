import { NextRequest, NextResponse } from 'next/server';
import { createBooking, generateBookingReference, Booking } from '@/lib/admin-db';

// Public API endpoint for customer bookings / quote requests (no authentication required).
// Supports tour, vehicle, by-air and custom bookings and returns a tracking reference.
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            customer_name,
            customer_email,
            customer_phone,
            travel_date,
            people_count,
            special_requests,
        } = body;

        const bookingType: Booking['booking_type'] = ['tour', 'vehicle', 'by_air', 'custom'].includes(body.booking_type)
            ? body.booking_type
            : 'tour';

        // A human label stored in tour_name (kept for admin display; NOT NULL in schema).
        const itemName: string =
            body.item_name || body.tour_name || (bookingType === 'custom' ? 'Custom trip request' : '');

        // Validate required fields
        if (!customer_name || !customer_email || !customer_phone) {
            return NextResponse.json(
                { error: 'Please fill in all required fields: Name, Email and Phone' },
                { status: 400 }
            );
        }
        if (bookingType !== 'custom' && !itemName) {
            return NextResponse.json(
                { error: 'Please select what you would like to book' },
                { status: 400 }
            );
        }

        const pricePerUnit = parseFloat(body.price_per_person) || 0;
        const durationDays = body.duration_days ? parseInt(body.duration_days) : undefined;
        const people = parseInt(people_count) || 1;

        // Compute an indicative total. For vehicles the unit is per-day, otherwise per-person.
        let totalPrice = parseFloat(body.total_price);
        if (isNaN(totalPrice)) {
            if (bookingType === 'vehicle') {
                totalPrice = pricePerUnit * (durationDays || 1);
            } else {
                totalPrice = pricePerUnit * people;
            }
        }

        const basePayload: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'reference'> = {
            booking_type: bookingType,
            customer_name,
            customer_email,
            customer_phone,
            customer_cnic: body.customer_cnic || undefined,
            tour_name: itemName || 'Custom trip request',
            tour_id: body.tour_id ? parseInt(body.tour_id) : undefined,
            vehicle_id: body.vehicle_id ? parseInt(body.vehicle_id) : undefined,
            by_air_id: body.by_air_id ? parseInt(body.by_air_id) : undefined,
            package_option_id: body.package_option_id ? parseInt(body.package_option_id) : undefined,
            option_code: body.option_code || undefined,
            travel_date: travel_date || new Date().toISOString().split('T')[0],
            duration_days: durationDays,
            people_count: people,
            rooms: body.rooms ? parseInt(body.rooms) : undefined,
            selected_tier: body.selected_tier || undefined,
            add_vehicle: body.add_vehicle || undefined,
            price_per_person: pricePerUnit,
            total_price: totalPrice,
            payment_status: 'unpaid',
            booking_status: 'pending',
            special_requests: special_requests || undefined,
            source: body.source === 'whatsapp' ? 'whatsapp' : 'web',
        };

        // Insert with a unique reference, retrying a few times on the rare collision.
        let id = 0;
        let reference = '';
        let lastError: any = null;
        for (let attempt = 0; attempt < 5; attempt += 1) {
            reference = generateBookingReference();
            try {
                id = await createBooking({ ...basePayload, reference });
                lastError = null;
                break;
            } catch (err: any) {
                // 23505 = unique_violation (duplicate reference); retry with a new code.
                if (err?.code === '23505') {
                    lastError = err;
                    continue;
                }
                throw err;
            }
        }
        if (lastError) throw lastError;

        return NextResponse.json(
            {
                success: true,
                id,
                reference,
                message: 'Booking request submitted successfully!',
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { error: `Failed to create booking: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}
