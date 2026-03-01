'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Sparkles, BarChart, Palette, Upload } from 'lucide-react';

import { getStyleFeedback, type StyleCoachOutput } from '@/ai/flows/style-coach';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    occasion: z.string().min(2, { message: 'Please specify an occasion.' }),
});

export default function StyleCoach() {
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<StyleCoachOutput | null>(null);
    const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { occasion: 'Everyday wear' },
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoDataUri(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!photoDataUri) {
            toast({
                variant: 'destructive',
                title: 'No photo taken',
                description: 'Please take a photo of your outfit first.',
            });
            return;
        }

        setIsLoading(true);
        setFeedback(null);

        try {
            const result = await getStyleFeedback({ ...values, photoDataUri });
            setFeedback(result);
        } catch (error) {
            console.error('Failed to get style feedback:', error);
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'There was a problem getting your feedback. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    const reset = () => {
        setPhotoDataUri(null);
        setFeedback(null);
        form.reset({ occasion: 'Everyday wear' });
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Your Outfit</CardTitle>
                    <CardDescription>
                        {photoDataUri ? 'Here is the photo you uploaded.' : 'Upload a photo of your outfit.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            "group relative rounded-lg overflow-hidden border-2 border-dashed flex items-center justify-center transition-all duration-500 ease-in-out",
                            photoDataUri
                                ? "aspect-[4/5] bg-muted border-transparent shadow-sm"
                                : "min-h-[250px] bg-muted/30 hover:bg-muted/50 hover:border-primary/50 cursor-pointer"
                        )}
                        onClick={() => !photoDataUri && fileInputRef.current?.click()}
                    >
                        {photoDataUri && <img src={photoDataUri} alt="Your outfit" className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" />}
                        {!photoDataUri && (
                            <div className="flex flex-col items-center justify-center text-muted-foreground p-6 text-center animate-in fade-in zoom-in-95 duration-500">
                                <div className="p-4 bg-background rounded-full mb-4 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                                    <Upload className="h-8 w-8 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                                </div>
                                <h3 className="font-semibold text-lg text-foreground mb-1">Upload an Outfit</h3>
                                <p className="text-sm px-4">Click here to choose a photo from your gallery</p>
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
                    {photoDataUri && (
                        <div className="mt-4 flex flex-col sm:flex-row gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
                            <Button onClick={reset} variant="outline" className="w-full shadow-sm hover:shadow-md transition-all">
                                Upload Another
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="sticky top-4">
                <CardHeader>
                    <CardTitle className="font-headline">AI Feedback</CardTitle>
                    <CardDescription>Tell us the occasion for this outfit.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="occasion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Occasion</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Work meeting, casual brunch" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading || !photoDataUri} className="w-full transition-transform hover:scale-105 active:scale-95 shadow-md">
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="mr-2 h-4 w-4" />
                                )}
                                Get Feedback
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6">
                        {isLoading && (
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        )}
                        {!isLoading && !feedback && (
                            <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
                                <p>Your style feedback will appear here.</p>
                            </div>
                        )}
                        {feedback && (
                            <div className="space-y-6 animate-fade-in-up">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium flex items-center gap-2"><Palette className="h-4 w-4" /> Harmony Score</span>
                                            <span className="text-sm font-semibold">{feedback.harmonyScore}/100</span>
                                        </div>
                                        <Progress value={feedback.harmonyScore} />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium flex items-center gap-2"><BarChart className="h-4 w-4" /> Trend Score</span>
                                            <span className="text-sm font-semibold">{feedback.trendScore}/100</span>
                                        </div>
                                        <Progress value={feedback.trendScore} />
                                    </div>
                                </div>
                                <Alert>
                                    <Sparkles className="h-4 w-4" />
                                    <AlertTitle className="font-headline">Style Tip</AlertTitle>
                                    <AlertDescription>
                                        {feedback.feedback}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
