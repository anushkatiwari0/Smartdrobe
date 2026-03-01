import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getWeather } from '@/lib/weather';

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

    const body = await request.json();
    const { occasion, city: bodyCity } = body;

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

    const city = bodyCity || profileResult.data?.location_city || 'London';
    const weather = await getWeather(city);

    // Return closet + weather for the client to call Genkit flow directly
    // (Genkit flows run server-side via Next.js server actions — no separate backend needed)
    return NextResponse.json({
        wardrobeItems,
        weather,
        occasion,
        userId: user.id,
    });
}
