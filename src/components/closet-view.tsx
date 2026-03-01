
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { PlusCircle, Loader2, Trash2, Check, X, WandSparkles, Upload, BadgeHelp, Filter, ChevronDown, CheckSquare, Combine, Sparkles, Shirt } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ClosetItem } from '@/lib/types';
import { analyzeClosetItem, type AnalyzeClosetItemOutput } from '@/ai/flows/analyze-closet-item';
import { generateClosetItemImage } from '@/ai/flows/closet-item-generator';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { useCloset } from '@/hooks/use-closet-store';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import OnboardingDialog from './onboarding-dialog';
import { Badge } from './ui/badge';
import { uploadImage } from '@/lib/image-upload';

const clothingCategories = [
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shoes',
  'Accessories',
  'Bags',
  'Jewelry',
  'Other'
];

const mainColors = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Gray', 'Pink', 'Purple', 'Orange', 'Brown', 'Beige'];

// Maps hex color codes returned by the AI to our color dropdown names
const hexToColorName = (hex: string): string | null => {
  if (!hex || !hex.startsWith('#')) return hex; // already a name — return as-is
  const h = hex.toLowerCase();
  // Brightness-based simple classifier using RGB
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  const brightness = (r + g + b) / 3;

  // Dominant channel detection
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;

  if (brightness > 220) return 'White';
  if (brightness < 40) return 'Black';
  if (saturation < 0.15) return brightness > 140 ? 'White' : brightness > 80 ? 'Gray' : 'Black';

  // Hue estimation
  if (max === r) {
    const ratio = (g - b) / (max - min);
    if (ratio < 0.5) return g > 80 ? 'Orange' : 'Red';
    if (g > 150) return 'Yellow';
    return 'Red';
  }
  if (max === g) {
    if (r > 120 && b < 80) return 'Yellow';
    if (b > 100) return 'Green';
    return 'Green';
  }
  // max === b
  if (r > 120) return 'Pink';
  if (r > 60) return 'Purple';
  return 'Blue';
};

// Tries to map an AI-detected color (hex or name) to a mainColors entry
const matchToMainColor = (detected: string): string | null => {
  const name = hexToColorName(detected);
  if (!name) return null;
  return mainColors.find(c => c.toLowerCase() === name.toLowerCase()) ?? null;
};

const addItemFormSchema = z.object({
  name: z.string().min(3, { message: 'Item name must be at least 3 characters.' }),
  category: z.string().min(1, { message: 'Please select a category.' }),
  color: z.string().min(1, { message: 'Please select a color.' }),
  description: z.string().min(10, { message: 'Please provide a detailed description.' }),
});

const saveCombinationFormSchema = z.object({
  combinationName: z.string().min(3, { message: 'Combination name must be at least 3 characters.' }),
});

const ClosetItemCard = ({ item, isSelectionMode, isSelected, onSelect, onDelete }: {
  item: ClosetItem,
  isSelectionMode: boolean,
  isSelected: boolean,
  onSelect: (item: ClosetItem) => void,
  onDelete: (id: string, name: string) => void
}) => {
  const [imgSrc, setImgSrc] = useState(item.imageUrl);

  return (
    <Card
      className={cn(
        "overflow-hidden flex flex-col transition-all shadow-sm hover:shadow-xl group",
        "animate-slide-in-from-right"
      )}
    >
      <div
        className={cn(
          "relative",
          isSelectionMode && 'cursor-pointer',
        )}
        onClick={() => onSelect(item)}
      >
        {isSelectionMode && isSelected && (
          <div className="absolute top-2 left-2 z-20 bg-primary rounded-full p-1 shadow-lg"><Check className="h-4 w-4 text-primary-foreground" /></div>
        )}
        {isSelectionMode && (
          <div className={cn("absolute inset-0 transition-all z-10", isSelected ? 'ring-2 ring-primary ring-offset-2' : 'group-hover:ring-2 group-hover:ring-primary/50')}></div>
        )}
        <div className="aspect-square relative transition-transform duration-500 group-hover:scale-105 bg-muted">
          <Image unoptimized
            src={imgSrc || 'https://placehold.co/600x600?text=No+Image'}
            alt={item.name}
            fill
            className="object-cover"
            data-ai-hint={item.aiHint}
            onError={() => setImgSrc('https://placehold.co/600x600?text=Image+Error')}
          />
        </div>
        <div className="absolute top-2 right-2 z-20">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="h-4 w-4" /><span className="sr-only">Delete item</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. This will permanently delete the item<span className="font-semibold"> {item.name}</span> from your closet.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(item.id, item.name)}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline">{item.name}</CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0">
      </CardFooter>
    </Card>
  );
};

