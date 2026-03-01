import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/wardrobe — returns all wardrobe items for the authenticated user
 */
export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map DB snake_case → app camelCase so UI fields like imageUrl work correctly
    const items = (data || []).map((row: Record<string, unknown>) => ({
        id: row.id,
        name: row.name,
        category: row.category,
        description: row.description,
        imageUrl: row.image_url,
        aiHint: row.ai_hint,
        color: row.color,
        colors: row.colors,
        wearCount: row.wear_count,
        lastWorn: row.last_worn,
        aiSuggestionCount: row.ai_suggestion_count,
        isFavorite: row.is_favorite,
        createdAt: row.created_at,
    }));

    return NextResponse.json({ items });
}

/**
 * POST /api/wardrobe — add a new wardrobe item
 * Accepts JSON body with: name, category, description, imageUrl, aiHint, color, colors
 */
export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, description, imageUrl, aiHint, color, colors } = body;

    if (!name || !category || !imageUrl) {
        return NextResponse.json({ error: 'Missing required fields: name, category, imageUrl' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('wardrobe_items')
        .insert({
            user_id: user.id,
            name,
            category,
            description: description || '',
            image_url: imageUrl,
            ai_hint: aiHint || '',
            color: color || '',
            colors: colors || [],
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map DB snake_case → app camelCase
    const item = {
        id: data.id,
        name: data.name,
        category: data.category,
        description: data.description,
        imageUrl: data.image_url,
        aiHint: data.ai_hint,
        color: data.color,
        colors: data.colors,
        wearCount: data.wear_count,
        lastWorn: data.last_worn,
        aiSuggestionCount: data.ai_suggestion_count,
    };

    return NextResponse.json({ item }, { status: 201 });
}
