import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import bcrypt from 'bcryptjs';

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

        const db = getDatabase();
        console.log('Database connected');

        // Create admin_users table if it doesn't exist
        db.exec(`CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Check if username already exists
        const existingUser = db.prepare('SELECT id FROM admin_users WHERE username = ?').get(username);
        if (existingUser) {
            console.log('Username already exists:', username);
            return NextResponse.json(
                { error: 'Username already exists' },
                { status: 400 }
            );
        }

        // Hash password with bcrypt before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Creating new admin:', { username });
        db.prepare(
            'INSERT INTO admin_users (username, password) VALUES (?, ?)'
        ).run(username, hashedPassword);

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
