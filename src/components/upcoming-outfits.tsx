
'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCloset } from '@/hooks/use-closet-store';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, isToday, isSameDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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
import { Trash2, CalendarPlus, BellRing } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UpcomingOutfits() {
  const { scheduledOutfits, removeScheduledOutfit, itemsMap } = useCloset();
  const { toast } = useToast();

  const upcomingOutfits = useMemo(() => {
    const today = new Date();
    const upcoming = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      const dateKey = format(date, 'yyyy-MM-dd');
      if (scheduledOutfits[dateKey]) {
        upcoming.push({
          date,
          dateKey,
          outfit: scheduledOutfits[dateKey],
        });
      }
    }
    return upcoming;
  }, [scheduledOutfits]);

  const todaysOutfit = useMemo(() => {
    const todayKey = format(new Date(), 'yyyy-MM-dd');
    if (scheduledOutfits[todayKey]) {
      return {
        dateKey: todayKey,
        outfit: scheduledOutfits[todayKey],
      };
    }
    return null;
  }, [scheduledOutfits]);

  const otherUpcomingOutfits = useMemo(() => {
    return upcomingOutfits.filter(o => !isToday(o.date));
  }, [upcomingOutfits]);


  const handleUnassign = (dateKey: string) => {
    removeScheduledOutfit(dateKey);
    toast({
      title: 'Outfit Unassigned',
      description: `The outfit for ${format(new Date(dateKey), 'PPP')} has been removed.`,
    });
  };

  if (!todaysOutfit && otherUpcomingOutfits.length === 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No Outfits Planned</CardTitle>
          <CardDescription>You have no outfits scheduled for the upcoming week.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/calendar">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Plan Your Outfits
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {todaysOutfit && (
        <Card className="border-primary shadow-lg animate-fade-in-up">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center justify-between">
              <span>Today's Outfit</span>
              <BellRing className="h-6 w-6 text-primary" />
            </CardTitle>
            <CardDescription>{format(new Date(), 'EEEE, MMMM do')}</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <p className="font-semibold text-lg">{todaysOutfit.outfit.title}</p>
              <p className="text-muted-foreground text-sm">{todaysOutfit.outfit.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {todaysOutfit.outfit.itemIds.map(id => itemsMap.get(id)).filter(Boolean).map(item => item && (
                <div key={item.id} className="aspect-square relative h-16 w-16 rounded-md overflow-hidden border bg-background" title={item.name}>
                  <Image unoptimized src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.aiHint} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {otherUpcomingOutfits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Outfits</CardTitle>
            <CardDescription>Here's what you've got planned for the week ahead.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea>
              <div className="flex space-x-4 pb-4">
                {otherUpcomingOutfits.map(({ date, dateKey, outfit }) => {
                  const items = outfit.itemIds.map(id => itemsMap.get(id)).filter(Boolean);
                  return (
                    <div key={dateKey} className="min-w-64 space-y-2 p-3 border rounded-lg bg-background">
                      <p className="font-semibold text-sm">{format(date, 'EEEE')}</p>
                      <p className="text-xs text-muted-foreground">{outfit.title}</p>
                      <div className="flex items-center gap-2 pt-1">
                        {items.slice(0, 3).map(item => item && (
                          <div key={item.id} className="aspect-square relative h-10 w-10 rounded-md overflow-hidden border" title={item.name}>
                            <Image unoptimized src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.aiHint} />
                          </div>
                        ))}
                        {items.length > 3 && (
                          <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-md text-muted-foreground text-xs font-semibold">
                            +{items.length - 3}
                          </div>
                        )}
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-auto p-1 mt-2">
                            <Trash2 className="mr-2 h-3 w-3" /> Clear
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will unassign the outfit for {format(date, 'PPP')}.
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
                    </div>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
