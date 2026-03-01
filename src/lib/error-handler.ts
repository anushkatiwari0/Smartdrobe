import { NextResponse } from 'next/server';

/**
 * Standardized API error handler for Route Handlers.
 * Returns consistent JSON responses, never exposes internals in production.
 */
export function apiError(errorOrMessage: unknown, status = 500): NextResponse {
    let message = 'An unexpected error occurred.';

    if (typeof errorOrMessage === 'string') {
        message = errorOrMessage;
    } else if (errorOrMessage instanceof Error) {
        message = errorOrMessage.message;
    } else if (
        typeof errorOrMessage === 'object' &&
        errorOrMessage !== null &&
        'message' in errorOrMessage
    ) {
        message = String((errorOrMessage as { message: unknown }).message);
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const safeMessage =
        isProduction && status === 500
            ? 'Something went wrong. Please try again later.'
            : message;

    console.error(`[API Error ${status}]`, message);
    return NextResponse.json({ error: safeMessage }, { status });
}

/**
 * Wraps an async route handler to auto-catch errors.
 */
export function withErrorHandling<T extends unknown[]>(
    handler: (...args: T) => Promise<NextResponse>
) {
    return async (...args: T): Promise<NextResponse> => {
        try {
            return await handler(...args);
        } catch (error) {
            return apiError(error);
        }
    };
}

/**
 * Friendly user-facing messages for common Supabase/auth errors.
 */
export function friendlyAuthError(message: string): string {
    const map: Record<string, string> = {
        'Invalid login credentials': 'Incorrect email or password. Please try again.',
        'Email not confirmed': 'Please check your email and confirm your account first.',
        'User already registered': 'An account with this email already exists. Try logging in.',
        'Password should be at least 6 characters': 'Password must be at least 6 characters.',
        'Email rate limit exceeded': 'Too many attempts. Please wait a few minutes before trying again.',
        'over_email_send_rate_limit': 'Too many emails sent. Please wait before requesting another.',
        'Auth session missing': 'Your session has expired. Please log in again.',
        'JWT expired': 'Your session has expired. Please log in again.',
    };

    for (const [key, friendly] of Object.entries(map)) {
        if (message.toLowerCase().includes(key.toLowerCase())) {
            return friendly;
        }
    }
    return message;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT-SIDE toast error helpers
// Import and call these from React components to show friendly toasts.
// ─────────────────────────────────────────────────────────────────────────────

/** Maps known error scenarios to friendly toast messages */
const CLIENT_ERROR_MAP: Record<string, { title: string; description: string }> = {
    network: {
        title: '🌐 Connection Error',
        description: 'Could not reach the server. Please check your internet connection.',
    },
    upload: {
        title: '📤 Upload Failed',
        description: 'Your image could not be uploaded. Please try a smaller file or try again.',
    },
    ai: {
        title: '🤖 AI Generation Failed',
        description: 'The AI could not generate a response right now. Please try again in a moment.',
    },
    auth: {
        title: '🔐 Session Expired',
        description: 'You have been signed out. Please log in again to continue.',
    },
    notFound: {
        title: '🔍 Not Found',
        description: 'The item you requested no longer exists.',
    },
    unknown: {
        title: '⚠️ Something Went Wrong',
        description: 'An unexpected error occurred. Please try again.',
    },
};

export type ErrorType = keyof typeof CLIENT_ERROR_MAP;

/**
 * Returns a friendly { title, description } object for a given error type.
 * Use with the shadcn/ui useToast hook:
 *
 * const { toast } = useToast();
 * const err = getToastError('upload');
 * toast({ variant: 'destructive', ...err });
 */
export function getToastError(type: ErrorType): { title: string; description: string } {
    return CLIENT_ERROR_MAP[type] ?? CLIENT_ERROR_MAP.unknown;
}

/**
 * Detects error type from a caught Error or Response object.
 * Usage:
 *   try { ... } catch(e) { const type = detectErrorType(e); toast({...getToastError(type)}) }
 */
export function detectErrorType(error: unknown): ErrorType {
    if (!navigator.onLine) return 'network';

    const msg =
        error instanceof Error
            ? error.message.toLowerCase()
            : String(error).toLowerCase();

    if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('network')) return 'network';
    if (msg.includes('upload') || msg.includes('cloudinary') || msg.includes('file')) return 'upload';
    if (msg.includes('ai') || msg.includes('genkit') || msg.includes('gemini') || msg.includes('generation')) return 'ai';
    if (msg.includes('session') || msg.includes('jwt') || msg.includes('auth') || msg.includes('unauthorized')) return 'auth';
    if (msg.includes('not found') || msg.includes('404')) return 'notFound';

    return 'unknown';
}
