import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
    getAllByAirPackages,
    createByAirPackage,
    updateByAirPackage,
    deleteByAirPackage,
} from '@/lib/fleet-db';

function verifyAdmin(request: NextRequest): boolean {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    const user = verifyToken(token);
    return user !== null;
}

// GET all by-air packages
export async function GET(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || undefined;

        const packages = await getAllByAirPackages({ status });
        return NextResponse.json(packages);
    } catch (error) {
        console.error('Error fetching by-air packages:', error);
        return NextResponse.json({ error: 'Failed to fetch by-air packages' }, { status: 500 });
    }
}

// POST create new by-air package
export async function POST(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, destination, price_per_person } = body;

        if (!title || !destination) {
            return NextResponse.json({ error: 'Missing required fields (title, destination)' }, { status: 400 });
        }

        const id = await createByAirPackage({
            title,
            slug: body.slug || title,
            destination,
            airline: body.airline,
            flight_duration: body.flight_duration,
            road_duration: body.road_duration,
            duration_days: parseInt(body.duration_days) || 1,
            duration_nights: parseInt(body.duration_nights) || 0,
            price_per_person: parseFloat(price_per_person) || 0,
            description: body.description,
            highlights: body.highlights,
            inclusions: body.inclusions,
            exclusions: body.exclusions,
            itinerary: body.itinerary,
            cover_image: body.cover_image,
            gallery: body.gallery,
            urgency_badge: body.urgency_badge || null,
            is_featured: !!body.is_featured,
            status: body.status || 'active',
            sort_order: parseInt(body.sort_order) || 0,
            meta_title: body.meta_title,
            meta_description: body.meta_description,
        });

        return NextResponse.json({ success: true, id }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating by-air package:', error);
        return NextResponse.json({ error: `Failed to create by-air package: ${error.message || 'Unknown error'}` }, { status: 500 });
    }
}

// PUT update by-air package
export async function PUT(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
        }

        const body = await request.json();
        if (body.duration_days !== undefined) body.duration_days = parseInt(body.duration_days) || 1;
        if (body.duration_nights !== undefined) body.duration_nights = parseInt(body.duration_nights) || 0;
        if (body.price_per_person !== undefined) body.price_per_person = parseFloat(body.price_per_person) || 0;
        if (body.sort_order !== undefined) body.sort_order = parseInt(body.sort_order) || 0;
        if (body.is_featured !== undefined) body.is_featured = !!body.is_featured;

        await updateByAirPackage(parseInt(id), body);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating by-air package:', error);
        return NextResponse.json({ error: `Failed to update by-air package: ${error.message || 'Unknown error'}` }, { status: 500 });
    }
}

// DELETE by-air package
export async function DELETE(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
        }

        await deleteByAirPackage(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting by-air package:', error);
        return NextResponse.json({ error: 'Failed to delete by-air package' }, { status: 500 });
    }
}
