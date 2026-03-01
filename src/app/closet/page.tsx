
'use client';

import ClosetView from '@/components/closet-view';
import ScheduledOutfitsView from '@/components/scheduled-outfits-view';
import UserOutfitsView from '@/components/user-outfits-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shirt, CalendarClock, Package, Sparkles } from 'lucide-react';
import AiCombinationsView from '@/components/ai-combinations-view';

export default function ClosetPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Virtual Closet
        </h1>
      </div>
      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">
            <Shirt className="mr-2 h-4 w-4" />
            My Items
          </TabsTrigger>
           <TabsTrigger value="outfits">
            <Package className="mr-2 h-4 w-4" />
            My Outfits
          </TabsTrigger>
           <TabsTrigger value="ai-combinations">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Combinations
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <CalendarClock className="mr-2 h-4 w-4" />
            Scheduled Outfits
          </TabsTrigger>
        </TabsList>
        <TabsContent value="items">
          <ClosetView />
        </TabsContent>
        <TabsContent value="outfits">
          <UserOutfitsView />
        </TabsContent>
        <TabsContent value="ai-combinations">
          <AiCombinationsView />
        </TabsContent>
        <TabsContent value="scheduled">
          <ScheduledOutfitsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
