import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
    getAllGalleryItems,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    GalleryItem,
} from '@/lib/db';

function verifyAdmin(request: NextRequest): boolean {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    const user = verifyToken(token);
    return user !== null;
}

// GET all gallery items
export async function GET() {
    try {
        const items = getAllGalleryItems();
        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching gallery items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch gallery items' },
            { status: 500 }
        );
    }
}

// POST create new gallery item (admin only)
export async function POST(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, category, title, description, media_url, thumbnail_url } = body;

        if (!type || !category || !media_url) {
            return NextResponse.json(
                { error: 'Type, category, and media_url are required' },
                { status: 400 }
            );
        }

        const itemData: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'> = {
            type,
            category,
            title,
            description,
            media_url,
            thumbnail_url,
        };

        const id = createGalleryItem(itemData);
        return NextResponse.json({ success: true, id }, { status: 201 });
    } catch (error) {
        console.error('Error creating gallery item:', error);
        return NextResponse.json(
            { error: 'Failed to create gallery item' },
            { status: 500 }
        );
    }
}

// PUT update gallery item (admin only)
export async function PUT(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Gallery item ID is required' },
                { status: 400 }
            );
        }

        updateGalleryItem(id, updates);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating gallery item:', error);
        return NextResponse.json(
            { error: 'Failed to update gallery item' },
            { status: 500 }
        );
    }
}

// DELETE gallery item (admin only)
export async function DELETE(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Gallery item ID is required' },
                { status: 400 }
            );
        }

        deleteGalleryItem(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        return NextResponse.json(
            { error: 'Failed to delete gallery item' },
            { status: 500 }
        );
    }
}
