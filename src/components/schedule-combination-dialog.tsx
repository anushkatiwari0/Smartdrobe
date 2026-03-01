
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useCloset } from '@/hooks/use-closet-store';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import type { UserOutfit } from '@/lib/types';
import { CalendarPlus } from 'lucide-react';

type ScheduleCombinationDialogProps = {
  children: React.ReactNode;
  outfit: UserOutfit;
};

export function ScheduleCombinationDialog({ children, outfit }: ScheduleCombinationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const { scheduleOutfit } = useCloset();
  const { toast } = useToast();

  const handleSchedule = () => {
    if (!selectedDate) {
      toast({
        variant: 'destructive',
        title: 'No date selected',
        description: 'Please select a date from the calendar.',
      });
      return;
    }

    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    scheduleOutfit(dateKey, {
        title: outfit.name,
        description: `Your planned combination: ${outfit.name}`,
        itemIds: outfit.itemIds
    });

    toast({
      title: 'Outfit Scheduled!',
      description: `"${outfit.name}" has been scheduled for ${format(selectedDate, 'PPP')}.`,
    });
    
    setIsOpen(false);
    setSelectedDate(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Calendar</DialogTitle>
          <DialogDescription>
            Select a date to schedule the outfit "{outfit.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
            />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSchedule} disabled={!selectedDate}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
