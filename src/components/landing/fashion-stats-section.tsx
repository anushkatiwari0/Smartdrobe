
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const data = [
  { name: 'Casual Looks', value: 35, color: '#a2d2ff' },
  { name: 'Formal Looks', value: 25, color: '#bde0fe' },
  { name: 'Party Looks', value: 40, color: '#ffafcc' },
];

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

export default function FashionStatsSection() {
  const animate = true;
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
              SmartDrobe analyzes your wardrobe to give you powerful insights. Discover your most-worn styles, dominant colors, and get data-driven advice to shop smarter and refine your look.
            </p>
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle>This Month's Style Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {data.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="font-medium">{entry.name}: <span className="font-bold text-primary">{entry.value}%</span></span>
                    </div>
                  ))}
                </div>
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
                  data={data}
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
                  {data.map((entry, index) => (
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
