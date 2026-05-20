import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { getAdminByUsername, verifyAdminPassword, createAdmin } from '@/lib/admin-db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Debug logging
        console.log('Received username:', username);

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Try to get user from database
        let user = await getAdminByUsername(username);

        if (!user) {
            console.log('User not found, checking environment variables');
            // Fallback to environment variables for initial admin setup
            const envUsername = process.env.ADMIN_USERNAME || 'admin';
            const envPassword = process.env.ADMIN_PASSWORD || 'admin123';
            
            if (username === envUsername && password === envPassword) {
                console.log('Login successful via environment fallback:', username);
                // Create admin user if not exists
                try {
                    await createAdmin(username, password);
                } catch (e) {
                    // User might already exist, ignore
                }
                
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

        // Verify password
        const isPasswordValid = await verifyAdminPassword(user, password);

        if (!isPasswordValid) {
            console.log('Password mismatch for user:', username);
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        console.log('Login successful:', username);
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
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
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
