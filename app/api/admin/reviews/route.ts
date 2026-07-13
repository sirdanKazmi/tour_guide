import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
    getAllReviews,
    createReview,
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

// POST create a review (incl. multi-dimension scores + trip context)
export async function POST(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const body = await request.json();
        const { customer_name, tour_name, rating } = body;
        if (!customer_name || !tour_name || !rating) {
            return NextResponse.json({ error: 'customer_name, tour_name and rating are required' }, { status: 400 });
        }
        const num = (v: any) => (v === '' || v === undefined || v === null ? undefined : parseFloat(v));
        const id = await createReview({
            customer_name,
            tour_name,
            rating: parseInt(rating),
            review_text: body.review_text || undefined,
            review_title: body.review_title || undefined,
            trip_type: body.trip_type || undefined,
            country: body.country || undefined,
            city: body.city || undefined,
            score_accommodation: num(body.score_accommodation),
            score_transport: num(body.score_transport),
            score_meals: num(body.score_meals),
            score_guide: num(body.score_guide),
            score_value: num(body.score_value),
            score_accuracy: num(body.score_accuracy),
            status: body.status || 'approved',
            is_featured: !!body.is_featured,
        });
        return NextResponse.json({ success: true, id }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating review:', error);
        return NextResponse.json({ error: `Failed to create review: ${error.message || 'Unknown error'}` }, { status: 500 });
    }
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
