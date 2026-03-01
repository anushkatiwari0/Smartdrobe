
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Loader2, Plus, Trash2, BellRing, WandSparkles, Package, Pencil } from 'lucide-react';

import { useCloset } from '@/hooks/use-closet-store';
import { generateScheduledOutfit } from '@/ai/flows/scheduled-outfit-generator';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import type { UserOutfit } from '@/lib/types';

const formSchema = z.object({
  eventDescription: z.string().min(3, { message: 'Please describe the event.' }),
});

export default function OutfitCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isClearConfirming, setIsClearConfirming] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const renameRef = useRef<HTMLInputElement>(null);

  const startRename = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    setRenamingId(id);
    setRenameValue(name);
    setTimeout(() => renameRef.current?.focus(), 50);
  };
  const commitRename = (id: string) => {
    if (renameValue.trim()) renameUserOutfit(id, renameValue.trim());
    setRenamingId(null);
  };
  const { toast } = useToast();
  const { closetItems, itemsMap, scheduledOutfits, scheduleOutfit, removeScheduledOutfit, userOutfits, renameUserOutfit } = useCloset();

  // Auto-purge past reminders on mount
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    Object.keys(scheduledOutfits).forEach(dateKey => {
      if (dateKey < today) removeScheduledOutfit(dateKey);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { eventDescription: '' },
  });

  const selectedDateKey = date ? format(date, 'yyyy-MM-dd') : '';
  const scheduledOutfit = scheduledOutfits[selectedDateKey];
  const itemsForScheduledOutfit = scheduledOutfit?.itemIds.map(id => itemsMap.get(id)).filter(Boolean) || [];

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!date) return;
    setIsLoading(true);

    try {
      const result = await generateScheduledOutfit({
        eventDescription: values.eventDescription,
        closetItems: closetItems,
      });

      const dateKey = format(date, 'yyyy-MM-dd');
      scheduleOutfit(dateKey, result.outfit);

      toast({
        title: '✨ Outfit Scheduled!',
        description: `We've planned a chic look for ${format(date, 'PPP')}.`,
        className: "bg-secondary text-secondary-foreground border-secondary shadow-md",
      });

      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Failed to schedule outfit:', error);
      toast({
        variant: 'destructive',
        title: 'Scheduling Failed',
        description: 'Could not generate an outfit. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCombination = (outfit: UserOutfit) => {
    if (!date) return;

    const dateKey = format(date, 'yyyy-MM-dd');
    scheduleOutfit(dateKey, {
      title: outfit.name,
      description: `Your planned combination: ${outfit.name}`,
      itemIds: outfit.itemIds
    });

    toast({
      title: '💖 Outfit Scheduled!',
      description: `"${outfit.name}" is set for ${format(date, 'PPP')}.`,
      className: "bg-secondary text-secondary-foreground border-secondary shadow-md",
    });

    setIsDialogOpen(false);
  }

  const handleRemoveOutfit = () => {
    if (!selectedDateKey) return;
    removeScheduledOutfit(selectedDateKey);
    setIsClearConfirming(false);
    toast({
      title: 'Reminder Cleared',
      description: `Outfit for ${format(date!, 'PPP')} has been removed.`,
    });
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  // Only mark future/today dates on the calendar
  const datesWithNotes = Object.keys(scheduledOutfits)
    .filter(d => d >= today)
    .map(dateStr => new Date(dateStr + 'T00:00:00'));

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 flex justify-center h-fit">
        <Card className="w-full max-w-lg shadow-sm border-border/60">
          <CardContent className="p-2 sm:p-4 md:p-6 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md w-full max-w-sm"
              modifiers={{ hasNote: datesWithNotes }}
              modifiersClassNames={{
                hasNote: 'border-primary text-primary-foreground bg-primary/80 rounded-full',
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              {date ? format(date, 'PPP') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scheduledOutfit ? (
              <Card className="bg-primary/10 animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline text-primary">
                    <BellRing className="h-5 w-5" />
                    Reminder
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-semibold text-lg">{scheduledOutfit.title}</p>
                  <p className="text-sm text-muted-foreground">{scheduledOutfit.description}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {itemsForScheduledOutfit.map(item =>
                      item ? (
                        <div key={item.id} className="aspect-square relative rounded-md overflow-hidden border bg-background" title={item.name}>
                          <Image unoptimized src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.aiHint} />
                        </div>
                      ) : null
                    )}
                  </div>
                  {isClearConfirming ? (
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={handleRemoveOutfit}
                      >
                        Yes, clear it
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setIsClearConfirming(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setIsClearConfirming(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Reminder
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">No outfit scheduled for this day.</p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button disabled={!date} className="transition-transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule an Outfit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Schedule an Outfit</DialogTitle>
                      <DialogDescription>
                        Schedule an outfit for {date ? format(date, 'PPP') : ''}.
                      </DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="ai-generate">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="ai-generate"><WandSparkles className="mr-2 h-4 w-4" />Generate</TabsTrigger>
                        <TabsTrigger value="use-saved"><Package className="mr-2 h-4 w-4" />Use Saved</TabsTrigger>
                      </TabsList>
                      <TabsContent value="ai-generate">
                        <p className="text-sm text-muted-foreground my-2">Describe the event and our AI will pick an outfit for you.</p>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                            <FormField
                              control={form.control}
                              name="eventDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Event Description</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Important client meeting" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <DialogFooter>
                              <Button type="submit" disabled={isLoading} className="w-full transition-transform hover:scale-105 active:scale-95">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate Outfit'}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </TabsContent>
                      <TabsContent value="use-saved">
                        <p className="text-sm text-muted-foreground my-2">Select one of your saved combinations.</p>
                        <ScrollArea className="h-64">
                          <div className="space-y-2 pr-4">
                            {userOutfits.length > 0 ? userOutfits.map(outfit => (
                              <div key={outfit.id} className="w-full border rounded-lg p-2 text-left hover:bg-accent flex items-center gap-3">
                                <div className="flex-grow min-w-0">
                                  {renamingId === outfit.id ? (
                                    <input
                                      ref={renameRef}
                                      value={renameValue}
                                      onChange={e => setRenameValue(e.target.value)}
                                      onBlur={() => commitRename(outfit.id)}
                                      onKeyDown={e => {
                                        if (e.key === 'Enter') commitRename(outfit.id);
                                        if (e.key === 'Escape') setRenamingId(null);
                                      }}
                                      onClick={e => e.stopPropagation()}
                                      className="w-full text-sm font-semibold bg-muted border border-primary rounded px-1 py-0.5 outline-none"
                                    />
                                  ) : (
                                    <div className="flex items-center gap-1 group/name">
                                      <p className="font-semibold text-sm truncate" onClick={() => handleSelectCombination(outfit)}>{outfit.name}</p>
                                      <button
                                        onClick={e => startRename(e, outfit.id, outfit.name)}
                                        className="opacity-0 group-hover/name:opacity-100 transition-opacity text-muted-foreground hover:text-primary shrink-0"
                                        title="Rename"
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <div className="flex -space-x-2 overflow-hidden shrink-0" onClick={() => handleSelectCombination(outfit)}>
                                  {outfit.itemIds.slice(0, 3).map(id => itemsMap.get(id)).filter(Boolean).map(item => item && (
                                    <Image unoptimized key={item.id} src={item.imageUrl} alt={item.name} width={32} height={32} className="inline-block h-8 w-8 rounded-full ring-2 ring-background" />
                                  ))}
                                  {outfit.itemIds.length > 3 && <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium ring-2 ring-background">+{outfit.itemIds.length - 3}</div>}
                                </div>
                              </div>
                            )) : (
                              <p className="text-center text-sm text-muted-foreground pt-16">No saved combinations found.</p>
                            )}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
