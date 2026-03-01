/**
 * Client-side analytics helper.
 * Silently fires events to /api/events — never throws or blocks UI.
 * 
 * Usage:
 *   import { trackEvent } from '@/lib/analytics';
 *   trackEvent('outfit_generated', { itemCount: 3 });
 */

type EventName =
    | 'user_login'
    | 'item_uploaded'
    | 'outfit_generated'
    | 'outfit_saved'
    | 'profile_updated'
    | 'page_view';

export function trackEvent(event: EventName, metadata?: Record<string, unknown>): void {
    // Fire and forget — never await this
    fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, metadata }),
    }).catch(() => {
        // Silently ignore all errors — analytics must not affect UX
    });
}
