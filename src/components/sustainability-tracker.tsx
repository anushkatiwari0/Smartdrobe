
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Leaf } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from 'recharts';

import { calculateCarbonFootprint } from '@/ai/flows/carbon-footprint-calculator';
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
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

const formSchema = z.object({
  category: z.string().min(1, { message: 'Category is required.' }),
  material: z.string().min(1, { message: 'Material is required.' }),
  origin: z.string().min(1, { message: 'Origin is required.' }),
});

type FootprintResult = {
  carbonScore: number;
  explanation: string;
  suggestion: string;
  ecoGrade: string;
};

const materials = ['Cotton', 'Polyester', 'Wool', 'Silk', 'Linen', 'Rayon', 'Leather'];
const categories = ['T-Shirt', 'Jeans', 'Jacket', 'Dress', 'Sweater', 'Shoes'];

const footprintByMaterialData = [
  { material: 'Cotton', co2eq: 20, fill: 'hsl(var(--chart-1))' },
  { material: 'Leather', co2eq: 110, fill: 'hsl(var(--chart-3))' },
  { material: 'Wool', co2eq: 60, fill: 'hsl(var(--chart-4))' },
  { material: 'Silk', co2eq: 80, fill: 'hsl(var(--chart-5))' },
];

const footprintDistributionData = [
  { category: 'Tops', value: 27, fill: 'hsl(var(--chart-1))' },
  { category: 'Bottoms', value: 20, fill: 'hsl(var(--chart-2))' },
  { category: 'Dresses', value: 13, fill: 'hsl(var(--chart-3))' },
  { category: 'Outerwear', value: 33, fill: 'hsl(var(--chart-4))' },
  { category: 'Shoes', value: 7, fill: 'hsl(var(--chart-5))' },
];

const chartConfig = {
  co2eq: {
    label: 'CO₂eq (kg)',
    color: 'hsl(var(--chart-1))',
  },
  value: {
    label: 'Distribution',
  },
  Cotton: {
    label: 'Cotton',
    color: 'hsl(var(--chart-1))',
  },
  Leather: {
    label: 'Leather',
    color: 'hsl(var(--chart-3))',
  },
  Wool: {
    label: 'Wool',
    color: 'hsl(var(--chart-4))',
  },
  Silk: {
    label: 'Silk',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;


export default function SustainabilityDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FootprintResult | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      material: '',
      origin: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    try {
      const plan = await calculateCarbonFootprint(values);
      setResult(plan);
    } catch (error) {
      console.error('Failed to calculate footprint:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:
          'There was a problem calculating the carbon footprint. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1 shadow-lg border-border/60">
          <CardHeader className="bg-secondary/30 rounded-t-lg">
            <CardTitle className="font-headline text-2xl text-primary">Analyze Item Report</CardTitle>
            <CardDescription className="text-muted-foreground/80">Get an instant AI sustainability score for any clothing item.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                          <SelectTrigger className="bg-background border-input focus:ring-primary/20">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
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
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Main Material</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                          <SelectTrigger className="bg-background border-input focus:ring-primary/20">
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {materials.map((mat) => (
                            <SelectItem key={mat} value={mat}>
                              {mat}
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
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Manufactured In</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Vietnam, Italy" {...field} className="bg-background border-input focus:ring-primary/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold shadow-md transition-all hover:scale-[1.02]">
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Leaf className="mr-2 h-5 w-5" />}
                  Calculate Impact
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 flex flex-col shadow-lg border-border/60">
          <CardHeader className="border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="font-headline text-2xl text-foreground">Carbon Impact Analysis</CardTitle>
              <div className="bg-secondary/50 text-foreground px-3 py-1 rounded-full text-sm font-semibold">AI Powered</div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center p-8">
            {isLoading && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-lg font-medium text-muted-foreground animate-pulse">Analyzing item metadata...</p>
              </div>
            )}
            {!isLoading && !result && (
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Ready to Analyze</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Fill out the details on the left to see the estimated environmental footprint of your garment.
                </p>
              </div>
            )}
            {result && (
              <div className="w-full max-w-2xl space-y-8 animate-fade-in-up">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center space-y-2 p-6 bg-secondary/20 rounded-xl border border-secondary/40">
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Estimated Footprint</p>
                    <div className="text-6xl font-bold font-headline text-foreground flex items-baseline justify-center gap-2">
                      {result.carbonScore}
                      <span className="text-2xl font-body font-medium text-muted-foreground">kg CO₂</span>
                    </div>
                    <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold text-white ${result.ecoGrade.startsWith('A') ? 'bg-green-500' :
                      result.ecoGrade.startsWith('B') ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                      Grade {result.ecoGrade}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-lg text-foreground mb-1">Analysis Verdict</h4>
                      <p className="text-muted-foreground leading-relaxed">{result.explanation}</p>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="h-4 w-4 text-primary" />
                        <h5 className="font-bold text-primary text-sm uppercase">Eco-Tip</h5>
                      </div>
                      <p className="text-sm font-medium text-foreground">{result.suggestion}</p>
                    </div>
                  </div>
                </div>

                {/* Visual Progress Bar Context */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase">
                    <span>Low Impact</span>
                    <span>Moderate</span>
                    <span>High Impact</span>
                  </div>
                  <div className="h-4 w-full bg-muted rounded-full overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 w-1/3 bg-green-400/30"></div>
                    <div className="absolute inset-y-0 left-1/3 w-1/3 bg-yellow-400/30"></div>
                    <div className="absolute inset-y-0 right-0 w-1/3 bg-red-400/30"></div>
                    <div
                      className="absolute top-0 bottom-0 w-2 bg-primary shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all duration-1000 ease-out"
                      style={{ left: `${Math.min(Math.max((result.carbonScore / 50) * 100, 0), 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Footprint by Material</CardTitle>
            <CardDescription>Estimated CO₂eq (kg) per item type based on average production data.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[250px]">
              <BarChart data={footprintByMaterialData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="material" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="co2eq" radius={8}>
                  {footprintByMaterialData.map((entry) => (
                    <Cell key={entry.material} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Wardrobe Footprint Distribution</CardTitle>
            <CardDescription>A simulated breakdown of your closet's impact by category.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={chartConfig} className="w-full h-[200px]">
              <PieChart>
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={footprintDistributionData} dataKey="value" nameKey="category" innerRadius={50} outerRadius={80} strokeWidth={2}>
                  {footprintDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
