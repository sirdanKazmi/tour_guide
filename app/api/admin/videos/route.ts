import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
    getAllVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo,
    Video,
} from '@/lib/db';

function verifyAdmin(request: NextRequest): boolean {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    const user = verifyToken(token);
    return user !== null;
}

// GET all videos
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const video = getVideoById(parseInt(id));
            if (!video) {
                return NextResponse.json({ error: 'Video not found' }, { status: 404 });
            }
            return NextResponse.json(video);
        }

        const videos = getAllVideos();
        return NextResponse.json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        return NextResponse.json(
            { error: 'Failed to fetch videos' },
            { status: 500 }
        );
    }
}

// POST create new video (admin only)
export async function POST(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, category, video_url, thumbnail_url, duration } = body;

        if (!title || !category || !video_url) {
            return NextResponse.json(
                { error: 'Title, category, and video_url are required' },
                { status: 400 }
            );
        }

        const videoData: Omit<Video, 'id' | 'created_at' | 'updated_at'> = {
            title,
            description,
            category,
            video_url,
            thumbnail_url,
            duration,
        };

        const id = createVideo(videoData);
        return NextResponse.json({ success: true, id }, { status: 201 });
    } catch (error) {
        console.error('Error creating video:', error);
        return NextResponse.json(
            { error: 'Failed to create video' },
            { status: 500 }
        );
    }
}

// PUT update video (admin only)
export async function PUT(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
        }

        const body = await request.json();
        updateVideo(parseInt(id), body);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating video:', error);
        return NextResponse.json(
            { error: 'Failed to update video' },
            { status: 500 }
        );
    }
}

// DELETE video (admin only)
export async function DELETE(request: NextRequest) {
    try {
        if (!verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
        }

        deleteVideo(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting video:', error);
        return NextResponse.json(
            { error: 'Failed to delete video' },
            { status: 500 }
        );
    }
}
