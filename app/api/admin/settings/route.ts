import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getAllSettings, setSetting } from '@/lib/admin-db';

function verifyAdmin(request: NextRequest): boolean {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    const user = verifyToken(token);
    return user !== null;
}

// GET all settings
export async function GET(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const settings = await getAllSettings();
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

// PUT update settings
export async function PUT(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        
        // Validate that we received settings data
        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 });
        }

        // Update each setting in the database
        for (const [key, value] of Object.entries(body)) {
            if (value !== undefined && value !== null) {
                await setSetting(key, String(value));
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Settings updated successfully' 
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
