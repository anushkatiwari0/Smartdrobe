
'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useCloset } from '@/hooks/use-closet-store';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

export default function ScheduledOutfitsView() {
  const { scheduledOutfits, removeScheduledOutfit, itemsMap } = useCloset();
  const { toast } = useToast();

  const sortedScheduledOutfits = useMemo(() => {
    return Object.entries(scheduledOutfits)
      .map(([date, outfit]) => ({ date: parseISO(date), ...outfit }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [scheduledOutfits]);

  const handleUnassign = (dateKey: string) => {
    removeScheduledOutfit(dateKey);
    toast({
      title: 'Outfit Unassigned',
      description: `The outfit for ${format(parseISO(dateKey), 'PPP')} has been removed.`,
    });
  };

  if (sortedScheduledOutfits.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">You have no scheduled outfits.</p>
        <p className="text-sm text-muted-foreground">
          Go to the Outfit Calendar to plan your looks.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedScheduledOutfits.map(({ date, ...outfit }, index) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        const items = outfit.itemIds.map(id => itemsMap.get(id)).filter(Boolean);

        return (
          <Card key={dateKey} className="flex flex-col data-[animate=true]:animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader>
              <CardTitle className="font-headline">{outfit.title}</CardTitle>
              <CardDescription>{format(date, 'PPP')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <p className="text-sm text-muted-foreground">{outfit.description}</p>
              <div className="grid grid-cols-4 gap-2">
                {items.slice(0, 4).map(item => item && (
                  <div key={item.id} className="aspect-square relative rounded-md overflow-hidden border" title={item.name}>
                    <Image unoptimized src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.aiHint} />
                  </div>
                ))}
                {items.length > 4 && (
                  <div className="aspect-square flex items-center justify-center bg-muted rounded-md text-muted-foreground text-xs font-semibold">
                    +{items.length - 4}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" /> Unassign
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will unassign the outfit for {format(date, 'PPP')}. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleUnassign(dateKey)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
