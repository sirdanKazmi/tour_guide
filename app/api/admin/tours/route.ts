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

        const tours = await getAllTours({ status, category, destination });
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

        const id = await createTour({
            tour_name,
            slug: body.slug,
            destination,
            category,
            travel_mode: body.travel_mode || 'By Road',
            description,
            duration,
            duration_days: body.duration_days ? parseInt(body.duration_days) : undefined,
            duration_nights: body.duration_nights ? parseInt(body.duration_nights) : undefined,
            price_per_person: parseFloat(price_per_person),
            max_seats: parseInt(max_seats),
            available_seats: parseInt(available_seats) || parseInt(max_seats),
            departure_city,
            rating: body.rating ? parseFloat(body.rating) : undefined,
            is_featured: !!body.is_featured,
            urgency_badge: body.urgency_badge || undefined,
            group_size: body.group_size || undefined,
            accommodation_summary: body.accommodation_summary || undefined,
            meals_summary: body.meals_summary || undefined,
            inclusions,
            exclusions,
            itinerary,
            itinerary_json: body.itinerary_json || undefined,
            pricing_tiers: body.pricing_tiers || undefined,
            gallery: body.gallery || undefined,
            related_tour_ids: body.related_tour_ids || undefined,
            cover_image,
            sort_order: body.sort_order ? parseInt(body.sort_order) : 0,
            itinerary_code: body.itinerary_code || undefined,
            transport_label: body.transport_label || undefined,
            availability: body.availability || undefined,
            highlights: body.highlights || undefined,
            videos: body.videos || undefined,
            tags: body.tags || undefined,
            map_lat: body.map_lat ? parseFloat(body.map_lat) : undefined,
            map_lng: body.map_lng ? parseFloat(body.map_lng) : undefined,
            map_embed_url: body.map_embed_url || undefined,
            meta_title: body.meta_title || undefined,
            meta_description: body.meta_description || undefined,
            meta_keywords: body.meta_keywords || undefined,
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
        // Coerce numeric fields when present
        ['price_per_person', 'rating', 'map_lat', 'map_lng'].forEach((k) => { if (body[k] !== undefined && body[k] !== '') body[k] = parseFloat(body[k]); });
        ['max_seats', 'available_seats', 'duration_days', 'duration_nights', 'sort_order'].forEach((k) => { if (body[k] !== undefined && body[k] !== '') body[k] = parseInt(body[k]); });
        if (body.is_featured !== undefined) body.is_featured = !!body.is_featured;

        await updateTour(parseInt(id), body);

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

        await deleteTour(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting tour:', error);
        return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 });
    }
}
