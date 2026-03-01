'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCloset } from '@/hooks/use-closet-store';
import { Target, TrendingUp, BarChart2, ShieldCheck, Shirt } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function AnalyticsDashboard() {
    const {
        closetItems,
        aiSuggestionsCount,
        acceptedSuggestionsCount,
        purchases
    } = useCloset();

    // Metric 1: North Star - AI Outfit Acceptance Rate
    const acceptanceRate = aiSuggestionsCount > 0
        ? Math.round((acceptedSuggestionsCount / aiSuggestionsCount) * 100)
        : 0;

    // Metric 2: Wardrobe Utilization
    const wornItemsCount = closetItems.filter(item => (item.wearCount || 0) > 0).length;
    const wardrobeUtilization = closetItems.length > 0
        ? Math.round((wornItemsCount / closetItems.length) * 100)
        : 0;

    // Metric 3: Cost Per Wear (ROI) Estimate
    const totalSpent = purchases.reduce((sum, p) => sum + p.price, 0) || 500; // Mock base if no purchases
    const totalWears = closetItems.reduce((sum, item) => sum + (item.wearCount || 0), 0);
    const costPerWear = totalWears > 0 ? (totalSpent / totalWears).toFixed(2) : '0.00';

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight font-headline flex items-center gap-2">
                        <BarChart2 className="h-6 w-6 text-primary" />
                        Product Analytics
                    </h2>
                    <p className="text-muted-foreground">Tracking AI performance and user engagement metrics.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    <ShieldCheck className="h-4 w-4" />
                    PM Dashboard View
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {/* North Star Metric Card */}
                <Card className="border-emerald-200 bg-emerald-50/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Target className="h-24 w-24 text-emerald-600" />
                    </div>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-emerald-800">
                            North Star: Acceptance Rate
                        </CardTitle>
                        <Target className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-700">{acceptanceRate}%</div>
                        <p className="text-xs text-emerald-600 mt-1">
                            {acceptedSuggestionsCount} of {aiSuggestionsCount} AI suggestions accepted
                        </p>
                        <div className="mt-4">
                            <Progress value={acceptanceRate} className="h-2 bg-emerald-200 text-emerald-600" />
                        </div>
                        <div className="mt-4 text-xs text-emerald-800/80 bg-emerald-100/50 p-2 rounded-md">
                            <strong>PM Note:</strong> High acceptance rate indicates strong recommendation model fit and low user decision fatigue.
                        </div>
                    </CardContent>
                </Card>

                {/* Utilization Card */}
                <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium">
                            Wardrobe Utilization
                        </CardTitle>
                        <Shirt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{wardrobeUtilization}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {wornItemsCount} of {closetItems.length} items worn actively
                        </p>
                        <div className="mt-4">
                            <Progress value={wardrobeUtilization} className="h-2" />
                        </div>
                        <div className="mt-4 text-xs text-muted-foreground bg-muted p-2 rounded-md">
                            <strong>Goal:</strong> Increase utilization by surfacing neglected items in AI recommendations.
                        </div>
                    </CardContent>
                </Card>

                {/* ROI Card */}
                <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium">
                            Avg. Cost Per Wear (ROI)
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">${costPerWear}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Based on {totalWears} total wardrobe wears
                        </p>
                        <div className="mt-8 text-xs text-muted-foreground bg-muted p-2 rounded-md">
                            <strong>Insight:</strong> Lowering this metric demonstrates tangible financial value to the user.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
