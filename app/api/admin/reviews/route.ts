import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
    getAllReviews,
    updateReviewStatus,
    deleteReview,
    toggleFeaturedReview,
} from '@/lib/admin-db';

function verifyAdmin(request: NextRequest): boolean {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    const user = verifyToken(token);
    return user !== null;
}

// GET all reviews
export async function GET(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || undefined;

        const reviews = await getAllReviews(status);
        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

// PUT update review status
export async function PUT(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const action = searchParams.get('action');

        if (!id) {
            return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
        }

        const reviewId = parseInt(id);

        if (action === 'status') {
            const body = await request.json();
            const { status } = body;

            if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
                return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
            }

            await updateReviewStatus(reviewId, status);
            return NextResponse.json({ success: true, message: 'Review status updated' });
        }

        if (action === 'featured') {
            const body = await request.json();
            const { is_featured } = body;

            await toggleFeaturedReview(reviewId, is_featured);
            return NextResponse.json({ success: true, message: 'Featured status updated' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
}

// DELETE review
export async function DELETE(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
        }

        await deleteReview(parseInt(id));
        return NextResponse.json({ success: true, message: 'Review deleted' });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}
