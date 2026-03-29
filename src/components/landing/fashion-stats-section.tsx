
'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCloset } from '@/hooks/use-closet-store';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background/80 border rounded-md shadow-lg">
        <p className="font-bold">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

// Helper function to categorize items into style types
const categorizeStyle = (category: string, description?: string): 'Casual' | 'Formal' | 'Party' | 'Activewear' => {
  const lowerCategory = category.toLowerCase();
  const lowerDesc = (description || '').toLowerCase();

  // Check for activewear first
  if (lowerCategory.includes('active') || lowerDesc.includes('activewear') || lowerDesc.includes('workout') || lowerDesc.includes('gym')) {
    return 'Activewear';
  }

  // Check for formal wear
  if (lowerCategory.includes('blazer') || lowerCategory.includes('suit') ||
      lowerDesc.includes('formal') || lowerDesc.includes('professional') ||
      lowerDesc.includes('office') || lowerDesc.includes('tailored') ||
      lowerDesc.includes('business') || category === 'Outerwear' && lowerDesc.includes('blazer')) {
    return 'Formal';
  }

  // Check for party wear
  if (lowerDesc.includes('party') || lowerDesc.includes('evening') ||
      lowerDesc.includes('cocktail') || lowerDesc.includes('elegant') ||
      lowerDesc.includes('stiletto') || lowerDesc.includes('heels') ||
      (category === 'Dresses' && (lowerDesc.includes('midi') || lowerDesc.includes('bodycon')))) {
    return 'Party';
  }

  // Default to casual
  return 'Casual';
};

export default function FashionStatsSection() {
  const animate = true;
  const { closetItems, userOutfits, scheduledOutfits } = useCloset();

  // Calculate real style breakdown from wardrobe
  const styleData = useMemo(() => {
    if (closetItems.length === 0) {
      // Show helpful message instead of fake data
      return [
        { name: 'No items yet', value: 100, color: '#e5e7eb' },
      ];
    }

    // Count items by style category
    const styleCounts = {
      Casual: 0,
      Formal: 0,
      Party: 0,
      Activewear: 0,
    };

    closetItems.forEach(item => {
      const style = categorizeStyle(item.category, item.description);
      styleCounts[style]++;
    });

    const total = closetItems.length;
    const colors = {
      Casual: '#a2d2ff',
      Formal: '#bde0fe',
      Party: '#ffafcc',
      Activewear: '#cdb4db',
    };

    // Filter out categories with 0 items and calculate percentages
    const result = Object.entries(styleCounts)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => ({
        name: `${name} Looks`,
        value: Math.round((count / total) * 100),
        color: colors[name as keyof typeof colors],
      }))
      .sort((a, b) => b.value - a.value); // Sort by percentage descending

    return result.length > 0 ? result : [
      { name: 'No style data', value: 100, color: '#e5e7eb' },
    ];
  }, [closetItems]);

  // Calculate additional insights
  const insights = useMemo(() => {
    const totalItems = closetItems.length;
    const totalOutfits = userOutfits.length;
    const scheduledCount = Object.keys(scheduledOutfits).length;

    // Most common color
    const colorCounts = new Map<string, number>();
    closetItems.forEach(item => {
      if (item.color) {
        const color = item.color.toLowerCase();
        colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
      }
    });

    const topColor = Array.from(colorCounts.entries())
      .sort((a, b) => b[1] - a[1])[0];

    return {
      totalItems,
      totalOutfits,
      scheduledCount,
      topColor: topColor ? topColor[0] : 'none',
      topColorCount: topColor ? topColor[1] : 0,
    };
  }, [closetItems, userOutfits, scheduledOutfits]);
  return (
    <section className="w-full py-8 md:py-12 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div
            className="space-y-4 data-[animate=true]:animate-fade-in-up"
            data-animate={animate}
          >
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Style Insights
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Understand Your Style DNA
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              {closetItems.length > 0
                ? "SmartDrobe analyzes your wardrobe to give you powerful insights. Discover your style patterns, dominant colors, and get data-driven advice to shop smarter."
                : "Add items to your wardrobe to unlock powerful style insights and personalized recommendations!"
              }
            </p>
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle>
                  {closetItems.length > 0
                    ? "Your Wardrobe Style Breakdown"
                    : "Your Style Analytics"
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {closetItems.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                      {styleData.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="font-medium">{entry.name}: <span className="font-bold text-primary">{entry.value}%</span></span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Items</p>
                        <p className="text-2xl font-bold text-primary">{insights.totalItems}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Saved Outfits</p>
                        <p className="text-2xl font-bold text-primary">{insights.totalOutfits}</p>
                      </div>
                      {insights.topColor !== 'none' && (
                        <div className="col-span-2">
                          <p className="text-sm text-muted-foreground">Most Common Color</p>
                          <p className="text-lg font-bold capitalize text-primary">
                            {insights.topColor} ({insights.topColorCount} items)
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Start adding items to your closet to see your personalized style breakdown and insights!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          <div
            className="flex justify-center h-80 w-full data-[animate=true]:animate-fade-in-up"
            data-animate={animate} style={{ animationDelay: '0.2s' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={styleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={140}
                  innerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={5}
                  animationBegin={200}
                  animationDuration={1000}
                >
                  {styleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
