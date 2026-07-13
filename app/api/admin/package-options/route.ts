import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
    getPackageOptionsByTour,
    createPackageOption,
    updatePackageOption,
    deletePackageOption,
    PackageOption,
} from '@/lib/packages-db';

function verifyAdmin(request: NextRequest): boolean {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    return verifyToken(token) !== null;
}

// Normalize numeric / boolean fields from a request body.
function coerce(body: any): Partial<PackageOption> {
    const out: any = { ...body };
    ['price'].forEach((k) => { if (out[k] !== undefined && out[k] !== '') out[k] = parseFloat(out[k]); });
    ['tour_id', 'min_persons', 'max_persons', 'rooms', 'vehicle_id', 'sort_order'].forEach((k) => {
        if (out[k] === '' || out[k] === null) out[k] = null;
        else if (out[k] !== undefined) out[k] = parseInt(out[k]);
    });
    if (out.is_active !== undefined) out.is_active = !!out.is_active;
    return out;
}

// GET ?tourId= — list options for a tour
export async function GET(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { searchParams } = new URL(request.url);
        const tourId = searchParams.get('tourId');
        if (!tourId) return NextResponse.json({ error: 'tourId is required' }, { status: 400 });
        const options = await getPackageOptionsByTour(parseInt(tourId));
        return NextResponse.json(options);
    } catch (error: any) {
        console.error('Error fetching package options:', error);
        return NextResponse.json({ error: 'Failed to fetch package options' }, { status: 500 });
    }
}

// POST — create (body.tour_id required)
export async function POST(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const body = coerce(await request.json());
        if (!body.tour_id) return NextResponse.json({ error: 'tour_id is required' }, { status: 400 });
        const id = await createPackageOption({
            tour_id: body.tour_id,
            code: body.code || null,
            tier: body.tier || null,
            transport_mode: body.transport_mode || null,
            price_unit: body.price_unit === 'per_group' ? 'per_group' : 'per_person',
            min_persons: body.min_persons ?? null,
            max_persons: body.max_persons ?? null,
            rooms: body.rooms ?? null,
            price: body.price || 0,
            vehicle_text: body.vehicle_text || null,
            vehicle_id: body.vehicle_id ?? null,
            hotels: body.hotels || null,
            included: body.included || null,
            not_included: body.not_included || null,
            extras: body.extras || null,
            sort_order: body.sort_order ?? 0,
            is_active: body.is_active !== undefined ? body.is_active : true,
        });
        return NextResponse.json({ success: true, id }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating package option:', error);
        return NextResponse.json({ error: `Failed to create package option: ${error.message || 'Unknown error'}` }, { status: 500 });
    }
}

// PATCH ?id= — update
export async function PATCH(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Option id is required' }, { status: 400 });
        const body = coerce(await request.json());
        delete (body as any).tour_id; // don't move an option between tours
        await updatePackageOption(parseInt(id), body);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating package option:', error);
        return NextResponse.json({ error: `Failed to update package option: ${error.message || 'Unknown error'}` }, { status: 500 });
    }
}

// DELETE ?id=
export async function DELETE(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Option id is required' }, { status: 400 });
        await deletePackageOption(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting package option:', error);
        return NextResponse.json({ error: 'Failed to delete package option' }, { status: 500 });
    }
}
