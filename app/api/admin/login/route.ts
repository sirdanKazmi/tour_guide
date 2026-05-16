import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Debug logging
        console.log('Received username:', username);
        console.log('Received password:', password);

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Initialize database and create admin_users table if it doesn't exist
        const db = getDatabase();
        db.exec(`CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Re-initialize default admin with hashed password if needed
        const existingAdmin = db.prepare('SELECT * FROM admin_users WHERE username = ?').get('admin') as { password: string } | undefined;
        if (!existingAdmin) {
            console.log('Creating default admin user with hashed password...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            db.prepare('INSERT INTO admin_users (username, password) VALUES (?, ?)').run('admin', hashedPassword);
        } else if (existingAdmin.password === 'admin123') {
            // Migrate plain text password to hashed
            console.log('Migrating default admin password to hashed format...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            db.prepare('UPDATE admin_users SET password = ? WHERE username = ?').run(hashedPassword, 'admin');
        }

        // Fetch user from database
        const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as { password: string } | undefined;

        if (!user) {
            console.log('User not found:', username);
            // Fallback to environment variables
            const envUsername = process.env.ADMIN_USERNAME || 'admin';
            const envPassword = process.env.ADMIN_PASSWORD || 'admin123';
            if (username === envUsername && password === envPassword) {
                console.log('Login successful via environment fallback:', username);
                const token = generateToken(username);
                const response = NextResponse.json(
                    { success: true, message: 'Login successful' },
                    { status: 200 }
                );
                response.cookies.set('admin_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 86400,
                    path: '/',
                });
                return response;
            }
            console.log('Invalid credentials for user:', username);
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Compare password with bcrypt
        console.log('Comparing password with bcrypt...');
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Password mismatch for user:', username);
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        console.log('Login successful for user:', username);
        const token = generateToken(username);

        const response = NextResponse.json(
            { success: true, message: 'Login successful' },
            { status: 200 }
        );

        // Set HTTP-only cookie
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400, // 24 hours
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
