
'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Sparkles, WandSparkles, Check, X, BrainCircuit, Pencil } from 'lucide-react';

import { generateQuickOutfit } from '@/ai/flows/quick-outfit-generator';
import type { QuickOutfitGeneratorOutput } from '@/ai/flows/quick-outfit-generator';
import { useCloset } from '@/hooks/use-closet-store';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from './ui/skeleton';
import { Loader, OutfitSkeleton } from './ui/loader';
import UpcomingOutfits from './upcoming-outfits';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { ScheduleCombinationDialog } from './schedule-combination-dialog';

const formSchema = z.object({
  occasion: z.string().min(1, { message: 'Occasion is required.' }),
  weather: z.string().min(1, { message: 'Weather is required.' }),
  mood: z.string().min(1, { message: 'Mood is required.' }),
});

export default function WhatToWear() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QuickOutfitGeneratorOutput | null>(null);
  const [acceptedOutfits, setAcceptedOutfits] = useState<Set<number>>(new Set());
  const [rejectedOutfits, setRejectedOutfits] = useState<Set<number>>(new Set());

  const { closetItems, userOutfits, itemsMap, recordAiSuggestion, acceptAiSuggestion, renameUserOutfit } = useCloset();
  const { toast } = useToast();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  const startRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setRenameValue(currentName);
    setTimeout(() => renameInputRef.current?.focus(), 50);
  };

  const commitRename = (id: string) => {
    if (renameValue.trim()) renameUserOutfit(id, renameValue.trim());
    setRenamingId(null);
  };

  const cancelRename = () => setRenamingId(null);

  const closetItemsMap = useMemo(() => {
    return new Map(closetItems.map(item => [item.name.toLowerCase(), item]));
  }, [closetItems]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      occasion: '',
      weather: '',
      mood: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setAcceptedOutfits(new Set());
    setRejectedOutfits(new Set());

    if (closetItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Your closet is empty!',
        description: 'Add some items to your closet first to get outfit suggestions.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const plan = await generateQuickOutfit({ ...values, closetItems: closetItems });
      setResult(plan);

      // Track that an AI suggestion batch was shown
      if (plan.outfits && plan.outfits.length > 0) {
        plan.outfits.forEach(outfit => {
          const outfitItemIds = outfit.items
            .map(name => closetItemsMap.get(name.toLowerCase())?.id)
            .filter(Boolean) as string[];
          if (outfitItemIds.length > 0) recordAiSuggestion(outfitItemIds);
        });
      }

      if (!plan.outfits || plan.outfits.length === 0) {
        toast({
          title: 'No outfits could be generated.',
          description: 'Try different criteria or add more items to your closet.',
        });
      }
    } catch (error) {
      console.error('Failed to generate outfit:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating your outfit. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleWearIt = (outfitIndex: number, outfit: any) => {
    const outfitItemIds = outfit.items
      .map((name: string) => closetItemsMap.get(name.toLowerCase())?.id)
      .filter(Boolean) as string[];

    acceptAiSuggestion(outfitItemIds, outfit.title);

    setAcceptedOutfits(prev => {
      const next = new Set(prev);
      next.add(outfitIndex);
      return next;
    });

    toast({
      title: "Outfit Accepted! 👗",
      description: "We've recorded this in your metrics and saved the combination.",
    });
  };

  const handleSkipIt = (outfitIndex: number) => {
    setRejectedOutfits(prev => {
      const next = new Set(prev);
      next.add(outfitIndex);
      return next;
    });
    toast({
      title: "Feedback Recorded",
      description: "We'll use this to improve future recommendations.",
    });
  }

  return (
    <>
      <UpcomingOutfits />
      <div className="grid lg:grid-cols-3 gap-8 pt-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Tell me the vibe</CardTitle>
              <CardDescription>Fill this in to get your outfit.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="occasion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occasion</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Casual brunch, work meeting" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weather"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weather</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Sunny and warm, cold and rainy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Mood</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Confident, relaxed, bold" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full transition-transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Style Me Quick
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card className="min-h-full">
            <CardHeader>
              <CardTitle className="font-headline">Your AI Outfit Suggestions</CardTitle>
              <CardDescription>Here are some AI-generated looks from your closet.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="space-y-4 py-6">
                  <div className="flex items-center gap-2 text-primary">
                    <Loader size={18} />
                    <p className="text-sm font-medium animate-pulse">Curating your perfect look...</p>
                  </div>
                  <OutfitSkeleton />
                </div>
              )}
              {!isLoading && (!result || result.outfits.length === 0) && (
                <div className="text-center text-muted-foreground py-16 px-4 border-2 border-dashed rounded-xl bg-muted/20">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <WandSparkles className="h-8 w-8 text-primary/60" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Ready for your next look?</h3>
                  <p className="text-sm max-w-sm mx-auto">
                    Tell us the occasion, weather, and your mood, and our AI will curate the perfect outfit from your closet.
                  </p>
                </div>
              )}
              {result && result.outfits.length > 0 && (
                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                  {result.outfits.map((outfit, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                      <AccordionTrigger className='font-headline text-lg'>{outfit.title}</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p className="text-muted-foreground">{outfit.description}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {outfit.items.map(itemName => {
                            const item = closetItemsMap.get(itemName.toLowerCase());
                            return item ? (
                              <div key={item.id}>
                                <div className="aspect-square relative rounded-md overflow-hidden border">
                                  <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    unoptimized={item.imageUrl.startsWith('data:')}
                                    data-ai-hint={item.aiHint}
                                  />
                                </div>
                                <p className="text-sm font-medium text-center mt-2">{item.name}</p>
                              </div>
                            ) : (
                              <div key={itemName} className="text-xs text-destructive p-2">Could not find '{itemName}' in your closet.</div>
                            )
                          })}
                        </div>

                        {outfit.reasoning && outfit.reasoning.length > 0 && (
                          <div className="mt-6 bg-muted/30 rounded-lg p-4 border border-border/50">
                            <h4 className="flex items-center text-sm font-semibold mb-3">
                              <Sparkles className="h-4 w-4 mr-2 text-primary" />
                              Suggested because:
                            </h4>
                            <ul className="space-y-2">
                              {outfit.reasoning.map((reason: string, i: number) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start">
                                  <span className="mr-2 text-primary">•</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex gap-4 mt-6 pt-4 border-t border-border/50">
                          {acceptedOutfits.has(index) ? (
                            <div className="flex items-center text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-md">
                              <Check className="h-4 w-4 mr-2" />
                              Added to Calendar & Metrics!
                            </div>
                          ) : rejectedOutfits.has(index) ? (
                            <div className="flex items-center text-sm font-semibold text-muted-foreground bg-muted/50 px-4 py-2 rounded-md">
                              <X className="h-4 w-4 mr-2" />
                              Skipped
                            </div>
                          ) : (
                            <>
                              <Button
                                onClick={() => handleWearIt(index, outfit)}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Wear It
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleSkipIt(index)}
                                className="flex-1"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Skip It
                              </Button>
                            </>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>

          {userOutfits.length > 0 && (
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="font-headline text-sm">Saved Combinations</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ScrollArea>
                  <div className="flex space-x-2 pb-2">
                    {userOutfits.map((outfit) => (
                      <div key={outfit.id} className="min-w-36 space-y-1.5 p-2 border rounded-lg bg-background">
                        {/* Inline rename row */}
                        {renamingId === outfit.id ? (
                          <input
                            ref={renameInputRef}
                            value={renameValue}
                            onChange={e => setRenameValue(e.target.value)}
                            onBlur={() => commitRename(outfit.id)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') commitRename(outfit.id);
                              if (e.key === 'Escape') cancelRename();
                            }}
                            className="w-full text-xs font-medium bg-muted border border-primary rounded px-1 py-0.5 outline-none"
                          />
                        ) : (
                          <div className="flex items-center gap-1 group">
                            <p className="font-medium text-xs truncate flex-1" title={outfit.name}>{outfit.name}</p>
                            <button
                              onClick={() => startRename(outfit.id, outfit.name)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary shrink-0"
                              title="Rename"
                            >
                              <Pencil className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          {outfit.itemIds.slice(0, 3).map(id => itemsMap.get(id)).filter(Boolean).map(item => item && (
                            <div key={item.id} className="aspect-square relative h-8 w-8 rounded overflow-hidden border shrink-0" title={item.name}>
                              <Image unoptimized src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.aiHint} />
                            </div>
                          ))}
                          {outfit.itemIds.length > 3 && (
                            <div className="h-8 w-8 flex items-center justify-center bg-muted rounded text-muted-foreground text-xs font-semibold shrink-0">
                              +{outfit.itemIds.length - 3}
                            </div>
                          )}
                        </div>
                        <ScheduleCombinationDialog outfit={outfit}>
                          <Button variant="outline" size="sm" className="w-full h-7 text-xs px-2">
                            <WandSparkles className="mr-1 h-3 w-3" />
                            Schedule
                          </Button>
                        </ScheduleCombinationDialog>
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </>
  );
}
