import TravelCapsuleAssistant from '@/components/travel-capsule-assistant';
import { Luggage } from 'lucide-react';

export default function TravelPlannerPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Luggage className="h-8 w-8 text-primary" />
          Travel Capsule Assistant
        </h1>
      </div>
      <p className="text-muted-foreground">
        Enter your trip details, and let our AI pack the perfect wardrobe for you.
      </p>
      <TravelCapsuleAssistant />
    </div>
  );
}
