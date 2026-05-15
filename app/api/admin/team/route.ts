import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
    getAllStaff,
    createStaff,
    updateStaff,
    deleteStaff,
} from '@/lib/admin-db';
import bcrypt from 'bcryptjs';

function verifyAdmin(request: NextRequest): boolean {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    const user = verifyToken(token);
    return user !== null;
}

// GET all team members
export async function GET(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const staff = getAllStaff();
        // Remove password from response
        const safeStaff = staff.map(({ password, ...rest }) => rest);
        return NextResponse.json(safeStaff);
    } catch (error) {
        console.error('Error fetching team members:', error);
        return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
    }
}

// POST create team member
export async function POST(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, role, email, phone, password } = body;

        if (!name || !role || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password || '123456', 10);

        const id = createStaff({
            name,
            role,
            email,
            phone: phone || null,
            password: hashedPassword,
            is_active: true,
        });

        return NextResponse.json({ success: true, id }, { status: 201 });
    } catch (error) {
        console.error('Error creating team member:', error);
        return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
    }
}

// PUT update team member
export async function PUT(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Team member ID is required' }, { status: 400 });
        }

        const body = await request.json();
        
        // If password is being updated, hash it
        if (body.password) {
            body.password = await bcrypt.hash(body.password, 10);
        }

        updateStaff(parseInt(id), body);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating team member:', error);
        return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
    }
}

// DELETE team member
export async function DELETE(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Team member ID is required' }, { status: 400 });
        }

        deleteStaff(parseInt(id));
        return NextResponse.json({ success: true, message: 'Team member deleted' });
    } catch (error) {
        console.error('Error deleting team member:', error);
        return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
    }
}
