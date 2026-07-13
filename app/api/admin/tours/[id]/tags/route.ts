import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getTagsForTour, addTagToTour } from '@/lib/tags-db';

function verifyAdmin(request: NextRequest): boolean {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    return verifyToken(token) !== null;
}

// GET — list tag names for a tour
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { id } = await params;
        const names = await getTagsForTour(parseInt(id));
        return NextResponse.json(names);
    } catch (error) {
        console.error('Error listing tour tags:', error);
        return NextResponse.json({ error: 'Failed to list tags' }, { status: 500 });
    }
}

// POST ?name=Honeymoon (or JSON body { name }) — attach a tag to a tour
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        let name = searchParams.get('name') || '';
        if (!name) {
            try { const body = await request.json(); name = body?.name || ''; } catch { /* no body */ }
        }
        if (!name.trim()) return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
        const tagId = await addTagToTour(parseInt(id), name);
        return NextResponse.json({ success: true, tag_id: tagId }, { status: 201 });
    } catch (error: any) {
        console.error('Error adding tour tag:', error);
        return NextResponse.json({ error: `Failed to add tag: ${error.message || 'Unknown error'}` }, { status: 500 });
    }
}
