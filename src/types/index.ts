/**
 * Global TypeScript type definitions for SmartDrobe.
 * Import from '@/types' anywhere in the app.
 */

// ─── Wardrobe ────────────────────────────────────────────────────────────────

export interface WardrobeItem {
    id: string;
    name: string;
    category: string;
    description?: string;
    imageUrl: string;
    aiHint?: string;
    color?: string;
    colors?: string[];
    wearCount?: number;
    lastWorn?: string | null;
    aiSuggestionCount?: number;
    isFavorite?: boolean;
    createdAt?: string;
}

export type WardrobeCategory =
    | 'Tops'
    | 'Bottoms'
    | 'Dresses'
    | 'Outerwear'
    | 'Shoes'
    | 'Accessories'
    | 'Bags'
    | 'Jewelry'
    | 'Other';

// ─── User / Profile ──────────────────────────────────────────────────────────

export interface UserProfile {
    id: string;
    display_name?: string;
    location_city?: string;
    onboarding_completed?: boolean;
    created_at?: string;
}

export interface UserPreferences {
    style_keywords?: string[];
    fav_colors?: string[];
    avoid_colors?: string[];
    occasions?: string[];
    gender_style?: string;
}

// ─── Outfit ──────────────────────────────────────────────────────────────────

export interface OutfitItem {
    id: string;
    name: string;
    itemIds: string[];
    createdAt?: string;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export type AnalyticsEvent =
    | 'user_login'
    | 'item_uploaded'
    | 'outfit_generated'
    | 'outfit_saved'
    | 'profile_updated'
    | 'page_view';

export interface EventPayload {
    event: AnalyticsEvent;
    metadata?: Record<string, unknown>;
}

// ─── API responses ────────────────────────────────────────────────────────────

export interface ApiError {
    error: string;
}

export interface ApiSuccess<T = unknown> {
    data?: T;
    message?: string;
}
