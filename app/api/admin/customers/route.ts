import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
} from '@/lib/admin-db';

function verifyAdmin(request: NextRequest): boolean {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    const user = verifyToken(token);
    return user !== null;
}

// GET all customers
export async function GET(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || undefined;

        console.log('Fetching customers with search:', search);
        const customers = getAllCustomers(search);
        console.log('Found customers:', customers.length);
        
        return NextResponse.json(customers);
    } catch (error: any) {
        console.error('Error fetching customers:', error);
        console.error('Error details:', error.message);
        return NextResponse.json({ error: `Failed to fetch customers: ${error.message}` }, { status: 500 });
    }
}

// POST create new customer
export async function POST(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, phone, city, cnic, admin_notes } = body;

        if (!name) {
            return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
        }

        const id = createCustomer({
            name,
            email,
            phone,
            city,
            cnic,
            total_bookings: 0,
            total_spent: 0,
            admin_notes,
        });

        return NextResponse.json({ success: true, id }, { status: 201 });
    } catch (error) {
        console.error('Error creating customer:', error);
        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }
}

// PUT update customer
export async function PUT(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
        }

        const body = await request.json();
        updateCustomer(parseInt(id), body);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
    }
}
