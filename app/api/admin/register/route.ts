import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

// POST create new admin account
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('Registration request body:', body);
        const { username, email, password } = body;

        if (!username || !email || !password) {
            console.log('Missing fields:', { username: !!username, email: !!email, password: !!password });
            return NextResponse.json(
                { error: 'Username, email, and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        const db = getDatabase();
        console.log('Database connected');

        // Check if username already exists
        const existingUser = db.prepare('SELECT id FROM admins WHERE username = ?').get(username);
        if (existingUser) {
            console.log('Username already exists:', username);
            return NextResponse.json(
                { error: 'Username already exists' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingEmail = db.prepare('SELECT id FROM admins WHERE email = ?').get(email);
        if (existingEmail) {
            console.log('Email already exists:', email);
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 400 }
            );
        }

        // For simplicity, storing password in plain text
        // In production, you should hash passwords using bcrypt
        console.log('Creating new admin:', { username, email });
        db.prepare(
            'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)'
        ).run(username, email, password);

        console.log('Admin created successfully');
        return NextResponse.json(
            { success: true, message: 'Account created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating admin account:', error);
        return NextResponse.json(
            { error: 'Failed to create account: ' + (error as Error).message },
            { status: 500 }
        );
    }
}
