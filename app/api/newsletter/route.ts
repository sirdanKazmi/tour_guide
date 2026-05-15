import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { join } from 'path';

function getDatabase() {
    const dbPath = join(process.cwd(), 'tour_guide.db');
    return new Database(dbPath);
}

// POST subscribe to newsletter
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        // Validate email
        if (!email || !email.trim()) {
            return NextResponse.json({ 
                error: 'Email is required' 
            }, { status: 400 });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ 
                error: 'Please enter a valid email address' 
            }, { status: 400 });
        }

        const db = getDatabase();

        // Create table if it doesn't exist
        db.exec(`
            CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check if email already exists
        const existing = db.prepare('SELECT id FROM newsletter_subscribers WHERE email = ?').get(email);
        if (existing) {
            db.close();
            return NextResponse.json({ 
                error: 'This email is already subscribed' 
            }, { status: 409 });
        }

        // Insert new subscriber
        db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)').run(email);
        db.close();

        return NextResponse.json({ 
            success: true, 
            message: 'Subscribed successfully!' 
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error subscribing to newsletter:', error);
        return NextResponse.json({ 
            error: `Failed to subscribe: ${error.message}` 
        }, { status: 500 });
    }
}

// GET all subscribers (admin only)
export async function GET(request: NextRequest) {
    try {
        // TODO: Add admin authentication check
        
        const db = getDatabase();
        const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC').all();
        db.close();

        return NextResponse.json(subscribers);
    } catch (error: any) {
        console.error('Error fetching subscribers:', error);
        return NextResponse.json({ 
            error: `Failed to fetch subscribers: ${error.message}` 
        }, { status: 500 });
    }
}
