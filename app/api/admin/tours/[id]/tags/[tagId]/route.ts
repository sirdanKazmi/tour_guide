import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { removeTagFromTour } from '@/lib/tags-db';

function verifyAdmin(request: NextRequest): boolean {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    return verifyToken(token) !== null;
}

// DELETE — detach a tag from a tour
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; tagId: string }> }) {
    try {
        if (!verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { id, tagId } = await params;
        await removeTagFromTour(parseInt(id), parseInt(tagId));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error removing tour tag:', error);
        return NextResponse.json({ error: 'Failed to remove tag' }, { status: 500 });
    }
}
