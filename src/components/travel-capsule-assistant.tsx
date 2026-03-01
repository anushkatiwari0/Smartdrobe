
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Sparkles, Luggage, Plane } from 'lucide-react';

import { generateTravelCapsule } from '@/ai/flows/travel-capsule-generator';
import type { TravelCapsuleOutput } from '@/lib/types';
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  destination: z.string().min(2, { message: 'Destination is required.' }),
  duration: z.coerce
    .number()
    .min(1, 'Trip must be at least 1 day.')
    .max(14, 'Trips longer than 14 days are not supported yet.'),
});

export default function TravelCapsuleAssistant({ 'data-animate': animate }: { 'data-animate'?: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TravelCapsuleOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { closetItems, itemsMap } = useCloset();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      duration: 3,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      if (closetItems.length < 5) {
        throw new Error(
          'Please add at least 5 items to your closet for travel planning.'
        );
      }
      const plan = await generateTravelCapsule({ ...values, closetItems: closetItems });
      setResult(plan);
      if (!plan.packingList || plan.packingList.length === 0) {
        toast({
          title: 'No packing list could be generated.',
          description:
            'Try different criteria or add more versatile items to your closet.',
        });
      }
    } catch (e: any) {
      console.error('Failed to generate travel plan:', e);
      setError(e.message);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:
          e.message || 'There was a problem generating your travel plan.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const packedItems = useMemo(() => {
    if (!result) return [];
    return result.packingList.map((id: string) => itemsMap.get(id)).filter(Boolean);
  }, [result, itemsMap]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Trip Details</CardTitle>
          <CardDescription>
            Where are you going and for how long?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid sm:grid-cols-3 gap-4"
            >
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Paris, France" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="sm:pt-8">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full transition-transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Plan My Trip
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="aspect-square w-full rounded-md" />)}
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-10 w-1/2" />
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)}
          </div>
        </div>
      )}

      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertTitle>Planning Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && result.packingList.length > 0 && (
        <div data-animate={animate} className="grid md:grid-cols-3 gap-8 data-[animate=true]:animate-fade-in-up">
          {/* Packing List */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Luggage className="h-6 w-6" /> Your Packing List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {packedItems.map(
                    (item: any) =>
                      item && (
                        <div key={item.id} className="group relative">
                          <div className="aspect-square relative rounded-md overflow-hidden border">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                              data-ai-hint={item.aiHint}
                            />
                          </div>
                          <div className={cn(
                            "absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 transition-opacity rounded-md group-hover:opacity-100"
                          )}>
                            <p className="text-white text-xs text-center p-1">{item.name}</p>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Plan */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Plane className="h-6 w-6" /> Daily Outfit Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full" defaultValue='item-0'>
                  {result.dailyPlan.map((day: any, index: number) => {
                    const dailyItems = day.itemIds.map((id: string) => itemsMap.get(id)).filter(Boolean);
                    return (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="font-semibold">
                          {day.title}
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <p className="text-muted-foreground">{day.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {dailyItems.map((item: any) => item && (
                              <div key={item.id} className="flex items-center gap-2 bg-secondary p-2 rounded-md" title={item.name}>
                                <div className="w-10 h-10 relative rounded overflow-hidden border">
                                  <Image unoptimized src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.aiHint} />
                                </div>
                                <span className="text-sm font-medium">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
