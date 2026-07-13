import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
    getAllVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
} from '@/lib/fleet-db';

function verifyAdmin(request: NextRequest): boolean {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    const user = verifyToken(token);
    return user !== null;
}

// GET all vehicles
export async function GET(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || undefined;
        const type = searchParams.get('type') || undefined;

        const vehicles = await getAllVehicles({ status, type });
        return NextResponse.json(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
    }
}

// POST create new vehicle
export async function POST(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, type, seats, price_per_day } = body;

        if (!name || !type || !seats) {
            return NextResponse.json({ error: 'Missing required fields (name, type, seats)' }, { status: 400 });
        }

        const id = await createVehicle({
            name,
            slug: body.slug || name,
            type,
            seats: parseInt(seats),
            has_ac: body.has_ac !== undefined ? !!body.has_ac : true,
            fuel: body.fuel || 'Petrol',
            with_driver: body.with_driver !== undefined ? !!body.with_driver : true,
            price_per_day: parseFloat(price_per_day) || 0,
            description: body.description,
            cover_image: body.cover_image,
            gallery: body.gallery,
            specs: body.specs,
            urgency_badge: body.urgency_badge || null,
            status: body.status || 'active',
            sort_order: parseInt(body.sort_order) || 0,
            meta_title: body.meta_title,
            meta_description: body.meta_description,
        });

        return NextResponse.json({ success: true, id }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating vehicle:', error);
        return NextResponse.json({ error: `Failed to create vehicle: ${error.message || 'Unknown error'}` }, { status: 500 });
    }
}

// PUT update vehicle
export async function PUT(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });
        }

        const body = await request.json();
        // Coerce numeric fields when present
        if (body.seats !== undefined) body.seats = parseInt(body.seats);
        if (body.price_per_day !== undefined) body.price_per_day = parseFloat(body.price_per_day) || 0;
        if (body.sort_order !== undefined) body.sort_order = parseInt(body.sort_order) || 0;

        await updateVehicle(parseInt(id), body);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating vehicle:', error);
        return NextResponse.json({ error: `Failed to update vehicle: ${error.message || 'Unknown error'}` }, { status: 500 });
    }
}

// DELETE vehicle
export async function DELETE(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });
        }

        await deleteVehicle(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
    }
}
