import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/health — Health check endpoint for monitoring
 * Returns system health status and connectivity checks
 */
export async function GET() {
    try {
        const checks = {
            api: 'unknown',
            database: 'unknown',
            timestamp: new Date().toISOString(),
        };

        // Check database connectivity
        try {
            const supabase = await createClient();
            const { error } = await supabase
                .from('profiles')
                .select('id')
                .limit(1);

            checks.database = error ? 'down' : 'up';
        } catch {
            checks.database = 'down';
        }

        // Check environment variables
        const requiredEnvVars = [
            'NEXT_PUBLIC_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            'GEMINI_API_KEY',
        ];

        const missingEnvVars = requiredEnvVars.filter(
            (key) => !process.env[key]
        );

        if (missingEnvVars.length > 0) {
            return NextResponse.json(
                {
                    status: 'unhealthy',
                    error: `Missing required environment variables: ${missingEnvVars.join(', ')}`,
                    checks,
                },
                { status: 503 }
            );
        }

        // Overall status
        const isHealthy = checks.database === 'up';
        checks.api = 'up';

        if (!isHealthy) {
            return NextResponse.json(
                {
                    status: 'unhealthy',
                    message: 'One or more services are down',
                    checks,
                },
                { status: 503 }
            );
        }

        return NextResponse.json({
            status: 'healthy',
            message: 'All systems operational',
            checks,
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: 'unhealthy',
                error: (error as Error).message,
                timestamp: new Date().toISOString(),
            },
            { status: 503 }
        );
    }
}
