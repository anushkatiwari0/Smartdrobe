import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const VALID_EVENTS = [
    'user_login',
    'item_uploaded',
    'outfit_generated',
    'outfit_saved',
    'profile_updated',
    'page_view',
] as const;

type EventName = typeof VALID_EVENTS[number];

/**
 * POST /api/events — silently log a user analytics event
 * Body: { event: EventName, metadata?: object }
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Events can be logged without auth (e.g., failed login attempts)
        const body = await request.json();
        const { event, metadata } = body;

        if (!VALID_EVENTS.includes(event as EventName)) {
            return NextResponse.json({ error: 'Invalid event name' }, { status: 400 });
        }

        const { error } = await supabase.from('user_events').insert({
            user_id: user?.id ?? null,
            event_name: event,
            metadata: metadata ?? {},
            created_at: new Date().toISOString(),
        });

        if (error) {
            // Silently fail — analytics should never break the app
            console.warn('[Analytics] Failed to log event:', error.message);
        }

        return NextResponse.json({ ok: true });
    } catch {
        // Always return 200 — analytics must never surface errors to users
        return NextResponse.json({ ok: true });
    }
}
