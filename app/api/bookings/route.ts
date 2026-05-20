import { NextRequest, NextResponse } from 'next/server';
import { createBooking } from '@/lib/admin-db';

// Public API endpoint for customer bookings (no authentication required)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            customer_name,
            customer_email,
            customer_phone,
            tour_name,
            travel_date,
            people_count,
            special_requests,
        } = body;

        console.log('Booking request received:', { customer_name, customer_email, customer_phone, tour_name });

        // Validate required fields
        if (!customer_name || !customer_email || !customer_phone || !tour_name) {
            return NextResponse.json({ 
                error: 'Please fill in all required fields: Name, Email, Phone, and Tour' 
            }, { status: 400 });
        }

        // Create booking with default values
        const id = await createBooking({
            customer_name,
            customer_email,
            customer_phone,
            customer_cnic: body.customer_cnic || null,
            tour_name,
            tour_id: body.tour_id || null,
            travel_date: travel_date || new Date().toISOString().split('T')[0],
            people_count: parseInt(people_count) || 1,
            price_per_person: 0,
            total_price: 0,
            payment_status: 'unpaid',
            booking_status: 'pending',
            special_requests: special_requests || null,
            admin_notes: body.admin_notes || null,
        });

        console.log('Booking created successfully with ID:', id);

        return NextResponse.json({ 
            success: true, 
            id,
            message: 'Booking submitted successfully!' 
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating booking:', error);
        console.error('Error details:', error.message);
        return NextResponse.json({ 
            error: `Failed to create booking: ${error.message || 'Unknown error'}` 
        }, { status: 500 });
    }
}
