
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, Palette, Shapes, VenetianMask, Sparkles, TrendingUp, Target, AlertCircle, Award } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

import { analyzeStyleProfile } from '@/ai/flows/style-profile-analyzer';
import type { StyleProfileAnalyzerOutput } from '@/ai/flows/style-profile-analyzer';
import { useCloset } from '@/hooks/use-closet-store';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from './ui/skeleton';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

export default function StyleProfileAnalyzer() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<StyleProfileAnalyzerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast} = useToast();
  const { closetItems } = useCloset();

  // Generate cache key based on closet items
  const getCacheKey = (items: typeof closetItems) => {
    const ids = items.map(item => item.id).sort().join(',');
    return `style-analysis-${ids}`;
  };

  // Load from cache
  const loadFromCache = (items: typeof closetItems): StyleProfileAnalyzerOutput | null => {
    try {
      const cacheKey = getCacheKey(items);
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Cache expires after 24 hours
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return data;
        } else {
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (e) {
      console.error('Cache read error:', e);
    }
    return null;
  };

  // Save to cache
  const saveToCache = (items: typeof closetItems, data: StyleProfileAnalyzerOutput) => {
    try {
      const cacheKey = getCacheKey(items);
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (e) {
      console.error('Cache write error:', e);
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysis(null);
    setError(null);

    try {
        if(closetItems.length < 3) {
            throw new Error("Please add at least 3 items to your closet to get a style analysis.");
        }

      // Check cache first
      const cached = loadFromCache(closetItems);
      if (cached) {
        setAnalysis(cached);
        setIsLoading(false);
        return;
      }

      const payload = closetItems.map((item) => ({
        id: item.id,
        name: item.name ?? '',
        category: item.category ?? '',
        description: item.description ?? '',
        imageUrl: item.imageUrl ?? '',
        aiHint: item.aiHint ?? '',
      }));
      const result = await analyzeStyleProfile({ closetItems: payload });
      setAnalysis(result);
      saveToCache(closetItems, result);
    } catch (e: any) {
      console.error('Failed to analyze style profile:', e);
      setError(e.message || 'An unexpected error occurred.');
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: e.message || 'There was a problem analyzing your style. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (closetItems.length >= 3) {
        handleAnalyze();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closetItems]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="lg:col-span-1 h-48 rounded-lg" />
            <Skeleton className="lg:col-span-1 h-48 rounded-lg" />
            <Skeleton className="lg:col-span-1 h-48 rounded-lg" />
            <Skeleton className="md:col-span-2 lg:col-span-3 h-64 rounded-lg" />
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Analysis Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
           <Button onClick={handleAnalyze} className="mt-4">
            Try Again
          </Button>
        </Alert>
      );
    }

    if (!analysis) {
       return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Your Style DNA is ready to be discovered.</p>
          <p className="text-sm text-muted-foreground mb-4">You need at least 3 items in your closet for an analysis.</p>
          <Button onClick={handleAnalyze} className="mt-4" disabled={closetItems.length < 3}>
            {closetItems.length < 3 ? `Add ${3 - closetItems.length} more items` : 'Analyze My Style'}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-sm hover:shadow-md transition-all duration-300 animate-slide-in-from-left" style={{ animationDelay: '0ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dominant Style</CardTitle>
              <VenetianMask className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline text-primary">{analysis.dominantStyle}</div>
              <p className="text-xs text-muted-foreground">Your primary fashion aesthetic</p>
            </CardContent>
          </Card>
           <Card className="shadow-sm hover:shadow-md transition-all duration-300 animate-slide-in-from-left" style={{ animationDelay: '100ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Core Color Palette</CardTitle>
              <Palette className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                {analysis.colorPalette.map(color => (
                    <div key={color} className="flex items-center gap-2">
                       <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: color.toLowerCase() }} />
                       <span className="text-sm font-medium text-muted-foreground">{color}</span>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-all duration-300 animate-slide-in-from-left" style={{ animationDelay: '200ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Category Breakdown</CardTitle>
               <Shapes className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={analysis.categoryDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={45}
                            innerRadius={30}
                            paddingAngle={5}
                            dataKey="count"
                            nameKey="name"
                            cornerRadius={8}
                        >
                            {analysis.categoryDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip
                          cursor={{fill: 'hsl(var(--accent))', opacity: 0.5}}
                          contentStyle={{
                            background: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        />
                    </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wardrobe Metrics Section */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Wardrobe Insights
            </CardTitle>
            <CardDescription>Key metrics about your style and wardrobe versatility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Versatility Score</span>
                </div>
                <Badge variant={analysis.versatilityScore >= 70 ? 'default' : 'secondary'}>
                  {analysis.versatilityScore}%
                </Badge>
              </div>
              <Progress value={analysis.versatilityScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {analysis.versatilityScore >= 80 ? 'Excellent! Your items mix and match beautifully' :
                 analysis.versatilityScore >= 60 ? 'Good versatility - room for more combinations' :
                 'Consider adding basics that work with multiple pieces'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Color Diversity</span>
                </div>
                <Badge variant={analysis.colorDiversity >= 60 ? 'default' : 'secondary'}>
                  {analysis.colorDiversity}%
                </Badge>
              </div>
              <Progress value={analysis.colorDiversity} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {analysis.colorDiversity >= 70 ? 'Great color variety! Your palette is well-balanced' :
                 analysis.colorDiversity >= 50 ? 'Decent variety - try adding pops of color' :
                 'Your wardrobe is quite monochrome - experiment with colors!'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Style Confidence</span>
                </div>
                <Badge variant={analysis.styleConfidence >= 75 ? 'default' : 'secondary'}>
                  {analysis.styleConfidence}%
                </Badge>
              </div>
              <Progress value={analysis.styleConfidence} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {analysis.styleConfidence >= 80 ? 'Strong style identity! Your wardrobe tells a clear story' :
                 analysis.styleConfidence >= 60 ? 'Emerging style - keep refining your aesthetic' :
                 'Still exploring - add pieces that reflect your unique style'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Wardrobe Gaps */}
        {analysis.wardrobeGaps && analysis.wardrobeGaps.length > 0 && (
          <Card className="shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up border-l-4 border-l-yellow-500" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Missing Essentials
              </CardTitle>
              <CardDescription>Complete your wardrobe with these key additions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.wardrobeGaps.map((gap, index) => (
                  <li key={index} className="flex items-start gap-2 animate-fade-in-up" style={{ animationDelay: `${350 + index * 50}ms` }}>
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span className="text-sm text-muted-foreground">{gap}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-sm hover:shadow-md transition-all duration-300 animate-slide-in-from-left" style={{ animationDelay: '400ms' }}>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Your Style Summary</CardTitle>
                    <CardDescription>An AI-powered look into your wardrobe's story.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-base leading-relaxed">{analysis.styleDescription}</p>
                </CardContent>
            </Card>
             <Card className="shadow-sm hover:shadow-md transition-all duration-300 animate-slide-in-from-right" style={{ animationDelay: '400ms' }}>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Key Pieces for Your Style
                    </CardTitle>
                    <CardDescription>Elevate your look with these AI suggestions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-base text-muted-foreground list-disc pl-5">
                        {analysis.keyPieces.map((piece, index) => (
                            <li key={index} className="animate-fade-in-up" style={{ animationDelay: `${450 + index * 100}ms` }}>{piece}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    );
  };

  return <div>{renderContent()}</div>;
}
