import { NextRequest, NextResponse } from 'next/server';
import { getAdminByUsername, createAdmin } from '@/lib/admin-db';

// POST create new admin account
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('Registration request body:', body);
        const { username, password } = body;

        if (!username || !password) {
            console.log('Missing fields:', { username: !!username, password: !!password });
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Check if username already exists
        const existingUser = await getAdminByUsername(username);
        if (existingUser) {
            console.log('Username already exists:', username);
            return NextResponse.json(
                { error: 'Username already exists' },
                { status: 400 }
            );
        }

        // Create new admin
        console.log('Creating new admin:', { username });
        await createAdmin(username, password);

        console.log('Admin created successfully');
        return NextResponse.json(
            { success: true, message: 'Account created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof Error && error.message.includes('duplicate key')) {
            return NextResponse.json(
                { error: 'Username already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
        console.error('Error creating admin account:', error);
        return NextResponse.json(
            { error: 'Failed to create account: ' + (error as Error).message },
            { status: 500 }
        );
    }
}
