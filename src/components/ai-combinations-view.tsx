
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Wand2, Save } from 'lucide-react';

import { generateLookbook } from '@/ai/flows/ai-lookbook-generator';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';
import { useCloset } from '@/hooks/use-closet-store';
import type { UserOutfit, ClosetItem } from '@/lib/types';
import { cn } from '@/lib/utils';

const occasions = [
  'Casual Weekend',
  'Business Meeting',
  'Date Night',
  'Summer Vacation',
  'Winter Gala',
  'Job Interview',
  'Work From Home',
  'City Exploration',
  'Beach Day',
  'Fitness/Gym',
  'Formal Gala',
  'Weekend Getaway',
];

const formSchema = z.object({
  occasion: z.string().min(1, { message: 'Please select an occasion.' }),
});

type OutfitSuggestion = {
  title: string;
  description: string;
  itemNames: string[];
};

export default function AiCombinationsView() {
  const [isLoading, setIsLoading] = useState(false);
  const [outfits, setOutfits] = useState<OutfitSuggestion[]>([]);
  const { toast } = useToast();
  const { closetItems, addUserOutfit, itemsMap } = useCloset();

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
        description: 'Add at least 3 items to generate combinations.',
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

    } catch (error) {
      console.error('Failed to generate lookbook:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating combinations. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSaveOutfit = (outfit: OutfitSuggestion) => {
    const itemIds = outfit.itemNames.map(name => {
      const found = Array.from(itemsMap.values()).find(item => item.name.toLowerCase() === name.toLowerCase());
      return found?.id;
    }).filter((id): id is string => !!id);

    if (itemIds.length !== outfit.itemNames.length) {
      toast({
        variant: 'destructive',
        title: 'Could not save outfit',
        description: 'Some items in this suggestion could not be found in your closet.',
      });
      return;
    }

    const newOutfit: UserOutfit = {
      id: new Date().toISOString(),
      name: outfit.title,
      itemIds: itemIds,
    };

    addUserOutfit(newOutfit);
    toast({
      title: 'Combination Saved!',
      description: `"${outfit.title}" has been added to 'My Outfits'.`,
    });
  };

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
                          <SelectValue placeholder="Select an occasion to get AI suggestions" />
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

      {(isLoading) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="aspect-square w-full col-span-2" />
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="aspect-square w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {outfits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfits.map((outfit, index) => {
            const outfitItems = outfit.itemNames.map(name =>
              Array.from(itemsMap.values()).find(item => item.name.toLowerCase() === name.toLowerCase())
            ).filter((item): item is ClosetItem => !!item);

            const mainItem = outfitItems.find(item => ['Dresses', 'Outerwear', 'Tops'].includes(item.category)) || outfitItems[0];
            const otherItems = outfitItems.filter(item => item.id !== mainItem?.id);

            return (
              <Card key={index} className="flex flex-col data-[animate=true]:animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <CardTitle className="font-headline">{outfit.title}</CardTitle>
                  <CardDescription>{outfit.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2 row-span-2">
                      {mainItem && (
                        <div className="aspect-square w-full relative rounded-md overflow-hidden bg-muted">
                          <Image unoptimized src={mainItem.imageUrl} alt={mainItem.name} fill className="object-cover" data-ai-hint={mainItem.aiHint} />
                        </div>
                      )}
                    </div>
                    {otherItems.slice(0, 2).map(item => item && (
                      <div key={item.id} className="aspect-square w-full relative rounded-md overflow-hidden bg-muted">
                        <Image unoptimized src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.aiHint} />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="secondary" onClick={() => handleSaveOutfit(outfit)}>
                    <Save className="mr-2 h-4 w-4" />
                    Save to My Outfits
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

    </div>
  );
}
