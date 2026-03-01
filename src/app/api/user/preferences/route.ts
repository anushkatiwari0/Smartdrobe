import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ preferences: data || null });
}

export async function PUT(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { style_keywords, fav_colors, avoid_colors, occasions, location_city, display_name } = body;

    // Update profile city and display_name
    if (location_city !== undefined || display_name !== undefined) {
        const profileUpdate: Record<string, string> = {};
        if (location_city !== undefined) profileUpdate.location_city = location_city;
        if (display_name !== undefined) profileUpdate.display_name = display_name;
        await supabase.from('profiles').update(profileUpdate).eq('id', user.id);
    }

    // Upsert preferences
    const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
            user_id: user.id,
            style_keywords: style_keywords ?? ['casual'],
            fav_colors: fav_colors ?? [],
            avoid_colors: avoid_colors ?? [],
            occasions: occasions ?? ['everyday'],
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ preferences: data });
}
