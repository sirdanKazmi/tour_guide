import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

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

        // Check if email already exists
        const { data: existing, error: checkError } = await supabase
            .from('newsletter_subscribers')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (checkError) throw checkError;

        if (existing) {
            return NextResponse.json({ 
                error: 'This email is already subscribed' 
            }, { status: 409 });
        }

        // Insert new subscriber
        const { error: insertError } = await supabase
            .from('newsletter_subscribers')
            .insert([{ email }]);

        if (insertError) throw insertError;

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
        
        const { data: subscribers, error } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(subscribers || []);
    } catch (error: any) {
        console.error('Error fetching subscribers:', error);
        return NextResponse.json({ 
            error: `Failed to fetch subscribers: ${error.message}` 
        }, { status: 500 });
    }
}
