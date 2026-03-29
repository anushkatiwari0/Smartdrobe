import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                // Suppress auth errors for stale sessions
                // Users will be redirected to login automatically
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
            global: {
                // Add error handler to suppress console spam from auth failures
                headers: {
                    'x-client-info': 'smartdrobe-browser',
                },
            },
        }
    );
}
