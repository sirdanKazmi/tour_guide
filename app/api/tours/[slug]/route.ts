import { NextRequest, NextResponse } from 'next/server';
import { getTourBySlug, getApprovedReviews } from '@/lib/admin-db';
import { getPackageOptionsByTour } from '@/lib/packages-db';

// Public full tour detail: tour + active package options + approved reviews for it.
export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const tour = await getTourBySlug(slug);
        if (!tour || tour.status === 'inactive') {
            return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
        }

        const [packageOptions, allReviews] = await Promise.all([
            getPackageOptionsByTour(tour.id!, true),
            getApprovedReviews().catch(() => []),
        ]);
        const reviews = allReviews.filter((r) => r.tour_name === tour.tour_name);

        return NextResponse.json({ ...tour, package_options: packageOptions, reviews });
    } catch (error) {
        console.error('Error fetching tour detail:', error);
        return NextResponse.json({ error: 'Failed to fetch tour' }, { status: 500 });
    }
}
