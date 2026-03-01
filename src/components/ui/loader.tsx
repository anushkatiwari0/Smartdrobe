'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// ─────────────────────────────────────────────────────────────────────────────
// <Loader /> — inline spinner, use inside buttons or standalone
// ─────────────────────────────────────────────────────────────────────────────
interface LoaderProps {
    /** Size in px (icon width/height). Default 16 */
    size?: number;
    /** Extra class names */
    className?: string;
    /** Optional label shown next to spinner */
    label?: string;
}

export function Loader({ size = 16, className, label }: LoaderProps) {
    return (
        <span className={cn('inline-flex items-center gap-2', className)}>
            <Loader2
                style={{ width: size, height: size }}
                className="animate-spin shrink-0"
            />
            {label && <span className="text-sm">{label}</span>}
        </span>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// <PageLoader /> — full-page centered spinner, use while page data loads
// ─────────────────────────────────────────────────────────────────────────────
interface PageLoaderProps {
    label?: string;
}

export function PageLoader({ label = 'Loading...' }: PageLoaderProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-muted-foreground">
            <Loader size={32} />
            <p className="text-sm">{label}</p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// <CardSkeleton /> — shimmer placeholder for a single card
// ─────────────────────────────────────────────────────────────────────────────
export function CardSkeleton() {
    return (
        <div className="rounded-xl border bg-card p-5 space-y-3 shadow-sm">
            <Skeleton className="h-5 w-2/5 rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-9 w-1/3 rounded-md mt-2" />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// <DashboardSkeleton /> — shimmer grid matching the dashboard layout
// ─────────────────────────────────────────────────────────────────────────────
export function DashboardSkeleton() {
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 animate-pulse">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-9 w-64 rounded-md" />
                <Skeleton className="h-4 w-80 rounded-md" />
            </div>
            {/* Tips row */}
            <div className="space-y-3">
                <Skeleton className="h-6 w-40 rounded-md" />
                <div className="grid gap-6 md:grid-cols-2">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </div>
            {/* Feature cards */}
            <div className="space-y-3">
                <Skeleton className="h-6 w-40 rounded-md" />
                <div className="grid gap-6 md:grid-cols-2">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// <WardrobeGridSkeleton /> — shimmer grid for the closet page
// ─────────────────────────────────────────────────────────────────────────────
interface WardrobeGridSkeletonProps {
    count?: number;
}

export function WardrobeGridSkeleton({ count = 8 }: WardrobeGridSkeletonProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border bg-card shadow-sm space-y-2">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-2 space-y-1">
                        <Skeleton className="h-4 w-3/4 rounded-md" />
                        <Skeleton className="h-3 w-1/2 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// <OutfitSkeleton /> — shimmer for AI outfit recommendation result
// ─────────────────────────────────────────────────────────────────────────────
export function OutfitSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Occasion + weather header */}
            <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
            </div>
            {/* Item rows */}
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border p-3">
                    <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2 rounded-md" />
                        <Skeleton className="h-3 w-3/4 rounded-md" />
                        <Skeleton className="h-3 w-2/5 rounded-md" />
                    </div>
                </div>
            ))}
            {/* Reasoning */}
            <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-4/6 rounded-md" />
            </div>
        </div>
    );
}
