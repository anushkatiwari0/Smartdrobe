import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@/lib/supabase/server';
import { rateLimiters } from '@/lib/rate-limit';
import { apiLogger } from '@/lib/logger';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * POST /api/upload — uploads an image to Cloudinary
 * Accepts: multipart/form-data with a 'file' field
 * Returns: { url: string }
 */
export async function POST(request: NextRequest) {
    // ✅ Authentication check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Rate limiting (10 uploads per minute per user)
    const rateLimitResult = rateLimiters.strict(user.id);
    if (!rateLimitResult.success) {
        return NextResponse.json(
            {
                error: 'Too many requests. Please try again later.',
                retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
            },
            {
                status: 429,
                headers: {
                    'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
                    'X-RateLimit-Remaining': String(rateLimitResult.remaining)
                }
            }
        );
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 });
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary
        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'smartdrobe',
                    resource_type: 'image',
                    transformation: [
                        { width: 800, height: 800, crop: 'limit' },
                        { quality: 'auto:good', fetch_format: 'webp' },
                    ],
                },
                (error, result) => {
                    if (error || !result) reject(error || new Error('Upload failed'));
                    else resolve(result as { secure_url: string });
                }
            ).end(buffer);
        });

        apiLogger.info('Upload', 'Image uploaded successfully', { userId: user.id });
        return NextResponse.json({ url: result.secure_url });
    } catch (error) {
        apiLogger.error('Upload', error, { userId: user.id });
        return NextResponse.json(
            { error: 'Failed to upload image. Please try again.' },
            { status: 500 }
        );
    }
}
