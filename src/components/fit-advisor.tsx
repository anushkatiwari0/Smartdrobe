'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Sparkles, Check, X, ShoppingCart } from 'lucide-react';

import { getFitAdvice } from '@/ai/flows/fit-advisor';
import type { FitAdvisorOutput } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const formSchema = z.object({
  height: z.string().min(1, { message: 'Height is required.' }),
  weight: z.string().min(1, { message: 'Weight is required.' }),
  gender: z.string().min(1, { message: 'Please select a gender.' }),
  bodyShape: z.string().min(1, { message: 'Please select a body shape.' }),
  fitPreference: z.string().min(1, { message: 'Please select a fit preference.' }),
});

const genders = ['Female', 'Male', 'Other'];
const bodyShapes = ['Rectangle', 'Triangle (Pear)', 'Inverted Triangle (Apple)', 'Hourglass', 'Round'];
const fitPreferences = ['Loose', 'Comfortable', 'Tailored', 'Tight'];

export default function FitAdvisor() {
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<FitAdvisorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: '',
      weight: '',
      gender: 'Female',
      bodyShape: '',
      fitPreference: 'Comfortable',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAdvice(null);

    try {
      const result = await getFitAdvice(values);
      setAdvice(result);
    } catch (error) {
      console.error('Failed to get fit advice:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem getting your fit advice. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Your Details</CardTitle>
            <CardDescription>
              This information helps our AI provide tailored advice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 5' 8'' or 173 cm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 150 lbs or 68 kg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genders.map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bodyShape"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Shape</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your body shape" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bodyShapes.map((shape) => (
                            <SelectItem key={shape} value={shape}>
                              {shape}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fitPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comfort & Fit Preference</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your preference" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fitPreferences.map((fit) => (
                            <SelectItem key={fit} value={fit}>
                              {fit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full transition-transform hover:scale-105 active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Get My Fit Advice
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="min-h-full">
          <CardHeader>
            <CardTitle className="font-headline">AI Fit & Style Advisor</CardTitle>
            <CardDescription>
              Personalized recommendations based on your profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            )}
            {!isLoading && !advice && (
              <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg">
                <p>Your personalized fit advice will appear here.</p>
              </div>
            )}
            {advice && (
              <div className="space-y-6 animate-fade-in-up">
                <div>
                  <h3 className="font-semibold font-headline text-lg flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Check /> Fashion Do's
                  </h3>
                  <ul className="mt-2 list-disc list-inside space-y-2 text-muted-foreground">
                    {advice.dos.map((item: string, index: number) => <li key={`do-${index}`}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold font-headline text-lg flex items-center gap-2 text-red-600 dark:text-red-400">
                    <X /> Fashion Don'ts
                  </h3>
                  <ul className="mt-2 list-disc list-inside space-y-2 text-muted-foreground">
                    {advice.donts.map((item: string, index: number) => <li key={`dont-${index}`}>{item}</li>)}
                  </ul>
                </div>

                {advice.shoppingSuggestions && advice.shoppingSuggestions.length > 0 && (
                  <Alert>
                    <ShoppingCart className="h-4 w-4" />
                    <AlertTitle className="font-headline">Shopping Suggestions</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-5 space-y-2 mt-2">
                        {advice.shoppingSuggestions.map((item: any, index: number) => (
                          <li key={`suggestion-${index}`}>
                            <span className="font-semibold">{item.itemName}:</span> {item.reason}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
