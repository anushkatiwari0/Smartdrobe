
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Wand2 } from 'lucide-react';

import { generateLookbook } from '@/ai/flows/ai-lookbook-generator';
import { generateOutfitImage } from '@/ai/flows/social-styling-feed';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';
import { useCloset } from '@/hooks/use-closet-store';
import type { ClosetItem } from '@/lib/types';

const occasions = [
  'Casual Weekend',
  'Business Meeting',
  'Date Night',
  'Summer Vacation',
  'Winter Gala',
  'Job Interview',
];

const formSchema = z.object({
  occasion: z.string().min(1, { message: 'Please select an occasion.' }),
});

type OutfitSuggestion = {
  title: string;
  description: string;
  itemNames: string[];
  imageUrl?: string;
};

export default function LookbookGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [outfits, setOutfits] = useState<OutfitSuggestion[]>([]);
  const { toast } = useToast();
  const { closetItems } = useCloset();

  const closetItemsMap = useMemo(() => {
    return new Map(closetItems.map((item) => [item.name.toLowerCase(), item]));
  }, [closetItems]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutfits([]);

    if (closetItems.length < 3) {
      toast({
        variant: 'destructive',
        title: 'Your closet is a bit empty!',
        description: 'Add at least 3 items to generate a lookbook.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const lookbookResult = await generateLookbook({
        occasion: values.occasion,
        closetItems: closetItems,
      });

      if (!lookbookResult.outfits || lookbookResult.outfits.length === 0) {
        toast({
          variant: 'destructive',
          title: 'No outfits generated.',
          description: 'The AI could not generate outfits for this occasion. Please try another one or add more versatile items to your closet.',
        });
        setIsLoading(false);
        return;
      }

      setOutfits(lookbookResult.outfits);

      const imagePromises = lookbookResult.outfits.map(outfit =>
        generateOutfitImage({ outfitDescription: `A high-fashion, magazine-quality photograph of this outfit: ${outfit.description}` })
      );

      const imageResults = await Promise.all(imagePromises);

      const outfitsWithImages = lookbookResult.outfits.map((outfit, index) => ({
        ...outfit,
        imageUrl: imageResults[index]?.imageUrl,
      }));

      setOutfits(outfitsWithImages);

    } catch (error) {
      console.error('Failed to generate lookbook:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:
          'There was a problem generating the lookbook. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col sm:flex-row items-end gap-4"
            >
              <FormField
                control={form.control}
                name="occasion"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Occasion</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an occasion" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {occasions.map((occasion) => (
                          <SelectItem key={occasion} value={occasion}>
                            {occasion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto transition-transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || outfits.length > 0) &&
        <Carousel className="w-full">
          <CarouselContent>
            {(isLoading ? (Array.from({ length: 3 }) as OutfitSuggestion[]) : outfits).map((outfit, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="grid md:grid-cols-3 gap-6 p-6">
                      <div className="md:col-span-1">
                        {outfit?.imageUrl ? (
                          <div className="aspect-square relative rounded-lg overflow-hidden">
                            <Image unoptimized
                              src={outfit.imageUrl}
                              alt={outfit.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Skeleton className="aspect-square w-full rounded-lg" />
                        )}
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        {outfit ? (
                          <>
                            <h3 className="font-headline text-2xl font-bold">{outfit.title}</h3>
                            <p className="text-muted-foreground">{outfit.description}</p>
                            <div>
                              <h4 className="font-semibold mb-2">Items Used:</h4>
                              <div className="flex flex-wrap gap-2">
                                {outfit.itemNames.map(itemName => {
                                  const item = closetItemsMap.get(itemName.toLowerCase());
                                  return item ? (
                                    <div key={item.id} className="group flex items-center gap-2 bg-secondary p-2 rounded-md transition-transform hover:animate-pop-out">
                                      <div className="w-10 h-10 relative rounded overflow-hidden border">
                                        <Image unoptimized src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.aiHint} />
                                      </div>
                                      <span className="text-sm font-medium">{item.name}</span>
                                    </div>
                                  ) : null
                                })}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      }
    </div>
  );
}
