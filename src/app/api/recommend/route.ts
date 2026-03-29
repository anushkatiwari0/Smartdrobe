import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getWeather } from '@/lib/weather';
import { RecommendationSchema, validateInput } from '@/lib/validation';
import { rateLimiters } from '@/lib/rate-limit';
import { apiLogger } from '@/lib/logger';

/**
 * POST /api/recommend — weather-aware AI outfit recommendation
 * Body: { occasion: string, city?: string }
 */
export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Rate limiting (10 AI requests per minute per user - expensive operation)
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
                    'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000))
                }
            }
        );
    }

    const body = await request.json();

    // ✅ Validate input with Zod
    const validation = validateInput(RecommendationSchema, body);
    if (!validation.success) {
        return NextResponse.json({
            error: 'Invalid input',
            details: validation.errors
        }, { status: 400 });
    }

    const { occasion, city: bodyCity } = validation.data;

    // Fetch wardrobe + profile in parallel
    const [wardrobeResult, profileResult] = await Promise.all([
        supabase
            .from('wardrobe_items')
            .select('id, name, category, description, image_url, ai_hint, color, colors, wear_count')
            .eq('user_id', user.id),
        supabase
            .from('profiles')
            .select('location_city, display_name')
            .eq('id', user.id)
            .single(),
    ]);

    const wardrobeItems = (wardrobeResult.data || []).map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        imageUrl: item.image_url,
        aiHint: item.ai_hint,
        color: item.color,
        colors: item.colors,
        wearCount: item.wear_count,
    }));

    const DEFAULT_CITY = process.env.DEFAULT_CITY || 'London';
    const city = bodyCity || profileResult.data?.location_city || DEFAULT_CITY;

    // ✅ Handle weather fetch errors gracefully
    let weather;
    try {
        weather = await getWeather(city);
    } catch (error) {
        apiLogger.warn('Recommend', 'Weather fetch failed, using fallback data', { city, userId: user.id });
        // Use fallback weather data
        weather = { temp: 20, description: 'Clear', humidity: 50 };
    }

    // Return closet + weather for the client to call Genkit flow directly
    // (Genkit flows run server-side via Next.js server actions — no separate backend needed)
    return NextResponse.json({
        wardrobeItems,
        weather,
        occasion,
        userId: user.id,
    });
}
