/**
 * Simple in-memory rate limiting
 * For production, consider using Redis (Upstash) or Vercel Edge Config
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number;
  /**
   * Time window in seconds
   */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const key = `${identifier}`;

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    // First request or window expired - create new entry
    const resetTime = now + windowMs;
    rateLimitStore.set(key, {
      count: 1,
      resetTime,
    });

    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }

  // Window is still active
  if (entry.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Middleware helper to apply rate limiting to API routes
 */
export function rateLimit(config: RateLimitConfig) {
  return (identifier: string): RateLimitResult => {
    return checkRateLimit(identifier, config);
  };
}

// Pre-configured rate limiters for different endpoints
export const rateLimiters = {
  /**
   * Strict rate limit for expensive operations (AI, uploads)
   * 10 requests per minute
   */
  strict: rateLimit({ maxRequests: 10, windowSeconds: 60 }),

  /**
   * Moderate rate limit for regular API calls
   * 30 requests per minute
   */
  moderate: rateLimit({ maxRequests: 30, windowSeconds: 60 }),

  /**
   * Lenient rate limit for read operations
   * 100 requests per minute
   */
  lenient: rateLimit({ maxRequests: 100, windowSeconds: 60 }),

  /**
   * Analytics events (very lenient)
   * 200 requests per minute
   */
  analytics: rateLimit({ maxRequests: 200, windowSeconds: 60 }),
};
