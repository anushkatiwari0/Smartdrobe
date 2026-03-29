import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { WardrobeItemUpdateSchema, validateInput } from '@/lib/validation';

/**
 * DELETE /api/wardrobe/[id] — remove a wardrobe item
 */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
        .from('wardrobe_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // RLS double-check

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
}

/**
 * PUT /api/wardrobe/[id] — update a wardrobe item (wearCount, lastWorn, etc.)
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // ✅ Validate input with Zod
    const validation = validateInput(WardrobeItemUpdateSchema, body);
    if (!validation.success) {
        return NextResponse.json({
            error: 'Invalid input',
            details: validation.errors
        }, { status: 400 });
    }

    // Map camelCase → snake_case for DB update
    const updates: Record<string, unknown> = {};
    if (validation.data.wearCount !== undefined) updates.wear_count = validation.data.wearCount;
    if (validation.data.lastWorn !== undefined) updates.last_worn = validation.data.lastWorn;
    if (validation.data.aiSuggestionCount !== undefined) updates.ai_suggestion_count = validation.data.aiSuggestionCount;
    if (validation.data.name !== undefined) updates.name = validation.data.name;
    if (validation.data.category !== undefined) updates.category = validation.data.category;
    if (validation.data.color !== undefined) updates.color = validation.data.color;
    if (validation.data.isFavorite !== undefined) updates.is_favorite = validation.data.isFavorite;

    const { data, error } = await supabase
        .from('wardrobe_items')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ item: data });
}
