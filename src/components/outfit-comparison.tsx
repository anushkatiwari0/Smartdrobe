
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Sparkles, Camera, UploadCloud, Shirt, Trash2, Trophy, Medal, Scale, Lightbulb, Redo, Save, HelpCircle } from 'lucide-react';

import { compareOutfits } from '@/ai/flows/outfit-comparison';
import { explainVerdict } from '@/ai/flows/explain-verdict';
import type { OutfitComparisonInput, OutfitComparisonOutput, UserOutfit } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import ClosetSelectorDialog from './closet-selector-dialog';
import { Input } from './ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { useCloset } from '@/hooks/use-closet-store';

type OutfitState = {
  description?: string;
  dataUri?: string;
  itemIds?: string[];
  name?: string;
};

const comparisonFormSchema = z.object({
  occasion: z.string().min(2, { message: "Please specify an occasion for context." })
})

function OutfitInputSlot({
  title,
  outfit,
  onImageChange,
  onDescriptionSelect,
  onClear,
}: {
  title: string;
  outfit: OutfitState;
  onImageChange: (dataUri: string) => void;
  onDescriptionSelect: (description: string, itemIds?: string[], name?: string) => void;
  onClear: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => onImageChange(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    onClear();
    setIsCameraOn(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOn(false);
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        onImageChange(canvas.toDataURL('image/jpeg'));
      }
      stopCamera();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-3 p-3 bg-secondary/20 rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="font-headline font-semibold">{title}</h3>
        {(outfit.dataUri || outfit.description) && !isCameraOn && (
          <Button onClick={onClear} variant="ghost" size="sm" className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
        )}
      </div>

      <div className="flex gap-4 items-start">
        <div className="w-32 h-32 shrink-0 relative bg-muted rounded-md overflow-hidden border-2 border-dashed flex items-center justify-center">
          {outfit.dataUri ? (
            <Image unoptimized src={outfit.dataUri} alt={title} fill className="object-cover" />
          ) : isCameraOn ? (
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          ) : outfit.description ? (
            <Shirt className="h-8 w-8 text-primary shadow-sm" />
          ) : (
            <div className="text-center text-muted-foreground p-2">
              <Shirt className="h-6 w-6 mx-auto mb-1 opacity-50" />
              <p className="text-[10px] font-medium leading-tight">No Outfit</p>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex-1 space-y-2">
          {outfit.description && !outfit.dataUri && (
            <p className="text-sm text-muted-foreground italic line-clamp-3">&quot;{outfit.name || outfit.description}&quot;</p>
          )}

          {isCameraOn ? (
            <div className="flex flex-col gap-2">
              <Button onClick={takePicture} size="sm" className="w-full h-8"><Camera className="mr-2 h-3 w-3" />Snap</Button>
              <Button onClick={stopCamera} variant="outline" size="sm" className="w-full h-8">Cancel</Button>
            </div>
          ) : !outfit.dataUri && !outfit.description ? (
            <div className="flex flex-col gap-2">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg" onChange={handleImageUpload} />
              <Button onClick={() => fileInputRef.current?.click()} size="sm" variant="outline" className="w-full h-8 justify-start"><UploadCloud className="mr-2 h-3 w-3" />Upload</Button>
              <Button onClick={startCamera} size="sm" variant="outline" className="w-full h-8 justify-start"><Camera className="mr-2 h-3 w-3" />Camera</Button>
              <ClosetSelectorDialog onSelect={onDescriptionSelect}>
                <Button size="sm" variant="outline" className="w-full h-8 justify-start"><Shirt className="mr-2 h-3 w-3" />Closet</Button>
              </ClosetSelectorDialog>
            </div>
          ) : (
            <div className="flex items-center h-full text-sm text-muted-foreground/50 italic py-2">
              Ready to compare
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OutfitComparison() {
  const [isLoading, setIsLoading] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [result, setResult] = useState<OutfitComparisonOutput | null>(null);
  const [outfitA, setOutfitA] = useState<OutfitState>({});
  const [outfitB, setOutfitB] = useState<OutfitState>({});
  const { toast } = useToast();
  const { addUserOutfit } = useCloset();

  const form = useForm<z.infer<typeof comparisonFormSchema>>({
    resolver: zodResolver(comparisonFormSchema),
    defaultValues: {
      occasion: 'Casual Brunch',
    },
  });

  const handleCompare = async (values: z.infer<typeof comparisonFormSchema>) => {
    if ((!outfitA.dataUri && !outfitA.description) || (!outfitB.dataUri && !outfitB.description)) {
      toast({
        variant: 'destructive',
        title: 'Missing Outfits',
        description: 'Please provide two outfits to compare.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    const input: OutfitComparisonInput = {
      occasion: values.occasion,
      outfitADescription: outfitA.description,
      outfitADataUri: outfitA.dataUri,
      outfitBDescription: outfitB.description,
      outfitBDataUri: outfitB.dataUri,
    };

    try {
      const comparisonResult = await compareOutfits(input);
      setResult(comparisonResult);
    } catch (error) {
      console.error('Failed to compare outfits:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem comparing the outfits. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setOutfitA({});
    setOutfitB({});
    form.reset();
  };

  const handleSaveOutfit = (outfitState: OutfitState) => {
    if (!outfitState.itemIds || outfitState.itemIds.length < 1) {
      toast({
        variant: 'destructive',
        title: 'Cannot Save Outfit',
        description: 'This outfit must be a combination of items from your closet to be saved.'
      });
      return;
    }

    const newOutfit: UserOutfit = {
      id: new Date().toISOString(),
      name: outfitState.name || `Saved Look for ${form.getValues('occasion')}`,
      itemIds: outfitState.itemIds,
    };

    addUserOutfit(newOutfit);
    toast({
      title: 'Outfit Saved!',
      description: `"${newOutfit.name}" has been added to your saved combinations.`
    });
  }

  const handleAskWhy = async () => {
    if (!result) return;
    setIsExplaining(true);
    try {
      const explanation = await explainVerdict({
        verdict: result.verdict,
        tipsA: result.outfitAAnalysis.improvementTips.join(' '),
        tipsB: result.outfitBAnalysis.improvementTips.join(' '),
      });
      toast({
        title: 'AI Explanation',
        description: explanation.explanation,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not get explanation',
        description: 'The AI could not provide an explanation at this time.',
      });
    } finally {
      setIsExplaining(false);
    }
  }


  if (result) {
    return (
      <Card className="data-[animate=true]:animate-fade-in-up">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center justify-between">
            <span>The Verdict</span>
            <Button onClick={handleReset} variant="outline" size="sm">
              <Redo className="mr-2 h-4 w-4" />
              Compare New Outfits
            </Button>
          </CardTitle>
          <CardDescription>
            For a <span className="font-semibold text-primary">{form.getValues('occasion')}</span>, here&apos;s the AI&apos;s recommendation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Trophy className="h-4 w-4" />
            <AlertTitle className="font-headline">The Winner is Outfit {result.recommendation}</AlertTitle>
            <AlertDescription className="mt-1 flex justify-between items-center">
              <span>{result.verdict}</span>
              <Button onClick={handleAskWhy} variant="link" size="sm" className="p-0 h-auto" disabled={isExplaining}>
                {isExplaining ? <Loader2 className="h-4 w-4 animate-spin" /> : <HelpCircle className="h-4 w-4" />}
                <span className="ml-1">Ask AI Why?</span>
              </Button>
            </AlertDescription>
          </Alert>
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Outfit A Card */}
            <Card className={cn("border-2 flex flex-col", result.recommendation === 'A' ? "border-primary" : "border-transparent")}>
              <CardHeader className="p-3">
                <div className="aspect-square w-full relative rounded-md overflow-hidden">
                  <Image unoptimized src={result.outfitAImageUrl!} alt="Outfit A" fill className="object-cover" />
                  {result.recommendation === 'A' && <Badge className="absolute top-2 left-2"><Medal className="mr-1 h-3 w-3" />Winner</Badge>}
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0 flex-grow">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Improvement Tips</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                        {result.outfitAAnalysis.improvementTips.map((tip, i) => <li key={i}>{tip}</li>)}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="p-3">
                <Button onClick={() => handleSaveOutfit(outfitA)} variant="secondary" className="w-full" disabled={!outfitA.itemIds || outfitA.itemIds.length < 1}>
                  <Save className="mr-2 h-4 w-4" /> Save this Look
                </Button>
              </CardFooter>
            </Card>
            {/* Outfit B Card */}
            <Card className={cn("border-2 flex flex-col", result.recommendation === 'B' ? "border-primary" : "border-transparent")}>
              <CardHeader className="p-3">
                <div className="aspect-square w-full relative rounded-md overflow-hidden">
                  <Image unoptimized src={result.outfitBImageUrl!} alt="Outfit B" fill className="object-cover" />
                  {result.recommendation === 'B' && <Badge className="absolute top-2 left-2"><Medal className="mr-1 h-3 w-3" />Winner</Badge>}
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0 flex-grow">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Improvement Tips</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                        {result.outfitBAnalysis.improvementTips.map((tip, i) => <li key={i}>{tip}</li>)}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="p-3">
                <Button onClick={() => handleSaveOutfit(outfitB)} variant="secondary" className="w-full" disabled={!outfitB.itemIds || outfitB.itemIds.length < 1}>
                  <Save className="mr-2 h-4 w-4" /> Save this Look
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <OutfitInputSlot
              title="Outfit A"
              outfit={outfitA}
              onImageChange={(dataUri) => setOutfitA({ dataUri })}
              onDescriptionSelect={(description, itemIds, name) => setOutfitA({ description, itemIds, name })}
              onClear={() => setOutfitA({})}
            />
            <OutfitInputSlot
              title="Outfit B"
              outfit={outfitB}
              onImageChange={(dataUri) => setOutfitB({ dataUri })}
              onDescriptionSelect={(description, itemIds, name) => setOutfitB({ description, itemIds, name })}
              onClear={() => setOutfitB({})}
            />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCompare)} className="mt-8 space-y-4">
              <FormField
                control={form.control}
                name="occasion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occasion for Comparison</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Casual Brunch, Work Meeting" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg" className="w-full transition-transform hover:scale-105 active:scale-95 shadow-md">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Compare Outfits
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <Skeleton className="h-64 w-full rounded-lg" />}

    </div>
  );
}
