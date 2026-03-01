/**
 * Validates required environment variables at startup.
 * Call this in next.config.ts to fail fast if keys are missing.
 */

const REQUIRED_ENV_VARS = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'GEMINI_API_KEY',
] as const;

const OPTIONAL_ENV_VARS = [
    { key: 'SUPABASE_SERVICE_ROLE_KEY', reason: 'needed for server-side DB operations' },
    { key: 'CLOUDINARY_CLOUD_NAME', reason: 'needed for image uploads' },
    { key: 'CLOUDINARY_API_KEY', reason: 'needed for image uploads' },
    { key: 'CLOUDINARY_API_SECRET', reason: 'needed for image uploads' },
    { key: 'NEXT_PUBLIC_OPENWEATHER_API_KEY', reason: 'needed for weather-aware recommendations' },
] as const;

export function validateEnv() {
    const missing: string[] = [];

    for (const key of REQUIRED_ENV_VARS) {
        if (!process.env[key]) {
            missing.push(key);
        }
    }

    for (const { key, reason } of OPTIONAL_ENV_VARS) {
        if (!process.env[key]) {
            console.warn(`⚠️  [SmartDrobe] Optional env var ${key} is not set (${reason})`);
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `❌ Missing required environment variables:\n${missing.map(k => `  - ${k}`).join('\n')}\n\nPlease add them to your .env.local file.`
        );
    }

    if (process.env.NODE_ENV === 'development') {
        console.info('✅ [SmartDrobe] All required environment variables are set.');
    }
}

/**
 * Returns true if Supabase is fully configured (URL + anon key present).
 */
export function isSupabaseConfigured(): boolean {
    return Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT_REF')
    );
}

/**
 * Returns true if Cloudinary is configured.
 */
export function isCloudinaryConfigured(): boolean {
    return Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name'
    );
}

/**
 * Returns true if OpenWeatherMap is configured.
 */
export function isWeatherConfigured(): boolean {
    return Boolean(
        process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY &&
        process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY !== 'your-openweathermap-api-key'
    );
}
