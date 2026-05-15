import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour,
} from '@/lib/admin-db';

function verifyAdmin(request: NextRequest): boolean {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    const user = verifyToken(token);
    return user !== null;
}

// GET all tours
export async function GET(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || undefined;
        const category = searchParams.get('category') || undefined;
        const destination = searchParams.get('destination') || undefined;

        const tours = getAllTours({ status, category, destination });
        return NextResponse.json(tours);
    } catch (error) {
        console.error('Error fetching tours:', error);
        return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
    }
}

// POST create new tour
export async function POST(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            tour_name,
            destination,
            category,
            description,
            duration,
            price_per_person,
            max_seats,
            available_seats,
            departure_city,
            inclusions,
            exclusions,
            itinerary,
            cover_image,
            status,
        } = body;

        if (!tour_name || !destination || !category || !duration || !price_per_person || !max_seats || !departure_city) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const id = createTour({
            tour_name,
            destination,
            category,
            description,
            duration,
            price_per_person: parseFloat(price_per_person),
            max_seats: parseInt(max_seats),
            available_seats: parseInt(available_seats) || parseInt(max_seats),
            departure_city,
            inclusions,
            exclusions,
            itinerary,
            cover_image,
            status: status || 'active',
        });

        return NextResponse.json({ success: true, id }, { status: 201 });
    } catch (error) {
        console.error('Error creating tour:', error);
        return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
    }
}

// PUT update tour
export async function PUT(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Tour ID is required' }, { status: 400 });
        }

        const body = await request.json();
        updateTour(parseInt(id), body);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating tour:', error);
        return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 });
    }
}

// DELETE tour
export async function DELETE(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Tour ID is required' }, { status: 400 });
        }

        deleteTour(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting tour:', error);
        return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 });
    }
}