export default function ClosetView({ 'data-animate': animate }: { 'data-animate'?: boolean }) {
  const { closetItems, addClosetItem, removeClosetItem, addUserOutfit } = useCloset();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ClosetItem[]>([]);
  const [isSaveCombinationDialogOpen, setIsSaveCombinationDialogOpen] = useState(false);

  const [tempSelectedCategories, setTempSelectedCategories] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<{ categories: string[] }>({ categories: [] });

  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeClosetItemOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const addItemForm = useForm<z.infer<typeof addItemFormSchema>>({
    resolver: zodResolver(addItemFormSchema),
    defaultValues: { name: '', category: '', color: '', description: '' },
  });

  const saveCombinationForm = useForm<z.infer<typeof saveCombinationFormSchema>>({
    resolver: zodResolver(saveCombinationFormSchema),
    defaultValues: { combinationName: '' },
  });

  const handleApplyFilters = () => {
    setAppliedFilters({
      categories: tempSelectedCategories,
    });
  };

  const handleResetFilters = () => {
    setTempSelectedCategories([]);
    setAppliedFilters({ categories: [] });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoDataUri(e.target?.result as string);
        addItemForm.reset();
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeItem = async () => {
    if (!photoDataUri) {
      toast({ variant: 'destructive', title: 'No photo selected' });
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await analyzeClosetItem({ photoDataUri });
      setAnalysisResult(result);
      addItemForm.setValue('name', result.itemName);
      addItemForm.setValue('category', result.category);
      addItemForm.setValue('description', result.description);

      // Auto-select color: try each detected color (name or hex) until one matches the dropdown
      const detectedColors = result.detectedColors || [];
      for (const detected of detectedColors) {
        const matched = matchToMainColor(detected);
        if (matched) {
          addItemForm.setValue('color', matched);
          break;
        }
      }

      toast({ title: "Analysis Complete!", description: "The item details have been filled in for you." });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not analyze the image.' });
    } finally {
      setIsAnalyzing(false);
    }
  }

  const handleGenerateImage = async () => {
    const description = addItemForm.getValues('description');
    if (!description || description.length < 10) {
      toast({ variant: 'destructive', title: 'Description too short', description: 'Please provide a more detailed description to generate an image.' });
      return;
    }
    setIsSaving(true);
    try {
      const result = await generateClosetItemImage({ itemDescription: description });
      setPhotoDataUri(result.imageUrl);
      setFileToUpload(null); // Clear manual upload if generating
      toast({ title: "Image Generated!", description: "An image has been generated based on your description." });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Image Generation Failed', description: 'Could not generate an image from the description.' });
    } finally {
      setIsSaving(false);
    }
  };

  async function onAddItem(values: z.infer<typeof addItemFormSchema>) {
    setIsSaving(true);

    if (!photoDataUri) {
      toast({ variant: 'destructive', title: 'No image provided', description: 'Please upload or generate an image for the item.' });
      setIsSaving(false);
      return;
    }

    let finalImageUrl = photoDataUri;

    try {
      if (fileToUpload) {
        finalImageUrl = await uploadImage(fileToUpload);
      } else if (photoDataUri.startsWith('data:')) {
        // Convert base64 to blob and upload
        const res = await fetch(photoDataUri);
        const blob = await res.blob();
        const file = new File([blob], `${values.name.replace(/\s+/g, '_')}_generated.png`, { type: 'image/png' });
        finalImageUrl = await uploadImage(file);
      }
    } catch (error) {
      console.error("Upload failed", error);
      toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not save the image. Please try again.' });
      setIsSaving(false);
      return;
    }

    const newItem: ClosetItem = {
      id: new Date().toISOString() + Math.random(),
      name: values.name,
      category: values.category,
      description: values.description,
      imageUrl: finalImageUrl,
      photoDataUri: finalImageUrl, // Pass this for display, but UseClosetStore should strip it if saving
      aiHint: `${values.category} ${values.name}`.toLowerCase(),
      color: values.color.toLowerCase(),
      colors: analysisResult?.detectedColors,
      primaryColorHex: analysisResult?.dominantColorHex,
    };
    addClosetItem(newItem);
    toast({ title: 'Item Added!', description: `${values.name} is now in your closet.` });

    resetAddDialog();
    setIsAddDialogOpen(false);
    setIsSaving(false);
  }

  const resetAddDialog = () => {
    addItemForm.reset();
    setPhotoDataUri(null);
    setFileToUpload(null);
    setAnalysisResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleDeleteItem = (itemId: string, itemName: string) => {
    removeClosetItem(itemId);
    toast({
      title: 'Item Removed',
      description: `${itemName} has been removed from your closet.`,
      variant: 'destructive'
    });
  }

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedItems([]);
  };

  const handleItemSelect = (item: ClosetItem) => {
    if (!isSelectionMode) return;
    setSelectedItems(prev =>
      prev.some(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    );
  };

  const onSaveCombination = (values: z.infer<typeof saveCombinationFormSchema>) => {
    if (selectedItems.length < 2) {
      toast({ variant: 'destructive', title: 'Not enough items', description: 'Please select at least 2 items to create a combination.' });
      return;
    }

    addUserOutfit({
      id: new Date().toISOString(),
      name: values.combinationName,
      itemIds: selectedItems.map(item => item.id),
    });

    toast({ title: 'Combination Saved!', description: `The "${values.combinationName}" combination has been created.` });

    setIsSaveCombinationDialogOpen(false);
    setIsSelectionMode(false);
    setSelectedItems([]);
    saveCombinationForm.reset();
  };

  const filteredItems = useMemo(() => {
    return closetItems.filter(item => {
      const categoryMatch = appliedFilters.categories.length === 0 || appliedFilters.categories.includes(item.category);
      return categoryMatch;
    });
  }, [closetItems, appliedFilters]);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedCloset');
    if (!hasVisited) {
      setIsOnboardingOpen(true);
      localStorage.setItem('hasVisitedCloset', 'true');
    }
  }, []);


  return (
    <div className="relative">
      <OnboardingDialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen} />
      <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Category ({appliedFilters.categories.length || 'All'}) <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {clothingCategories.map(cat => (
                <DropdownMenuCheckboxItem
                  key={cat}
                  checked={tempSelectedCategories.includes(cat)}
                  onCheckedChange={(checked) => {
                    setTempSelectedCategories(prev => {
                      const newCategories = checked ? [...prev, cat] : prev.filter(c => c !== cat);
                      setAppliedFilters({ categories: newCategories });
                      return newCategories;
                    });
                  }}
                >
                  {cat}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {appliedFilters.categories.length > 0 && <Button variant="ghost" onClick={handleResetFilters} className="h-9 px-3">Reset Filters</Button>}

          <Button variant="ghost" size="icon" onClick={() => setIsOnboardingOpen(true)} className="ml-auto sm:ml-0">
            <BadgeHelp className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Help</span>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isSelectionMode ? 'default' : 'outline'}
            onClick={handleToggleSelectionMode}
            className="transition-transform hover:scale-105 active:scale-95"
          >
            {isSelectionMode ? <CheckSquare className="mr-2 h-4 w-4" /> : <Combine className="mr-2 h-4 w-4" />}
            {isSelectionMode ? `Done Selecting (${selectedItems.length})` : 'Create Combination'}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => {
            if (!isOpen) resetAddDialog();
            setIsAddDialogOpen(isOpen);
          }}>
            <DialogTrigger asChild>
              <Button className="transition-transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-headline">Add New Item</DialogTitle>
                <DialogDescription>
                  Upload a picture and our AI will help you fill in the details, or generate one from a description.
                </DialogDescription>
              </DialogHeader>
              <Form {...addItemForm}>
                <form onSubmit={addItemForm.handleSubmit(onAddItem)} className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="aspect-square relative bg-muted rounded-lg overflow-hidden border-2 border-dashed flex items-center justify-center">
                      {photoDataUri ? (
                        <Image unoptimized src={photoDataUri} alt="Your outfit" fill className="object-cover" />
                      ) : (
                        <div className="text-center text-muted-foreground p-4">
                          <Upload className="mx-auto h-12 w-12" />
                          <p className="mt-2 font-semibold">Upload a photo</p>
                          <p className="text-xs">or generate one from a description</p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/png, image/jpeg"
                      onChange={handleImageUpload}
                    />
                    <Button type="button" onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      {photoDataUri ? 'Change Photo' : 'Select Photo'}
                    </Button>
                    <Button type="button" onClick={handleAnalyzeItem} disabled={isAnalyzing || !photoDataUri} className="w-full">
                      {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
                      Analyze with AI
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <FormField control={addItemForm.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Classic White Tee" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={addItemForm.control} name="category" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                            <SelectContent>{clothingCategories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={addItemForm.control} name="color" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                            <SelectContent>{mainColors.map((color) => (<SelectItem key={color} value={color}>{color}</SelectItem>))}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="relative">
                      <FormField control={addItemForm.control} name="description" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl><Textarea placeholder="e.g., A high-quality photo of a simple, elegant white silk blouse." className="min-h-[80px]" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-1 right-1 h-8 w-8"
                        onClick={handleGenerateImage}
                        disabled={isSaving}
                      >
                        <WandSparkles className="h-4 w-4" />
                        <span className="sr-only">Generate Image</span>
                      </Button>
                    </div>
                    {analysisResult && analysisResult.detectedColors && (
                      <FormItem>
                        <FormLabel>AI Detected Colors</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.detectedColors.map(color => (
                            <Badge key={color} variant="secondary" className="capitalize">{color}</Badge>
                          ))}
                        </div>
                      </FormItem>
                    )}
                    <Button type="submit" disabled={isSaving} className="w-full">
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSaving ? 'Saving...' : 'Add to Closet'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>


      {filteredItems.length === 0 && closetItems.length > 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No clothes found with the selected filters.</p>
          <p className="text-sm text-muted-foreground">Try adjusting or clearing your filters.</p>
        </div>
      ) : closetItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 px-4 border-2 border-dashed rounded-xl bg-muted/10">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
            <Shirt className="h-10 w-10 text-primary/40" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-3 font-headline">Your virtual closet is empty</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Start digitizing your wardrobe by adding your first item. Upload a photo and let our AI handle the details.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="transition-transform hover:scale-105 active:scale-95 shadow-md">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Item
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-24">
          {isSaving && (
            <Card><CardHeader><Skeleton className="aspect-square w-full rounded-md" /></CardHeader><CardContent><Skeleton className="h-4 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" /></CardContent></Card>
          )}
          {filteredItems.map((item, index) => (
            <div key={item.id} style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'both' }}>
              <ClosetItemCard
                item={item}
                isSelectionMode={isSelectionMode}
                isSelected={selectedItems.some(i => i.id === item.id)}
                onSelect={handleItemSelect}
                onDelete={handleDeleteItem}
              />
            </div>
          ))}
        </div>
      )}

      {isSelectionMode && (
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 animate-fade-in-up">
          <div className="container mx-auto">
            <Card className="flex items-center justify-between p-4 shadow-2xl bg-background/90 backdrop-blur-sm">
              <div className="flex items-center gap-2 overflow-hidden">
                <p className="font-semibold text-lg hidden sm:block">Selected:</p>
                <div className="flex gap-2">
                  {selectedItems.slice(0, 5).map(item => (
                    <div key={item.id} className="h-12 w-12 relative rounded-md overflow-hidden border-2 border-primary">
                      <Image unoptimized src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                  ))}
                  {selectedItems.length > 5 && <div className="h-12 w-12 flex items-center justify-center bg-muted rounded-md text-sm font-semibold">+{selectedItems.length - 5}</div>}
                  {selectedItems.length === 0 && <p className="text-muted-foreground">Select items to create a combination.</p>}
                </div>
              </div>
              <Dialog open={isSaveCombinationDialogOpen} onOpenChange={setIsSaveCombinationDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={selectedItems.length < 2}>Save Combination ({selectedItems.length})</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Your Combination</DialogTitle>
                    <DialogDescription>Give this combination a name to save it to "My Outfits".</DialogDescription>
                  </DialogHeader>
                  <Form {...saveCombinationForm}>
                    <form onSubmit={saveCombinationForm.handleSubmit(onSaveCombination)} className="space-y-4">
                      <FormField control={saveCombinationForm.control} name="combinationName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Combination Name</FormLabel>
                          <FormControl><Input placeholder="e.g., Casual Friday Look" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <DialogFooter>
                        <Button type="submit">Save Combination</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
