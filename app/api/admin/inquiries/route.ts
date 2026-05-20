import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
    getAllInquiries,
    updateInquiryStatus,
    deleteInquiry,
} from '@/lib/admin-db';

function verifyAdmin(request: NextRequest): boolean {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    const user = verifyToken(token);
    return user !== null;
}

// GET all inquiries
export async function GET(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || undefined;

        const inquiries = await getAllInquiries(status);
        return NextResponse.json(inquiries);
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
    }
}

// PUT update inquiry status
export async function PUT(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 });
        }

        const body = await request.json();
        const { status } = body;

        if (!status || !['new', 'read', 'replied'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        await updateInquiryStatus(parseInt(id), status);
        return NextResponse.json({ success: true, message: 'Inquiry status updated' });
    } catch (error) {
        console.error('Error updating inquiry:', error);
        return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
    }
}

// DELETE inquiry
export async function DELETE(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 });
        }

        await deleteInquiry(parseInt(id));
        return NextResponse.json({ success: true, message: 'Inquiry deleted' });
    } catch (error) {
        console.error('Error deleting inquiry:', error);
        return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
    }
}
