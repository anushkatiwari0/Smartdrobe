import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { EventSchema, validateInput } from '@/lib/validation';
import { apiLogger } from '@/lib/logger';

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

        // ✅ Validate input with Zod
        const validation = validateInput(EventSchema, body);
        if (!validation.success) {
            // Silently fail for analytics - never break the app
            return NextResponse.json({ ok: true });
        }

        const { event, metadata } = validation.data;

        const { error } = await supabase.from('user_events').insert({
            user_id: user?.id ?? null,
            event_name: event,
            metadata: metadata ?? {},
            created_at: new Date().toISOString(),
        });

        if (error) {
            // Silently fail — analytics should never break the app
            apiLogger.warn('Analytics', 'Failed to log event', { error: error.message, event });
        }

        return NextResponse.json({ ok: true });
    } catch {
        // Always return 200 — analytics must never surface errors to users
        return NextResponse.json({ ok: true });
    }
}
