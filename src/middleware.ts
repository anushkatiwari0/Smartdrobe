import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES = [
    '/dashboard',
    '/closet',
    '/what-to-wear',
    '/style-coach',
    '/style-dna',
    '/lookbook',
    '/moodboard',
    '/travel-planner',
    '/calendar',
    '/fit-advisor',
    '/feed',
    '/exchange',
    '/shopping',
    '/sustainability',
    '/about',
    '/profile',
];

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session with error handling for stale tokens
    let user = null;
    try {
        const { data, error } = await supabase.auth.getUser();

        // If there's an auth error, clear the stale session cookies
        if (error) {
            console.warn('[Middleware] Auth error, clearing stale session:', error.message);
            supabaseResponse.cookies.delete('sb-waoimuehhsakrgjyixrq-auth-token');
            supabaseResponse.cookies.delete('sb-waoimuehhsakrgjyixrq-auth-token.0');
            supabaseResponse.cookies.delete('sb-waoimuehhsakrgjyixrq-auth-token.1');
        } else {
            user = data.user;
        }
    } catch (err) {
        // Handle network/fetch errors gracefully
        console.error('[Middleware] Failed to fetch user session:', err);
        // Clear potentially corrupted session cookies
        supabaseResponse.cookies.delete('sb-waoimuehhsakrgjyixrq-auth-token');
        supabaseResponse.cookies.delete('sb-waoimuehhsakrgjyixrq-auth-token.0');
        supabaseResponse.cookies.delete('sb-waoimuehhsakrgjyixrq-auth-token.1');
    }

    const pathname = request.nextUrl.pathname;
    const isProtected = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    if (!user && isProtected) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect logged-in users away from auth pages
    if (
        user &&
        (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup'))
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
