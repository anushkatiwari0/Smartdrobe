
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useCloset } from '@/hooks/use-closet-store';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import { Trash2, Package, Pencil, Check } from 'lucide-react';

export default function UserOutfitsView() {
  const { userOutfits, removeUserOutfit, renameUserOutfit, itemsMap } = useCloset();
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

  const handleRemoveOutfit = (outfitId: string, outfitName: string) => {
    removeUserOutfit(outfitId);
    toast({ title: 'Combination Removed', description: `"${outfitName}" has been removed.` });
  };

  if (userOutfits.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">You haven't created any combinations yet.</p>
        <p className="text-sm text-muted-foreground">
          Go to the "My Items" tab and use the "Create Combination" button to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {userOutfits.map((outfit, index) => {
        const items = outfit.itemIds.map(id => itemsMap.get(id)).filter(Boolean);
        const isRenaming = renamingId === outfit.id;

        return (
          <Card key={outfit.id} className="flex flex-col data-[animate=true]:animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="pb-2">
              {/* Inline rename in card header */}
              {isRenaming ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={renameInputRef}
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    onBlur={() => commitRename(outfit.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitRename(outfit.id);
                      if (e.key === 'Escape') setRenamingId(null);
                    }}
                    className="flex-1 text-base font-semibold bg-muted border border-primary rounded px-2 py-0.5 outline-none font-headline"
                  />
                  <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => commitRename(outfit.id)}>
                    <Check className="h-4 w-4 text-primary" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <CardTitle className="font-headline flex-1 truncate" title={outfit.name}>{outfit.name}</CardTitle>
                  <button
                    onClick={() => startRename(outfit.id, outfit.name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary shrink-0"
                    title="Rename combination"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
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
                    <Trash2 className="mr-2 h-4 w-4" /> Remove Combination
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove "{outfit.name}". This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleRemoveOutfit(outfit.id, outfit.name)}>
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
