
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, ShoppingCart, Sparkles, Shirt, ExternalLink } from 'lucide-react';

import { useCloset } from '@/hooks/use-closet-store';
import { useToast } from '@/hooks/use-toast';
import { generateShoppingSuggestions } from '@/ai/flows/shopping-assistant';
import { generateClosetItemImage } from '@/ai/flows/closet-item-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';

type Suggestion = {
  itemName: string;
  reason: string;
  imagePrompt: string;
  imageUrl?: string;
  price?: number;
  url?: string;
};

export default function ShoppingAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { closetItems } = useCloset();
  const { toast } = useToast();

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    if (closetItems.length < 3) {
      setError('Please add at least 3 items to your closet to get shopping suggestions.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateShoppingSuggestions({ closetItems: closetItems });

      if (!result.suggestions || result.suggestions.length === 0) {
        toast({
          variant: 'default',
          title: 'No suggestions generated',
          description: "Your wardrobe looks great! We couldn't find any essential gaps right now.",
        });
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setSuggestions(result.suggestions);

      const imagePromises = result.suggestions.map(suggestion =>
        generateClosetItemImage({ itemDescription: suggestion.imagePrompt })
      );

      const imageResults = await Promise.all(imagePromises);

      setSuggestions(prevSuggestions =>
        prevSuggestions.map((suggestion, index) => ({
          ...suggestion,
          imageUrl: imageResults[index]?.imageUrl,
        }))
      );

    } catch (e: any) {
      console.error('Failed to generate shopping suggestions:', e);
      setError(e.message || 'An unexpected error occurred while fetching suggestions.');
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: e.message || 'There was a problem generating suggestions. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderInitialState = () => (
    <Card className="flex flex-col items-center justify-center text-center p-8 data-[animate=true]:animate-fade-in-up h-full">
      <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold font-headline">Ready to enhance your wardrobe?</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        Click the button to let our AI find the perfect pieces to complete your collection based on your current closet.
      </p>
      {error && (
        <Alert variant="destructive" className="mt-4 max-w-md text-left">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button onClick={handleGenerateSuggestions} className="mt-6 transition-transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg" size="lg" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Generate Shopping Suggestions
      </Button>
    </Card>
  );

  const renderLoadingState = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="data-[animate=true]:animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
          <CardHeader className="p-0">
            <Skeleton className="aspect-square w-full rounded-t-lg" />
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-10 w-full rounded-md mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderSuggestions = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {suggestions.map((item, index) => (
        <Card key={index} className="flex flex-col data-[animate=true]:animate-fade-in-up transition-transform hover:-translate-y-1 hover:shadow-xl">
          <CardHeader className="p-0 relative">
            <div className="aspect-square relative rounded-t-lg overflow-hidden">
              {item.imageUrl ? (
                <Image unoptimized
                  src={item.imageUrl}
                  alt={item.itemName}
                  fill
                  className="object-cover"
                />
              ) : (
                <Skeleton className="h-full w-full" />
              )}
            </div>
            <Badge className="absolute top-2 left-2 shadow-lg" variant="secondary">SmartPick AI</Badge>
          </CardHeader>
          <CardContent className="p-4 flex-grow flex flex-col">
            <CardTitle className="font-headline text-xl">{item.itemName}</CardTitle>
            {item.price && <p className="text-lg font-semibold text-primary">₹{item.price.toFixed(2)}</p>}
            <CardDescription className="text-muted-foreground mt-2 flex-grow">{item.reason}</CardDescription>

            <div className="mt-4 space-y-2">
              {item.url && (
                <Button asChild className="w-full" variant="secondary">
                  <Link href={item.url} target="_blank" rel="noopener noreferrer">
                    View Item <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <Card className="data-[animate=true]:animate-fade-in-down">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Shirt className="h-6 w-6 text-primary" />
              Your Closet Snapshot
            </CardTitle>
            <CardDescription>
              Our AI will analyze these items to find what's missing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {closetItems.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
                {closetItems.slice(0, 8).map((item, index) => (
                  <div key={item.id} className="aspect-square relative rounded-md overflow-hidden border data-[animate=true]:animate-fade-in-up" title={item.name} style={{ animationDelay: `${index * 50}ms` }}>
                    <Image unoptimized
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      data-ai-hint={item.aiHint}
                    />
                  </div>
                ))}
                {closetItems.length > 8 && (
                  <div className="aspect-square flex items-center justify-center bg-muted rounded-md text-muted-foreground text-sm font-semibold data-[animate=true]:animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    +{closetItems.length - 8} more
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Your closet is empty. Add items to get suggestions.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        {isLoading ? renderLoadingState() : (suggestions.length > 0 ? renderSuggestions() : renderInitialState())}
      </div>
    </div>
  );
}
