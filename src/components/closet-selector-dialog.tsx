
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCloset } from '@/hooks/use-closet-store';
import type { ClosetItem, UserOutfit } from '@/lib/types';
import { Button } from '@/components/ui/button';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Check, Package, Shirt } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ClosetSelectorDialogProps = {
  children: React.ReactNode;
  onSelect: (description: string, itemIds?: string[], name?: string) => void;
};

export default function ClosetSelectorDialog({ children, onSelect }: ClosetSelectorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ClosetItem[]>([]);
  const { closetItems, userOutfits, itemsMap } = useCloset();

  const handleItemSelect = (item: ClosetItem) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const handleOutfitSelect = (outfit: UserOutfit) => {
    const outfitItemIds = outfit.itemIds;
    const description = outfitItemIds.map(id => itemsMap.get(id)?.description).filter(Boolean).join(', ');
    onSelect(description, outfit.itemIds, outfit.name);
    setIsOpen(false);
    setSelectedItems([]);
  }

  const handleConfirmSelection = () => {
    const description = selectedItems.map((item) => item.description).join(', ');
    onSelect(description, selectedItems.map(i => i.id));
    setIsOpen(false);
    setSelectedItems([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select from Closet</DialogTitle>
          <DialogDescription>
            Choose individual items or a saved combination.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="items">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="items"><Shirt className="mr-2 h-4 w-4" />Items</TabsTrigger>
            <TabsTrigger value="outfits"><Package className="mr-2 h-4 w-4" />Combinations</TabsTrigger>
          </TabsList>
          <TabsContent value="items">
            <ScrollArea className="h-96">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-1">
                {closetItems.map((item) => (
                  <button
                    key={item.id}
                    className={cn(
                      'relative group aspect-square rounded-lg overflow-hidden border-2',
                      selectedItems.some((i) => i.id === item.id)
                        ? 'border-primary'
                        : 'border-transparent'
                    )}
                    onClick={() => handleItemSelect(item)}
                  >
                    <Image unoptimized
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      data-ai-hint={item.aiHint}
                    />
                    <div
                      className={cn(
                        'absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity',
                        selectedItems.some((i) => i.id === item.id)
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                      )}
                    >
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleConfirmSelection}
                disabled={selectedItems.length === 0}
              >
                Confirm Selection ({selectedItems.length})
              </Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="outfits">
            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
                {userOutfits.map((outfit) => (
                  <button key={outfit.id} onClick={() => handleOutfitSelect(outfit)} className="border rounded-lg p-3 text-left hover:bg-accent">
                    <p className="font-semibold">{outfit.name}</p>
                    <div className="flex -space-x-2 overflow-hidden mt-2">
                      {outfit.itemIds.slice(0, 4).map(id => itemsMap.get(id)).filter(Boolean).map(item => item && (
                        <Image key={item.id} src={item.imageUrl} alt={item.name} width={40} height={40} className="inline-block h-10 w-10 rounded-full ring-2 ring-background" unoptimized />
                      ))}
                      {outfit.itemIds.length > 4 && <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-xs font-medium ring-2 ring-background">+{outfit.itemIds.length - 4}</div>}
                    </div>
                  </button>
                ))}
                {userOutfits.length === 0 && (
                  <p className="text-center text-muted-foreground col-span-full py-16">No saved combinations found.</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
