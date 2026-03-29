/**
 * Zod validation schemas for API routes
 * Provides type-safe input validation and sanitization
 */

import { z } from 'zod';

// ✅ Wardrobe item validation
export const WardrobeItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').trim(),
  category: z.string().min(1, 'Category is required').max(50, 'Category too long'),
  description: z.string().max(500, 'Description too long').optional().default(''),
  imageUrl: z.string().url('Invalid image URL'),
  aiHint: z.string().max(200, 'AI hint too long').optional().default(''),
  color: z.string().max(30, 'Color name too long').optional().default(''),
  colors: z.array(z.string()).max(10, 'Too many colors').optional().default([]),
});

export const WardrobeItemUpdateSchema = z.object({
  wearCount: z.number().int().min(0).optional(),
  lastWorn: z.string().optional(),
  aiSuggestionCount: z.number().int().min(0).optional(),
  name: z.string().min(1).max(100).trim().optional(),
  category: z.string().min(1).max(50).optional(),
  color: z.string().max(30).optional(),
  isFavorite: z.boolean().optional(),
});

// ✅ Recommendation request validation
export const RecommendationSchema = z.object({
  occasion: z.string().min(1, 'Occasion is required').max(100),
  city: z.string().max(100).optional(),
});

// ✅ Event logging validation
const VALID_EVENTS = [
  'user_login',
  'item_uploaded',
  'outfit_generated',
  'outfit_saved',
  'profile_updated',
  'page_view',
] as const;

export const EventSchema = z.object({
  event: z.enum(VALID_EVENTS, {
    errorMap: () => ({ message: 'Invalid event name' })
  }),
  metadata: z.record(z.unknown()).optional().default({}),
});

// ✅ User preferences validation
export const UserPreferencesSchema = z.object({
  display_name: z.string().min(1).max(100).trim().optional(),
  location_city: z.string().min(1).max(100).trim().optional(),
  style_keywords: z.array(z.string()).max(20).optional(),
  favorite_colors: z.array(z.string()).max(10).optional(),
  occasions: z.array(z.string()).max(15).optional(),
});

// ✅ Helper function for validation with error formatting
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}
