
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useCloset } from '@/hooks/use-closet-store';
import { useToast } from '@/hooks/use-toast';
import { makeOffer } from '@/ai/flows/make-offer';
import type { ClosetItem } from '@/lib/types';

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Loader2, Send, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


const offerFormSchema = z.object({
  message: z.string().min(10, { message: 'Offer message must be at least 10 characters.' }),
});

export default function ExchangeMarketplace() {
  const { closetItems } = useCloset();

  const itemsForSale = useMemo(() => {
    // This feature is currently disabled, so we return an empty array.
    // To re-enable, you would filter closetItems based on a 'forSale' property.
    return [] as ClosetItem[];
  }, [closetItems]);

  const [activeItem, setActiveItem] = useState<ClosetItem | null>(null);
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const [offerResponse, setOfferResponse] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof offerFormSchema>>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: { message: '' },
  });

  const handleOpenDialog = (item: ClosetItem) => {
    setActiveItem(item);
    setOfferResponse(null);
    form.reset();
  };

  const handleOfferSubmit = async (values: z.infer<typeof offerFormSchema>) => {
    if (!activeItem) return;

    setIsSubmittingOffer(true);
    setOfferResponse(null);

    try {
      const result = await makeOffer({
        itemId: activeItem.id,
        itemName: activeItem.name,
        offerMessage: values.message,
      });
      setOfferResponse(result.confirmationMessage);
      form.reset();
    } catch (error) {
      console.error("Failed to make offer:", error);
      toast({
        variant: 'destructive',
        title: 'Offer Failed',
        description: 'Could not send your offer at this time. Please try again.',
      });
    } finally {
      setIsSubmittingOffer(false);
    }
  };


  if (itemsForSale.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">The marketplace is currently empty.</p>
        <p className="text-sm text-muted-foreground">This feature is not currently enabled.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {itemsForSale.map((item, index) => (
        <Dialog key={item.id} onOpenChange={(open) => !open && setActiveItem(null)}>
          <Card className="overflow-hidden data-[animate=true]:animate-fade-in-up transition-transform hover:-translate-y-1 shadow-sm hover:shadow-lg flex flex-col" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="p-0">
              <div className="aspect-square relative">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  unoptimized
                  data-ai-hint={item.aiHint}
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="text-lg font-headline">{item.name}</CardTitle>
              <CardDescription>{item.category}</CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <DialogTrigger asChild>
                <Button className="w-full transition-transform hover:scale-105 active:scale-95" onClick={() => handleOpenDialog(item)}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Make an Offer
                </Button>
              </DialogTrigger>
            </CardFooter>
          </Card>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Make an Offer</DialogTitle>
              <DialogDescription>
                Send a message to the seller to make your offer or ask a question.
              </DialogDescription>
            </DialogHeader>
            <div className="grid sm:grid-cols-2 gap-6 items-start">
              {/* Item Preview */}
              <div className="space-y-4">
                <div className="aspect-square relative rounded-md overflow-hidden border">
                  <Image
                    src={activeItem?.imageUrl || 'https://placehold.co/400x400.png'}
                    alt={activeItem?.name || 'Item'}
                    fill
                    className="object-cover"
                    unoptimized
                    data-ai-hint={activeItem?.aiHint}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-headline">{activeItem?.name}</h3>
                  <p className="text-sm text-muted-foreground">{activeItem?.category}</p>
                </div>
              </div>

              {/* Form or Success Message */}
              <div>
                {offerResponse ? (
                  <div className="flex flex-col items-center justify-center text-center h-full space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <AlertTitle className="text-xl font-bold font-headline">Success!</AlertTitle>
                    <AlertDescription>{offerResponse}</AlertDescription>
                    <DialogFooter className="w-full">
                      <DialogClose asChild>
                        <Button className="w-full">Close</Button>
                      </DialogClose>
                    </DialogFooter>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleOfferSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Message</FormLabel>
                            <FormControl>
                              <Textarea placeholder="e.g., Hi! I'm interested in this item. Would you accept..." {...field} className="min-h-[120px]" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isSubmittingOffer} className="w-full">
                        {isSubmittingOffer ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="mr-2 h-4 w-4" />
                        )}
                        {isSubmittingOffer ? 'Sending...' : 'Send Offer'}
                      </Button>
                    </form>
                  </Form>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
